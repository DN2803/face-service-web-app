from app.packages.embedding.services.EmbeddingService import EmbeddingService
from app.packages.embedding.repositories.PersonEmbeddingRepo import PersonEmbeddingRepo

from deepface import DeepFace
import pickle
import numpy as np
import pandas as pd
# import torch
# import torch.nn.functional as F

# __device = 'cuda' if torch.cuda.is_available() else 'cpu'

class PersonEmbeddingService(EmbeddingService):
    def __init__(self):
        self.repository = PersonEmbeddingRepo()
    
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

    def retrieval(self, embedding: np.ndarray, sim_threshold = 0.7):
        df = self.repository.get_embed_df()

        if df.empty: return []
        db_embed_np = np.array(df['embedding'].tolist())
        
        cos_sim = embedding @ db_embed_np.T
        print(f'MIN sim: {cos_sim.min()}, MAX sim: {cos_sim.max()}')
        
        indices = np.where(cos_sim > sim_threshold)[0]
        filtered_df  = df.iloc[indices]
        result = filtered_df['id'].to_list() #TODO: need to sort it?

        return result

    def add_embedding(self, embed: list[float], image_id):
        binary_embed = pickle.dumps(embed)

        embed = self.repository.add_embed(embedding = binary_embed, image_id = image_id)
        return embed

    def get_embedding(self, embed_id):
        obj = self.repository.get_embedding(embed_id)
        embedding = pickle.loads(obj.embedding)
        return embedding
