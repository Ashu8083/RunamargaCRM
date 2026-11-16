import logging

from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker

from app.config.settings import settings

# Configure logger
logger = logging.getLogger(__name__)

DATABASE_URL = (
    f"postgresql+psycopg://"
    f"{settings.DATABASE_USER}:"
    f"{settings.DATABASE_PASSWORD}@"
    f"{settings.DATABASE_HOST}:"
    f"{settings.DATABASE_PORT}/"
    f"{settings.DATABASE_NAME}"
)

engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,
)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
)


def check_database_connection():
    """Check whether PostgreSQL is reachable."""

    try:
        with engine.connect() as connection:
            connection.execute(text("SELECT 1"))

        logger.info("Database connection successful.")

    except Exception:
        logger.exception("Database connection failed.")
        raise


def get_db():
    db = SessionLocal()

    try:
        yield db
    except Exception:
        logger.exception("Database session error.")
        raise
    finally:
        db.close()