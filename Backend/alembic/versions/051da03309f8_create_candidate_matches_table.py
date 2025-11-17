"""create candidate_matches table

Revision ID: 051da03309f8
Revises: a8a140de2231
Create Date: 2025-11-16 23:54:31.686597

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql


# revision identifiers, used by Alembic.
revision: str = '051da03309f8'
down_revision: Union[str, Sequence[str], None] = 'a8a140de2231'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.create_table('candidate_matches',
        sa.Column('id', sa.UUID(), nullable=False),
        sa.Column('candidate_id', sa.UUID(), nullable=False),
        sa.Column('jd_id', sa.UUID(), nullable=False),
        sa.Column('skill_match_percent', sa.Integer(), nullable=True),
        sa.Column('sbert_score', sa.Float(), nullable=True),
        sa.Column('final_score', sa.Integer(), nullable=True),
        sa.Column('matched_skills', postgresql.JSONB(astext_type=sa.Text()), nullable=True),
        sa.Column('calculated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.ForeignKeyConstraint(['candidate_id'], ['candidates.id'], ),
        sa.ForeignKeyConstraint(['jd_id'], ['job_descriptions.id'], ),
        sa.PrimaryKeyConstraint('id')
    )


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_table('candidate_matches')
