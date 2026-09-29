"""remove redundant phone employee unique constraint

Revision ID: 3efb919b64e1
Revises: a19f28a3bcd4
Create Date: 2026-09-26 08:30:29.533383

"""
from typing import Sequence, Union

from alembic import op


# revision identifiers, used by Alembic.
revision: str = "3efb919b64e1"
down_revision: Union[str, Sequence[str], None] = "a19f28a3bcd4"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Remove redundant unique constraint.

    Uniqueness remains enforced by the existing
    ix_phone_numbers_employee_id unique index.
    """
    op.drop_constraint(
        "phone_numbers_employee_id_key",
        "phone_numbers",
        type_="unique",
    )


def downgrade() -> None:
    """Restore the unique constraint."""
    op.create_unique_constraint(
        "phone_numbers_employee_id_key",
        "phone_numbers",
        ["employee_id"],
    )