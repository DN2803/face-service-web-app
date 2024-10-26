from app.config.Database import db
from app.config.Hash import Hash
from app.services.base_service import BaseService
from ..models.user_model import UserModel

class UserService(BaseService): 
    def __init__(self, model= UserModel(db), session = None):
        super().__init__(model, session)
    def create(self, data):
        hash_util = Hash()  # Tạo một đối tượng Hash
        # Băm mật khẩu nếu có trong dữ liệu
        if 'password' in data:
            data['password'] = hash_util.getHash(data['password'])  # Thay thế mật khẩu bằng mật khẩu đã băm
        response = self.model.create(data)  # Tạo người dùng mới
        return response

    def get_by_email(self, email):
        user = self.model.get_by_email(email)
        return user