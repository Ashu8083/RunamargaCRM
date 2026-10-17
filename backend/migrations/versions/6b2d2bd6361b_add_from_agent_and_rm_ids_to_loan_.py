
"""add from agent and rm ids to loan shuffle history

Revision ID: 6b2d2bd6361b
Revises: 999b02bb7584
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "6b2d2bd6361b"
down_revision: Union[str, Sequence[str], None] = "999b02bb7584"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        "loan_shuffle_history",
        sa.Column("from_agent_id", sa.Integer(), nullable=True),
    )

    op.add_column(
        "loan_shuffle_history",
        sa.Column("from_rm_id", sa.Integer(), nullable=True),
    )

    op.create_foreign_key(
        "fk_loan_shuffle_history_from_agent",
        "loan_shuffle_history",
        "employee_contexts",
        ["from_agent_id"],
        ["id"],
    )

    op.create_foreign_key(
        "fk_loan_shuffle_history_from_rm",
        "loan_shuffle_history",
        "employee_contexts",
        ["from_rm_id"],
        ["id"],
    )


def downgrade() -> None:
    op.drop_constraint(
        "fk_loan_shuffle_history_from_rm",
        "loan_shuffle_history",
        type_="foreignkey",
    )

    op.drop_constraint(
        "fk_loan_shuffle_history_from_agent",
        "loan_shuffle_history",
        type_="foreignkey",
    )

    op.drop_column("loan_shuffle_history", "from_rm_id")
    op.drop_column("loan_shuffle_history", "from_agent_id")
