from app.config.Database import db
from app.models.BaseModel import BaseModel, TimestampMixin

class FaceImage(TimestampMixin, BaseModel):
    __abstract__ = True
    img_url = db.Column(db.String(255), nullable=False)