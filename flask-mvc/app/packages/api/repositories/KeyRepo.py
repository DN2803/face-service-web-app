from app.repositories.BaseRepository import BaseRepository
from app.packages.api.models.Key import Key
from app.config.Database import db

class KeyRepo(BaseRepository):
    def __init__(self):
        super().__init__(Key, db.session)

    def add_key(self, **kwargs):
        return self._create(**kwargs)

    def get_key_by_id(self, key_id):
        return self._get_by('all', 'id', 'equal', key_id)

    def check_key_exists(self, key):
        return self._get_by('all', 'key', 'equal', key)

    def update_key(self, key, **kwargs):
        return self._update_by_obj(key, **kwargs)

    def get_dev_keys(self, admin_key_id):
        return self._get_by('all', 'admin_key_id', 'equal', admin_key_id, all=True)