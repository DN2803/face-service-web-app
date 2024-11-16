from app.repositories.BaseRepository import BaseRepository
from app.packages.api.models.AccessCollection import AccessCollection
from app.config.Database import db

class AccessCollectionRepo(BaseRepository):
    def __init__(self):
        super().__init__(AccessCollection, db.session)

    def link(self, collection_id, key_id):
        return self._create(collection_id=collection_id, key_id=key_id)
    
    def get_key(self, collection_id):
        return self._get_by('collection_id',collection_id)