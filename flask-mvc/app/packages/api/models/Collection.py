from app.config.Database import db
from app.models.BaseModel import BaseModel, TimestampMixin
from app.packages.api.models.Person import Person
from app.packages.api.models.AccessCollection import AccessCollection

class Collection(TimestampMixin, BaseModel):
    name = db.Column(db.Unicode(40), nullable=False)
    description = db.Column(db.Unicode(40), nullable=False)
    admin_key_id = db.Column(db.Integer, db.ForeignKey('key.id',name='collection-key-fk', ondelete='CASCADE'),  nullable=False)

    persons = db.relationship('Person', backref='collection', cascade='all, delete-orphan')
    access = db.relationship('AccessCollection', backref='collection-access', cascade='all, delete-orphan')


from marshmallow_sqlalchemy import SQLAlchemySchema, auto_field

class CollectionSchema(SQLAlchemySchema):
    class Meta:
        model = Collection
        include_fk = True
    
    id = auto_field()
    name = auto_field()
    description = auto_field()

from sqlalchemy import event
@event.listens_for(Collection, "before_delete")
def prevent_delete(mapper, connection, target):
    if target.name == 'Base':
        raise ValueError(f'Cannot delete Base Collection. collection_id:{target.id}')