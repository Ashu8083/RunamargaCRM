"""create loan reference table

Revision ID: b515626cfb7d
Revises: aa732e56f913
Create Date: 2026-09-08 12:45:59.555503

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "b515626cfb7d"
down_revision: Union[str, Sequence[str], None] = "aa732e56f913"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""

    op.create_table(
        "loan_references",

        sa.Column(
            "id",
            sa.Integer(),
            nullable=False,
        ),

        sa.Column(
            "loan_id",
            sa.Integer(),
            nullable=True,
        ),

        sa.Column(
            "name",
            sa.String(),
            nullable=True,
        ),

        sa.Column(
            "phone",
            sa.String(),
            nullable=True,
        ),

        sa.Column(
            "address",
            sa.String(),
            nullable=True,
        ),

        sa.Column(
            "relation",
            sa.String(),
            nullable=True,
        ),

        sa.Column(
            "created_at",
            sa.TIMESTAMP(timezone=True),
            server_default=sa.text("now()"),
            nullable=True,
        ),

        sa.Column(
            "updated_at",
            sa.TIMESTAMP(timezone=True),
            nullable=True,
        ),

        sa.Column(
            "deleted_at",
            sa.TIMESTAMP(timezone=True),
            nullable=True,
        ),

        sa.ForeignKeyConstraint(
            ["loan_id"],
            ["loan_applications.id"],
            ondelete="CASCADE",
        ),

        sa.PrimaryKeyConstraint("id"),
    )

    op.create_index(
        op.f("ix_loan_references_id"),
        "loan_references",
        ["id"],
        unique=False,
    )


def downgrade() -> None:
    """Downgrade schema."""

    # This migration originally had an empty upgrade(),
    # so there is nothing to remove during this downgrade.
    pass