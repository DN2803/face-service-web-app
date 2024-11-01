from app.services.BaseService import BaseService
from app.packages.collection.repositories.CollectionRepo import CollectionRepo

class CollectionService(BaseService):
    def __init__(self):
        self.repository = CollectionRepo()