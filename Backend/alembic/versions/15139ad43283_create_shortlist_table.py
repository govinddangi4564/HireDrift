"""create shortlist table

Revision ID: 15139ad43283
Revises: 051da03309f8
Create Date: 2025-11-16 23:54:40.315091

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '15139ad43283'
down_revision: Union[str, Sequence[str], None] = '051da03309f8'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.create_table('shortlist',
        sa.Column('id', sa.UUID(), nullable=False),
        sa.Column('candidate_id', sa.UUID(), nullable=False),
        sa.Column('jd_id', sa.UUID(), nullable=False),
        sa.Column('shortlisted', sa.Boolean(), nullable=True),
        sa.Column('shortlisted_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.Column('shortlisted_by', sa.UUID(), nullable=True),
        sa.ForeignKeyConstraint(['candidate_id'], ['candidates.id'], ),
        sa.ForeignKeyConstraint(['jd_id'], ['job_descriptions.id'], ),
        sa.ForeignKeyConstraint(['shortlisted_by'], ['users.user_id'], ),
        sa.PrimaryKeyConstraint('id')
    )


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_table('shortlist')
