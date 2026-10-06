"""create reminders table

Revision ID: 556a9981cd9f
Revises: 9f0d211b4de4
Create Date: 2026-10-05 11:26:40.860796

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# ============================================================
# REVISION IDENTIFIERS
# ============================================================

revision: str = "556a9981cd9f"

down_revision: Union[str, Sequence[str], None] = "9f0d211b4de4"

branch_labels: Union[str, Sequence[str], None] = None

depends_on: Union[str, Sequence[str], None] = None


# ============================================================
# UPGRADE
# ============================================================

def upgrade() -> None:
    """
    Create the reminders table.
    """

    op.create_table(
        "reminders",

        # ----------------------------------------------------
        # PRIMARY KEY
        # ----------------------------------------------------

        sa.Column(
            "id",
            sa.Integer(),
            autoincrement=True,
            nullable=False,
        ),

        # ----------------------------------------------------
        # EMPLOYEE
        # ----------------------------------------------------

        sa.Column(
            "employee_id",
            sa.Integer(),
            nullable=False,
        ),

        # ----------------------------------------------------
        # LOAN APPLICATION
        # ----------------------------------------------------

        sa.Column(
            "application_id",
            sa.Integer(),
            nullable=False,
        ),

        # ----------------------------------------------------
        # REMINDER DATE + TIME
        # ----------------------------------------------------

        sa.Column(
            "reminder_at",
            sa.DateTime(timezone=True),
            nullable=False,
        ),

        # ----------------------------------------------------
        # NOTE
        # ----------------------------------------------------

        sa.Column(
            "note",
            sa.Text(),
            nullable=False,
        ),

        # ----------------------------------------------------
        # STATUS
        # ----------------------------------------------------

        sa.Column(
            "status",
            sa.String(length=20),
            server_default="pending",
            nullable=False,
        ),

        # ----------------------------------------------------
        # COMPLETION
        # ----------------------------------------------------

        sa.Column(
            "completed_at",
            sa.DateTime(timezone=True),
            nullable=True,
        ),

        # ----------------------------------------------------
        # AUDIT
        # ----------------------------------------------------

        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.func.now(),
            nullable=False,
        ),

        sa.Column(
            "updated_at",
            sa.DateTime(timezone=True),
            server_default=sa.func.now(),
            nullable=False,
        ),

        sa.Column(
            "deleted_at",
            sa.DateTime(timezone=True),
            nullable=True,
        ),

        # ----------------------------------------------------
        # FOREIGN KEYS
        # ----------------------------------------------------

        sa.ForeignKeyConstraint(
            ["employee_id"],
            ["employees.id"],
        ),

        sa.ForeignKeyConstraint(
            ["application_id"],
            ["loan_applications.id"],
        ),

        # ----------------------------------------------------
        # PRIMARY KEY
        # ----------------------------------------------------

        sa.PrimaryKeyConstraint(
            "id",
        ),
    )

    # ========================================================
    # INDEXES
    # ========================================================

    op.create_index(
        "ix_reminders_employee_id",
        "reminders",
        ["employee_id"],
        unique=False,
    )

    op.create_index(
        "ix_reminders_application_id",
        "reminders",
        ["application_id"],
        unique=False,
    )

    op.create_index(
        "ix_reminders_reminder_at",
        "reminders",
        ["reminder_at"],
        unique=False,
    )

    op.create_index(
        "ix_reminders_status",
        "reminders",
        ["status"],
        unique=False,
    )

    op.create_index(
        "ix_reminders_deleted_at",
        "reminders",
        ["deleted_at"],
        unique=False,
    )


# ============================================================
# DOWNGRADE
# ============================================================

def downgrade() -> None:
    """
    Remove the reminders table and its indexes.
    """

    op.drop_index(
        "ix_reminders_deleted_at",
        table_name="reminders",
    )

    op.drop_index(
        "ix_reminders_status",
        table_name="reminders",
    )

    op.drop_index(
        "ix_reminders_reminder_at",
        table_name="reminders",
    )

    op.drop_index(
        "ix_reminders_application_id",
        table_name="reminders",
    )

    op.drop_index(
        "ix_reminders_employee_id",
        table_name="reminders",
    )

    op.drop_table(
        "reminders",
    )