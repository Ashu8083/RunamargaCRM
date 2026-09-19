"""migrate duplicate approval ownership to employee contexts

Revision ID: f52975b45c63
Revises: 5cee164372ec
Create Date: 2026-09-17 13:55:19.633552

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'f52975b45c63'
down_revision: Union[str, Sequence[str], None] = '5cee164372ec'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""

    # Add new EmployeeContext-based ownership columns
    op.add_column(
        "duplicate_approvals",
        sa.Column(
            "applied_by_context_id",
            sa.Integer(),
            nullable=True,
        ),
    )

    op.add_column(
        "duplicate_approvals",
        sa.Column(
            "rm_context_id",
            sa.Integer(),
            nullable=True,
        ),
    )

    # Add foreign keys
    op.create_foreign_key(
        "fk_duplicate_approvals_applied_by_context",
        "duplicate_approvals",
        "employee_contexts",
        ["applied_by_context_id"],
        ["id"],
        ondelete="SET NULL",
    )

    op.create_foreign_key(
        "fk_duplicate_approvals_rm_context",
        "duplicate_approvals",
        "employee_contexts",
        ["rm_context_id"],
        ["id"],
        ondelete="SET NULL",
    )
        # Migrate applied_by employee IDs → EmployeeContext IDs
    op.execute(
        """
        UPDATE duplicate_approvals da
        SET applied_by_context_id = ec.id
        FROM employee_contexts ec
        WHERE ec.employee_id = da.applied_by_id
          AND ec.is_active = TRUE
        """
    )

    # Migrate RM employee IDs → EmployeeContext IDs
    op.execute(
        """
        UPDATE duplicate_approvals da
        SET rm_context_id = ec.id
        FROM employee_contexts ec
        WHERE ec.employee_id = da.rm_id
          AND ec.is_active = TRUE
        """
    )
        # Remove legacy employee-ID ownership columns
    op.drop_column(
        "duplicate_approvals",
        "applied_by_id",
    )

    op.drop_column(
        "duplicate_approvals",
        "rm_id",
    )
def downgrade() -> None:
    """Downgrade schema."""

    # Restore legacy employee-ID ownership columns
    op.add_column(
        "duplicate_approvals",
        sa.Column(
            "applied_by_id",
            sa.Integer(),
            nullable=True,
        ),
    )

    op.add_column(
        "duplicate_approvals",
        sa.Column(
            "rm_id",
            sa.Integer(),
            nullable=True,
        ),
    )

    # Restore employee IDs from EmployeeContext IDs
    op.execute(
        """
        UPDATE duplicate_approvals da
        SET applied_by_id = ec.employee_id
        FROM employee_contexts ec
        WHERE ec.id = da.applied_by_context_id
        """
    )

    op.execute(
        """
        UPDATE duplicate_approvals da
        SET rm_id = ec.employee_id
        FROM employee_contexts ec
        WHERE ec.id = da.rm_context_id
        """
    )

    # Remove new foreign keys
    op.drop_constraint(
        "fk_duplicate_approvals_applied_by_context",
        "duplicate_approvals",
        type_="foreignkey",
    )

    op.drop_constraint(
        "fk_duplicate_approvals_rm_context",
        "duplicate_approvals",
        type_="foreignkey",
    )

    # Remove EmployeeContext ownership columns
    op.drop_column(
        "duplicate_approvals",
        "applied_by_context_id",
    )

    op.drop_column(
        "duplicate_approvals",
        "rm_context_id",
    )