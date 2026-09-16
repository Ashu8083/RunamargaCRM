# backend/migrations/versions/9125cf1f074c_remove_admin_id_from_call_logs.py

"""remove admin_id from call logs

Revision ID: 9125cf1f074c
Revises: 2e9710d6e46e
Create Date: 2026-09-12

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "9125cf1f074c"
down_revision: Union[str, Sequence[str], None] = "2e9710d6e46e"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Remove admin_id from call_logs if it exists."""

    bind = op.get_bind()
    inspector = sa.inspect(bind)

    columns = {
        column["name"]
        for column in inspector.get_columns("call_logs")
    }

    if "admin_id" in columns:
        op.drop_column(
            "call_logs",
            "admin_id",
        )


def downgrade() -> None:
    """Restore admin_id to call_logs if it does not exist."""

    bind = op.get_bind()
    inspector = sa.inspect(bind)

    columns = {
        column["name"]
        for column in inspector.get_columns("call_logs")
    }

    if "admin_id" not in columns:
        op.add_column(
            "call_logs",
            sa.Column(
                "admin_id",
                sa.BigInteger(),
                nullable=True,
            ),
        )