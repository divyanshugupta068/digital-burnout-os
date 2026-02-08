"""
Production-grade configuration with environment variable support
"""

import os
from typing import List, Optional
from pydantic_settings import BaseSettings
from pydantic import validator


class Settings(BaseSettings):
    # Application
    PROJECT_NAME: str = "Digital Burnout OS"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")
    DEBUG: bool = os.getenv("DEBUG", "False").lower() == "true"
    
    # Security
    SECRET_KEY: str = os.getenv("SECRET_KEY", "CHANGE-THIS-IN-PRODUCTION")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days
    REFRESH_TOKEN_EXPIRE_DAYS: int = 30
    
    # Database
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL",
        "sqlite:///./burnout.db"  # Local fallback
    )
    
    # PostgreSQL-specific settings
    DB_POOL_SIZE: int = int(os.getenv("DB_POOL_SIZE", "10"))
    DB_MAX_OVERFLOW: int = int(os.getenv("DB_MAX_OVERFLOW", "20"))
    DB_POOL_TIMEOUT: int = int(os.getenv("DB_POOL_TIMEOUT", "30"))
    DB_POOL_RECYCLE: int = int(os.getenv("DB_POOL_RECYCLE", "3600"))
    DB_POOL_PRE_PING: bool = True  # Always enabled for production
    
    # Redis
    REDIS_URL: str = os.getenv("REDIS_URL", "")
    REDIS_ENABLED: bool = bool(os.getenv("REDIS_URL", ""))
    
    # CORS - Dynamic origins based on environment
    ALLOWED_ORIGINS: str = os.getenv(
        "ALLOWED_ORIGINS",
        "http://localhost:3000,http://localhost:3001"
    )
    
    @validator("ALLOWED_ORIGINS", pre=True)
    def parse_cors_origins(cls, v) -> List[str]:
        """Parse comma-separated CORS origins"""
        if isinstance(v, str):
            return [origin.strip() for origin in v.split(",") if origin.strip()]
        return v
    
    # Email Configuration
    EMAIL_ENABLED: bool = bool(os.getenv("SMTP_USER") or os.getenv("SENDGRID_API_KEY"))
    SMTP_HOST: str = os.getenv("SMTP_HOST", "smtp.gmail.com")
    SMTP_PORT: int = int(os.getenv("SMTP_PORT", "587"))
    SMTP_USER: str = os.getenv("SMTP_USER", "")
    SMTP_PASSWORD: str = os.getenv("SMTP_PASSWORD", "")
    EMAIL_FROM: str = os.getenv("EMAIL_FROM", "noreply@burnoutapp.com")
    EMAIL_FROM_NAME: str = os.getenv("EMAIL_FROM_NAME", "Digital Burnout OS")
    USE_SENDGRID: bool = os.getenv("USE_SENDGRID", "false").lower() == "true"
    SENDGRID_API_KEY: str = os.getenv("SENDGRID_API_KEY", "")
    
    # Payment
    RAZORPAY_KEY_ID: str = os.getenv("RAZORPAY_KEY_ID", "")
    RAZORPAY_KEY_SECRET: str = os.getenv("RAZORPAY_KEY_SECRET", "")
    RAZORPAY_WEBHOOK_SECRET: str = os.getenv("RAZORPAY_WEBHOOK_SECRET", "")
    
    # Frontend URL (for email links, redirects)
    FRONTEND_URL: str = os.getenv("FRONTEND_URL", "http://localhost:3000")
    
    # Rate Limiting
    RATE_LIMIT_ENABLED: bool = os.getenv("RATE_LIMIT_ENABLED", "true").lower() == "true"
    RATE_LIMIT_PER_MINUTE: int = int(os.getenv("RATE_LIMIT_PER_MINUTE", "60"))
    
    # File Upload
    MAX_UPLOAD_SIZE: int = int(os.getenv("MAX_UPLOAD_SIZE", str(10 * 1024 * 1024)))  # 10MB
    
    # Cloud Storage (Optional)
    AWS_ACCESS_KEY_ID: str = os.getenv("AWS_ACCESS_KEY_ID", "")
    AWS_SECRET_ACCESS_KEY: str = os.getenv("AWS_SECRET_ACCESS_KEY", "")
    AWS_S3_BUCKET: str = os.getenv("AWS_S3_BUCKET", "")
    AWS_REGION: str = os.getenv("AWS_REGION", "us-east-1")
    
    # Monitoring & Logging
    SENTRY_DSN: str = os.getenv("SENTRY_DSN", "")
    SENTRY_ENABLED: bool = bool(os.getenv("SENTRY_DSN", ""))
    LOG_LEVEL: str = os.getenv("LOG_LEVEL", "INFO")
    
    # Server
    HOST: str = os.getenv("HOST", "0.0.0.0")  # Bind to all interfaces in production
    PORT: int = int(os.getenv("PORT", "8000"))
    WORKERS: int = int(os.getenv("WORKERS", "2"))
    
    @property
    def is_production(self) -> bool:
        return self.ENVIRONMENT == "production"
    
    @property
    def is_development(self) -> bool:
        return self.ENVIRONMENT == "development"
    
    @property
    def database_url_sync(self) -> str:
        """Get synchronous database URL (for SQLAlchemy)"""
        if self.DATABASE_URL.startswith("postgres://"):
            # Render uses postgres://, but SQLAlchemy 2.0 requires postgresql://
            return self.DATABASE_URL.replace("postgres://", "postgresql://", 1)
        return self.DATABASE_URL
    
    @property
    def database_url_async(self) -> str:
        """Get async database URL (if using async SQLAlchemy)"""
        url = self.database_url_sync
        if url.startswith("postgresql://"):
            return url.replace("postgresql://", "postgresql+asyncpg://", 1)
        return url
    
    class Config:
        case_sensitive = True
        env_file = ".env"
        env_file_encoding = "utf-8"


# Global settings instance
settings = Settings()


# Validation on startup
def validate_production_settings():
    """Validate critical settings in production"""
    if settings.is_production:
        errors = []
        
        if settings.SECRET_KEY == "CHANGE-THIS-IN-PRODUCTION":
            errors.append("SECRET_KEY must be changed in production")
        
        if not settings.DATABASE_URL or settings.DATABASE_URL.startswith("sqlite"):
            errors.append("Production must use PostgreSQL, not SQLite")
        
        if not settings.ALLOWED_ORIGINS or "localhost" in settings.ALLOWED_ORIGINS:
            errors.append("ALLOWED_ORIGINS must be set to production frontend domain")
        
        if settings.DEBUG:
            errors.append("DEBUG must be False in production")
        
        if errors:
            raise ValueError(
                "Production configuration errors:\n" + "\n".join(f"  - {e}" for e in errors)
            )
    
    print(f"✅ Configuration validated: {settings.ENVIRONMENT} environment")
    print(f"   Database: {settings.DATABASE_URL[:30]}...")
    print(f"   CORS Origins: {settings.ALLOWED_ORIGINS}")
    print(f"   Email Enabled: {settings.EMAIL_ENABLED}")
    print(f"   Redis Enabled: {settings.REDIS_ENABLED}")
    print(f"   Sentry Enabled: {settings.SENTRY_ENABLED}")
