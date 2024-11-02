from app.config.Database import db
from app.packages.image.models.FaceImage import FaceImage

class UserFaceImage(FaceImage):
    user_id = db.Column(db.Integer, db.ForeignKey('user.id', name='face-user-fk', ondelete='CASCADE'), nullable=False)