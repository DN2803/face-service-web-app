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
        return self._get_by('id',id)
    
    def get_embeds_df(self, person_ids):
        result = self.session.query.with_entities(self.model.person_id, self.model.embedding).filter(
            self.model.person_id.in_(person_ids)
        ).all()

        df = pd.DataFrame(result, columns=['person_id', 'embedding'])
        df['embedding'] = df['embedding'].apply(pickle.loads)
        return df