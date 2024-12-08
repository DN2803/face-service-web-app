from app.packages.embedding.services.EmbeddingService import EmbeddingService
from app.packages.embedding.repositories.UserEmbeddingRepo import UserEmbeddingRepo

import pickle

class UserEmbeddingService(EmbeddingService):
    def __init__(self):
        self.repository = UserEmbeddingRepo()

    def add_embedding(self, embed: list[float], image_id):
        binary_embed = pickle.dumps(embed)

        embed = self.repository.add_embed(embedding = binary_embed, image_id = image_id)
        return embed

    def get_embedding(self, embed_id):
        obj = self.repository.get_embedding(embed_id)
        embedding = pickle.loads(obj.embedding)
        return embedding
