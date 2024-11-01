from app.repositories.BaseRepository import BaseRepository
from app.packages.embedding.models.PersonFaceEmbedding import PersonFaceEmbedding
from app.config.Database import db

import pickle

class PersonEmbeddingRepo(BaseRepository):
    def __init__(self):
        super().__init__(PersonFaceEmbedding, db.session)

    def add_embed(self, **kwargs):
        try:
            return self._create(**kwargs)
        except Exception as e:
            raise e
    
    def get_embedding(self, id):
        return self._get_by('id',id)

    def get_embed_df(self):
        df = self._get_dataframe(drop_cols=['image_id'])
        df['embedding'] = df['embedding'].apply(pickle.loads)
        return df