from app.services.BaseService import BaseService
from app.packages.api.models.Key import KeySchema
from app.packages.api.repositories.KeyRepo import KeyRepo
from app.packages.api.repositories.CollectionRepo import CollectionRepo
from app.packages.api.repositories.AccessCollectionRepo import AccessCollectionRepo

import time

class KeyAuthService(BaseService):
    def __init__(self):
        self.repository = KeyRepo()
        self.schema = KeySchema()

    def check_key(self, key):
        key_obj = self.repository.check_key_exists(key)

        if key_obj:
            if int(time.time()) < key_obj.expires_at:
                raise Exception('The given API-Key has expired!')

            is_admin = False if key_obj.admin_key_id else True
            return key_obj, is_admin

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
        key_obj, is_admin = self.check_key(key)

        if key_obj == None: return False

        return self.check_access(key_obj.id, is_admin, collection_ids)

    def update_key(self, key, **kwargs):
        key_obj = self.repository.check_key_exists(key)
        
        if not key_obj:
            raise Exception('Given API Key does not exist!')
        
        self.repository.update_key(key_obj, **kwargs)