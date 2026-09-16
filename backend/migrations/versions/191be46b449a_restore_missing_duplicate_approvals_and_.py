# backend/migrations/versions/191be46b449a_restore_missing_duplicate_approvals_and_.py

"""restore missing duplicate approvals and phone numbers tables

Revision ID: 191be46b449a
Revises: 08f4737e4ece
Create Date: 2026-09-13 19:35:53.122782

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql


# revision identifiers, used by Alembic.
revision: str = "191be46b449a"
down_revision: Union[str, Sequence[str], None] = "08f4737e4ece"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Restore missing duplicate_approvals and phone_numbers tables."""

    # =========================================================
    # 1. Restore duplicate_approvals
    # =========================================================

    duplicate_approval_status = postgresql.ENUM(
        "pending",
        "approved",
        "rejected",
        name="duplicate_approval_status",
        create_type=False,
    )

    op.create_table(
        "duplicate_approvals",

        sa.Column(
            "id",
            sa.Integer(),
            nullable=False,
        ),

        sa.Column(
            "name",
            sa.String(),
            nullable=True,
        ),

        sa.Column(
            "phone",
            sa.String(),
            nullable=True,
        ),

        sa.Column(
            "loan_amt",
            sa.DECIMAL(15, 2),
            nullable=True,
        ),

        sa.Column(
            "loan_purpose",
            sa.String(),
            nullable=True,
        ),

        sa.Column(
            "referral",
            sa.String(),
            nullable=True,
        ),

        sa.Column(
            "loan_type_id",
            sa.Integer(),
            nullable=True,
        ),

        sa.Column(
            "applied_by_id",
            sa.Integer(),
            nullable=True,
        ),

        sa.Column(
            "status",
            duplicate_approval_status,
            nullable=False,
            server_default=sa.text(
                "'pending'::duplicate_approval_status"
            ),
        ),

        sa.Column(
            "approved_by_id",
            sa.Integer(),
            nullable=True,
        ),

        sa.Column(
            "rejected_remarks",
            sa.Text(),
            nullable=True,
        ),

        sa.Column(
            "applied_date",
            sa.Date(),
            nullable=True,
        ),

        sa.Column(
            "approved_at",
            sa.TIMESTAMP(timezone=True),
            nullable=True,
        ),

        sa.Column(
            "loan_id",
            sa.Integer(),
            nullable=True,
        ),

        sa.Column(
            "rm_id",
            sa.Integer(),
            nullable=True,
        ),

        sa.Column(
            "created_at",
            sa.TIMESTAMP(timezone=True),
            server_default=sa.func.now(),
            nullable=True,
        ),

        sa.Column(
            "deleted_at",
            sa.TIMESTAMP(timezone=True),
            nullable=True,
        ),

        sa.PrimaryKeyConstraint(
            "id",
        ),

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
    )

    op.create_index(
        "ix_duplicate_approvals_id",
        "duplicate_approvals",
        ["id"],
        unique=False,
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
        [
            "deleted_at",
            "applied_date",
            "status",
            "loan_type_id",
        ],
        unique=False,
    )

    # =========================================================
    # 2. Restore phone_numbers
    # =========================================================

    phone_number_status = postgresql.ENUM(
        "inactive",
        "active",
        name="phonenumberstatus",
        create_type=False,
    )

    op.create_table(
        "phone_numbers",

        sa.Column(
            "id",
            sa.Integer(),
            nullable=False,
        ),

        sa.Column(
            "employee_id",
            sa.Integer(),
            nullable=False,
        ),

        sa.Column(
            "phone",
            sa.Text(),
            nullable=True,
        ),

        sa.Column(
            "status",
            phone_number_status,
            nullable=False,
            server_default=sa.text(
                "'inactive'::phonenumberstatus"
            ),
        ),

        sa.Column(
            "trackable",
            phone_number_status,
            nullable=False,
            server_default=sa.text(
                "'inactive'::phonenumberstatus"
            ),
        ),

        sa.Column(
            "reports_to_id",
            sa.Integer(),
            nullable=True,
        ),

        sa.Column(
            "created_at",
            sa.TIMESTAMP(),
            server_default=sa.text("now()"),
            nullable=True,
        ),

        sa.Column(
            "updated_at",
            sa.TIMESTAMP(),
            server_default=sa.text("now()"),
            nullable=True,
        ),

        sa.Column(
            "deleted_at",
            sa.TIMESTAMP(),
            nullable=True,
        ),

        sa.ForeignKeyConstraint(
            ["employee_id"],
            ["employees.id"],
            ondelete="CASCADE",
        ),

        sa.ForeignKeyConstraint(
            ["reports_to_id"],
            ["employees.id"],
            ondelete="SET NULL",
        ),

        sa.PrimaryKeyConstraint(
            "id",
        ),

        sa.UniqueConstraint(
            "employee_id",
        ),
    )

    op.create_index(
        "ix_phone_numbers_id",
        "phone_numbers",
        ["id"],
        unique=False,
    )

    op.create_index(
        "ix_phone_numbers_employee_id",
        "phone_numbers",
        ["employee_id"],
        unique=True,
    )

    op.create_index(
        "ix_phone_numbers_reports_to_id",
        "phone_numbers",
        ["reports_to_id"],
        unique=False,
    )


def downgrade() -> None:
    """Remove the restored tables."""

    # ---------------------------------------------------------
    # Remove phone_numbers
    # ---------------------------------------------------------

    op.drop_index(
        "ix_phone_numbers_reports_to_id",
        table_name="phone_numbers",
    )

    op.drop_index(
        "ix_phone_numbers_employee_id",
        table_name="phone_numbers",
    )

    op.drop_index(
        "ix_phone_numbers_id",
        table_name="phone_numbers",
    )

    op.drop_table(
        "phone_numbers",
    )

    # ---------------------------------------------------------
    # Remove duplicate_approvals
    # ---------------------------------------------------------

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

    op.drop_index(
        "ix_duplicate_approvals_id",
        table_name="duplicate_approvals",
    )

    op.drop_table(
        "duplicate_approvals",
    )

    # Do not drop either PostgreSQL enum here.
    #
    # duplicate_approval_status and phonenumberstatus existed
    # before this repair migration and are owned by the
    # existing schema/migration history.