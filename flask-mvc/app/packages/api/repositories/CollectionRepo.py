from app.repositories.BaseRepository import BaseRepository
from app.packages.api.models.Collection import Collection
from app.config.Database import db

class CollectionRepo(BaseRepository):
    def __init__(self):
        super().__init__(Collection, db.session)

    def add_collection(self, **kwargs):
        return self._create(**kwargs)
    
    def get_collection_by_id(self, id):
        return self._get_by('id', id)
    
    def get_collections(self, collection_ids):
        return self.model.query.filter(
            self.model.id.in_(collection_ids)
        ).all()

    def get_collections_by_key_id(self, admin_key_id):
        return self._get_by('admin_key_id',admin_key_id, all=True)