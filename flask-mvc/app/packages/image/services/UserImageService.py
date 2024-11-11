from app.packages.image.services.ImageService import ImageService
from app.packages.image.repositories.UserImageRepo import UserImageRepo

import uuid

class UserImageService(ImageService):
    IMG_DIR = 'User'

    def __init__(self):
        self.repository = UserImageRepo()

    def store(self, face_np, user_id):
        """ Store the given face image and update database
        Returns:
            result: an object of UserFaceImage
        """
        img_name = str(uuid.uuid4()) + '.jpg'
        img_path = f'{self.IMG_DIR}/{img_name}'
        self._upload_to_cloud(face_np, img_path)

        old_img = self.repository.get_by_user_id(user_id)

        if old_img:
            self._delete_on_cloud(old_img.img_url)
            self.remove(old_img)

        img_obj = self.repository.add_img(img_name=img_name, img_url=img_path, user_id=user_id)

        return img_obj