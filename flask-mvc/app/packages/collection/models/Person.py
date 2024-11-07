from app.config.Database import db
from app.models.BaseModel import BaseModel, TimestampMixin

class Person(TimestampMixin, BaseModel):
    name = db.Column(db.Unicode(40), nullable=False)
    birth =  db.Column(db.DateTime)
    nationality = db.Column(db.String(50))
    avt_id = db.Column(db.Integer, db.ForeignKey('person-face-image.id', name='person-image-fk', ondelete='SET NULL'))
    collection_id = db.Column(db.Integer, db.ForeignKey('collection.id', name='person-collection-fk', ondelete='CASCADE'))

    person_face_image = db.relationship('PersonFaceImage', backref='person', cascade='all, delete-orphan')

from marshmallow_sqlalchemy import SQLAlchemySchema, auto_field

class PersonSchema(SQLAlchemySchema):
    class Meta:
        model = Person
        include_fk = True
    
    name = auto_field()
    birth = auto_field()
    nationality = auto_field()
    collection_id = auto_field()