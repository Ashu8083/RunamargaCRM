
# backend/app/database_triggers/runner.py

import logging
from pathlib import Path

import psycopg

from app.config.settings import settings


logger = logging.getLogger(__name__)

TRIGGER_DIRECTORY = Path(__file__).resolve().parent


def get_database_url() -> str:
    return (
        f"postgresql://"
        f"{settings.DATABASE_USER}:"
        f"{settings.DATABASE_PASSWORD}@"
        f"{settings.DATABASE_HOST}:"
        f"{settings.DATABASE_PORT}/"
        f"{settings.DATABASE_NAME}"
    )


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

                # The SQL files contain trusted project-owned SQL.
                # prepare=False permits scripts containing multiple statements.
                cursor.execute(sql, prepare=False)

    logger.info("Database trigger SQL initialization completed")
