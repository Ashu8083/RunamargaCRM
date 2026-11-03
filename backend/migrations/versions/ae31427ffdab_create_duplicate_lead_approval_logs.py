"""create duplicate lead approval logs

Revision ID: ae31427ffdab
Revises: dea22873ce2b
Create Date: 2026-10-11 17:20:57.576807
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# Revision identifiers used by Alembic.
revision: str = "ae31427ffdab"
down_revision: Union[str, Sequence[str], None] = "dea22873ce2b"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # =========================================================
    # DUPLICATE LEAD APPROVAL LOGS
    # =========================================================

    op.create_table(
        "duplicate_lead_approval_logs",
        sa.Column("id", sa.Integer(), nullable=False),

        sa.Column("duplicate_approval_id", sa.Integer(), nullable=True),
        sa.Column("loan_id", sa.Integer(), nullable=True),

        sa.Column("submitted_by_id", sa.Integer(), nullable=True),
        sa.Column("reports_to_id", sa.Integer(), nullable=True),
        sa.Column("reviewed_by_id", sa.Integer(), nullable=True),

        sa.Column(
            "status",
            sa.Enum(
                "pending",
                "approved",
                "rejected",
                name="duplicate_lead_approval_log_status",
            ),
            nullable=False,
        ),

        sa.Column(
            "created_at",
            sa.TIMESTAMP(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),

        sa.Column("deleted_at", sa.TIMESTAMP(timezone=True), nullable=True),

        # Original duplicate approval record.
        sa.ForeignKeyConstraint(
            ["duplicate_approval_id"],
            ["duplicate_approvals.id"],
            ondelete="SET NULL",
        ),

        # Loan application created after approval.
        sa.ForeignKeyConstraint(
            ["loan_id"],
            ["loan_applications.id"],
            ondelete="SET NULL",
        ),

        sa.ForeignKeyConstraint(
            ["submitted_by_id"],
            ["employee_contexts.id"],
            ondelete="SET NULL",
        ),

        sa.ForeignKeyConstraint(
            ["reports_to_id"],
            ["employee_contexts.id"],
            ondelete="SET NULL",
        ),

        sa.ForeignKeyConstraint(
            ["reviewed_by_id"],
            ["employees.id"],
            ondelete="SET NULL",
        ),

        sa.PrimaryKeyConstraint("id"),
    )

    # =========================================================
    # INDEXES
    # =========================================================

    op.create_index(
        "idx_duplicate_lead_approval_logs_duplicate_approval_id",
        "duplicate_lead_approval_logs",
        ["duplicate_approval_id"],
        unique=False,
    )

    op.create_index(
        "idx_duplicate_lead_approval_logs_loan_id",
        "duplicate_lead_approval_logs",
        ["loan_id"],
        unique=False,
    )

    op.create_index(
        "idx_duplicate_lead_approval_logs_submitted_by_id",
        "duplicate_lead_approval_logs",
        ["submitted_by_id"],
        unique=False,
    )

    op.create_index(
        "idx_duplicate_lead_approval_logs_reports_to_id",
        "duplicate_lead_approval_logs",
        ["reports_to_id"],
        unique=False,
    )

    op.create_index(
        "idx_duplicate_lead_approval_logs_reviewed_by_id",
        "duplicate_lead_approval_logs",
        ["reviewed_by_id"],
        unique=False,
    )

    op.create_index(
        "idx_duplicate_lead_approval_logs_status",
        "duplicate_lead_approval_logs",
        ["status"],
        unique=False,
    )

    op.create_index(
        "idx_duplicate_lead_approval_logs_deleted_at",
        "duplicate_lead_approval_logs",
        ["deleted_at"],
        unique=False,
    )

    op.create_index(
        "idx_duplicate_lead_approval_logs_dashboard",
        "duplicate_lead_approval_logs",
        ["deleted_at", "created_at", "status"],
        unique=False,
    )

    op.create_index(
        op.f("ix_duplicate_lead_approval_logs_id"),
        "duplicate_lead_approval_logs",
        ["id"],
        unique=False,
    )


def downgrade() -> None:
    # =========================================================
    # DROP DUPLICATE LEAD APPROVAL LOGS
    # =========================================================

    op.drop_index(
        op.f("ix_duplicate_lead_approval_logs_id"),
        table_name="duplicate_lead_approval_logs",
    )

    op.drop_index(
        "idx_duplicate_lead_approval_logs_dashboard",
        table_name="duplicate_lead_approval_logs",
    )

    op.drop_index(
        "idx_duplicate_lead_approval_logs_deleted_at",
        table_name="duplicate_lead_approval_logs",
    )

    op.drop_index(
        "idx_duplicate_lead_approval_logs_status",
        table_name="duplicate_lead_approval_logs",
    )

    op.drop_index(
        "idx_duplicate_lead_approval_logs_reviewed_by_id",
        table_name="duplicate_lead_approval_logs",
    )

    op.drop_index(
        "idx_duplicate_lead_approval_logs_reports_to_id",
        table_name="duplicate_lead_approval_logs",
    )

    op.drop_index(
        "idx_duplicate_lead_approval_logs_submitted_by_id",
        table_name="duplicate_lead_approval_logs",
    )

    op.drop_index(
        "idx_duplicate_lead_approval_logs_loan_id",
        table_name="duplicate_lead_approval_logs",
    )

    op.drop_index(
        "idx_duplicate_lead_approval_logs_duplicate_approval_id",
        table_name="duplicate_lead_approval_logs",
    )

    op.drop_table("duplicate_lead_approval_logs")


