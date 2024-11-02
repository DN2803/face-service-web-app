from app.services.BaseService import BaseService
from app.packages.embedding.services.EmbeddingService import EmbeddingService
from app.packages.image.repositories.ImageRepo import ImageRepo
from app.packages.image import IMAGE_DIR

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
    def extract_face(img_path, anti_spoofing=False, only_one = False):
        """
        Extract faces from a given image

        Args:
            img_path (str or np.ndarray): Path to the first image. Accepts exact image path
                as a string, numpy array (BGR), or base64 encoded images.

            anti_spoofing (boolean): Flag to enable anti spoofing (default is False).

        Returns:
            results (List[Dict[str, Any]]): A list of dictionaries, where each dictionary contains:

            - "face" (np.ndarray): The detected face as a NumPy array.

            - "facial_area" (Dict[str, Any]): The detected face's regions as a dictionary containing:
                + keys 'x', 'y', 'w', 'h' with int values
                + keys 'left_eye', 'right_eye' with a tuple of 2 ints as values. left and right eyes
                    are eyes on the left and right respectively with respect to the person itself
                    instead of observer.

            - "confidence" (float): The confidence score associated with the detected face.

            - "is_real" (boolean): antispoofing analyze result. this key is just available in the
                result only if anti_spoofing is set to True in input arguments.

            - "antispoof_score" (float): score of antispoofing analyze result. this key is
                just available in the result only if anti_spoofing is set to True in input arguments.
        """
        face_objs = DeepFace.extract_faces(
            img_path = img_path, 
            detector_backend = 'yolov8',
            align = True,
            color_face = 'bgr',
            normalize_face = False,
            anti_spoofing = anti_spoofing,
        )

        if only_one and len(face_objs) != 1:
            raise Exception(f'There is not exactly one person in this image!')

        return face_objs
    
    @staticmethod
    def encode(img_np):
        """ Extract features from a given face image
        Returns:
            result (NDArray): normalize img features
        """
        embedding_objs = DeepFace.represent(
            img_path = img_np,
            model_name = "Facenet512",
            enforce_detection = False,
            detector_backend = 'skip'
        )
        embed = embedding_objs[0]['embedding']
        embed_np = np.array(embed)
        embed_normalize = embed_np/ np.linalg.norm(embed_np)
        return embed_normalize

    @staticmethod
    def compare(img1_path, img2_path, threshold = 0.6):
        face_obj_1 = ImageService.extract_face(img1_path, only_one=True)
        face_obj_2 = ImageService.extract_face(img2_path, only_one=True)
        embed_1 = ImageService.encode(face_obj_1[0]['face'])
        embed_2 = ImageService.encode(face_obj_2[0]['face'])
        cos_sim = np.dot(embed_1, embed_2)

        if cos_sim < threshold:
            return False, 0
        
        return True, cos_sim

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