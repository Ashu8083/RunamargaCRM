"""upgrade loan shuffle history

Revision ID: 21b2a6aa9af6
Revises: 38a6b0ab45d3
Create Date: 2026-09-28 09:18:26.831471

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "21b2a6aa9af6"
down_revision: Union[str, Sequence[str], None] = "38a6b0ab45d3"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "loan_shuffle_history",

        sa.Column(
            "id",
            sa.Integer(),
            primary_key=True,
            index=True,
            nullable=False,
        ),

        sa.Column(
            "shuffled_by_context_id",
            sa.Integer(),
            sa.ForeignKey("employee_contexts.id"),
            nullable=False,
        ),

        sa.Column(
            "to_agent_context_id",
            sa.Integer(),
            sa.ForeignKey("employee_contexts.id"),
            nullable=True,
        ),

        sa.Column(
            "to_rm_context_id",
            sa.Integer(),
            sa.ForeignKey("employee_contexts.id"),
            nullable=True,
        ),

        sa.Column(
            "loan_ids",
            sa.JSON(),
            nullable=False,
        ),

        sa.Column(
            "created_at",
            sa.DateTime(),
            nullable=True,
        ),

        sa.Column(
            "updated_at",
            sa.DateTime(),
            nullable=True,
        ),

        sa.Column(
            "deleted_at",
            sa.DateTime(),
            nullable=True,
        ),
    )


def downgrade() -> None:
    op.drop_table("loan_shuffle_history")