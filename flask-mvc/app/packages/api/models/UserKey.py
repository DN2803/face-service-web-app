from app.config.Database import db

class UserKey(db.Model):
    key_id = db.Column(db.Integer, db.ForeignKey('key.id', name='userkey-key-fk', ondelete='CASCADE'), primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id', name='userkey-user-fk', ondelete='CASCADE'), index=True)