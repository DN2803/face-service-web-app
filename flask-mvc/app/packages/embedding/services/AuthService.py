from app.services.BaseService import BaseService
from app.repositories.UserAuthRepo import UserAuthRepo
from werkzeug.security import check_password_hash, generate_password_hash

class AuthService(BaseService):
    def __init__(self):
        print("Authentication Service")
        super().__init__(UserAuthRepo())

    def register_user(self, username, password):
        if (self.repository.get_by_username(username)):
            raise Exception("username exists")
        hashed_password = generate_password_hash(password)
        new_user = self.repository.model(username=username, password=hashed_password)
        self.repository.add_user(new_user)

    def validate_login(self, username, password):
        user = self.repository.get_by_username(username)

        if user and check_password_hash(user.password, password):
            return True
        
        return False