from app.repositories.BaseRepository import BaseRepository
from app.packages.api.models.UserKey import UserKey
from app.config.Database import db

class UserKeyRepo(BaseRepository):
    def __init__(self):
        super().__init__(UserKey, db.session)

    def add(self, user_id, key_id):
        self._create(user_id=user_id,key_id=key_id)

    def get_key_ids(self, user_id):
        return self._get_by('user_id', user_id, all=True)