from app.packages.embedding.services.EmbeddingService import EmbeddingService
from app.packages.embedding.repositories.PersonEmbeddingRepo import PersonEmbeddingRepo

import pickle
import numpy as np
import pandas as pd

class PersonEmbeddingService(EmbeddingService):
    def __init__(self):
        self.repository = PersonEmbeddingRepo()

    def retrieval(self, df: pd.DataFrame, embedding: np.ndarray, limit, sim_threshold = 0.7):
        if df.empty: return None
        db_embed_np = np.array(df['embedding'].tolist())
        
        cos_sim = embedding @ db_embed_np.T
        print(f'MIN sim: {cos_sim.min()}, MAX sim: {cos_sim.max()}')
        
        indices = np.where(cos_sim > sim_threshold)[0]
        filtered_df  = df.iloc[indices]
        result = filtered_df['id']
        result = filtered_df['person_id'].drop_duplicates().tolist()

        if len(result) > limit:
            result = result[:limit]

        return result

    def add_embedding(self, embed: list[float], image_id, person_id):
        binary_embed = pickle.dumps(embed)
        embed = self.repository.add_embed(
            embedding = binary_embed,
            image_id = image_id,
            person_id=person_id
        )

        return embed

    def get_embedding(self, embed_id):
        obj = self.repository.get_embedding(embed_id)
        embedding = pickle.loads(obj.embedding)
        return embedding
