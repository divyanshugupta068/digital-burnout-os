"""
Production-grade database configuration with connection pooling
"""

from sqlalchemy import create_engine, event, exc
from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy.pool import NullPool, QueuePool
import logging
from .config import settings

logger = logging.getLogger(__name__)


def create_database_engine():
    """
    Create production-ready database engine with proper pooling
    """
    database_url = settings.database_url_sync
    
    # Determine if using SQLite (development) or PostgreSQL (production)
    is_sqlite = database_url.startswith("sqlite")
    
    if is_sqlite:
        # SQLite configuration (local development only)
        logger.info("📂 Using SQLite database (development mode)")
        connect_args = {"check_same_thread": False}
        engine = create_engine(
            database_url,
            connect_args=connect_args,
            echo=settings.DEBUG,
            poolclass=NullPool  # SQLite doesn't benefit from connection pooling
        )
    else:
        # PostgreSQL configuration (production)
        logger.info("🐘 Using PostgreSQL database (production mode)")
        engine = create_engine(
            database_url,
            echo=settings.DEBUG,
            poolclass=QueuePool,
            pool_size=settings.DB_POOL_SIZE,
            max_overflow=settings.DB_MAX_OVERFLOW,
            pool_timeout=settings.DB_POOL_TIMEOUT,
            pool_recycle=settings.DB_POOL_RECYCLE,
            pool_pre_ping=settings.DB_POOL_PRE_PING,  # Test connections before using
            connect_args={
                "connect_timeout": 10,
                "application_name": settings.PROJECT_NAME,
            },
        )
        
        # Add event listeners for connection management
        @event.listens_for(engine, "connect")
        def receive_connect(dbapi_conn, connection_record):
            """Log successful connections"""
            logger.debug("✅ Database connection established")
        
        @event.listens_for(engine, "checkout")
        def receive_checkout(dbapi_conn, connection_record, connection_proxy):
            """Verify connection is alive on checkout"""
            try:
                cursor = dbapi_conn.cursor()
                cursor.execute("SELECT 1")
                cursor.close()
            except exc.DBAPIError as e:
                logger.error(f"❌ Bad connection detected, reconnecting: {e}")
                raise exc.DisconnectionError()
    
    return engine


# Create global engine instance
engine = create_database_engine()

# Create sessionmaker
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
    expire_on_commit=False  # Prevent detached instance errors
)


def get_db() -> Session:
    """
    Dependency function to get database session
    Automatically handles session cleanup
    """
    db = SessionLocal()
    try:
        yield db
    except Exception as e:
        logger.error(f"❌ Database session error: {e}")
        db.rollback()
        raise
    finally:
        db.close()


def init_db():
    """
    Initialize database tables (development only!)
    In production, use Alembic migrations instead
    """
    if settings.is_production:
        logger.warning("⚠️ Skipping table creation in production. Use Alembic migrations!")
        return
    
    logger.info("🔨 Creating database tables...")
    
    # Import all models to ensure they're registered
    from ..models.base import Base
    from ..models.user import User
    from ..models.tracking import BehaviorLog, SleepLog, MoodEntry, BurnoutScore, Recommendation, Alert
    from ..models.subscription import Subscription
    from ..models.payment import Payment
    
    try:
        Base.metadata.create_all(bind=engine)
        logger.info("✅ Database tables created successfully!")
    except Exception as e:
        logger.error(f"❌ Error creating tables: {e}")
        raise


def check_db_connection() -> bool:
    """
    Health check: verify database connection
    """
    try:
        with engine.connect() as conn:
            conn.execute("SELECT 1")
        logger.info("✅ Database connection healthy")
        return True
    except Exception as e:
        logger.error(f"❌ Database connection failed: {e}")
        return False


def close_db_connections():
    """
    Gracefully close all database connections
    Call this during application shutdown
    """
    try:
        engine.dispose()
        logger.info("✅ Database connections closed gracefully")
    except Exception as e:
        logger.error(f"❌ Error closing database connections: {e}")
