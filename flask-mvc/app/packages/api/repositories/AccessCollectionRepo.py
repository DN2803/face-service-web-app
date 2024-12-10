from app.repositories.BaseRepository import BaseRepository
from app.packages.api.models.AccessCollection import AccessCollection
from app.config.Database import db

class AccessCollectionRepo(BaseRepository):
    def __init__(self):
        super().__init__(AccessCollection, db.session)

    def add_access(self, collection_id, key_id):
        return self._create(collection_id=collection_id, key_id=key_id)

    def add_multiple_access(self, key_id, collection_ids):
        accesses = [
            {
                'key_id': key_id,
                'collection_id': collection_id
            } for collection_id in collection_ids
        ]
        self._batch_insert(accesses)

    def get_accessible_collections(self, key_id):
        df = self._get_by('collection_id', 'key_id', 'equal', key_id, return_type='df')
        return df['collection_id'].to_list()

    def get_collection_ids(self, key_id):
        coll_id_df =  self._get_by(
            select_cols='all',
            column='key_id',
            operator='equal',
            value=key_id,
            return_type='df'
        )
        return coll_id_df['collection_id'].tolist()