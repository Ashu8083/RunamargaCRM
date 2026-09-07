"""change reports to employee context

Revision ID: 8f1231a4cce7
Revises: 55d16e508d0f
Create Date: 2026-09-06 10:56:26.741723

"""

from typing import Sequence, Union

from alembic import op


# revision identifiers, used by Alembic.
revision: str = "8f1231a4cce7"
down_revision: Union[str, Sequence[str], None] = "55d16e508d0f"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Remove the old foreign key:
    #
    # employee_contexts.reports_to_id
    #          ↓
    #      employees.id

    op.drop_constraint(
        "employee_contexts_reports_to_id_fkey",
        "employee_contexts",
        type_="foreignkey",
    )

    # Existing reports_to_id values contain EMPLOYEE IDs.
    #
    # Convert them to EMPLOYEE_CONTEXT IDs.
    #
    # Example:
    # reports_to_id = 13
    # employee 13 has employee_context id = 38
    # therefore:
    # reports_to_id becomes 38
    #
    # If an employee has no employee_context, the
    # reports_to_id becomes NULL.

    op.execute(
        """
        UPDATE employee_contexts AS source
        SET reports_to_id = target.id
        FROM employee_contexts AS target
        WHERE source.reports_to_id = target.employee_id
        """
    )

    # Any remaining reports_to_id values could not be
    # converted because the referenced employee does
    # not have an employee_context.
    #
    # Clear those values so the new FK can be created.

    op.execute(
        """
        UPDATE employee_contexts AS source
        SET reports_to_id = NULL
        WHERE source.reports_to_id IS NOT NULL
          AND NOT EXISTS (
              SELECT 1
              FROM employee_contexts AS target
              WHERE target.id = source.reports_to_id
          )
        """
    )

    # New relationship:
    #
    # employee_contexts.reports_to_id
    #          ↓
    # employee_contexts.id

    op.create_foreign_key(
        "employee_contexts_reports_to_id_fkey",
        "employee_contexts",
        "employee_contexts",
        ["reports_to_id"],
        ["id"],
        ondelete="SET NULL",
    )


def downgrade() -> None:
    # Remove the self-referencing foreign key.

    op.drop_constraint(
        "employee_contexts_reports_to_id_fkey",
        "employee_contexts",
        type_="foreignkey",
    )

    # Restore:
    #
    # reports_to_id → employees.id

    op.create_foreign_key(
        "employee_contexts_reports_to_id_fkey",
        "employee_contexts",
        "employees",
        ["reports_to_id"],
        ["id"],
        ondelete="SET NULL",
    )