import jwt
import os
from datetime import datetime, timedelta

from app.config.Hash import *
from .auth_service import AuthService
from ..models.password_model import PasswordModel

class PasswordService(AuthService):
    def __init__(self):
        super().__init__(model=PasswordModel())
    def authenticate(self, data):
        user = self.model.get_by_email(email=data["email"])
        if not user:
            raise Exception('Email không tồn tại')
        # Kiểm tra mật khẩu
        hash_util = Hash()
        if not hash_util.checkHash(self.model.get_authen_method(user["email"]), data["password"]):
            raise Exception('Mật khẩu không đúng')

        # Tạo JWT token
        token = jwt.encode({
            'email': user['email'],
            'exp': datetime.utcnow() + timedelta(hours=1)  # Thời gian hết hạn là 1 giờ
        }, os.getenv('JWT_SECRET_KEY'), algorithm="HS256")

        return user, token
    def resetPassword (self, data):
        user = self.model.get_by_email(email=data["email"])
        if not user:
            raise Exception('Email không tồn tại')
        # Băm mật khẩu nếu có trong dữ liệu
        hash_util = Hash()
        if 'password' in data:
            data['password'] = hash_util.getHash(data['password'])  # Thay thế mật khẩu bằng mật khẩu đã băm

        save_data = {
            "password": data['password'] ,
        }
        response = self.model.create_new_password(data["email"], save_data)  # Tạo người dùng mới
        return response


    