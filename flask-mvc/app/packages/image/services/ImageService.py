from app.services.BaseService import BaseService
from app.packages.image.repositories.ImageRepo import ImageRepo
from app.cloud_storage.StorageApp import storage_app
from app.packages.image.services import FaceService

import cv2

class ImageService(BaseService):
    def __init__(self, repository: ImageRepo):
        super().__init__(repository)
        self.IMG_DIR = None

    @staticmethod
    def extract_faces(img_path, anti_spoofing=False):
        """
        Extract the face from a given image that includes only one face.

        Args:
        ----
        - img_path (str or np.ndarray): Path to the first image. Accepts exact image path
            as a string, numpy array (BGR), or base64 encoded images.

        - anti_spoofing (boolean): Flag to enable anti spoofing (default is False).

        Returns:
        ----
        results (List[Dict[str, Any]]): A list of dictionaries, where each dictionary contains:

        - "face" (np.ndarray): The detected face as a NumPy array.

        - "facial_area" (Dict[str, Any]): The detected face's regions as a dictionary containing:
            * keys 'x', 'y', 'w', 'h' with int values
            * keys 'left_eye', 'right_eye' with a tuple of 2 ints as values. left and right eyes
                are eyes on the left and right respectively with respect to the person itself
                instead of observer.
            * "confidence" (float): The confidence score associated with the detected face.
            * "is_real" (boolean): antispoofing analyze result. this key is just available in the
                result only if anti_spoofing is set to True in input arguments.
            * "antispoof_score" (float): score of antispoofing analyze result. this key is
                just available in the result only if anti_spoofing is set to True in input arguments.
        """

        return FaceService.extract_faces(
            img_path,
            anti_spoofing=anti_spoofing,
            only_one=True,
            align=True,
            return_faces=True
        )

    def __compress(self, img_np, quality=85):
        encode_param = [int(cv2.IMWRITE_JPEG_QUALITY), quality]
        _, buffer = cv2.imencode('.jpg', img_np, encode_param)
        
        return buffer.tobytes()

    def _upload_to_cloud(self, img_np, folder, file_name):
        content = self.__compress(img_np)        
        return storage_app.upload(content, folder, file_name)

    def _remove_on_cloud(self, file_path):
        storage_app.delete(file_path)

    def remove(self, img_obj):
        file_path = f'{self.IMG_DIR}/{img_obj.img_name}'
        self._remove_on_cloud(file_path)
        self.repository._delete(img_obj)