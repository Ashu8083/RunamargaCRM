"""merge current migration heads

Revision ID: 38a6b0ab45d3
Revises: 6674ebce4c34, f52975b45c63
Create Date: 2026-09-26 08:15:15.016127

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '38a6b0ab45d3'
down_revision: Union[str, Sequence[str], None] = ('6674ebce4c34', 'f52975b45c63')
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
