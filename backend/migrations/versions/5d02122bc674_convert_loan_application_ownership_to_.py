"""convert loan application ownership to employee contexts

Revision ID: 5d02122bc674
Revises: 684e345acae7
Create Date: 2026-09-17 10:17:30.504415

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '5d02122bc674'
down_revision: Union[str, Sequence[str], None] = '684e345acae7'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None



def upgrade():
    op.add_column(
        "loan_applications",
        sa.Column(
            "applied_by_context_id",
            sa.Integer(),
            nullable=True,
        ),
    )

    op.add_column(
        "loan_applications",
        sa.Column(
            "agent_context_id",
            sa.Integer(),
            nullable=True,
        ),
    )

    op.add_column(
        "loan_applications",
        sa.Column(
            "rm_context_id",
            sa.Integer(),
            nullable=True,
        ),
    )

    op.create_foreign_key(
        "fk_loan_applications_applied_by_context",
        "loan_applications",
        "employee_contexts",
        ["applied_by_context_id"],
        ["id"],
        ondelete="SET NULL",
    )

    op.create_foreign_key(
        "fk_loan_applications_agent_context",
        "loan_applications",
        "employee_contexts",
        ["agent_context_id"],
        ["id"],
        ondelete="SET NULL",
    )

    op.create_foreign_key(
        "fk_loan_applications_rm_context",
        "loan_applications",
        "employee_contexts",
        ["rm_context_id"],
        ["id"],
        ondelete="SET NULL",
    )

    op.create_index(
        "idx_loan_applied_by_context_id",
        "loan_applications",
        ["applied_by_context_id"],
    )

    op.create_index(
        "idx_loan_agent_context_id",
        "loan_applications",
        ["agent_context_id"],
    )

    op.create_index(
        "idx_loan_rm_context_id",
        "loan_applications",
        ["rm_context_id"],
    )


def downgrade():
    op.drop_index(
        "idx_loan_rm_context_id",
        table_name="loan_applications",
    )

    op.drop_index(
        "idx_loan_agent_context_id",
        table_name="loan_applications",
    )

    op.drop_index(
        "idx_loan_applied_by_context_id",
        table_name="loan_applications",
    )

    op.drop_constraint(
        "fk_loan_applications_rm_context",
        "loan_applications",
        type_="foreignkey",
    )

    op.drop_constraint(
        "fk_loan_applications_agent_context",
        "loan_applications",
        type_="foreignkey",
    )

    op.drop_constraint(
        "fk_loan_applications_applied_by_context",
        "loan_applications",
        type_="foreignkey",
    )

    op.drop_column(
        "loan_applications",
        "rm_context_id",
    )

    op.drop_column(
        "loan_applications",
        "agent_context_id",
    )

    op.drop_column(
        "loan_applications",
        "applied_by_context_id",
    )