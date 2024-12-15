from app.services.BaseService import BaseService
from app.packages.user.repositories.UserRepo import UserRepo
from app.packages.user.models.User import UserSchema
from app.packages.image.services.UserImageService import UserImageService
from app.packages.embedding.services.UserEmbeddingService import UserEmbeddingService

from flask_jwt_extended import create_refresh_token, create_access_token
from datetime import timedelta
import numpy as np
from werkzeug.security import check_password_hash, generate_password_hash

class AuthService(BaseService):
    def __init__(self):
        self.repository = UserRepo()
        self.schema = UserSchema()
    
    @staticmethod
    def gen_token(user_id, refresh=False):
        if refresh:
            token = create_refresh_token(
                identity=user_id,
                expires_delta=timedelta(days=30)
            )
        else:
            token = create_access_token(
                identity=user_id,
                expires_delta=timedelta(hours=1),
                fresh=True
            )

        return token

    def check_email(self, email):
        user = self.repository.get_user_by_email(email)

        if user:
            info = self.schema.dump(user)
            info.pop('password')
            info.pop('email')
            return info
        else:
            return None

    def register(self, **kwargs):
        validated_data = self.schema.load(data=kwargs)
        hashed_password = generate_password_hash(validated_data['password'])
        validated_data['password'] = hashed_password
        user = self.repository.add_user(**validated_data)
        return user.id

    def validate_login(self, id, password):
        user = self.repository.get_user_by_id(id)

        if user and check_password_hash(user.password, password):
            return True

        return False

    def validate_face_login(self, id, img, threshold = 0.7):
        user = self.repository.get_user_by_id(id)

        if user.verified:
            face_service = UserImageService()
            embed_service = UserEmbeddingService()
            face_obj = face_service.extract_faces(img, anti_spoofing=True)
            is_real, antispoof_score = face_obj['is_real'], face_obj['antispoof_score']

            if not is_real or antispoof_score < 0.66:
                return False

            embedding = embed_service.encode(face_obj['face'])
            user_embedding = embed_service.get_embedding(user.face_embed_id)

            similarity = np.dot(embedding, user_embedding)
            print(similarity)

            if similarity > threshold:
                return True
        else:
            raise Exception('User has not registered a face id!')

        return False