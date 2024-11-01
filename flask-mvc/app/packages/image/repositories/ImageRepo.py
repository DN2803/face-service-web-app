from app.repositories.BaseRepository import BaseRepository
from app.packages.image.models.FaceImage import FaceImage

class ImageRepo(BaseRepository):
    def __init__(self, model: FaceImage, session):
        super().__init__(model, session)

    def add_img(self, **kwargs):
        try:
            return self._create(**kwargs)
        except Exception as e:
            raise e