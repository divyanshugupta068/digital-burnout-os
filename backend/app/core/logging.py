"""
Production-grade structured logging
"""

import logging
import sys
from pythonjsonlogger import jsonlogger
from .config import settings


def setup_logging():
    """
    Configure structured JSON logging for production observability
    """
    # Root logger
    root_logger = logging.getLogger()
    root_logger.setLevel(getattr(logging, settings.LOG_LEVEL.upper()))
    
    # Remove existing handlers
    root_logger.handlers = []
    
    # Create handler
    handler = logging.StreamHandler(sys.stdout)
    
    if settings.is_production:
        # JSON formatter for production (easier to parse in log aggregators)
        formatter = jsonlogger.JsonFormatter(
            "%(asctime)s %(name)s %(levelname)s %(message)s %(pathname)s %(lineno)d",
            rename_fields={
                "asctime": "timestamp",
                "name": "logger",
                "levelname": "level",
                "pathname": "file",
                "lineno": "line"
            }
        )
    else:
        # Human-readable formatter for development
        formatter = logging.Formatter(
            "%(asctime)s - %(name)s - %(levelname)s - %(message)s",
            datefmt="%Y-%m-%d %H:%M:%S"
        )
    
    handler.setFormatter(formatter)
    root_logger.addHandler(handler)
    
    # Silence noisy loggers
    logging.getLogger("uvicorn.access").setLevel(logging.WARNING)
    logging.getLogger("sqlalchemy.engine").setLevel(logging.WARNING)
    
    # Log startup
    root_logger.info(
        f"🚀 Logging initialized for {settings.ENVIRONMENT} environment",
        extra={
            "environment": settings.ENVIRONMENT,
            "log_level": settings.LOG_LEVEL,
            "debug": settings.DEBUG
        }
    )
    
    return root_logger


def get_logger(name: str) -> logging.Logger:
    """Get a logger instance"""
    return logging.getLogger(name)
