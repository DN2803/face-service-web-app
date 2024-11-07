from app.config.Database import db
from app.packages.image.models.FaceImage import FaceImage
from app.packages.embedding.models.UserFaceEmbedding import UserFaceEmbedding

class UserFaceImage(FaceImage):
    user_id = db.Column(db.Integer, db.ForeignKey('user.id', name='face-user-fk', ondelete='CASCADE'), nullable=False)

    user_embedding = db.relationship('UserFaceEmbedding', backref='user-face-image', cascade='all, delete')