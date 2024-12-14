from app.services.BaseService import BaseService
from app.packages.image.services import FaceService

class EmbeddingService(BaseService):
    def __init__(self, repository):
        super().__init__(repository)
    
    @staticmethod
    def encode(img_np):
        """ Extract features from a given face image
        Returns:
            result (NDArray): normalize img features
        """
        return FaceService.represent(img_np)