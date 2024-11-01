from app.config.Database import db
from app.models.BaseModel import BaseModel, TimestampMixin

class Collection(TimestampMixin, BaseModel):
    name = db.Column(db.Unicode(40), nullable=False)
    description = db.Column(db.Unicode(40), nullable=False)
    admin_key_id = db.Column(db.Integer, db.ForeignKey('key.id',name='collection-key-fk', ondelete='CASCADE'))
    persons = db.relationship('Person', backref='collection', cascade='all, delete-orphan')

from marshmallow_sqlalchemy import SQLAlchemySchema, auto_field

class PersonSchema(SQLAlchemySchema):
    class Meta:
        model = Collection
        include_fk = True
    
    name = auto_field()
    description = auto_field()