from app.services.BaseService import BaseService
from app.packages.user.repositories.UserRepo import UserRepo
from app.packages.user.models.User import UserSchema
from app.packages.image.services.UserImageService import UserImageService
from app.packages.embedding.services.UserEmbeddingService import UserEmbeddingService
from app.packages.api.repositories.UserKeyRepo import UserKeyRepo
from app.packages.api.services.KeyService import KeyService
from app.packages.api.models.Key import KeySchema
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
            face_objs = face_service.extract_face(img_np, only_one=True)

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
    
    #PROJECTS
    def create_project(self, user_id, project_name):
        project_info = KeyService().create_project(project_name)
        UserKeyRepo().add(user_id, project_info['id'])

        return project_info

    def get_projects(self, user_id):
        objs = UserKeyRepo().get_key_ids(user_id)
        key_service = KeyService()
        key_schema = KeySchema()
        result = []

        for obj in objs:
            key_obj = key_service.get_key_by_id(obj.key_id)
            temp_result = key_schema.dump(key_obj)
            result.append(temp_result)

        return result