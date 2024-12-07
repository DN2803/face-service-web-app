from app.packages.image.repositories.ImageRepo import ImageRepo
from app.packages.image.models.UserFaceImage import UserFaceImage
from app.config.Database import db

class UserImageRepo(ImageRepo):
    def __init__(self):
        super().__init__(UserFaceImage, db.session)

    def get_by_user_id(self, user_id):
        return self._get_by('all', 'user_id', 'equal', user_id)