"""
Production-grade FastAPI application with security, monitoring, and health checks
"""

from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
import time
import logging

from .core.config import settings, validate_production_settings
from .core.database import init_db, check_db_connection, close_db_connections
from .core.logging import setup_logging
from .routers import auth, tracking, analytics, users, gamification, payments

# Setup logging
setup_logging()
logger = logging.getLogger(__name__)

# Initialize rate limiter
limiter = Limiter(
    key_func=get_remote_address,
    default_limits=[f"{settings.RATE_LIMIT_PER_MINUTE}/minute"] if settings.RATE_LIMIT_ENABLED else []
)

# Create FastAPI app
app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    openapi_url=f"{settings.API_V1_STR}/openapi.json" if not settings.is_production else None,  # Disable in prod
    docs_url="/docs" if settings.DEBUG else None,  # Disable Swagger in production
    redoc_url="/redoc" if settings.DEBUG else None,
    debug=settings.DEBUG,
)

# Add rate limiter state
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)


# ============================================
# MIDDLEWARE
# ============================================

# 1. Request timing middleware
@app.middleware("http")
async def add_process_time_header(request: Request, call_next):
    """Track request processing time"""
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    response.headers["X-Process-Time"] = str(process_time)
    
    # Log slow requests
    if process_time > 1.0:
        logger.warning(
            f"Slow request: {request.method} {request.url.path} took {process_time:.2f}s",
            extra={
                "method": request.method,
                "path": request.url.path,
                "duration": process_time
            }
        )
    
    return response


# 2. Security headers middleware
@app.middleware("http")
async def add_security_headers(request: Request, call_next):
    """Add security headers to all responses"""
    response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
    return response


# 3. CORS - Production-safe configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,  # NO wildcards in production!
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allow_headers=[
        "Accept",
        "Accept-Language",
        "Content-Type",
        "Authorization",
        "X-Requested-With",
    ],
    expose_headers=["X-Process-Time"],
    max_age=600,  # Cache preflight requests for 10 minutes
)

# 4. GZip compression
app.add_middleware(GZipMiddleware, minimum_size=1000)

# 5. Trusted Host (prevent host header poisoning)
if settings.is_production:
    # Extract domain from FRONTEND_URL
    allowed_hosts = ["*"]  # Configure based on your domain
    # app.add_middleware(TrustedHostMiddleware, allowed_hosts=allowed_hosts)


# ============================================
# ERROR HANDLERS
# ============================================

@app.exception_handler(StarletteHTTPException)
async def http_exception_handler(request: Request, exc: StarletteHTTPException):
    """Handle HTTP exceptions"""
    logger.error(
        f"HTTP error: {exc.status_code} - {exc.detail}",
        extra={"status_code": exc.status_code, "path": request.url.path}
    )
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.detail, "status_code": exc.status_code}
    )


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    """Handle validation errors"""
    logger.warning(
        f"Validation error on {request.url.path}",
        extra={"errors": exc.errors(), "path": request.url.path}
    )
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={"detail": exc.errors(), "message": "Validation error"}
    )


@app.exception_handler(Exception)
async def general_exception_handler(request: Request, exc: Exception):
    """Catch-all exception handler"""
    logger.exception(
        f"Unhandled exception: {str(exc)}",
        extra={"path": request.url.path}
    )
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "detail": "Internal server error" if settings.is_production else str(exc),
            "message": "An unexpected error occurred"
        }
    )


# ============================================
# STARTUP & SHUTDOWN EVENTS
# ============================================

@app.on_event("startup")
async def startup_event():
    """Initialize application on startup"""
    logger.info("=" * 60)
    logger.info(f"🚀 Starting {settings.PROJECT_NAME} v{settings.VERSION}")
    logger.info(f"   Environment: {settings.ENVIRONMENT}")
    logger.info(f"   Debug Mode: {settings.DEBUG}")
    logger.info("=" * 60)
    
    # Validate production settings
    try:
        validate_production_settings()
    except ValueError as e:
        logger.critical(f"❌ Configuration error: {e}")
        if settings.is_production:
            raise
    
    # Initialize database
    if not settings.is_production:
        init_db()
        logger.info("✅ Database tables initialized (development)")
    else:
        logger.info("ℹ️  Skipping table creation (production - use migrations)")
    
    # Check database connection
    if check_db_connection():
        logger.info("✅ Database connection verified")
    else:
        logger.error("❌ Database connection failed!")
        if settings.is_production:
            raise RuntimeError("Cannot start application: database unreachable")
    
    # Initialize Sentry (if configured)
    if settings.SENTRY_ENABLED:
        import sentry_sdk
        from sentry_sdk.integrations.fastapi import FastApiIntegration
        
        sentry_sdk.init(
            dsn=settings.SENTRY_DSN,
            environment=settings.ENVIRONMENT,
            traces_sample_rate=0.1 if settings.is_production else 1.0,
            integrations=[FastApiIntegration()],
        )
        logger.info("✅ Sentry monitoring enabled")
    
    logger.info(f"✅ Application startup complete!")


@app.on_event("shutdown")
async def shutdown_event():
    """Cleanup on shutdown"""
    logger.info("🛑 Shutting down application...")
    close_db_connections()
    logger.info("✅ Shutdown complete")


# ============================================
# HEALTH CHECK ENDPOINTS
# ============================================

@app.get("/health", tags=["Health"])
async def health_check():
    """
    Health check endpoint for monitoring (Render, uptime monitors, etc.)
    Returns 200 OK if application is healthy
    """
    db_healthy = check_db_connection()
    
    return {
        "status": "healthy" if db_healthy else "unhealthy",
        "environment": settings.ENVIRONMENT,
        "database": "connected" if db_healthy else "disconnected",
        "version": settings.VERSION
    }


@app.get("/", tags=["Root"])
async def root():
    """Root endpoint"""
    return {
        "message": f"{settings.PROJECT_NAME} API",
        "version": settings.VERSION,
        "environment": settings.ENVIRONMENT,
        "docs": "/docs" if settings.DEBUG else "disabled",
        "health": "/health"
    }


# ============================================
# ROUTERS
# ============================================

app.include_router(auth.router, prefix=f"{settings.API_V1_STR}/auth", tags=["Authentication"])
app.include_router(users.router, prefix=f"{settings.API_V1_STR}/users", tags=["Users"])
app.include_router(tracking.router, prefix=f"{settings.API_V1_STR}/tracking", tags=["Tracking"])
app.include_router(analytics.router, prefix=f"{settings.API_V1_STR}/analytics", tags=["Analytics"])
app.include_router(gamification.router, prefix=f"{settings.API_V1_STR}/gamification", tags=["Gamification"])
app.include_router(payments.router, prefix=f"{settings.API_V1_STR}/payments", tags=["Payments"])


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.DEBUG,
        log_level=settings.LOG_LEVEL.lower()
    )
