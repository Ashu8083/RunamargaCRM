
# backend/app/config/database.py

from sqlalchemy import create_engine
from sqlalchemy.engine import URL
from sqlalchemy.orm import sessionmaker
import logging
from app.config.settings import settings

# Configure logger
logger = logging.getLogger(__name__)

# ============================================================================
# DATABASE URL
# ============================================================================

# URL.create safely handles special characters in the database password.
DATABASE_URL = URL.create(

    drivername="postgresql+psycopg",

    username=settings.DATABASE_USER,

    password=settings.DATABASE_PASSWORD,

    host=settings.DATABASE_HOST,

    port=settings.DATABASE_PORT,

    database=settings.DATABASE_NAME,

)


# ============================================================================
# DATABASE ENGINE AND CONNECTION POOL
# ============================================================================

engine = create_engine(
    DATABASE_URL,

    # Maximum number of persistent connections in this process.
    pool_size=2,

    # Additional temporary connections allowed during traffic spikes.
    max_overflow=3,

    # Maximum time to wait for an available connection.
    pool_timeout=30,

    # Recycle connections periodically.
    pool_recycle=1800,

    # Check connection health before reusing a pooled connection.
    pool_pre_ping=True,
)


# ============================================================================
# DATABASE SESSION FACTORY
# ============================================================================

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
)


# ============================================================================
# FASTAPI DATABASE DEPENDENCY
# ============================================================================

def get_db():
    db = SessionLocal()

    try:
        yield db
    except Exception:
        logger.exception("Database session error.")
        raise
    finally:
        db.close()