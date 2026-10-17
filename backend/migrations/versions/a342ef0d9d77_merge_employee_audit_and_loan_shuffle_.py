"""merge employee audit and loan shuffle migrations

Revision ID: a342ef0d9d77
Revises: 6b2d2bd6361b, 785978f8a9b4
Create Date: 2026-10-15 11:46:03.186521
"""

from typing import Sequence, Union

from alembic import op

# revision identifiers, used by Alembic.
revision: str = 'a342ef0d9d77'
down_revision: Union[str, Sequence[str], None] = ('6b2d2bd6361b', '785978f8a9b4')
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    pass


def downgrade() -> None:
    pass