"""change reports to employee context

Revision ID: 8f1231a4cce7
Revises: 55d16e508d0f
Create Date: 2026-09-06 10:56:26.741723

"""
from typing import Sequence, Union

from alembic import op


# revision identifiers, used by Alembic.
revision: str = '8f1231a4cce7'
down_revision: Union[str, Sequence[str], None] = '55d16e508d0f'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""

    # ------------------------------------------------------------------------
    # Remove old foreign key
    #
    # reports_to_id previously pointed to:
    #
    #     employees.id
    #
    # ------------------------------------------------------------------------

    op.drop_constraint(
        'employee_contexts_reports_to_id_fkey',
        'employee_contexts',
        type_='foreignkey',
    )


    # ------------------------------------------------------------------------
    # Create new self-referencing foreign key
    #
    # reports_to_id now points to:
    #
    #     employee_contexts.id
    #
    # Example:
    #
    # Agent EmployeeContext
    #       reports_to_id
    #              ↓
    # Team Lead EmployeeContext
    #
    # ------------------------------------------------------------------------

    op.create_foreign_key(
        'employee_contexts_reports_to_id_fkey',
        'employee_contexts',
        'employee_contexts',
        ['reports_to_id'],
        ['id'],
        ondelete='SET NULL',
    )


def downgrade() -> None:
    """Downgrade schema."""

    # ------------------------------------------------------------------------
    # Remove self-referencing foreign key
    # ------------------------------------------------------------------------

    op.drop_constraint(
        'employee_contexts_reports_to_id_fkey',
        'employee_contexts',
        type_='foreignkey',
    )


    # ------------------------------------------------------------------------
    # Restore old foreign key
    #
    # reports_to_id → employees.id
    #
    # ------------------------------------------------------------------------

    op.create_foreign_key(
        'employee_contexts_reports_to_id_fkey',
        'employee_contexts',
        'employees',
        ['reports_to_id'],
        ['id'],
        ondelete='SET NULL',
    )