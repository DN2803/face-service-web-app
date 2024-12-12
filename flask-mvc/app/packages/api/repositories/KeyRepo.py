from app.repositories.BaseRepository import BaseRepository
from app.packages.api.models.Key import Key
from app.packages.user.models.User import User
from app.packages.api.models.AccessCollection import AccessCollection
from app.config.Database import db

from sqlalchemy.orm import aliased
from sqlalchemy import func, literal
import pandas as pd

class KeyRepo(BaseRepository):
    def __init__(self):
        super().__init__(Key, db.session)

    def add_key(self, **kwargs):
        return self._create(**kwargs)

    def get_key_by_ids(self, key_ids, all=True):
        return self._get_by('all', 'id', 'in', key_ids, all)

    def check_key_exists(self, key):
        return self._get_by('all', 'key', 'equal', key)

    def update_key(self, key, **kwargs):
        return self._update_by_obj(key, **kwargs)

    def get_devs_info_df(self, admin_key_id):
        query = (
            self.session.query(
                self.model.key,
                User.name,
                User.email,
                AccessCollection.key_id,
                func.concat(
                    literal('['),
                    func.group_concat(AccessCollection.collection_id), # SQL LITE
                    literal("]")
                ).label('scope')
            )
            .filter(self.model.admin_key_id == admin_key_id)
            .join(User, self.model.user_id == User.id)
            .join(AccessCollection, self.model.id == AccessCollection.key_id)
            .group_by(AccessCollection.key_id)
            .statement
        )
        return pd.read_sql(query, con=db.engine)

    def get_projects(self, user_id):
        Admin_Key = aliased(Key)
        query = (
            self.session.query(
                self.model.key,
                self.model.project_name,
                self.model.expires_at,
                Admin_Key.project_name.label('original_name'),
                User.name.label('admin')
            )
            .filter(self.model.user_id == user_id)
            .join(Admin_Key, self.model.admin_key_id == Admin_Key.id, isouter=True)
            .join(User, User.id == Admin_Key.user_id, isouter=True)
            .statement
        )
        return pd.read_sql(query, con=db.engine)

    def remove_key(self, key):
        self._delete(key)