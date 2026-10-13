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
            CREATE INDEX IF NOT EXISTS ix_phone_numbers_id
            ON phone_numbers (id);
        """)

        op.execute("""
            CREATE UNIQUE INDEX IF NOT EXISTS ix_phone_numbers_employee_id
            ON phone_numbers (employee_id);
        """)

        op.execute("""
            CREATE INDEX IF NOT EXISTS ix_phone_numbers_reports_to_id
            ON phone_numbers (reports_to_id);
        """)
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