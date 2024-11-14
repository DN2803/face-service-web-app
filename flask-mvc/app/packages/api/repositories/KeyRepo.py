from app.repositories.BaseRepository import BaseRepository
from app.packages.api.models.Key import Key
from app.config.Database import db

class KeyRepo(BaseRepository):
    def __init__(self):
        super().__init__(Key, db.session)

    def add_key(self, **kwargs):
        try:
            return self._create(**kwargs)
        except Exception as e:
            raise e

    def get_key_by_id(self, key_id):
        return self._get_by('id', key_id)