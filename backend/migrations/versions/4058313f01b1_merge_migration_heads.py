"""merge migration heads

Revision ID: 4058313f01b1
Revises: 4ae955b8443c, ef08f3f527ca
Create Date: 2026-09-12 10:46:27.891173

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '4058313f01b1'
down_revision: Union[str, Sequence[str], None] = ('4ae955b8443c', 'ef08f3f527ca')
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
