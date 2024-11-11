from app.services.BaseService import BaseService
from app.packages.image.repositories.ImageRepo import ImageRepo
from app.packages.embedding.services.EmbeddingService import EmbeddingService
from app.cloud_storage.StorageApp import storage_app

import base64
from deepface import DeepFace
import cv2

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
            detector_backend = 'yunet',
            align = True,
            color_face = 'bgr',
            normalize_face = False,
            anti_spoofing = anti_spoofing,
        )

        if only_one and len(face_objs) != 1:
            raise Exception(f'There is not exactly one person in this image!')

        return face_objs

    @staticmethod
    def compare(img1_path, img2_path, threshold = 0.6):
        face_obj_1 = ImageService.extract_face(img1_path, only_one=True)
        face_obj_2 = ImageService.extract_face(img2_path, only_one=True)
        embed_1 = EmbeddingService.encode(face_obj_1[0]['face'])
        embed_2 = EmbeddingService.encode(face_obj_2[0]['face'])

        return EmbeddingService.compare(embed_1, embed_2, threshold)

    @staticmethod
    def _get_download_link(img_path):
        storage_app.gen_download_link(img_path)

    def __compress(self, img_np, quality=85):
        encode_param = [int(cv2.IMWRITE_JPEG_QUALITY), quality]
        _, buffer = cv2.imencode('.jpg', img_np, encode_param)
        compressed_base64 = base64.b64encode(buffer).decode('utf-8')
        
        return compressed_base64

    def _upload_to_cloud(self, img_np, file_path):
        content = self.__compress(img_np)        
        return storage_app.upload(file_path, content)

    def _delete_on_cloud(self, file_path):
        return storage_app.delete(file_path)

    def remove(self, img_obj):
        self.repository._delete(img_obj)