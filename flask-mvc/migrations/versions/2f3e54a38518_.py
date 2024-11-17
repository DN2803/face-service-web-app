"""empty message

Revision ID: 2f3e54a38518
Revises: 
Create Date: 2024-11-17 01:05:28.159941

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '2f3e54a38518'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('key',
    sa.Column('key', sa.String(length=32), nullable=False),
    sa.Column('project_name', sa.String(length=50), nullable=False),
    sa.Column('created_at', sa.Integer(), nullable=False),
    sa.Column('expires_at', sa.Integer(), nullable=False),
    sa.Column('admin_key_id', sa.Integer(), nullable=True),
    sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
    sa.ForeignKeyConstraint(['admin_key_id'], ['key.id'], name='key-admin-fk', ondelete='CASCADE'),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('person',
    sa.Column('name', sa.Unicode(length=40), nullable=False),
    sa.Column('birth', sa.DateTime(), nullable=True),
    sa.Column('nationality', sa.String(length=50), nullable=True),
    sa.Column('avt_id', sa.Integer(), nullable=False),
    sa.Column('collection_id', sa.Integer(), nullable=True),
    sa.Column('created_at', sa.DateTime(), nullable=True),
    sa.Column('updated_at', sa.DateTime(), nullable=True),
    sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
    sa.ForeignKeyConstraint(['avt_id'], ['person_face_image.id'], name='person-image-fk'),
    sa.ForeignKeyConstraint(['collection_id'], ['collection.id'], name='person-collection-fk', ondelete='SET NULL'),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('person_face_image',
    sa.Column('person_id', sa.Integer(), nullable=False),
    sa.Column('img_url', sa.String(length=255), nullable=False),
    sa.Column('created_at', sa.DateTime(), nullable=True),
    sa.Column('updated_at', sa.DateTime(), nullable=True),
    sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
    sa.ForeignKeyConstraint(['person_id'], ['person.id'], name='face-person-fk', ondelete='CASCADE'),
    sa.PrimaryKeyConstraint('id')
    )
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
    sa.Column('created_at', sa.DateTime(), nullable=True),
    sa.Column('updated_at', sa.DateTime(), nullable=True),
    sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
    sa.ForeignKeyConstraint(['user_id'], ['user.id'], name='face-user-fk', ondelete='CASCADE'),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('collection',
    sa.Column('name', sa.Unicode(length=40), nullable=False),
    sa.Column('description', sa.Unicode(length=40), nullable=False),
    sa.Column('admin_key_id', sa.Integer(), nullable=False),
    sa.Column('created_at', sa.DateTime(), nullable=True),
    sa.Column('updated_at', sa.DateTime(), nullable=True),
    sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
    sa.ForeignKeyConstraint(['admin_key_id'], ['key.id'], name='collection-key-fk', ondelete='CASCADE'),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('person_face_embedding',
    sa.Column('embedding', sa.LargeBinary(), nullable=False),
    sa.Column('image_id', sa.Integer(), nullable=False),
    sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
    sa.ForeignKeyConstraint(['image_id'], ['person_face_image.id'], name='embed-pface-fk', ondelete='CASCADE'),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('user_key',
    sa.Column('user_id', sa.Integer(), nullable=False),
    sa.Column('key_id', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['key_id'], ['key.id'], name='userkey-key-fk', ondelete='CASCADE'),
    sa.ForeignKeyConstraint(['user_id'], ['user.id'], name='userkey-user-fk', ondelete='CASCADE'),
    sa.PrimaryKeyConstraint('user_id', 'key_id')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('user_key')
    op.drop_table('person_face_embedding')
    op.drop_table('collection')
    op.drop_table('user_face_image')
    op.drop_table('user_face_embedding')
    op.drop_table('user')
    op.drop_table('person_face_image')
    op.drop_table('person')
    op.drop_table('key')
    # ### end Alembic commands ###