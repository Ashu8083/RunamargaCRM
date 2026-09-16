"""merge loan assignments and call assignments heads

Revision ID: 08f4737e4ece
Revises: 4ffa9a4c3742, 9e690ac09e82
Create Date: 2026-09-12 21:42:26.285638

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '08f4737e4ece'
down_revision: Union[str, Sequence[str], None] = ('4ffa9a4c3742', '9e690ac09e82')
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
