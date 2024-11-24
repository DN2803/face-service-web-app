from app.repositories.BaseRepository import BaseRepository
from app.packages.api.models.Key import Key
from app.config.Database import db

import time

class KeyRepo(BaseRepository):
    def __init__(self):
        super().__init__(Key, db.session)

    def add_key(self, **kwargs):
        return self._create(**kwargs)

    def get_key_by_id(self, key_id):
        return self._get_by('id', key_id)
    
    def check_key(self, key):
        obj = self._get_by('key', key)

        if obj and int(time.time()) < obj.expires_at:
            return obj
        else:
            return None

    def update_key(self, key, **kwargs):
        return self._update_by_obj(key, **kwargs)