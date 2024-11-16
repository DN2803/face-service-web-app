from app.services.BaseService import BaseService
from app.packages.api.models.Key import KeySchema
from app.packages.api.models.Person import PersonSchema
from app.packages.api.models.Collection import CollectionSchema
from app.packages.api.repositories.KeyRepo import KeyRepo
from app.packages.api.repositories.PersonRepo import PersonRepo
from app.packages.api.repositories.CollectionRepo import CollectionRepo
from app.packages.api.repositories.AccessCollectionRepo import AccessCollectionRepo

import time
import secrets

class KeyService(BaseService):
    DEFAULT_EXP = int(2592000) # 30 days

    def __init__(self):
        self.repository = KeyRepo()

    def __gen_key(self):
        key = secrets.token_hex(32)
        created_at = int(time.time())

        return key, created_at

    def create_project(self, project_name):
        key, created_at = self.__gen_key()
        expires_at = created_at + self.DEFAULT_EXP
        key_obj = self.repository.add_key(
            key = key,
            project_name = project_name,
            created_at = created_at,
            expires_at = expires_at
        )
        
        res = KeySchema().dump(key_obj)
        return res

    def get_key_by_id(self, key_id):
        return self.repository.get_key_by_id(key_id)

    def check_key(self, key):
        return self.repository.check_key(key)
    
    def add_person(self, key_id, **kwargs):
        schema = PersonSchema()
        validated_data = schema.load(data=kwargs)
        person = None

        if 'collection_id' in validated_data:
            key_obj = AccessCollectionRepo().get_key(validated_data['collection_id'])

            if not key_obj or key_obj.id != key_id:
                raise Exception('Cannot add Person to this Collection!')

            person = PersonRepo().add_person(**validated_data)
        else:
            collection_obj = CollectionRepo().add_collection(name='.', description='.')
            AccessCollectionRepo().link(collection_obj.id, key_id)
            validated_data['collection_id'] = collection_obj.id
            person = PersonRepo().add_person(**validated_data)

        res = schema.dump(person)
        return res
    
    def add_collection(self, key_id, **kwargs):
        schema = CollectionSchema()
        validated_data = schema.load(data=kwargs)
        person = None

        collection_obj = CollectionRepo().add_collection(**validated_data)
        AccessCollectionRepo().link(collection_obj.id, key_id)

        res = schema.dump(collection_obj)
        return res
