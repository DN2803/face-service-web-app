from app.packages.image.services.ImageService import ImageService
from app.packages.image.repositories.UserImageRepo import UserImageRepo

import uuid
import os
from deepface import DeepFace
import cv2
from typing import Union
import numpy as np

IMAGE_DIR = os.path.join('..', 'Image')
os.makedirs(IMAGE_DIR, exist_ok=True)

class UserImageService(ImageService):
    def __init__(self):
        self.repository = UserImageRepo()

    def store(self, face_np: np.ndarray, user_id):
        """ Store the given face image and update database
        Returns:
            result: the image model object
        """
        img_name = str(uuid.uuid4()) + '.jpg'
        img_name = os.path.join('User', img_name)
        img_path = os.path.join(IMAGE_DIR, img_name)
        cv2.imwrite(img_path, face_np, [int(cv2.IMWRITE_JPEG_QUALITY), 80])

        found_img = self.repository.get_by_user_id(user_id)

        if found_img:
            os.remove(found_img.img_url)
            self.remove(found_img)

        img_obj = self.repository.add_img(img_name=img_name, img_url=img_path, user_id=user_id)

        return img_obj