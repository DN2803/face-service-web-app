from app.services.BaseService import BaseService
from app.packages.api.repositories.KeyRepo import KeyRepo

class KeyService(BaseService):
    def __init__(self):
        self.repository = KeyRepo()