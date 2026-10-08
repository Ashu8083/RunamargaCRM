"""empty message

Revision ID: f04cb08aef94
Revises: 3829bdb14c74, 67394766279f
Create Date: 2026-10-08 11:24:18.674900

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'f04cb08aef94'
down_revision: Union[str, Sequence[str], None] = ('3829bdb14c74', '67394766279f')
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
