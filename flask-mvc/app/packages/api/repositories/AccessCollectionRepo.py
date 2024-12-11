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

    def check_access(self, key_id, collection_ids):
        access_objs = self.model.query.filter(
            (self.model.key_id == key_id) & (self.model.collection_id.in_(collection_ids))
        ).all()

        return len(access_objs) == len(collection_ids)

    def get_accesses(self, key_id) -> list:
        return self._get_by('all', 'key_id', 'equal', key_id, 'all')

    def remove_access(self, access_obj):
        self._delete(access_obj)