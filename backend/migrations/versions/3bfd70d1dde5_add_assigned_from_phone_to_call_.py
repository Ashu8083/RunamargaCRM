"""add assigned from phone to call reassignment logs

Revision ID: 3bfd70d1dde5
Revises: 8c274a999779
Create Date: 2026-10-12 10:36:16.650255

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '3bfd70d1dde5'
down_revision: Union[str, Sequence[str], None] = '8c274a999779'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # 1. Remove the foreign key before changing the column type
    op.drop_constraint(
        "call_reassignment_audit_logs_assigned_to_phone_fkey",
        "call_reassignment_audit_logs",
        type_="foreignkey",
    )

    # 2. Change assigned_to_phone from INTEGER to VARCHAR(20)
    op.alter_column(
        "call_reassignment_audit_logs",
        "assigned_to_phone",
        existing_type=sa.Integer(),
        type_=sa.String(length=20),
        existing_nullable=True,
        postgresql_using="NULL",
    )

    # 3. Add the new column for the previous assignee's phone
    op.add_column(
        "call_reassignment_audit_logs",
        sa.Column("assigned_from_phone", sa.String(length=20), nullable=True),
    )


def downgrade() -> None:
    # 1. Remove the new column
    op.drop_column(
        "call_reassignment_audit_logs",
        "assigned_from_phone",
    )

    # 2. Convert assigned_to_phone back to INTEGER.
    # Clear values because phone numbers cannot be converted to phone_numbers.id.
    op.alter_column(
        "call_reassignment_audit_logs",
        "assigned_to_phone",
        existing_type=sa.String(length=20),
        type_=sa.Integer(),
        existing_nullable=True,
        postgresql_using="NULL",
    )

    # 3. Restore the foreign key
    op.create_foreign_key(
        "call_reassignment_audit_logs_assigned_to_phone_fkey",
        "call_reassignment_audit_logs",
        "phone_numbers",
        ["assigned_to_phone"],
        ["id"],
        ondelete="SET NULL",
    )