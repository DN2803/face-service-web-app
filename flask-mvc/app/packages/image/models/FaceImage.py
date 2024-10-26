from app.config.Database import db
from app.models.BaseModel import BaseModel, TimestampMixin
import uuid

class Image(TimestampMixin, BaseModel):
    __abstract__ = True
    img_name = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    img_url = db.Column(db.String(255), nullable=False)

class FaceImage(Image):
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)