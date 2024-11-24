from app.config.Database import db
from app.models.BaseModel import BaseModel, TimestampMixin
from app.packages.image.models.PersonFaceImage import PersonFaceImage

class Person(TimestampMixin, BaseModel):
    name = db.Column(db.Unicode(40), nullable=False)
    birth =  db.Column(db.Date)
    nationality = db.Column(db.String(50))
    collection_id = db.Column(
        db.Integer,
        db.ForeignKey('collection.id',name='person-collection-fk', ondelete='CASCADE')
    )
    person_face_image = db.relationship(
        'PersonFaceImage',
        backref='person',
        cascade='all, delete-orphan',
        foreign_keys='PersonFaceImage.person_id'
    )

from marshmallow_sqlalchemy import SQLAlchemySchema, auto_field

class PersonSchema(SQLAlchemySchema):
    class Meta:
        model = Person
        include_fk = True
    
    id = auto_field()
    name = auto_field()
    birth = auto_field()
    nationality = auto_field()
    collection_id = auto_field()