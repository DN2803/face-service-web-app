from app.services.BaseService import BaseService
from app.packages.api.repositories.KeyRepo import KeyRepo
import time
import secrets

class KeyService(BaseService):
    DEFAULT_EXP = int(2,592,000) # 30 days

    def __init__(self):
        self.repository = KeyRepo()

    def __gen_key(self):
        key = secrets.token_hex(32)
        created_at = int(time.time())

        return key, created_at

    def create_project(self, project_name):
        key, created_at = self.__gen_key()
        expires_at =created_at+self.DEFAULT_EXP
        key_obj = self.repository.add_key(
            key = key,
            project_name = project_name,
            created_at = created_at,
            expires_at = expires_at
        )

        return key_obj.id, key_obj.key, key_obj.expires_at

    def get_key_by_id(self, key_id):
        return self.repository.get_key_by_id(key_id)
