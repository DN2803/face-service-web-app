from abc import abstractmethod


from app.services.base_service import BaseService
from ..models.auth_model import AuthModel
class AuthService(BaseService): 

    def __init__(self, model= AuthModel(), session = None):
        super().__init__(model, session)
        print(model)
    
    @abstractmethod
    def authenticate(self, data):
        pass

    def isUserEmail(self, data):
        user = self.model.get_by_email(data["email"])
        if user: 
            return True
        else:
            return False