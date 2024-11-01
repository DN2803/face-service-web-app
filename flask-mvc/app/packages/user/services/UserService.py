from app.services.BaseService import BaseService
from app.packages.user.repositories.UserRepo import UserRepo
from app.packages.user.models.User import UserSchema
from app.packages.image.services.UserImageService import UserImageService
from app.packages.embedding.services.UserEmbeddingService import UserEmbeddingService

import numpy as np
from werkzeug.security import check_password_hash, generate_password_hash

class UserService(BaseService):
    def __init__(self):
        self.repository = UserRepo()
        self.schema = UserSchema()
    
    def check_email(self, email):
        user = self.repository.get_user_by_email(email)
        
        if user:
            return user.id
        else:
            return 0

    def register(self, **kwargs):
        validated_data = self.schema.load(data=kwargs)
        hashed_password = generate_password_hash(validated_data['password'])
        validated_data['password'] = hashed_password
        user = self.repository.add_user(**validated_data)
        return user.id

    def validate_login(self, id, password):
        user = self.repository.get_user_by_id(id)

        token = ''

        if user and check_password_hash(user.password, password):
                 
            return True, token
        
        return False, token
    
    def add_face_id(self, email, img):
        """
        add face id for exist user
        """

        face_service = UserImageService()
        embed_service = UserEmbeddingService()

        user = self.repository.get_user_by_email(email)

        if not user:
            return "User's email was not found!"
        
        face_img = face_service.extract_face(img)
        embedding = embed_service.encode(face_img)

        if not user.verified: # add
            retrieval_res = embed_service.retrieval(embedding, sim_threshold=0.65)

            if len(retrieval_res) != 0:
                return "This Face ID is already registered to another user."
        else: # or update
            pass #TODO: check condition for update new face id.

        img_obj = face_service.store(face_img, user.id)
        embed = embed_service.add_embedding(embedding, img_obj.id)

        self.repository.add_face_embed(user.id, embed.id)

        return "User Face ID registered successfully."

    def validate_face_login(self, id, img, threshold = 0.7):
        user = self.repository.get_user_by_id(id)
        
        if user.face_embed_id:
            face_service = UserImageService()
            embed_service = UserEmbeddingService()
            face_img = face_service.extract_face(img)
            embedding = embed_service.encode(face_img)
            user_embedding = embed_service.get_embedding(user.face_embed_id)

            similarity = np.dot(embedding, user_embedding) #cos_sim for two normalized vector
            print(similarity)

            if similarity > threshold:
                return True
        else:
            raise Exception('User has not registered a face id!')

        return False
