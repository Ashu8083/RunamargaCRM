"""remove legacy loan ownership columns

Revision ID: 5cee164372ec
Revises: db693eab7dac
Create Date: 2026-09-17 10:54:05.483062

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '5cee164372ec'
down_revision: Union[str, Sequence[str], None] = 'db693eab7dac'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

def upgrade() -> None:
    bind = op.get_bind()
    inspector = sa.inspect(bind)

    columns = {
        column["name"]
        for column in inspector.get_columns("loan_applications")
    }

    if "applied_by_id" in columns:
        op.drop_column("loan_applications", "applied_by_id")

    if "agent_id" in columns:
        op.drop_column("loan_applications", "agent_id")

    if "rm_id" in columns:
        op.drop_column("loan_applications", "rm_id")


def downgrade() -> None:
    bind = op.get_bind()
    inspector = sa.inspect(bind)

    columns = {
        column["name"]
        for column in inspector.get_columns("loan_applications")
    }

    if "applied_by_id" not in columns:
        op.add_column(
            "loan_applications",
            sa.Column("applied_by_id", sa.Integer(), nullable=True),
        )

    if "agent_id" not in columns:
        op.add_column(
            "loan_applications",
            sa.Column("agent_id", sa.Integer(), nullable=True),
        )

    if "rm_id" not in columns:
        op.add_column(
            "loan_applications",
            sa.Column("rm_id", sa.Integer(), nullable=True),
        )