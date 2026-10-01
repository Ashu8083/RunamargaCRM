"""merge migration heads

Revision ID: 3f64805dfc2b
Revises: 67394766279f, c5cab52bf8bc, d68261f43881
Create Date: 2026-10-01 08:02:35.882869

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '3f64805dfc2b'
down_revision: Union[str, Sequence[str], None] = ('67394766279f', 'c5cab52bf8bc', 'd68261f43881')
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
