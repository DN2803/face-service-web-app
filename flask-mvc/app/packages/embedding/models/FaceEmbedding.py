from app.config.Database import db
from app.models.BaseModel import BaseModel

class ImageEmbedding(BaseModel):
    __abstract__ = True
    id = db.Column(db.Integer, primary_key=True, autoincrement = True)
    embed_vector  = db.Column(db.LargeBinary, nullable=False)

    @property
    def image_id(self):
        raise NotImplementedError("Subclasses must define the image_id column.")

class FaceEmbedding(ImageEmbedding):
    image_id = db.Column(db.String(36), db.ForeignKey('face_image.id'), nullable=False)