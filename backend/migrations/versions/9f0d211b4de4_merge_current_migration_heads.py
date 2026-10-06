"""
merge current migration heads

Revision ID: 9f0d211b4de4
Revises: 67394766279f, d68261f43881
Create Date: 2026-10-05 11:20:45.679645

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# ============================================================
# REVISION IDENTIFIERS
# ============================================================

revision: str = "9f0d211b4de4"

down_revision: Union[str, Sequence[str], None] = (
    "67394766279f",
    "d68261f43881",
)

branch_labels: Union[str, Sequence[str], None] = None

depends_on: Union[str, Sequence[str], None] = None


# ============================================================
# UPGRADE
# ============================================================

def upgrade() -> None:
    """
    Merge the existing Alembic migration heads.

    This migration does not modify the database schema.
    It only joins the two migration branches into a
    single migration head.
    """
    pass


# ============================================================
# DOWNGRADE
# ============================================================

def downgrade() -> None:
    """
    Reverse the migration graph merge.

    No database schema changes are required here because
    the merge migration itself does not create or modify
    any database objects.
    """
    pass