"""create leave managements table

Revision ID: 15502a832dad
Revises: e9ead7bd46b9
Create Date: 2026-10-20 11:53:49.327284
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# Revision identifiers used by Alembic.
revision: str = "15502a832dad"
down_revision: Union[str, Sequence[str], None] = "e9ead7bd46b9"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Create the leave_managements table."""

    op.create_table(
        "leave_managements",
        sa.Column(
            "id",
            sa.Integer(),
            primary_key=True,
            nullable=False,
        ),
        sa.Column(
            "applied_by",
            sa.Integer(),
            sa.ForeignKey(
                "employees.id",
                ondelete="CASCADE",
            ),
            nullable=False,
        ),
        sa.Column(
            "from_date",
            sa.Date(),
            nullable=False,
        ),
        sa.Column(
            "to_date",
            sa.Date(),
            nullable=False,
        ),
        sa.Column(
            "leave_type",
            sa.String(length=50),
            nullable=False,
        ),
        sa.Column(
            "reason",
            sa.Text(),
            nullable=False,
        ),
        sa.Column(
            "status",
            sa.String(length=20),
            nullable=False,
            server_default="Pending",
        ),
        sa.Column(
            "approved_by",
            sa.Integer(),
            sa.ForeignKey(
                "employee_contexts.id",
                ondelete="SET NULL",
            ),
            nullable=True,
        ),
        sa.Column(
            "reviewed_at",
            sa.TIMESTAMP(timezone=True),
            nullable=True,
        ),
        sa.Column(
            "review_remarks",
            sa.Text(),
            nullable=True,
        ),
        sa.Column(
            "created_at",
            sa.TIMESTAMP(timezone=True),
            nullable=False,
            server_default=sa.text("now()"),
        ),
        sa.Column(
            "updated_at",
            sa.TIMESTAMP(timezone=True),
            nullable=True,
        ),
        sa.CheckConstraint(
            "status IN ('Pending', 'Approved', 'Rejected')",
            name="ck_leave_managements_status",
        ),
        sa.CheckConstraint(
            "to_date >= from_date",
            name="ck_leave_managements_date_range",
        ),
    )

    # Indexes
    op.create_index(
        "ix_leave_managements_applied_by",
        "leave_managements",
        ["applied_by"],
        unique=False,
    )

    op.create_index(
        "ix_leave_managements_applied_by_dates",
        "leave_managements",
        ["applied_by", "from_date", "to_date"],
        unique=False,
    )

    op.create_index(
        "ix_leave_managements_approved_by",
        "leave_managements",
        ["approved_by"],
        unique=False,
    )

    op.create_index(
        "ix_leave_managements_status",
        "leave_managements",
        ["status"],
        unique=False,
    )


def downgrade() -> None:
    """Drop the leave_managements table."""

    op.drop_index(
        "ix_leave_managements_status",
        table_name="leave_managements",
    )

    op.drop_index(
        "ix_leave_managements_approved_by",
        table_name="leave_managements",
    )

    op.drop_index(
        "ix_leave_managements_applied_by_dates",
        table_name="leave_managements",
    )

    op.drop_index(
        "ix_leave_managements_applied_by",
        table_name="leave_managements",
    )

    op.drop_table("leave_managements")