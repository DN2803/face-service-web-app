from app.repositories.BaseRepository import BaseRepository
from app.packages.collection.models.Collection import Collection
from app.config.Database import db

class CollectionRepo(BaseRepository):
    def __init__(self):
        super().__init__(Collection, db.session)