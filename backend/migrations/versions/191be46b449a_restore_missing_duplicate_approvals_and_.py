"""restore missing duplicate approvals and phone numbers tables

Revision ID: 191be46b449a
Revises: 08f4737e4ece
Create Date: 2026-09-13 19:35:53.122782

This migration is intentionally a no-op.

The original migrations that create these tables have been restored:

- 51b9c47d546b -> duplicate_approvals
- 4aaa83cde927 -> phone_numbers

Therefore these tables must not be recreated here.
"""

from typing import Sequence, Union


# revision identifiers, used by Alembic.
revision: str = "191be46b449a"
down_revision: Union[str, Sequence[str], None] = "08f4737e4ece"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """No-op.

    duplicate_approvals is created by 51b9c47d546b.
    phone_numbers is created by 4aaa83cde927.
    """
    pass


def downgrade() -> None:
    """No-op.

    The tables are owned by their original migrations.
    """
    pass