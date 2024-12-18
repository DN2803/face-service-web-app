from app.repositories.BaseRepository import BaseRepository
from app.packages.api.models.Key import Key
from app.packages.user.models.User import User
from app.packages.api.models.AccessCollection import AccessCollection
from app.config.Database import db

from sqlalchemy.orm import aliased
from sqlalchemy import func
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
        filter_query = (
            self.session.query(
                self.model.id,
                self.model.key,
                self.model.user_id
            )
            .filter(self.model.admin_key_id == admin_key_id)
            .subquery('filter_query')
        )
        query = (
            self.session.query(
                filter_query.c.key,
                User.name,
                User.email,
                AccessCollection.key_id,
                func.group_concat(AccessCollection.collection_id).label('scope') # SQL LITE
            )
            .join(User, filter_query.c.user_id == User.id)
            .join(AccessCollection, filter_query.c.id == AccessCollection.key_id)
            .group_by(AccessCollection.key_id)
            .statement
        )
        df = pd.read_sql(query, con=db.engine)
        df['scope'] = df['scope'].apply(lambda x: list(map(int, x.split(','))))
        return df

    def get_projects(self, user_id):
        filter_query = (
            self.session.query(
                self.model.key,
                self.model.project_name,
                self.model.expires_at,
                self.model.admin_key_id
            )
            .filter(self.model.user_id == user_id)
            .subquery('filter_query')
        )

        Admin_Key = aliased(Key)
        query = (
            self.session.query(
                filter_query.c.key,
                filter_query.c.project_name,
                filter_query.c.expires_at,
                Admin_Key.project_name.label('original_name'),
                User.name.label('admin')
            )
            .join(Admin_Key, filter_query.c.admin_key_id == Admin_Key.id, isouter=True)
            .join(User, User.id == Admin_Key.user_id, isouter=True)
            .statement
        )
        return pd.read_sql(query, con=db.engine)

    def remove_key(self, key):
        self._delete(key)