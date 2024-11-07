from app.config.Database import db
from app.packages.image.models.FaceImage import FaceImage
from app.packages.embedding.models.PersonFaceEmbedding import PersonFaceEmbedding

class PersonFaceImage(FaceImage):
    person_id = db.Column(db.Integer, db.ForeignKey('person.id', name='face-person-fk', ondelete='CASCADE'), nullable=False)

    person_embedding = db.relationship('PersonFaceEmbedding', backref='person-face-image', cascade='all, delete')