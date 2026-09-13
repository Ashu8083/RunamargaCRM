"""create duplicate approvals

Revision ID: 1aec75f634d8
Revises: b916860233ec
Create Date: 2026-09-07 11:13:49.126638

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = '1aec75f634d8'
down_revision: Union[str, Sequence[str], None] = 'b916860233ec'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.create_table(
        "duplicate_approvals",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("name", sa.String(), nullable=True),
        sa.Column("phone", sa.String(), nullable=True),
        sa.Column("loan_amt", sa.DECIMAL(15, 2), nullable=True),
        sa.Column("loan_purpose", sa.String(), nullable=True),
        sa.Column("referral", sa.String(), nullable=True),
        sa.Column("loan_type_id", sa.Integer(), nullable=True),
        sa.Column("applied_by_id", sa.Integer(), nullable=True),
        sa.Column(
            "status",
            sa.Enum(
                "pending",
                "approved",
                "rejected",
                name="duplicate_approval_status",
            ),
            nullable=False,
        ),
        sa.Column("approved_by_id", sa.Integer(), nullable=True),
        sa.Column("rejected_remarks", sa.Text(), nullable=True),
        sa.Column("applied_date", sa.Date(), nullable=True),
        sa.Column(
            "approved_at",
            sa.TIMESTAMP(timezone=True),
            nullable=True,
        ),
        sa.Column("loan_id", sa.Integer(), nullable=True),
        sa.Column("rm_id", sa.Integer(), nullable=True),
        sa.Column(
            "created_at",
            sa.TIMESTAMP(timezone=True),
            server_default=sa.text("now()"),
            nullable=True,
        ),
        sa.Column("deleted_at", sa.TIMESTAMP(timezone=True), nullable=True),
        sa.ForeignKeyConstraint(
            ["loan_type_id"],
            ["loan_types.id"],
        ),
        sa.ForeignKeyConstraint(
            ["applied_by_id"],
            ["employees.id"],
        ),
        sa.ForeignKeyConstraint(
            ["approved_by_id"],
            ["employees.id"],
        ),
        sa.ForeignKeyConstraint(
            ["loan_id"],
            ["loan_applications.id"],
        ),
        sa.ForeignKeyConstraint(
            ["rm_id"],
            ["employees.id"],
        ),
        sa.PrimaryKeyConstraint("id"),
    )

    op.create_index(
        "idx_duplicate_approval_applied_date",
        "duplicate_approvals",
        ["applied_date"],
        unique=False,
    )
    op.create_index(
        "idx_duplicate_approval_type_id",
        "duplicate_approvals",
        ["loan_type_id"],
        unique=False,
    )
    op.create_index(
        "idx_duplicate_approval_rm_id",
        "duplicate_approvals",
        ["rm_id"],
        unique=False,
    )
    op.create_index(
        "idx_duplicate_approval_status",
        "duplicate_approvals",
        ["status"],
        unique=False,
    )
    op.create_index(
        "idx_duplicate_approval_approved_by_id",
        "duplicate_approvals",
        ["approved_by_id"],
        unique=False,
    )
    op.create_index(
        "idx_duplicate_approval_deleted_at",
        "duplicate_approvals",
        ["deleted_at"],
        unique=False,
    )
    op.create_index(
        "idx_duplicate_approval_dashboard",
        "duplicate_approvals",
        ["deleted_at", "applied_date", "status", "loan_type_id"],
        unique=False,
    )


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_index(
        "idx_duplicate_approval_dashboard",
        table_name="duplicate_approvals",
    )
    op.drop_index(
        "idx_duplicate_approval_deleted_at",
        table_name="duplicate_approvals",
    )
    op.drop_index(
        "idx_duplicate_approval_approved_by_id",
        table_name="duplicate_approvals",
    )
    op.drop_index(
        "idx_duplicate_approval_status",
        table_name="duplicate_approvals",
    )
    op.drop_index(
        "idx_duplicate_approval_rm_id",
        table_name="duplicate_approvals",
    )
    op.drop_index(
        "idx_duplicate_approval_type_id",
        table_name="duplicate_approvals",
    )
    op.drop_index(
        "idx_duplicate_approval_applied_date",
        table_name="duplicate_approvals",
    )
    op.drop_table("duplicate_approvals")

    sa.Enum(
        "pending",
        "approved",
        "rejected",
        name="duplicate_approval_status",
    ).drop(op.get_bind(), checkfirst=True)