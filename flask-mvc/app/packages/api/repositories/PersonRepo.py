from app.repositories.BaseRepository import BaseRepository
from app.packages.api.models.Person import Person
from app.config.Database import db

class PersonRepo(BaseRepository):
    def __init__(self):
        super().__init__(Person, db.session)

    def add_person(self, **kwargs):
        return self._create(**kwargs)
    
    def update_info(self, person, **kwargs):
        self._update_by_obj(person,**kwargs)