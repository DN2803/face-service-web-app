from app.config.Database import db
from app.models.BaseModel import BaseModel, TimestampMixin
from app.packages.image.models.UserFaceImage import UserFaceImage

class User(TimestampMixin, BaseModel):
    #info
    verified = db.Column(db.Boolean, nullable = False, default=False)
    name = db.Column(db.Unicode(80))

    #auth_info
    email = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    face_embed_id = db.Column(
        db.Integer,
        db.ForeignKey('user_face_embedding.id',name='user-faceEmbed-fk', ondelete='SET NULL')
    )

    user_face_image = db.relationship('UserFaceImage', backref='user', cascade='all, delete-orphan')

from marshmallow_sqlalchemy import SQLAlchemySchema, auto_field
from marshmallow import fields, validate

class UserSchema(SQLAlchemySchema):
    class Meta:
        model = User
        include_fk = True
    
    id = auto_field()
    verified = auto_field()
    name = auto_field()
    email = fields.Email(
        required = True,
        validate = validate.Length(max=100)
    )
    password = auto_field()
