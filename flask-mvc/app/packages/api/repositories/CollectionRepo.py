from app.repositories.BaseRepository import BaseRepository
from app.packages.api.models.Collection import Collection
from app.config.Database import db

class CollectionRepo(BaseRepository):
    def __init__(self):
        super().__init__(Collection, db.session)

    def add_collection(self, **kwargs):
        return self._create(**kwargs)
    
    def get_collection_by_id(self, id):
        return self._get_by(
            select_cols='all',
            column='id',
            operator='equal',
            value=id
        )

    def get_collections(self, collection_ids):
        return self._get_by(
            select_cols='all',
            column='id',
            operator='in',
            value=collection_ids,
            all=True
        )

    def get_collections_by_key_id(self, admin_key_id):
        return self._get_by(
            select_cols='all',
            column='admin_key_id',
            operator='equal',
            value=admin_key_id,
            all=True
        )

    def check_admin_access(self, admin_key_id, collection_id):
        obj = self.get_collection_by_id(collection_id)

        if not obj or obj.admin_key_id != admin_key_id: 
            return False

        return True

    def update(self, collection, **kwargs):
        self._update_by_obj(collection, **kwargs)

    def delete(self, collection):
        self._delete(collection)