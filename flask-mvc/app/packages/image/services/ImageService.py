from app.services.BaseService import BaseService
from app.packages.image.repositories.ImageRepo import ImageRepo
from app.packages.image import IMAGE_DIR

from typing import Union
import uuid
import os
from deepface import DeepFace
from deepface.commons.image_utils import load_image_from_base64
import cv2
import numpy as np


class ImageService(BaseService):
    def __init__(self, repository: ImageRepo):
        super().__init__(repository)

    @staticmethod 
    def extract_face(img_path: Union[str, np.ndarray]):
        """
        Extract face from a given image

        Args:
        img_path (str or np.ndarray): The exact path to the image, a numpy array in BGR format,
            or a base64 encoded image. If the source image contains multiple faces, the result will
            include information for each detected face.

        Returns:
            results (np.ndarray): A numpy array contains the detected face 
                in BGR format
        """

        face_objs = DeepFace.extract_faces(
            img_path = img_path, 
            detector_backend = 'yolov8',
            align = True,
            color_face = 'bgr',
            normalize_face = False
        )

        if len(face_objs) != 1:
            raise Exception('There is not exactly ONE person in the given image')

        return face_objs[0]['face']

    @staticmethod
    def store_source(uri):
        img_np = load_image_from_base64(uri)
        img_name = str(uuid.uuid4()) + '.jpg'
        img_name = os.path.join('Source', img_name)
        img_path = os.path.join(IMAGE_DIR, img_name)

        cv2.imwrite(img_path, img_np, [int(cv2.IMWRITE_JPEG_QUALITY), 80])
        return img_name

    def remove(self, img_obj):
        self.repository._delete(img_obj)