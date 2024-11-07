from app.packages.image.services.ImageService import ImageService
from app.packages.image.repositories.UserImageRepo import UserImageRepo
from app.packages.image import IMAGE_DIR

import uuid
import os
import cv2

USER_IMG_DIR = os.path.join(IMAGE_DIR, 'User')
os.makedirs(USER_IMG_DIR, exist_ok=True)

class UserImageService(ImageService):
    def __init__(self):
        self.repository = UserImageRepo()

    def store(self, face_np, user_id):
        """ Store the given face image and update database
        Returns:
            result: the image model object
        """
        img_name = str(uuid.uuid4()) + '.jpg'
        img_path = os.path.join(USER_IMG_DIR, img_name)
        cv2.imwrite(img_path, face_np, [int(cv2.IMWRITE_JPEG_QUALITY), 80])

        old_img = self.repository.get_by_user_id(user_id)

        if old_img:
            os.remove(old_img.img_url)
            self.remove(old_img)

        img_obj = self.repository.add_img(img_name=img_name, img_url=img_path, user_id=user_id)

        return img_obj