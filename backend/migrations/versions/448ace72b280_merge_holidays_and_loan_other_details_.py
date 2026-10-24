"""merge holidays and loan other details heads

Revision ID: 448ace72b280
Revises: 195132074481, b500635387eb
Create Date: 2026-10-24 11:04:41.431599

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '448ace72b280'
down_revision: Union[str, Sequence[str], None] = ('195132074481', 'b500635387eb')
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
