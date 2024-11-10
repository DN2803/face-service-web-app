"""empty message

Revision ID: 0f946f5f6cec
Revises: 
Create Date: 2024-11-01 21:35:23.800949

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '0f946f5f6cec'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('user',
    sa.Column('verified', sa.Boolean(), nullable=False),
    sa.Column('name', sa.Unicode(length=80), nullable=True),
    sa.Column('email', sa.String(length=100), nullable=False),
    sa.Column('password', sa.String(length=255), nullable=False),
    sa.Column('face_embed_id', sa.Integer(), nullable=True),
    sa.Column('created_at', sa.DateTime(), nullable=True),
    sa.Column('updated_at', sa.DateTime(), nullable=True),
    sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
    sa.ForeignKeyConstraint(['face_embed_id'], ['user_face_embedding.id'], name='user-faceEmbed-fk', ondelete='SET NULL'),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('user_face_embedding',
    sa.Column('embedding', sa.LargeBinary(), nullable=False),
    sa.Column('image_id', sa.Integer(), nullable=False),
    sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
    sa.ForeignKeyConstraint(['image_id'], ['user_face_image.id'], name='embed-uface-fk', ondelete='CASCADE'),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('user_face_image',
    sa.Column('user_id', sa.Integer(), nullable=False),
    sa.Column('img_url', sa.String(length=255), nullable=False),
    sa.Column('src_img_url', sa.String(length=255), nullable=False),
    sa.Column('created_at', sa.DateTime(), nullable=True),
    sa.Column('updated_at', sa.DateTime(), nullable=True),
    sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
    sa.ForeignKeyConstraint(['user_id'], ['user.id'], name='face-user-fk', ondelete='CASCADE'),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('user_face_image')
    op.drop_table('user_face_embedding')
    op.drop_table('user')
    # ### end Alembic commands ###