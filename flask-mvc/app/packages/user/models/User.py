from app.config.Database import db
from app.models.BaseModel import BaseModel, TimestampMixin

class User(TimestampMixin, BaseModel):
    role = db.Column(db.String(10), nullable=False, default='base')
    verified = db.Column(db.Boolean, nullable = False, default=False)
    
    #info
    name = db.Column(db.Unicode(80))
    phone_number = db.Column(db.String(10))

    #auth_info
    email = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    # face_embed_id = db.Column(db.Integer, db.ForeignKey('face_embedding.id'))

from marshmallow_sqlalchemy import SQLAlchemySchema, auto_field
from marshmallow import fields, validate

class UserSchema(SQLAlchemySchema):
    class Meta:
        model = User
        # load_instance = True
        include_fk = True
    
    name = auto_field()
    phone_number = auto_field()
    email = fields.Email(
        required = True,
        validate = validate.Length(max=100)
    )
    password = auto_field()
