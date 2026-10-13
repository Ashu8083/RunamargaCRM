"""update duplicate approval and team chat employee foreign keys

Revision ID: 999b02bb7584
Revises: 69cb37642d3a
Create Date: 2026-10-13 10:29:18.904421
"""

from typing import Sequence, Union

from alembic import op


# Revision identifiers.
revision: str = "999b02bb7584"
down_revision: Union[str, Sequence[str], None] = "69cb37642d3a"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # duplicate_approvals.approved_by_id
    op.drop_constraint(
        "duplicate_approvals_approved_by_id_fkey",
        "duplicate_approvals",
        type_="foreignkey",
    )

    op.create_foreign_key(
        "fk_duplicate_approvals_approved_by_context",
        "duplicate_approvals",
        "employee_contexts",
        ["approved_by_id"],
        ["id"],
    )

    # duplicate_lead_approval_logs.reviewed_by_id
    op.drop_constraint(
        "duplicate_lead_approval_logs_reviewed_by_id_fkey",
        "duplicate_lead_approval_logs",
        type_="foreignkey",
    )

    op.create_foreign_key(
        "fk_duplicate_lead_approval_logs_reviewed_by_context",
        "duplicate_lead_approval_logs",
        "employee_contexts",
        ["reviewed_by_id"],
        ["id"],
        ondelete="SET NULL",
    )

    # team_chat.sender_admin_id
    op.drop_constraint(
        "team_chat_sender_admin_id_fkey",
        "team_chat",
        type_="foreignkey",
    )

    op.create_foreign_key(
        "fk_team_chat_sender_context",
        "team_chat",
        "employee_contexts",
        ["sender_admin_id"],
        ["id"],
        ondelete="CASCADE",
    )

    # team_chat.deleted_by_admin_id
    op.drop_constraint(
        "team_chat_deleted_by_admin_id_fkey",
        "team_chat",
        type_="foreignkey",
    )

    op.create_foreign_key(
        "fk_team_chat_deleted_by_context",
        "team_chat",
        "employee_contexts",
        ["deleted_by_admin_id"],
        ["id"],
        ondelete="SET NULL",
    )


def downgrade() -> None:
    # Restore team_chat.deleted_by_admin_id -> employees.id
    op.drop_constraint(
        "fk_team_chat_deleted_by_context",
        "team_chat",
        type_="foreignkey",
    )

    op.create_foreign_key(
        "team_chat_deleted_by_admin_id_fkey",
        "team_chat",
        "employees",
        ["deleted_by_admin_id"],
        ["id"],
        ondelete="SET NULL",
    )

    # Restore team_chat.sender_admin_id -> employees.id
    op.drop_constraint(
        "fk_team_chat_sender_context",
        "team_chat",
        type_="foreignkey",
    )

    op.create_foreign_key(
        "team_chat_sender_admin_id_fkey",
        "team_chat",
        "employees",
        ["sender_admin_id"],
        ["id"],
        ondelete="CASCADE",
    )

    # Restore duplicate_lead_approval_logs.reviewed_by_id
    op.drop_constraint(
        "fk_duplicate_lead_approval_logs_reviewed_by_context",
        "duplicate_lead_approval_logs",
        type_="foreignkey",
    )

    op.create_foreign_key(
        "duplicate_lead_approval_logs_reviewed_by_id_fkey",
        "duplicate_lead_approval_logs",
        "employees",
        ["reviewed_by_id"],
        ["id"],
        ondelete="SET NULL",
    )

    # Restore duplicate_approvals.approved_by_id
    op.drop_constraint(
        "fk_duplicate_approvals_approved_by_context",
        "duplicate_approvals",
        type_="foreignkey",
    )

    op.create_foreign_key(
        "duplicate_approvals_approved_by_id_fkey",
        "duplicate_approvals",
        "employees",
        ["approved_by_id"],
        ["id"],
    )