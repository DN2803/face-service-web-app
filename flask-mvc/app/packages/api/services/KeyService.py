from app.services.BaseService import BaseService
from app.packages.api.models.Key import KeySchema
from app.packages.api.repositories.KeyRepo import KeyRepo
from app.packages.api.repositories.CollectionRepo import CollectionRepo
from app.packages.api.repositories.AccessCollectionRepo import AccessCollectionRepo

import time
import secrets

class KeyService(BaseService):
    DEFAULT_EXP = int(2592000) # 30 days

    def __init__(self):
        self.repository = KeyRepo()
        self.schema = KeySchema()

    def __gen_key(self):
        key = secrets.token_hex(32)
        created_at = int(time.time())

        return key, created_at

    def create_project(self, project_name):
        key, created_at = self.__gen_key()
        expires_at = created_at + self.DEFAULT_EXP
        key_obj = self.repository.add_key(
            key = key,
            project_name = project_name,
            created_at = created_at,
            expires_at = expires_at
        )

        #create default collection
        CollectionRepo().add_collection(
            name='Base', 
            description='The default collection of your project. Undeletable.',
            admin_key_id=key_obj.id
        )

        res = self.schema.dump(key_obj)
        res['id'] = key_obj.id
        return res

    def get_key_by_id(self, key_id):
        return self.repository.get_key_by_id(key_id)

    def check_key(self, key):
        key_obj = self.repository.check_key(key)

        if key_obj:
            is_admin = False if key_obj.admin_key_id else True
            return key_obj.id, is_admin

        return None, None

    def check_access(self, key_id, is_admin, collection_ids):
        check_access_func = CollectionRepo().check_admin_access if is_admin \
                        else AccessCollectionRepo().check_access

        for collection_id in collection_ids:
            is_accessible = check_access_func(key_id, collection_id)

            if not is_accessible: return False

        return True

    def validate(self, key, collection_ids):
        """Check key and access collection permission"""
        key_id, is_admin = self.check_key(key)

        if key_id == None: return False

        return self.check_access(key_id, is_admin, collection_ids)