"""create phone numbers table

Revision ID: 174e4245fdc9
Revises: 122b78c4d0c7
Create Date: 2026-09-06 01:10:10.501393
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "174e4245fdc9"
down_revision: Union[str, Sequence[str], None] = "122b78c4d0c7"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
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
            sa.Enum(
                "inactive",
                "active",
                name="phonenumberstatus",
            ),
            nullable=False,
            server_default="inactive",
        ),

        sa.Column(
            "trackable",
            sa.Enum(
                "inactive",
                "active",
                name="phonenumberstatus",
            ),
            nullable=False,
            server_default="inactive",
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

        sa.PrimaryKeyConstraint("id"),

        sa.UniqueConstraint("employee_id"),
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
    op.execute(
        "DROP TABLE IF EXISTS phone_numbers CASCADE"
    )

    op.execute(
        "DROP TYPE IF EXISTS phonenumberstatus CASCADE"
    )