from app.services.BaseService import BaseService
from app.packages.user.repositories.UserRepo import UserRepo
from app.packages.user.models.User import UserSchema
from app.packages.image.services.UserImageService import UserImageService
from app.packages.embedding.services.UserEmbeddingService import UserEmbeddingService

from flask_jwt_extended import create_refresh_token, create_access_token
from datetime import timedelta
import numpy as np
from werkzeug.security import check_password_hash, generate_password_hash

class UserService(BaseService):
    def __init__(self):
        self.repository = UserRepo()
        self.schema = UserSchema()
    
    @staticmethod
    def gen_token(user_id, refresh=False):
        token = ''

        if refresh:
            token = create_refresh_token(identity=user_id,
                                        expires_delta=timedelta(days=30)
                                        )
        else:
            token = create_access_token(identity=user_id,
                                        expires_delta=timedelta(hours=1),
                                        fresh=True
                                        )

        return token

    def check_email(self, email):
        user = self.repository.get_user_by_email(email)
        
        if user:
            return user.id, user.name, user.verified
        else:
            return None, None

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

    def add_face_id(self, user_id, img):
        """
        add face id for exist user
        """

        user = self.repository.get_user_by_id(user_id)

        if not user:
            raise Exception("User was not found!")

        face_service = UserImageService()
        embed_service = UserEmbeddingService()

        face_objs = face_service.extract_face(img, only_one=True)
        face_img = face_objs[0]['face']
        embedding = embed_service.encode(face_img)

        if not user.verified: #add
            retrieval_res = embed_service.retrieval(embedding, sim_threshold=0.7)

            if len(retrieval_res) != 0:
                return str("This Face ID is already registered to another user.")
        else: #or update
            user_embedding = embed_service.get_embedding(user.face_embed_id)
            matched, _ = embed_service.compare(user_embedding, embedding,threshold=0.7)

            if not matched:
                raise Exception('Updating the Face ID with a different face is not allowed.')

        img_obj = face_service.store(face_img, user.id)
        embed = embed_service.add_embedding(embedding, img_obj.id)

        self.repository.add_face_embed(user.id, embed.id)

        return str("User Face ID registered successfully.")

    def validate_face_login(self, id, img, threshold = 0.7):
        user = self.repository.get_user_by_id(id)
        
        if user.verified:
            face_service = UserImageService()
            embed_service = UserEmbeddingService()
            face_objs = face_service.extract_face(img, only_one=True)
            embedding = embed_service.encode(face_objs[0]['face'])
            user_embedding = embed_service.get_embedding(user.face_embed_id)

            similarity = np.dot(embedding, user_embedding)
            print(similarity)

            if similarity > threshold:
                return True
        else:
            raise Exception('User has not registered a face id!')

        return False

    def get_base_info(self, user_id):
        user = self.repository.get_user_by_id(user_id)
        info = UserSchema().dump(user)
        info.pop('password')

        return info
    
    def get_projects(self, user_id):
        pass