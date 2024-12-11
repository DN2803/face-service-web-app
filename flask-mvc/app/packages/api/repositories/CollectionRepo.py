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

    def update(self, collection, **kwargs):
        self._update_by_obj(collection, **kwargs)

    def delete(self, collection):
        self._delete(collection)