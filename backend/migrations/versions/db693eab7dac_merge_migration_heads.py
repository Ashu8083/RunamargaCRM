"""merge migration heads

Revision ID: db693eab7dac
Revises: 4aaa83cde927, 5d02122bc674
Create Date: 2026-09-17 10:24:34.595464

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'db693eab7dac'
down_revision: Union[str, Sequence[str], None] = ('4aaa83cde927', '5d02122bc674')
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
