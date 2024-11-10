from app.config.Database import db
from app.models.BaseModel import BaseModel

class PersonFaceEmbedding(BaseModel):
    embedding  = db.Column(db.LargeBinary, nullable=False)
    image_id = db.Column(db.Interger, db.ForeignKey('person_face_image.id',name='embed-pface-fk',ondelete='CASCADE'), nullable=False)