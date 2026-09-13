"""create call assignments

Revision ID: 9e690ac09e82
Revises: 9125cf1f074c
Create Date: 2026-09-12 17:37:31.837978

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "9e690ac09e82"
down_revision: Union[str, Sequence[str], None] = "9125cf1f074c"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.create_table(
        "call_assignments",
        sa.Column(
            "id",
            sa.BigInteger(),
            autoincrement=True,
            nullable=False,
        ),
        sa.Column(
            "phone_number",
            sa.String(length=255),
            nullable=False,
        ),
        sa.Column(
            "assigned_to_id",
            sa.BigInteger(),
            nullable=True,
        ),
        sa.Column(
            "assigned_by_id",
            sa.BigInteger(),
            nullable=True,
        ),
        sa.Column(
            "status",
            sa.Enum(
                "RECEIVED",
                "MISSED",
                "REJECTED",
                "IN_PROGRESS",
                name="call_status_enum",
            ),
            nullable=False,
        ),
        sa.Column(
            "created_at",
            sa.TIMESTAMP(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.Column(
            "updated_at",
            sa.TIMESTAMP(timezone=True),
            nullable=True,
        ),
        sa.Column(
            "deleted_at",
            sa.DateTime(timezone=True),
            nullable=True,
        ),
        sa.ForeignKeyConstraint(
            ["assigned_to_id"],
            ["employees.id"],
        ),
        sa.ForeignKeyConstraint(
            ["assigned_by_id"],
            ["employees.id"],
        ),
        sa.PrimaryKeyConstraint("id"),
    )

    op.create_index(
        op.f("ix_call_assignments_id"),
        "call_assignments",
        ["id"],
        unique=False,
    )


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_index(
        op.f("ix_call_assignments_id"),
        table_name="call_assignments",
    )

    op.drop_table("call_assignments")

    sa.Enum(
        "RECEIVED",
        "MISSED",
        "REJECTED",
        "IN_PROGRESS",
        name="call_status_enum",
    ).drop(op.get_bind(), checkfirst=True)