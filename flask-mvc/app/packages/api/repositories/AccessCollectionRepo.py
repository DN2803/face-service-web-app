from app.repositories.BaseRepository import BaseRepository
from app.packages.api.models.AccessCollection import AccessCollection
from app.config.Database import db

class AccessCollectionRepo(BaseRepository):
    def __init__(self):
        super().__init__(AccessCollection, db.session)

    def add_access(self, collection_id, key_id):
        return self._create(collection_id=collection_id, key_id=key_id)

    def check_access(self, key_id, collection_id):
        obj = self.model.query.filter(
            (self.model.key_id == key_id) & (self.model.collection_id == collection_id)
        ).first()

        return True if obj else False

    def get_collection_ids(self, key_id):
        coll_id_df =  self._get_dataframe(
            drop_cols=['key_id'],
            filter_col='key_id',
            filter_value=key_id
        )
        return coll_id_df['collection_id'].tolist()