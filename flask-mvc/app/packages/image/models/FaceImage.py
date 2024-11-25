from app.config.Database import db
from app.models.BaseModel import BaseModel, TimestampMixin

class FaceImage(TimestampMixin, BaseModel):
    __abstract__ = True    
    img_name = db.Column(db.String(36), nullable=False) #uuid
    img_url = db.Column(db.String(120), nullable=False)