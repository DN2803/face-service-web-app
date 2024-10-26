from app.repositories.BaseRepository import BaseRepository
from app.packages.user.models.User import User
from app.config.Database import db

class UserRepo(BaseRepository):
    def __init__(self):
        print('User Authentication Repository')
        super().__init__(User, db.session)

    def add_user(self, **kwargs):
        # self.__getattribute__
        # if (self._get_by('email',kwargs['email'])):
        #     raise Exception('There is an account using this email!')

        # #TODO: check face exists?
        # self._create(**kwargs)

        try:
            self._create(**kwargs)
        except Exception as e:
            raise e

    def get_user_by_email(self, email):
        return self._get_by('email', email)

    def add_face_embed(self, embed_id):
        pass