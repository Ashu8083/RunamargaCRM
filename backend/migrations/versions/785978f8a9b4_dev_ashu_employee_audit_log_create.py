"""dev-ashu: employee-audit log create 

Revision ID: 785978f8a9b4
Revises: dea22873ce2b
Create Date: 2026-10-09 11:55:36.078976

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '785978f8a9b4'
down_revision: Union[str, Sequence[str], None] = 'dea22873ce2b'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None



def upgrade() -> None:
    """Apply employee audit log and related schema changes safely."""

    # Create the table only if it does not already exist.
    bind = op.get_bind()
    inspector = sa.inspect(bind)

    if "employee_audit_logs" not in inspector.get_table_names():
        op.create_table(
            "employee_audit_logs",
            sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
            sa.Column("action", sa.String(length=10), nullable=False),
            sa.Column("action_by_id", sa.Integer(), nullable=True),
            sa.Column("employee_id", sa.Integer(), nullable=True),
            sa.Column("report_to_id", sa.Integer(), nullable=True),
            sa.Column(
                "date_and_time",
                sa.DateTime(timezone=True),
                server_default=sa.text("now()"),
                nullable=False,
            ),
            sa.Column("deleted_at", sa.DateTime(timezone=True), nullable=True),
            sa.ForeignKeyConstraint(
                ["action_by_id"], ["employee_contexts.id"], ondelete="SET NULL"
            ),
            sa.ForeignKeyConstraint(
                ["employee_id"], ["employee_contexts.id"], ondelete="SET NULL"
            ),
            sa.ForeignKeyConstraint(
                ["report_to_id"], ["employee_contexts.id"], ondelete="SET NULL"
            ),
            sa.PrimaryKeyConstraint("id"),
        )

    # Create each index only if it is missing.
    indexes_to_create = [
        ("employee_audit_logs", "ix_employee_audit_logs_action", ["action"]),
        ("employee_audit_logs", "ix_employee_audit_logs_action_by_id", ["action_by_id"]),
        ("employee_audit_logs", "ix_employee_audit_logs_date_and_time", ["date_and_time"]),
        ("employee_audit_logs", "ix_employee_audit_logs_employee_id", ["employee_id"]),
        ("employee_audit_logs", "ix_employee_audit_logs_id", ["id"]),
        ("employee_audit_logs", "ix_employee_audit_logs_report_to_id", ["report_to_id"]),
        ("duplicate_approvals", "idx_duplicate_approval_rm_context_id", ["rm_context_id"]),
        ("duplicate_approvals", "ix_duplicate_approvals_id", ["id"]),
        (
            "loan_applications",
            "idx_dashboard_main",
            ["deleted_at", "applied_date", "agent_context_id", "rm_context_id", "loan_type_id"],
        ),
        ("loan_applications", "ix_loan_applications_agent_context_id", ["agent_context_id"]),
        ("loan_applications", "ix_loan_applications_applied_by_context_id", ["applied_by_context_id"]),
        ("loan_applications", "ix_loan_applications_rm_context_id", ["rm_context_id"]),
    ]

    for table_name, index_name, columns in indexes_to_create:
        existing_indexes = {
            index["name"] for index in sa.inspect(bind).get_indexes(table_name)
        }
        if index_name not in existing_indexes:
            op.create_index(index_name, table_name, columns, unique=False)

    # The previous checks confirmed these columns contain no NULL values.
    op.alter_column(
        "employee_face_profiles",
        "capture_type",
        existing_type=sa.VARCHAR(length=30),
        nullable=False,
    )
    op.alter_column(
        "employee_face_profiles",
        "image_path",
        existing_type=sa.VARCHAR(),
        nullable=False,
    )



def downgrade() -> None:
    """Revert the changes made by this migration without deleting
    the pre-existing employee_audit_logs table or its indexes.
    """

    bind = op.get_bind()
    inspector = sa.inspect(bind)

    # Remove indexes created for duplicate_approvals if present.
    for index_name in (
        "ix_duplicate_approvals_id",
        "idx_duplicate_approval_rm_context_id",
    ):
        existing = {
            index["name"]
            for index in inspector.get_indexes("duplicate_approvals")
        }
        if index_name in existing:
            op.drop_index(index_name, table_name="duplicate_approvals")
            inspector = sa.inspect(bind)

    # Remove indexes created for loan_applications if present.
    for index_name in (
        "ix_loan_applications_rm_context_id",
        "ix_loan_applications_applied_by_context_id",
        "ix_loan_applications_agent_context_id",
        "idx_dashboard_main",
    ):
        existing = {
            index["name"]
            for index in inspector.get_indexes("loan_applications")
        }
        if index_name in existing:
            op.drop_index(index_name, table_name="loan_applications")
            inspector = sa.inspect(bind)

    # Restore the original nullable settings.
    op.alter_column(
        "employee_face_profiles",
        "image_path",
        existing_type=sa.VARCHAR(),
        nullable=True,
    )
    op.alter_column(
        "employee_face_profiles",
        "capture_type",
        existing_type=sa.VARCHAR(length=30),
        nullable=True,
    )

    # Keep employee_audit_logs and its pre-existing indexes intact.
