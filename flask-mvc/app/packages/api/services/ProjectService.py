from app.services.BaseService import BaseService
from app.packages.api.models.Key import KeySchema
from app.packages.api.repositories.KeyRepo import KeyRepo
from app.packages.api.repositories.CollectionRepo import CollectionRepo
from app.packages.api.repositories.AccessCollectionRepo import AccessCollectionRepo

import time
import secrets

class ProjectService(BaseService):
    DEFAULT_EXP = int(2592000) # 30 days

    def __init__(self):
        self.repository = KeyRepo()

    def __gen_key(self):
        key = secrets.token_hex(32)
        created_at = int(time.time())

        return key, created_at

    #-----------------USER-PROJECT-----------------#
    def create_project(self, user_id, project_name):
        # CREATE A ADMIN KEY
        key, created_at = self.__gen_key()
        data = {
            'key': key,
            'project_name': project_name,
            'created_at': created_at,
            'expires_at': created_at + self.DEFAULT_EXP,
            'user_id': user_id
        }
        key_obj = self.repository.add_key(**data)

        #create default collection and add access permission
        collection_obj = CollectionRepo().add_collection(
            name='Base', 
            description='The default collection of your project. Undeletable.',
            admin_key_id=key_obj.id
        )
        AccessCollectionRepo().add_access(collection_obj.id, key_obj.id)

        project_info = KeySchema().dump(key_obj)
        project_info['id'] = key_obj.id
        return project_info

    def get_projects(self, user_id):
        project_df = self.repository.get_projects(user_id)
        return project_df.to_dict(orient='records')

    def rename_project(self, key_obj, new_project_name):
        self.repository.update_key(key_obj, project_name = new_project_name)

    #-----------------PROJECT-TEAM-MANAGEMENT-----------------#    
    def add_dev(self, admin_key_obj, dev_id, scopes):
        # CREATE A DEV KEY
        key, created_at = self.__gen_key()
        data = {
            'key': key,
            'project_name': admin_key_obj.project_name,
            'created_at': created_at,
            'expires_at': admin_key_obj.expires_at,
            'admin_key_id': admin_key_obj.id,
            'user_id': dev_id
        }

        dev_key_obj = self.repository.add_key(**data)
        AccessCollectionRepo().add_multiple_access(dev_key_obj.id, scopes)

        return dev_key_obj.id, dev_key_obj.key

    def get_project_team(self, admin_key_id):
        dev_info_df = self.repository.get_devs_info_df(admin_key_id)
        return dev_info_df.to_dict(orient='records')