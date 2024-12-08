from app.services.BaseService import BaseService
from app.packages.api.models.Key import KeySchema
from app.packages.api.repositories.KeyRepo import KeyRepo
from app.packages.api.repositories.UserKeyRepo import UserKeyRepo
from app.packages.api.repositories.CollectionRepo import CollectionRepo
from app.packages.api.repositories.AccessCollectionRepo import AccessCollectionRepo
from app.packages.user.repositories.UserRepo import UserRepo

import time
import secrets

class ProjectService(BaseService):
    DEFAULT_EXP = int(2592000) # 30 days

    def __init__(self):
        self.repository = KeyRepo()
        self.schema = KeySchema()
        self.user_key_repo = UserKeyRepo()

    def __gen_key(self):
        key = secrets.token_hex(32)
        created_at = int(time.time())

        return key, created_at

    def __create_admin_key(self, project_name):
        key, created_at = self.__gen_key()
        data = {
            'key': key,
            'project_name': project_name,
            'created_at': created_at,
            'expires_at': created_at + self.DEFAULT_EXP
        }
        key_obj = self.repository.add_key(**data)

        #create default collection
        CollectionRepo().add_collection(
            name='Base', 
            description='The default collection of your project. Undeletable.',
            admin_key_id=key_obj.id
        )

        res = self.schema.dump(key_obj)
        res['id'] = key_obj.id
        return res

    #-----------------USER-PROJECT-----------------#
    def create_project(self, user_id, project_name):
        project_info = self.__create_admin_key(project_name)
        self.user_key_repo.add_ownership(user_id, project_info['id'])

        return project_info

    def get_projects(self, user_id):
        key_ids = self.user_key_repo.get_key_ids(user_id)
        objs = self.repository.get_key_by_ids(key_ids)
        #TODO: admin project info for dev-key
        return self.schema.dump(objs, many=True)

    def rename_project(self, key_obj, new_project_name):
        self.repository.update_key(key_obj, project_name = new_project_name)

    #-----------------PROJECT-TEAM-MANAGEMENT-----------------#    
    def __create_dev_key(self, admin_key_obj, scopes):
        key, created_at = self.__gen_key()
        data = {
            'key': key,
            'project_name': admin_key_obj.project_name,
            'created_at': created_at,
            'expires_at': admin_key_obj.expires_at,
            'admin_key_id': admin_key_obj.admin_key_id
        }

        dev_key_obj = self.repository.add_key(**data)
        AccessCollectionRepo().add_multiple_access(dev_key_obj.id, scopes)

        return dev_key_obj.id, dev_key_obj.key

    def add_dev(self, admin_key_obj, dev_id, scopes):
        dev_key_id, dev_key = self.__create_dev_key(admin_key_obj, scopes)
        self.user_key_repo.add_ownership(user_id=dev_id, key_id=dev_key_id)

        return dev_key

    def get_project_team(self, admin_key_id):
        dev_info_df = self.repository.get_devs_info_df(admin_key_id)
        return dev_info_df.to_dict(orient='records')