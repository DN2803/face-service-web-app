from app.config.Database import db
from app.models.BaseModel import BaseModel
from datetime import datetime, timezone

class Key(BaseModel):
    key = db.Column(db.String(255), nullable=False)
    created = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    expires_at = db.Column(db.DateTime, nullable=False)

    admin_key_id = db.Column(db.Integer, db.ForeignKey('key.id',name='key-admin-fk', ondelete='CASCADE'))

    dev_key_id = db.relationship('Key', backref='key', cascade='all, delete-orphan')
    collections = db.relationship('Collection', backref='key', cascade='all, delete-orphan')
