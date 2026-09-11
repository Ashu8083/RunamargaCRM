"""update employee face profiles

Revision ID: ef08f3f527ca
Revises: b916860233ec
Create Date: 2026-09-07 13:20:46.338983

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "ef08f3f527ca"
down_revision: Union[str, Sequence[str], None] = "b916860233ec"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""

    # Add new columns as nullable first so existing
    # employee_face_profiles rows are not affected.
    op.add_column(
        "employee_face_profiles",
        sa.Column(
            "capture_type",
            sa.String(length=30),
            nullable=True,
        ),
    )

    op.add_column(
        "employee_face_profiles",
        sa.Column(
            "image_path",
            sa.String(),
            nullable=True,
        ),
    )

    # Remove the UNIQUE index on employee_id.
    # This allows multiple face profiles for the same employee.
    op.drop_index(
        op.f("ix_employee_face_profiles_employee_id"),
        table_name="employee_face_profiles",
    )

    # Recreate employee_id as a normal non-unique index.
    op.create_index(
        op.f("ix_employee_face_profiles_employee_id"),
        "employee_face_profiles",
        ["employee_id"],
        unique=False,
    )


def downgrade() -> None:
    """Downgrade schema."""

    # Remove the non-unique index.
    op.drop_index(
        op.f("ix_employee_face_profiles_employee_id"),
        table_name="employee_face_profiles",
    )

    # Restore the original UNIQUE index.
    op.create_index(
        op.f("ix_employee_face_profiles_employee_id"),
        "employee_face_profiles",
        ["employee_id"],
        unique=True,
    )

    op.drop_column(
        "employee_face_profiles",
        "image_path",
    )

    op.drop_column(
        "employee_face_profiles",
        "capture_type",
    )