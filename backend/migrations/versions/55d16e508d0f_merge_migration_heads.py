"""merge migration heads

Revision ID: 55d16e508d0f
Revises: 331077bf5492, 5437c1002ecb
Create Date: 2026-09-06 10:53:57.233966

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '55d16e508d0f'
down_revision: Union[str, Sequence[str], None] = ('331077bf5492', '5437c1002ecb')
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
