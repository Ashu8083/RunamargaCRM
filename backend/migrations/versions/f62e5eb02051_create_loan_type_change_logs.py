"""create loan type change logs

Revision ID: f62e5eb02051
Revises: 21b2a6aa9af6
Create Date: 2026-09-28 12:53:15.286504

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'f62e5eb02051'
down_revision: Union[str, Sequence[str], None] = '21b2a6aa9af6'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None




def upgrade():
    op.create_table(
        "loan_type_change_logs",

        sa.Column(
            "id",
            sa.Integer(),
            nullable=False,
        ),

        sa.Column(
            "loan_id",
            sa.Integer(),
            nullable=False,
        ),

        sa.Column(
            "changed_by_id",
            sa.Integer(),
            nullable=False,
        ),

        sa.Column(
            "changed_by_role",
            sa.String(length=100),
            nullable=False,
        ),

        sa.Column(
            "reports_to_id",
            sa.Integer(),
            nullable=True,
        ),

        sa.Column(
            "from_loan_type_id",
            sa.Integer(),
            nullable=True,
        ),

        sa.Column(
            "to_loan_type_id",
            sa.Integer(),
            nullable=False,
        ),

        sa.Column(
            "created_at",
            sa.DateTime(),
            nullable=False,
        ),

        sa.Column(
            "updated_at",
            sa.DateTime(),
            nullable=False,
        ),

        sa.Column(
            "deleted_at",
            sa.DateTime(),
            nullable=True,
        ),

        sa.ForeignKeyConstraint(
            ["loan_id"],
            ["loan_applications.id"],
        ),

        sa.ForeignKeyConstraint(
            ["changed_by_id"],
            ["employee_contexts.id"],
        ),

        sa.ForeignKeyConstraint(
            ["reports_to_id"],
            ["employee_contexts.id"],
        ),

        sa.ForeignKeyConstraint(
            ["from_loan_type_id"],
            ["loan_types.id"],
        ),

        sa.ForeignKeyConstraint(
            ["to_loan_type_id"],
            ["loan_types.id"],
        ),

        sa.PrimaryKeyConstraint("id"),
    )

    op.create_index(
        "ix_loan_type_change_logs_id",
        "loan_type_change_logs",
        ["id"],
        unique=False,
    )

    op.create_index(
        "ix_loan_type_change_logs_loan_id",
        "loan_type_change_logs",
        ["loan_id"],
        unique=False,
    )

    op.create_index(
        "ix_loan_type_change_logs_changed_by_id",
        "loan_type_change_logs",
        ["changed_by_id"],
        unique=False,
    )

    op.create_index(
        "ix_loan_type_change_logs_reports_to_id",
        "loan_type_change_logs",
        ["reports_to_id"],
        unique=False,
    )

    op.create_index(
        "ix_loan_type_change_logs_from_loan_type_id",
        "loan_type_change_logs",
        ["from_loan_type_id"],
        unique=False,
    )

    op.create_index(
        "ix_loan_type_change_logs_to_loan_type_id",
        "loan_type_change_logs",
        ["to_loan_type_id"],
        unique=False,
    )

    op.create_index(
        "ix_loan_type_change_logs_deleted_at",
        "loan_type_change_logs",
        ["deleted_at"],
        unique=False,
    )


def downgrade():
    op.drop_index(
        "ix_loan_type_change_logs_deleted_at",
        table_name="loan_type_change_logs",
    )

    op.drop_index(
        "ix_loan_type_change_logs_to_loan_type_id",
        table_name="loan_type_change_logs",
    )

    op.drop_index(
        "ix_loan_type_change_logs_from_loan_type_id",
        table_name="loan_type_change_logs",
    )

    op.drop_index(
        "ix_loan_type_change_logs_reports_to_id",
        table_name="loan_type_change_logs",
    )

    op.drop_index(
        "ix_loan_type_change_logs_changed_by_id",
        table_name="loan_type_change_logs",
    )

    op.drop_index(
        "ix_loan_type_change_logs_loan_id",
        table_name="loan_type_change_logs",
    )

    op.drop_index(
        "ix_loan_type_change_logs_id",
        table_name="loan_type_change_logs",
    )

    op.drop_table("loan_type_change_logs")