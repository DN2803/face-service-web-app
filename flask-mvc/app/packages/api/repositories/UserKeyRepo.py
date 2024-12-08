from app.repositories.BaseRepository import BaseRepository
from app.packages.api.models.UserKey import UserKey
from app.config.Database import db

class UserKeyRepo(BaseRepository):
    def __init__(self):
        super().__init__(UserKey, db.session)

    def add_ownership(self, user_id, key_id):
        self._create(user_id=user_id,key_id=key_id)

    def get_key_ids(self, user_id):
        """Get all key_ids belongs to a user_id"""
        df = self._get_by(['key_id'], 'user_id', 'equal', user_id, return_type='df')
        return df['key_id'].tolist()

    def get_user_id(self, key_id):
        """Get user_id of the owner of the key_id"""
        obj = self._get_by('all', 'key_id', 'equal', key_id)
        return obj.user_id

    def get_by_key_ids(self, key_ids):
        """Find all user_key records by a given key_ids list"""
        return self._get_by('all', 'key_id', 'in', key_ids, return_type='df')