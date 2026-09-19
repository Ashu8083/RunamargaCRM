"""create phone numbers table

Revision ID: 4aaa83cde927
Revises: 51b9c47d546b
Create Date: 2026-09-13 17:54:49.775034

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql


# revision identifiers, used by Alembic.
revision: str = '4aaa83cde927'
down_revision: Union[str, Sequence[str], None] = '51b9c47d546b'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""

    op.execute("""
        DO $$
        BEGIN
            IF NOT EXISTS (
                SELECT 1
                FROM pg_type
                WHERE typname = 'phonenumberstatus'
            ) THEN
                CREATE TYPE phonenumberstatus AS ENUM ('inactive', 'active');
            END IF;
        END
        $$;
    """)

    op.execute("""
        CREATE TABLE phone_numbers (
            id INTEGER NOT NULL,
            employee_id INTEGER NOT NULL,
            phone TEXT,
            status phonenumberstatus NOT NULL DEFAULT 'inactive',
            trackable phonenumberstatus NOT NULL DEFAULT 'inactive',
            reports_to_id INTEGER,
            created_at TIMESTAMP DEFAULT now(),
            updated_at TIMESTAMP DEFAULT now(),
            deleted_at TIMESTAMP,
            CONSTRAINT phone_numbers_pkey PRIMARY KEY (id),
            CONSTRAINT phone_numbers_employee_id_key UNIQUE (employee_id),
            CONSTRAINT phone_numbers_employee_id_fkey
                FOREIGN KEY (employee_id)
                REFERENCES employees (id)
                ON DELETE CASCADE,
            CONSTRAINT phone_numbers_reports_to_id_fkey
                FOREIGN KEY (reports_to_id)
                REFERENCES employees (id)
                ON DELETE SET NULL
        )
    """)

    op.create_index(
        "ix_phone_numbers_id",
        "phone_numbers",
        ["id"],
        unique=False,
    )

    op.create_index(
        "ix_phone_numbers_employee_id",
        "phone_numbers",
        ["employee_id"],
        unique=True,
    )

    op.create_index(
        "ix_phone_numbers_reports_to_id",
        "phone_numbers",
        ["reports_to_id"],
        unique=False,
    )
def downgrade() -> None:
    """Downgrade schema."""

    op.drop_index(
        "ix_phone_numbers_reports_to_id",
        table_name="phone_numbers",
    )

    op.drop_index(
        "ix_phone_numbers_employee_id",
        table_name="phone_numbers",
    )

    op.drop_index(
        "ix_phone_numbers_id",
        table_name="phone_numbers",
    )

    op.drop_table("phone_numbers")

    op.execute("""
        DROP TYPE IF EXISTS phonenumberstatus;
    """)