from app.config.Database import db
from app.packages.image.models.FaceImage import FaceImage

class PersonFaceImage(FaceImage):
    person_id = db.Column(db.Integer, db.ForeignKey('person.id', name='face-person-fk', ondelete='CASCADE'), nullable=False)