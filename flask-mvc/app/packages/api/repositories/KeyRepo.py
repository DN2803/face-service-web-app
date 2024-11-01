from app.repositories.BaseRepository import BaseRepository
from app.packages.api.models.Key import Key
from app.config.Database import db

class KeyRepo(BaseRepository):
    def __init__(self):
        super().__init__(Key, db.session)