from app.services.BaseService import BaseService
from app.packages.user.repositories.UserRepo import UserRepo
from app.packages.user.models.User import UserSchema
from app.packages.image.services.UserImageService import UserImageService
from app.packages.embedding.services.UserEmbeddingService import UserEmbeddingService

import time
from deepface.commons.image_utils import load_image_from_base64

class UserService(BaseService):
    def __init__(self):
        self.schema = UserSchema()
        self.repository = UserRepo()

    def add_face_id(self, user_id, img):
        """
        add face id for exist user
        """

        user = self.repository.get_user_by_id(user_id)

        if not user:
            raise Exception("User was not found!")

        face_service = UserImageService()
        embed_service = UserEmbeddingService()

        try:
            img_np = load_image_from_base64(img)
            face_objs = face_service.extract_faces(img_np, anti_spoofing=True)
            is_real, antispoof_score = face_objs['is_real'], face_objs['antispoof_score']

            if is_real and antispoof_score > 0.66:
                raise Exception('The given image did not pass the anti-spoofing check!')

            face_img = face_objs[0]['face']
            embedding = embed_service.encode(face_img)

            img_obj = face_service.store(face_img, user.id)
            embed = embed_service.add_embedding(embedding, img_obj.id)

            self.repository.add_face_embed(user, embed.id)

            return str("User Face ID registered successfully.")
        except Exception as e:
            import cv2
            error_file_path = f'../Image/User/error_{user_id}_{time.time()}.jpg'
            cv2.imwrite(error_file_path, img_np)
            raise e

    def get_base_info(self, user_id):
        user = self.repository.get_user_by_id(user_id)
        info = self.schema.dump(user)
        info.pop('password')

        return info