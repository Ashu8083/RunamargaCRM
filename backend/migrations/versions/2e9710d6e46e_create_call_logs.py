"""create call logs

Revision ID: 2e9710d6e46e
Revises: 4058313f01b1
Create Date: 2026-09-12 10:52:28.840387

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "2e9710d6e46e"
down_revision: Union[str, Sequence[str], None] = "4058313f01b1"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""

    op.create_table(
        "call_logs",

        sa.Column(
            "id",
            sa.BigInteger(),
            nullable=False,
        ),

        sa.Column(
            "employee_id",
            sa.BigInteger(),
            nullable=False,
        ),

        sa.Column(
            "phone_number",
            sa.String(length=255),
            nullable=False,
        ),

        sa.Column(
            "call_type",
            sa.Enum(
                "INCOMING",
                "OUTGOING",
                name="calltypeenum",
            ),
            nullable=False,
        ),

        sa.Column(
            "mobile_status",
            sa.Enum(
                "RECEIVED",
                "MISSED",
                "REJECTED",
                "NOT_REACHED",
                name="mobilestatusenum",
            ),
            nullable=True,
        ),

        sa.Column(
            "call_started_at",
            sa.TIMESTAMP(timezone=True),
            nullable=False,
        ),

        sa.Column(
            "call_ended_at",
            sa.TIMESTAMP(timezone=True),
            nullable=True,
        ),

        sa.Column(
            "duration_seconds",
            sa.Integer(),
            nullable=True,
        ),

        sa.Column(
            "recording_path",
            sa.String(length=255),
            nullable=True,
        ),

        sa.Column(
            "recording_size_kb",
            sa.Integer(),
            nullable=True,
        ),

        sa.Column(
            "recording_duration_seconds",
            sa.Integer(),
            nullable=True,
        ),

        sa.Column(
            "attended_at",
            sa.TIMESTAMP(timezone=True),
            nullable=True,
        ),

        sa.Column(
            "attended_by",
            sa.BigInteger(),
            nullable=True,
        ),

        sa.Column(
            "remarks",
            sa.Text(),
            nullable=True,
        ),

        sa.Column(
            "created_at",
            sa.TIMESTAMP(timezone=True),
            server_default=sa.text("now()"),
            nullable=True,
        ),

        sa.Column(
            "updated_at",
            sa.TIMESTAMP(timezone=True),
            nullable=True,
        ),

        sa.ForeignKeyConstraint(
            ["attended_by"],
            ["employees.id"],
        ),

        sa.ForeignKeyConstraint(
            ["employee_id"],
            ["employees.id"],
            ondelete="CASCADE",
        ),

        sa.PrimaryKeyConstraint("id"),
    )

    op.create_index(
        "idx_call_logs_employee_id_lookup",
        "call_logs",
        ["employee_id"],
        unique=False,
    )

    op.create_index(
        "idx_call_logs_employee_started_at",
        "call_logs",
        [
            "employee_id",
            sa.literal_column("call_started_at DESC"),
        ],
        unique=False,
    )

    op.create_index(
        "idx_call_logs_phone_employee_started_at_id",
        "call_logs",
        [
            "phone_number",
            "employee_id",
            sa.literal_column("call_started_at DESC"),
            sa.literal_column("id DESC"),
        ],
        unique=False,
    )

    op.create_index(
        "idx_call_logs_phone_number_lookup",
        "call_logs",
        ["phone_number"],
        unique=False,
    )

    op.create_index(
        "idx_call_logs_started_at",
        "call_logs",
        [
            sa.literal_column("call_started_at DESC"),
        ],
        unique=False,
    )

    op.create_index(
        op.f("ix_call_logs_id"),
        "call_logs",
        ["id"],
        unique=False,
    )


def downgrade() -> None:
    """Downgrade schema."""

    op.drop_index(
        op.f("ix_call_logs_id"),
        table_name="call_logs",
    )

    op.drop_index(
        "idx_call_logs_started_at",
        table_name="call_logs",
    )

    op.drop_index(
        "idx_call_logs_phone_number_lookup",
        table_name="call_logs",
    )

    op.drop_index(
        "idx_call_logs_phone_employee_started_at_id",
        table_name="call_logs",
    )

    op.drop_index(
        "idx_call_logs_employee_started_at",
        table_name="call_logs",
    )

    op.drop_index(
        "idx_call_logs_employee_id_lookup",
        table_name="call_logs",
    )

    op.drop_table("call_logs")