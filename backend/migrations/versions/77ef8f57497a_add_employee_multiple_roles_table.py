"""add employee multiple roles table

Revision ID: 77ef8f57497a
Revises: bb15a71ef441
Create Date: 2026-08-31 19:07:36.471925

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '77ef8f57497a'
down_revision: Union[str, Sequence[str], None] = 'bb15a71ef441'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "employee_roles",

        sa.Column(
            "id",
            sa.Integer(),
            primary_key=True,
        ),

        sa.Column(
            "employee_id",
            sa.Integer(),
            sa.ForeignKey(
                "employees.id",
                ondelete="CASCADE",
            ),
            nullable=False,
        ),

        sa.Column(
            "role_id",
            sa.Integer(),
            sa.ForeignKey(
                "roles.id",
                ondelete="CASCADE",
            ),
            nullable=False,
        ),

        sa.Column(
            "created_at",
            sa.TIMESTAMP(timezone=True),
            server_default=sa.func.now(),
        ),

        sa.Column(
            "updated_at",
            sa.TIMESTAMP(timezone=True),
            nullable=True,
        ),

        sa.UniqueConstraint(
            "employee_id",
            "role_id",
            name="uix_employee_role",
        ),
    )

    op.create_index(
        "ix_employee_roles_id",
        "employee_roles",
        ["id"],
    )

    op.create_index(
        "ix_employee_roles_employee_id",
        "employee_roles",
        ["employee_id"],
    )

    op.create_index(
        "ix_employee_roles_role_id",
        "employee_roles",
        ["role_id"],
    )


def downgrade() -> None:
    op.drop_index(
        "ix_employee_roles_role_id",
        table_name="employee_roles",
    )

    op.drop_index(
        "ix_employee_roles_employee_id",
        table_name="employee_roles",
    )

    op.drop_index(
        "ix_employee_roles_id",
        table_name="employee_roles",
    )

    op.drop_table("employee_roles")