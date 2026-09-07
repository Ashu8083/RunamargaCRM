"""empty message

Revision ID: b916860233ec
Revises: 174e4245fdc9, 8f1231a4cce7
Create Date: 2026-09-06 18:00:37.761266

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'b916860233ec'
down_revision: Union[str, Sequence[str], None] = ('174e4245fdc9', '8f1231a4cce7')
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
