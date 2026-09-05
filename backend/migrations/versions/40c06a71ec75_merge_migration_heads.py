"""merge migration heads

Revision ID: 40c06a71ec75
Revises: 331077bf5492, 5437c1002ecb
Create Date: 2026-09-06 00:18:45.214484

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '40c06a71ec75'
down_revision: Union[str, Sequence[str], None] = ('331077bf5492', '5437c1002ecb')
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
