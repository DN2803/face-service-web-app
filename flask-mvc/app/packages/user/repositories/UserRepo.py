from app.repositories.BaseRepository import BaseRepository
from app.packages.user.models.User import User
from app.config.Database import db

class UserRepo(BaseRepository):
    def __init__(self):
        super().__init__(User, db.session)

    def add_user(self, **kwargs):
        return self._create(**kwargs)

    def get_user_by_id(self, id):
        return self._get_by('all', 'id', 'equal', id)

    def get_user_by_email(self, email):
        return self._get_by('all','email', 'equal', email)

    def add_face_embed(self, user, embed_id):
        self._update_by_obj(obj=user, verified=True, face_embed_id=embed_id)