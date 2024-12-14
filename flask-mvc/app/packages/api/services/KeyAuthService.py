from app.services.BaseService import BaseService
from app.packages.api.repositories.KeyRepo import KeyRepo
from app.packages.api.repositories.AccessCollectionRepo import AccessCollectionRepo
from app.packages.api.controllers.RateLimiter import fixed_window_limit

from werkzeug.exceptions import Unauthorized, Forbidden
import time

class KeyAuthService(BaseService):
    def __init__(self):
        self.repository = KeyRepo()

    def check_key(self, key, check_rate_limit=True):
        """
        Check if the given key is exists and it has not expired.
        ----
        Args:
        - key (str): API key
        - check_rate_limit (bool): A flag to check API key rate_limit.
        """
        key_obj = self.repository.check_key_exists(key)

        if not key_obj:
            raise Unauthorized('The given API Key does not exist!')

        if int(time.time()) > key_obj.expires_at:
            raise Forbidden('The given API-Key has expired!')

        is_admin = False if key_obj.admin_key_id else True

        if check_rate_limit:
            allowed, message = fixed_window_limit(key, is_admin, key_obj.admin_key_id)

            if not allowed:
                raise Forbidden(message)

        return key_obj, is_admin

    def check_access(self, key_id, collection_ids):
        if not AccessCollectionRepo().check_access(key_id, collection_ids):
            raise Forbidden(
                'At least one of the given collections is inaccessible with your API key!'
            )

    def validate(self, key, collection_ids):
        """Check key and access collection permission"""
        key_obj, _ = self.check_key(key)
        self.check_access(key_obj.id, collection_ids)