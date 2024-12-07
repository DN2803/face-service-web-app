from app.repositories.BaseRepository import BaseRepository
from app.packages.embedding.models.UserFaceEmbedding import UserFaceEmbedding
from app.config.Database import db


class UserEmbeddingRepo(BaseRepository):
    def __init__(self):
        super().__init__(UserFaceEmbedding, db.session)

    def add_embed(self, **kwargs):
        try:
            return self._create(**kwargs)
        except Exception as e:
            raise e
    
    def get_embedding(self, id):
        return self._get_by('all', 'id','equal', id)