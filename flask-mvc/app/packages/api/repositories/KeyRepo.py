from app.repositories.BaseRepository import BaseRepository
from app.packages.api.models.Key import Key
from app.config.Database import db

class KeyRepo(BaseRepository):
    def __init__(self):
        super().__init__(Key, db.session)

    def add_key(self, **kwargs):
        return self._create(**kwargs)

    def get_key_by_ids(self, key_id, all=True):
        return self._get_by('all', 'id', 'equal', key_id, all)

    def check_key_exists(self, key):
        return self._get_by('all', 'key', 'equal', key)

    def update_key(self, key, **kwargs):
        return self._update_by_obj(key, **kwargs)

    def get_devs_info_df(self, admin_key_id):
        from app.packages.api.models.UserKey import UserKey
        from app.packages.user.models.User import User
        from app.packages.api.models.AccessCollection import AccessCollection
        from sqlalchemy import func, literal
        import pandas as pd

        query = (
            self.session.query(
                self.model.key,
                User.name,
                User.email,
                func.concat(
                    literal('['),
                    func.group_concat(self.model.collection_id), # SQL LITE
                    literal("]")
                ).label('scopes')
            )
            .filter(self.model.admin_key_id == admin_key_id)
            .join(UserKey, self.model.id == UserKey.key_id)
            .join(User, UserKey.user_id == User.id)
            .join(self.model.id == AccessCollection.key_id)
            .group_by(self.model.key_id)
            .statement
        )
        return pd.read_sql(query, con=db.engine)

    def remove_key(self, key):
        self._delete(key)