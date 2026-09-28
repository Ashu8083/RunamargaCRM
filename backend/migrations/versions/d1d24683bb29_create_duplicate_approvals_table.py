"""create duplicate approvals table

Revision ID: d1d24683bb29
Revises: eb5f9fd7ed25
Create Date: 2026-09-07
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql


# revision identifiers, used by Alembic.
revision: str = "d1d24683bb29"
down_revision: Union[str, Sequence[str], None] = "eb5f9fd7ed25"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    pass

def downgrade() -> None:
    pass