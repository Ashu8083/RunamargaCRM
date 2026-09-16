"""add phone_id to call_logs

Revision ID: 684e345acae7
Revises: 191be46b449a
Create Date: 2026-09-16 10:05:58.779321

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "684e345acae7"
down_revision: Union[str, Sequence[str], None] = "191be46b449a"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        "call_logs",
        sa.Column(
            "phone_id",
            sa.Integer(),
            nullable=True,
        ),
    )

    op.create_index(
        op.f("ix_call_logs_phone_id"),
        "call_logs",
        ["phone_id"],
        unique=False,
    )

    op.create_foreign_key(
        "fk_call_logs_phone_id_phone_numbers",
        "call_logs",
        "phone_numbers",
        ["phone_id"],
        ["id"],
        ondelete="SET NULL",
    )


def downgrade() -> None:
    op.drop_constraint(
        "fk_call_logs_phone_id_phone_numbers",
        "call_logs",
        type_="foreignkey",
    )

    op.drop_index(
        op.f("ix_call_logs_phone_id"),
        table_name="call_logs",
    )

    op.drop_column(
        "call_logs",
        "phone_id",
    )