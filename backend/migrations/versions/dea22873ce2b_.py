"""empty message

Revision ID: dea22873ce2b
Revises: f04cb08aef94, cd13949c87e7
Create Date: 2026-10-09 09:01:46.604639

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'dea22873ce2b'
down_revision: Union[str, Sequence[str], None] = ('f04cb08aef94', 'cd13949c87e7')
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
