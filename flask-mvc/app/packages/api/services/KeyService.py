from app.services.BaseService import BaseService
from app.packages.api.repositories.KeyRepo import KeyRepo

from flask_jwt_extended import create_access_token
from datetime import datetime, timedelta, timezone

class KeyService(BaseService):
    def __init__(self):
        self.repository = KeyRepo()