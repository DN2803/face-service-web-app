from app.repositories.BaseRepository import BaseRepository
from app.packages.api.models.UserKey import UserKey
from app.config.Database import db

class UserKeyRepo(BaseRepository):
    def __init__(self):
        super().__init__(UserKey, db.session)

    def add(self, user_id, key_id):
        self._create(user_id=user_id,key_id=key_id)

    def get_key_ids(self, user_id):
        return self._get_by('all', 'user_id', 'equal', user_id, all=True)

    def get_user_id(self, key_id):
        return self._get_by('all', 'key_id', 'equal', key_id)
    
    def check_ownership(self, user_id, key_id):
        obj = self._get_by('all', 'key_id', 'equal', key_id)

        if not obj or obj.user_id != user_id:
            return False

        return True