"""update call logs to employee context

Revision ID: 67394766279f
Revises: 3efb919b64e1
Create Date: 2026-09-29 11:49:21.641210
created_by: dev_sharath

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "67394766279f"
down_revision: Union[str, Sequence[str], None] = "3efb919b64e1"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""

    # ------------------------------------------------------------------
    # 1. Drop indexes that depend on employee_id
    # ------------------------------------------------------------------

    op.drop_index(
        "idx_call_logs_employee_id_lookup",
        table_name="call_logs",
    )

    op.drop_index(
        "idx_call_logs_employee_started_at",
        table_name="call_logs",
    )

    op.drop_index(
        "idx_call_logs_phone_employee_started_at_id",
        table_name="call_logs",
    )

    # ------------------------------------------------------------------
    # 2. Drop old foreign keys
    # ------------------------------------------------------------------

    op.drop_constraint(
        "call_logs_attended_by_fkey",
        "call_logs",
        type_="foreignkey",
    )

    op.drop_constraint(
        "call_logs_employee_id_fkey",
        "call_logs",
        type_="foreignkey",
    )

    # ------------------------------------------------------------------
    # 3. Remove old columns
    # ------------------------------------------------------------------

    op.drop_column(
        "call_logs",
        "recording_path",
    )

    op.drop_column(
        "call_logs",
        "recording_size_kb",
    )

    op.drop_column(
        "call_logs",
        "recording_duration_seconds",
    )

    op.drop_column(
        "call_logs",
        "attended_by",
    )

    op.drop_column(
        "call_logs",
        "remarks",
    )

    op.drop_column(
        "call_logs",
        "employee_id",
    )

    # ------------------------------------------------------------------
    # 4. Add employee_context_id
    # ------------------------------------------------------------------

    op.add_column(
        "call_logs",
        sa.Column(
            "employee_context_id",
            sa.Integer(),
            nullable=False,
        ),
    )

    # ------------------------------------------------------------------
    # 5. Add employee_context foreign key
    # ------------------------------------------------------------------

    op.create_foreign_key(
        "call_logs_employee_context_id_fkey",
        "call_logs",
        "employee_contexts",
        ["employee_context_id"],
        ["id"],
        ondelete="CASCADE",
    )

    # ------------------------------------------------------------------
    # 6. Create new indexes
    # ------------------------------------------------------------------

    op.create_index(
        "idx_call_logs_context_id_lookup",
        "call_logs",
        ["employee_context_id"],
        unique=False,
    )

    op.create_index(
        "idx_call_logs_context_started_at",
        "call_logs",
        [
            "employee_context_id",
            sa.literal_column("call_started_at DESC"),
        ],
        unique=False,
    )

    op.create_index(
        "idx_call_logs_phone_context_started_at_id",
        "call_logs",
        [
            "phone_number",
            "employee_context_id",
            sa.literal_column("call_started_at DESC"),
            sa.literal_column("id DESC"),
        ],
        unique=False,
    )


def downgrade() -> None:
    """Downgrade schema."""

    # ------------------------------------------------------------------
    # 1. Drop indexes using employee_context_id
    # ------------------------------------------------------------------

    op.drop_index(
        "idx_call_logs_phone_context_started_at_id",
        table_name="call_logs",
    )

    op.drop_index(
        "idx_call_logs_context_started_at",
        table_name="call_logs",
    )

    op.drop_index(
        "idx_call_logs_context_id_lookup",
        table_name="call_logs",
    )

    # ------------------------------------------------------------------
    # 2. Drop employee_context foreign key
    # ------------------------------------------------------------------

    op.drop_constraint(
        "call_logs_employee_context_id_fkey",
        "call_logs",
        type_="foreignkey",
    )

    # ------------------------------------------------------------------
    # 3. Remove employee_context_id
    # ------------------------------------------------------------------

    op.drop_column(
        "call_logs",
        "employee_context_id",
    )

    # ------------------------------------------------------------------
    # 4. Restore old columns
    # ------------------------------------------------------------------

    op.add_column(
        "call_logs",
        sa.Column(
            "employee_id",
            sa.BigInteger(),
            nullable=False,
        ),
    )

    op.add_column(
        "call_logs",
        sa.Column(
            "attended_by",
            sa.BigInteger(),
            nullable=True,
        ),
    )

    op.add_column(
        "call_logs",
        sa.Column(
            "recording_path",
            sa.String(length=255),
            nullable=True,
        ),
    )

    op.add_column(
        "call_logs",
        sa.Column(
            "recording_size_kb",
            sa.Integer(),
            nullable=True,
        ),
    )

    op.add_column(
        "call_logs",
        sa.Column(
            "recording_duration_seconds",
            sa.Integer(),
            nullable=True,
        ),
    )

    op.add_column(
        "call_logs",
        sa.Column(
            "remarks",
            sa.Text(),
            nullable=True,
        ),
    )

    # ------------------------------------------------------------------
    # 5. Restore old foreign keys
    # ------------------------------------------------------------------

    op.create_foreign_key(
        "call_logs_employee_id_fkey",
        "call_logs",
        "employees",
        ["employee_id"],
        ["id"],
        ondelete="CASCADE",
    )

    op.create_foreign_key(
        "call_logs_attended_by_fkey",
        "call_logs",
        "employees",
        ["attended_by"],
        ["id"],
    )

    # ------------------------------------------------------------------
    # 6. Restore old indexes
    # ------------------------------------------------------------------

    op.create_index(
        "idx_call_logs_employee_id_lookup",
        "call_logs",
        ["employee_id"],
        unique=False,
    )

    op.create_index(
        "idx_call_logs_employee_started_at",
        "call_logs",
        [
            "employee_id",
            sa.literal_column("call_started_at DESC"),
        ],
        unique=False,
    )

    op.create_index(
        "idx_call_logs_phone_employee_started_at_id",
        "call_logs",
        [
            "phone_number",
            "employee_id",
            sa.literal_column("call_started_at DESC"),
            sa.literal_column("id DESC"),
        ],
        unique=False,
    )