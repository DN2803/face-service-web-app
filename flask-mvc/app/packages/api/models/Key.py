from app.config.Database import db
from app.models.BaseModel import BaseModel
from app.packages.api.models.Collection import Collection
from app.packages.api.models.AccessCollection import AccessCollection

class Key(BaseModel):
    key = db.Column(db.String(32), unique=True, nullable=False) #indexing
    project_name = db.Column(db.String(50), nullable=False)
    created_at = db.Column(db.Integer, nullable=False)
    expires_at = db.Column(db.Integer, nullable=False)
    admin_key_id = db.Column(
        db.Integer,
        db.ForeignKey('key.id',name='key-admin-fk', ondelete='CASCADE'),
        index=True,
    )
    user_id = db.Column(
        db.Integer,
        db.ForeignKey('user.id',name='key-user-fk', ondelete='CASCADE'),
        index=True,
    )

    dev_key_id = db.relationship(
        'Key', 
        backref='admin_key',
        remote_side='Key.id',
        single_parent=True
    )
    collections = db.relationship('Collection', backref='key', cascade='all, delete-orphan')
    access = db.relationship('AccessCollection', backref='key-access', cascade='all, delete-orphan')

from marshmallow_sqlalchemy import SQLAlchemySchema, auto_field
class KeySchema(SQLAlchemySchema):
    class Meta:
        model = Key
        include_fk = True

    key = auto_field()
    project_name = auto_field()
    expires_at = auto_field()
    admin_key_id = auto_field()