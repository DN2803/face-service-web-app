from app.config.Database import db

class BaseModel(db.Model):
    __abstract__ = True
    def __init__(self):
        print('Base Model')

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)

from datetime import datetime, timezone
class TimestampMixin(db.Model):
    __abstract__ = True
    created = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    updated = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))