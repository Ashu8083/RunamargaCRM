"""create bank processing logs

Revision ID: d68261f43881
Revises: f62e5eb02051
Create Date: 2026-09-28 17:46:42.071962

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'd68261f43881'
down_revision: Union[str, Sequence[str], None] = 'f62e5eb02051'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

def upgrade():

    op.create_table(
        "bank_processing_logs",

        sa.Column(
            "id",
            sa.Integer(),
            primary_key=True,
            nullable=False,
        ),

        sa.Column(
            "loan_id",
            sa.Integer(),
            sa.ForeignKey(
                "loan_applications.id",
                ondelete="CASCADE",
            ),
            nullable=False,
        ),

        sa.Column(
            "bp_id",
            sa.Integer(),
            sa.ForeignKey(
                "bank_processings.id",
                ondelete="CASCADE",
            ),
            nullable=False,
        ),

        sa.Column(
            "event",
            sa.String(length=100),
            nullable=False,
        ),

        sa.Column(
            "employee_context_id",
            sa.Integer(),
            sa.ForeignKey(
                "employee_contexts.id",
                ondelete="SET NULL",
            ),
            nullable=True,
        ),

        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.func.now(),
            nullable=False,
        ),

        sa.Column(
            "deleted_at",
            sa.DateTime(timezone=True),
            nullable=True,
        ),
    )

    op.create_index(
        "ix_bank_processing_logs_id",
        "bank_processing_logs",
        ["id"],
    )

    op.create_index(
        "ix_bank_processing_logs_loan_id",
        "bank_processing_logs",
        ["loan_id"],
    )

    op.create_index(
        "ix_bank_processing_logs_bp_id",
        "bank_processing_logs",
        ["bp_id"],
    )

    op.create_index(
        "ix_bank_processing_logs_event",
        "bank_processing_logs",
        ["event"],
    )

    op.create_index(
        "ix_bank_processing_logs_employee_context_id",
        "bank_processing_logs",
        ["employee_context_id"],
    )

    op.create_index(
        "ix_bank_processing_logs_created_at",
        "bank_processing_logs",
        ["created_at"],
    )

    op.create_index(
        "ix_bank_processing_logs_deleted_at",
        "bank_processing_logs",
        ["deleted_at"],
    )


def downgrade():

    op.drop_index(
        "ix_bank_processing_logs_deleted_at",
        table_name="bank_processing_logs",
    )

    op.drop_index(
        "ix_bank_processing_logs_created_at",
        table_name="bank_processing_logs",
    )

    op.drop_index(
        "ix_bank_processing_logs_employee_context_id",
        table_name="bank_processing_logs",
    )

    op.drop_index(
        "ix_bank_processing_logs_event",
        table_name="bank_processing_logs",
    )

    op.drop_index(
        "ix_bank_processing_logs_bp_id",
        table_name="bank_processing_logs",
    )

    op.drop_index(
        "ix_bank_processing_logs_loan_id",
        table_name="bank_processing_logs",
    )

    op.drop_index(
        "ix_bank_processing_logs_id",
        table_name="bank_processing_logs",
    )

    op.drop_table("bank_processing_logs")