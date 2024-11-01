from app.repositories.BaseRepository import BaseRepository
from app.packages.user.models.User import User
from app.config.Database import db

class UserRepo(BaseRepository):
    def __init__(self):
        super().__init__(User, db.session)

    def add_user(self, **kwargs):
        try:
            return self._create(**kwargs)
        except Exception as e:
            raise e

    def get_user_by_id(self, id):
        return self._get_by('id', id)

    def get_user_by_email(self, email):
        return self._get_by('email', email)

    def add_face_embed(self, user_id, embed_id):
        self._update_by_id(id=user_id, verified=True, face_embed_id=embed_id)