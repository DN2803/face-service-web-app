from abc import abstractmethod
from app.config.Database import db
from app.packages.users.models.user_model import UserModel

class AuthModel(UserModel): 
    def __init__(self, mongo=db):
        super().__init__(mongo=mongo)
        
    @abstractmethod
    def get_authen_method(self, email):
        pass 