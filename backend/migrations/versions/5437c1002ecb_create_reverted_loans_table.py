"""create reverted loans table

Revision ID: 5437c1002ecb
Revises: b8356d296335
Create Date: 2026-09-03 18:54:18.092634
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "5437c1002ecb"
down_revision: Union[str, Sequence[str], None] = "b8356d296335"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "reverted_loans",

        sa.Column(
            "id",
            sa.Integer(),
            primary_key=True,
            nullable=False,
        ),

        sa.Column(
            "remarks",
            sa.Text(),
            nullable=True,
        ),

        sa.Column(
            "loan_id",
            sa.Integer(),
            sa.ForeignKey("loan_applications.id"),
            nullable=False,
        ),

        sa.Column(
            "reverted_by_id",
            sa.Integer(),
            sa.ForeignKey("employees.id"),
            nullable=False,
        ),

        sa.Column(
            "reverted_by_name",
            sa.String(length=150),
            nullable=False,
        ),

        sa.Column(
            "rejection_type",
            sa.String(length=50),
            nullable=False,
        ),

        sa.Column(
            "reverted_by_role",
            sa.String(length=50),
            nullable=False,
        ),

        sa.Column(
            "reverted_at",
            sa.TIMESTAMP(),
            server_default=sa.func.now(),
            nullable=True,
        ),

        sa.Column(
            "created_at",
            sa.TIMESTAMP(),
            server_default=sa.func.now(),
            nullable=True,
        ),

        sa.Column(
            "updated_at",
            sa.TIMESTAMP(),
            nullable=True,
        ),

        sa.Column(
            "deleted_at",
            sa.TIMESTAMP(),
            nullable=True,
        ),
    )

  

def downgrade() -> None:
    op.drop_table("reverted_loans")