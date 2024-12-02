from app.repositories.BaseRepository import BaseRepository
from app.packages.api.models.Person import Person
from app.config.Database import db

import pandas as pd

class PersonRepo(BaseRepository):
    def __init__(self):
        super().__init__(Person, db.session)

    def add_person(self, **kwargs):
        return self._create(**kwargs)

    def get_person(self, person_id):
        return self._get_by('id', person_id)

    def get_df(self, collection_ids):
        query = self.session.query(self.model).filter(
            (self.model.collection_id.in_(collection_ids))
        ).statement

        df = pd.read_sql(query, con=db.engine)

        return df

    def update_info(self, person, **kwargs):
        return self._update_by_obj(person,**kwargs)

    def delete_person(self, person):
        self._delete(person)

    def get_persons(self, limit, last_id, collection_ids):
        records = self.model.query.filter(
            (self.model.id > last_id) & (self.model.collection_id.in_(collection_ids))
        ).limit(limit).all()

        return records