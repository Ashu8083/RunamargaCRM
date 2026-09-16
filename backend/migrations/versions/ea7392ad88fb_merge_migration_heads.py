"""merge migration heads

Revision ID: ea7392ad88fb
Revises: ef08f3f527ca, 4ae955b8443c
Create Date: 2026-09-12 14:00:41.988885

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'ea7392ad88fb'
down_revision: Union[str, Sequence[str], None] = ('ef08f3f527ca', '4ae955b8443c')
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
