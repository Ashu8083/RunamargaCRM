import logging
from pathlib import Path

import psycopg

from app.config.database import DATABASE_URL


logger = logging.getLogger(__name__)

TRIGGER_DIRECTORY = Path(__file__).resolve().parent


def get_database_url() -> str:
    base_url = (
        DATABASE_URL
        .set(drivername="postgresql")
        .render_as_string(hide_password=False)
    )
    # Neon (and most cloud PostgreSQL providers) require SSL.
    # Append sslmode=require if not already present.
    if "sslmode" not in base_url:
        separator = "&" if "?" in base_url else "?"
        base_url = f"{base_url}{separator}sslmode=require"
    return base_url


def apply_database_triggers() -> None:
    """Apply every SQL file in this directory in filename order."""

    sql_files = sorted(TRIGGER_DIRECTORY.glob("*.sql"))

    if not sql_files:
        logger.info("No database trigger SQL files found")
        return

    with psycopg.connect(get_database_url()) as connection:
        with connection.cursor() as cursor:
            for sql_file in sql_files:
                sql = sql_file.read_text(encoding="utf-8").strip()

                if not sql:
                    continue

                logger.info("Applying database SQL file: %s", sql_file.name)

                cursor.execute(sql, prepare=False)

    logger.info("Database trigger SQL initialization completed")