"""add rejected remarks to loan applications

Revision ID: b8356d296335
Revises: 77ef8f57497a
Create Date: 2026-09-03 14:11:31.617888

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'b8356d296335'
down_revision: Union[str, Sequence[str], None] = '77ef8f57497a'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade():
    op.add_column(
        "loan_applications",
        sa.Column(
            "rejected_remarks",
            sa.Text(),
            nullable=True,
        ),
    )


def downgrade():
    op.drop_column(
        "loan_applications",
        "rejected_remarks",
    )