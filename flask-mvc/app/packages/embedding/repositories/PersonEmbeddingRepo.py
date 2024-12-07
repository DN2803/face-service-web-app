from app.repositories.BaseRepository import BaseRepository
from app.packages.embedding.models.PersonFaceEmbedding import PersonFaceEmbedding
from app.config.Database import db

import pandas as pd
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
        return self._get_by('all', 'id', 'equal', id)

    def get_embeds_df(self, person_ids):
        df = self._get_by(
            select_cols=['person_id', 'embedding'], 
            column = 'person_id', 
            operator = 'in',
            value = person_ids,
            return_type='df')

        df['embedding'] = df['embedding'].apply(pickle.loads)
        return df