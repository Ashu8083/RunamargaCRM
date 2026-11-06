from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

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
    port=int(settings.DATABASE_PORT),
    database=settings.DATABASE_NAME,
)


# ============================================================================
# DATABASE ENGINE AND CONNECTION POOL
# ============================================================================

engine = create_engine(DATABASE_URL)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
)


def get_db():
    db = SessionLocal()

    try:
        yield db
    except Exception:
        logger.exception("Database session error.")
        raise
    finally:
        db.close()