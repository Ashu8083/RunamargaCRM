"""create duplicate approvals table

Revision ID: d1d24683bb29
Revises: eb5f9fd7ed25
Create Date: 2026-09-07
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql


# revision identifiers, used by Alembic.
revision: str = "d1d24683bb29"
down_revision: Union[str, Sequence[str], None] = "eb5f9fd7ed25"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ---------------------------------------------------------
    # Make sure the PostgreSQL enum exists.
    #
    # DO NOT use SQLAlchemy's automatic enum creation here.
    # This safely creates the enum only if it does not exist.
    # ---------------------------------------------------------
    op.execute(
        """
        DO $$
        BEGIN
            IF NOT EXISTS (
                SELECT 1
                FROM pg_type
                WHERE typname = 'duplicate_approval_status'
            ) THEN
                CREATE TYPE duplicate_approval_status AS ENUM (
                    'pending',
                    'approved',
                    'rejected'
                );
            END IF;
        END
        $$;
        """
    )

    # Use the already-existing PostgreSQL enum.
    duplicate_approval_status = postgresql.ENUM(
        "pending",
        "approved",
        "rejected",
        name="duplicate_approval_status",
        create_type=False,
    )

    # ---------------------------------------------------------
    # Create duplicate_approvals table
    # ---------------------------------------------------------
    op.create_table(
        "duplicate_approvals",

        # Primary key
        sa.Column(
            "id",
            sa.Integer(),
            nullable=False,
        ),

        # Application data
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

        # Loan type
        sa.Column(
            "loan_type_id",
            sa.Integer(),
            nullable=True,
        ),

        # Employee who submitted request
        sa.Column(
            "applied_by_id",
            sa.Integer(),
            nullable=True,
        ),

        # Approval status
        sa.Column(
            "status",
            duplicate_approval_status,
            nullable=False,
            server_default=sa.text("'pending'"),
        ),

        # Employee who approved request
        sa.Column(
            "approved_by_id",
            sa.Integer(),
            nullable=True,
        ),

        # Rejection remarks
        sa.Column(
            "rejected_remarks",
            sa.Text(),
            nullable=True,
        ),

        # Dates
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

        # NULL while approval is pending.
        # Filled with the new loan_applications.id after approval.
        sa.Column(
            "loan_id",
            sa.Integer(),
            nullable=True,
        ),

        # Selected RM
        sa.Column(
            "rm_id",
            sa.Integer(),
            nullable=True,
        ),

        # Timestamps
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

        # -----------------------------------------------------
        # Constraints
        # -----------------------------------------------------
        sa.PrimaryKeyConstraint("id"),

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

    # ---------------------------------------------------------
    # Indexes
    # ---------------------------------------------------------

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


def downgrade() -> None:
    # ---------------------------------------------------------
    # Drop indexes
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

    # ---------------------------------------------------------
    # Drop table
    # ---------------------------------------------------------

    op.drop_table("duplicate_approvals")

    # Do not drop duplicate_approval_status here.
    #
    # The enum may have existed before this migration and
    # therefore should not be removed by this migration.