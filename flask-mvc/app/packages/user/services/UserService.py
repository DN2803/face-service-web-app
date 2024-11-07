from app.services.BaseService import BaseService
from app.packages.user.repositories.UserRepo import UserRepo
from app.packages.user.models.User import UserSchema
from app.packages.image.services.UserImageService import UserImageService
from app.packages.embedding.services.UserEmbeddingService import UserEmbeddingService

class UserService(BaseService):
    def __init__(self):
        self.repository = UserRepo()
        self.schema = UserSchema()

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

        img_obj = face_service.store(face_img, user.id)
        embed = embed_service.add_embedding(embedding, img_obj.id)

        self.repository.add_face_embed(user.id, embed.id)

        return str("User Face ID registered successfully.")

    def get_base_info(self, user_id):
        user = self.repository.get_user_by_id(user_id)
        info = self.schema.dump(user)
        info.pop('password')

        return info
    
    def get_projects(self, user_id):
        user = self.repository.get_user_by_id(user_id)

        if not user:
            raise Exception("User was not found!")