from app.services.BaseService import BaseService

from deepface import DeepFace
import numpy as np

class EmbeddingService(BaseService):
    def __init__(self, repository):
        super().__init__(repository)
    
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
    def compare(embed_1, embed_2, threshold=0.66):
        sim = np.dot(embed_1, embed_2) #cos_sim for two normalized vector

        if sim > threshold:
            return True, sim
        else:
            return False, sim
