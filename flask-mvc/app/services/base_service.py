from app.repositories.base_repository import BaseRepository
class BaseService:
    def __init__(self, model, session):
        self.model = model
        self.repository = BaseRepository(model, session)
    def create(self, data): 
        pass 