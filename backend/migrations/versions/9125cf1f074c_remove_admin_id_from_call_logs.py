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
    """Remove admin_id from call_logs."""

    op.drop_column(
        "call_logs",
        "admin_id",
    )


def downgrade() -> None:
    """Restore admin_id to call_logs."""

    op.add_column(
        "call_logs",
        sa.Column(
            "admin_id",
            sa.BigInteger(),
            nullable=True,
        ),
    )