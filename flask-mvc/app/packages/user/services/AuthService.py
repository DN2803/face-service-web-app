from app.services.BaseService import BaseService
from app.repositories.UserRepo import UserRepo
from app.packages.user.models.User import UserSchema
from werkzeug.security import check_password_hash, generate_password_hash

import jwt
from app.config.DeployConfig import config
from datetime import datetime, timezone, timedelta

class AuthService(BaseService):
    def __init__(self):
        print("Authentication Service")
        self.repository = UserRepo()
        self.schema = UserSchema()
    
    def register(self, **kwargs):
        validated_data = self.schema.load(data=kwargs)
        hashed_password = generate_password_hash(validated_data['password'])
        validated_data['password'] = hashed_password

        self.repository.add_user(**validated_data)

    def validate_login(self, email, password):
        user = self.repository.get_user_by_email(email)

        if user and check_password_hash(user.password, password):
            token = jwt.encode({
                'email': email,
                'exp': datetime.now(timezone.utc)+ timedelta(hours=1)
                }, 
                config.SECRET_KEY, 
                algorithm="HS256")
            
            return True, token
        
        return False, None
    def isExistEmail(self, email): 
        user = self.repository.get_user_by_email(email)
        if user:
            return True
        return False