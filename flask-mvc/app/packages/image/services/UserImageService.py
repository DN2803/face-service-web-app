from app.packages.image.services.ImageService import ImageService
from app.packages.image.repositories.UserImageRepo import UserImageRepo

import uuid

class UserImageService(ImageService):
    def __init__(self):
        self.repository = UserImageRepo()
        self.IMG_DIR = 'User'


    def store(self, face_np, user_id):
        """ Store the given face image and update database
        Returns:
            result: an object of UserFaceImage
        """
        img_name = str(uuid.uuid4())
        img_url = self._upload_to_cloud(face_np, self.IMG_DIR, img_name)

        old_img = self.repository.get_by_user_id(user_id)

        if old_img:
            self.remove(old_img)

        img_obj = self.repository.add_img(img_name=img_name, img_url=img_url, user_id=user_id)

        return img_obj
