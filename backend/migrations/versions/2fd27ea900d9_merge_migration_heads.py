"""merge migration heads

Revision ID: 2fd27ea900d9
Revises: 3829bdb14c74, 3f64805dfc2b
Create Date: 2026-10-01 08:51:14.807988

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '2fd27ea900d9'
down_revision: Union[str, Sequence[str], None] = ('3829bdb14c74', '3f64805dfc2b')
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
