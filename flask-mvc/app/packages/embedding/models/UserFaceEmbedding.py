from app.config.Database import db
from app.models.BaseModel import BaseModel

class UserFaceEmbedding(BaseModel):
    embedding  = db.Column(db.LargeBinary, nullable=False)
    image_id = db.Column(db.Integer, db.ForeignKey('user_face_image.id',name='embed-uface-fk',ondelete='CASCADE'), nullable=False)