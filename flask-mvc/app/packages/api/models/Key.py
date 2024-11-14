from app.config.Database import db
from app.models.BaseModel import BaseModel

class Key(BaseModel):
    key = db.Column(db.String(32), nullable=False)
    project_name = db.Column(db.String(50), nullable=False)
    created = db.Column(db.Integer, nullable=False)
    expires_at = db.Column(db.Integer, nullable=False)

    admin_key_id = db.Column(db.Integer, db.ForeignKey('key.id',name='key-admin-fk', ondelete='CASCADE'))

    dev_key_id = db.relationship(
        'Key', 
        backref='admin_key',
        remote_side='Key.id',
        cascade='all, delete-orphan',
        single_parent=True
    )
    collections = db.relationship('Collection', backref='key', cascade='all, delete-orphan')
