from app.config.Database import db

class AccessCollection():
    collection_id = db.Column(db.Integer, db.ForeignKey('user.id',name='access-collection-fk', ondelete='CASCADE'), primary_key=True)
    key_id = db.Column(db.Integer, db.ForeignKey('key.id', name='access-key-fk', ondelete='CASCADE'), primary_key=True)