"""merge holidays and loan other details heads

Revision ID: ea3822300f2e
Revises: 448ace72b280
Create Date: 2026-11-02 19:16:19.047383

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'ea3822300f2e'
down_revision: Union[str, Sequence[str], None] = '448ace72b280'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
