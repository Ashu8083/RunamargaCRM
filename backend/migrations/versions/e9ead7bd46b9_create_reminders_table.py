
"""create reminders table

Revision ID: e9ead7bd46b9
Revises: a342ef0d9d77
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "e9ead7bd46b9"
down_revision: Union[str, Sequence[str], None] = "a342ef0d9d77"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "reminders",
        sa.Column("id", sa.BigInteger(), autoincrement=True, nullable=False),
        sa.Column("employee_id", sa.Integer(), nullable=False),
        sa.Column("application_id", sa.Integer(), nullable=False),
        sa.Column("reminder_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("note", sa.Text(), nullable=False),
        sa.Column(
            "status",
            sa.String(length=20),
            server_default="pending",
            nullable=False,
        ),
        sa.Column("completed_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.Column(
            "updated_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.Column("deleted_at", sa.DateTime(timezone=True), nullable=True),
        sa.ForeignKeyConstraint(
            ["employee_id"],
            ["employees.id"],
        ),
        sa.ForeignKeyConstraint(
            ["application_id"],
            ["loan_applications.id"],
        ),
        sa.PrimaryKeyConstraint("id"),
    )

    op.create_index(
        "ix_reminders_employee_id",
        "reminders",
        ["employee_id"],
        unique=False,
    )
    op.create_index(
        "ix_reminders_application_id",
        "reminders",
        ["application_id"],
        unique=False,
    )
    op.create_index(
        "ix_reminders_reminder_at",
        "reminders",
        ["reminder_at"],
        unique=False,
    )
    op.create_index(
        "ix_reminders_status",
        "reminders",
        ["status"],
        unique=False,
    )
    op.create_index(
        "ix_reminders_deleted_at",
        "reminders",
        ["deleted_at"],
        unique=False,
    )


def downgrade() -> None:
    op.drop_table("reminders")
