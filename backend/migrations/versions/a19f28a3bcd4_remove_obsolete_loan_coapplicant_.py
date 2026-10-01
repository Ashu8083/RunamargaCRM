"""remove obsolete loan coapplicant relation

Revision ID: a19f28a3bcd4
Revises: 38a6b0ab45d3
Create Date: 2026-09-26 08:28:26.945497

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "a19f28a3bcd4"
down_revision: Union[str, Sequence[str], None] = "38a6b0ab45d3"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Remove obsolete relation column from loan_coapplicants."""
    op.drop_column("loan_coapplicants", "relation")


def downgrade() -> None:
    """Restore relation column to loan_coapplicants."""
    op.add_column(
        "loan_coapplicants",
        sa.Column("relation", sa.String(), nullable=True),
    )