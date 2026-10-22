"""create holidays table

Revision ID: 195132074481
Revises: 15502a832dad
Create Date: 2026-10-20 12:43:41.975062

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "195132074481"
down_revision: Union[str, Sequence[str], None] = "15502a832dad"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Create holidays table
    op.create_table(
        "holidays",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("name", sa.String(length=150), nullable=False),
        sa.Column("date", sa.Date(), nullable=False),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column(
            "is_active",
            sa.Boolean(),
            server_default=sa.text("true"),
            nullable=False,
        ),
        sa.Column(
            "created_at",
            sa.TIMESTAMP(timezone=False),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.Column(
            "updated_at",
            sa.TIMESTAMP(timezone=False),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("date", name="uq_holidays_date"),
    )

    op.create_index(
        "ix_holidays_date",
        "holidays",
        ["date"],
        unique=False,
    )


def downgrade() -> None:
    # Remove only the holidays objects created by this migration
    op.drop_index(
        "ix_holidays_date",
        table_name="holidays",
    )

    op.drop_table("holidays")