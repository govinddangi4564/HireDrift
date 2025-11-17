"""newsletter to bool

Revision ID: 31e3f06c8cf6
Revises: 3e5bde0c7863
Create Date: 2025-11-16 18:40:40.352790

"""
from typing import Sequence, Union
import sqlalchemy as sa
from alembic import op


# revision identifiers, used by Alembic.
revision: str = '31e3f06c8cf6'
down_revision: Union[str, Sequence[str], None] = '3e5bde0c7863'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.create_table('users',
        sa.Column('user_id', sa.UUID(), nullable=False),
        sa.Column('full_name', sa.String(), nullable=False),
        sa.Column('email', sa.String(), nullable=False),
        sa.Column('password', sa.String(), nullable=False),
        sa.Column('phone', sa.String(), nullable=False),
        sa.Column('newsletter', sa.Boolean(), nullable=True),
        sa.Column('picture', sa.String(), nullable=True),
        sa.PrimaryKeyConstraint('user_id'),
        sa.UniqueConstraint('email')
    )
    op.create_index(op.f('ix_users_user_id'), 'users', ['user_id'], unique=False)


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_index(op.f('ix_users_user_id'), table_name='users')
    op.drop_table('users')
