from app.services.BaseService import BaseService
from app.packages.api.models.Key import KeySchema
from app.packages.api.models.Person import PersonSchema
from app.packages.api.models.Collection import CollectionSchema
from app.packages.api.repositories.KeyRepo import KeyRepo
from app.packages.api.repositories.PersonRepo import PersonRepo
from app.packages.api.repositories.CollectionRepo import CollectionRepo
from app.packages.api.repositories.AccessCollectionRepo import AccessCollectionRepo
from app.packages.embedding.services.PersonEmbeddingService import PersonEmbeddingService
from app.packages.image.services.PersonImageService import PersonImageService

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

        #create default collection
        collection_obj = CollectionRepo().add_collection(
            name='Base', 
            description='The default collection of your project. Undeletable.',
            admin_key_id=key_obj.id
        )
        self.repository.update_key(key, def_coll_id = collection_obj.id)
        res = KeySchema().dump(key_obj)

        return res

    def get_key_by_id(self, key_id):
        return self.repository.get_key_by_id(key_id)

    def check_key(self, key):
        key_obj = self.repository.check_key(key)

        if key_obj:
            is_admin = False if key_obj.admin_key_id else True
            return key_obj.id, is_admin

        return None, None

    def check_access(self, key_id, is_admin, collection_id):
        result = False

        if is_admin:
            collection = CollectionRepo().get_collection_by_id(collection_id)

            if collection.admin_key_id == key_id: 
                result = True 
        else:
            result = AccessCollectionRepo().check_access(key_id, collection_id)

        return result

    #----------------------PERSON----------------------#
    def _person_img_process(self, images, person_id):
        img_urls = []
        face_imgs = []
        embed_ids = []
        img_service = PersonImageService()
        embed_service = PersonEmbeddingService()

        for image in images:
            try:
                face_objs = img_service.extract_face(image, only_one=True)
                face_img = face_objs[0]['face']

                if len(face_imgs) != 1:
                    face_imgs.append(face_img)

                img_id, img_url = img_service.store(face_img, person_id)
                img_urls.append(img_url)

                if len(embed_ids) != 1:
                    embedding = embed_service.encode(face_img)
                    embed = embed_service.add_embedding(embedding, img_id)
                    embed_ids.append(embed.id)

            except Exception as e:
                print('Ignore invalid image storing: ' + str(e))
                continue

        return img_urls, embed_ids[0]

    def add_person(self, key_id, is_admin, **kwargs):
        schema = PersonSchema()
        images = kwargs.pop('images')

        if not images: raise Exception('No image found!')

        validated_data = schema.load(data=kwargs)
        person = None

        if self.check_access(key_id, is_admin, validated_data['collection_id']):
            raise Exception('Cannot add Person to this Collection!')

        person_repo = PersonRepo()
        person = person_repo.add_person(**validated_data)
        img_url_list, embed_id = self._person_img_process(images, person.id)
        person_repo.update_info(person, face_embed_id=embed_id)
        person_info = schema.dump(person)
        return person_info, img_url_list

    def get_person(self, key_id, is_admin, person_id):
        person_repo = PersonRepo()
        person_obj = person_repo.get_person(person_id)

        if not person_obj or not self.check_access(key_id, is_admin, person_obj.collection_id):
            return None

        info = PersonSchema().dump(person_obj)
        img_urls =  PersonImageService().get_link_by_person_id(person_id)
        info['images'] = img_urls

        return info

    def update_person(self, key_id, is_admin, person_id):
        #TODO: update person info, images
        pass

    def delete_person(self, key_id, is_admin, person_id):
        person_repo = PersonRepo()
        person_obj = person_repo.get_person(person_id)

        if not person_obj or not self.check_access(key_id, is_admin, person_obj.collection_id):
            return False
        else:
            person_repo.delete_person(person=person_obj)
            return True

    def get_persons(self, key_id, is_admin, **kwargs):        
        collection_ids, limit = kwargs['collection_ids'], kwargs['limit']        
        last_id = kwargs['last_id'] if 'last_id' in kwargs else 0

        for collection_id in collection_id:
            if not self.check_access(key_id, is_admin, collection_id):
                raise Exception('Collection is inaccessible!')

        persons = PersonRepo().get_persons(limit, last_id, collection_ids)
        schema = PersonSchema()
        img_service = PersonImageService()
        result = []

        for person in persons:
            info = schema.dumps(person)
            img_urls =  img_service.get_link_by_person_id(person.id)
            info['images'] = img_urls
            result.append(info)

        return result

    #----------------------COLLECTION----------------------#
    def add_collection(self, key_id, **kwargs):
        schema = CollectionSchema()
        validated_data = schema.load(data=kwargs)
        validated_data['admin_key_id'] = key_id
        collection_obj = CollectionRepo().add_collection(**validated_data)

        res = schema.dump(collection_obj)
        return res

    def get_collection(self, key_id, is_admin, collection_id):
        collection_repo = CollectionRepo()
        collection_obj = collection_repo.get_collection_by_id(collection_id)

        if not collection_obj or not self.check_access(key_id, is_admin, collection_id):
            return None

        info = CollectionSchema().dump(collection_obj)
        return info

    def get_collections(self, key_id, is_admin):
        collections = None

        if is_admin:
            collections = CollectionRepo().get_collections_by_key_id(key_id)
            
        else:
            collection_ids = AccessCollectionRepo().get_collection_ids(key_id)
            collections = CollectionRepo().get_collections(collection_ids)

        result =  CollectionSchema(many=True).dump(collections)
        return result
    
    def search(self, key_id, is_admin, **kwargs):
        collection_id = kwargs['collection_id'],
        image, score, limit = kwargs['image'], kwargs['score'], kwargs['limit']

        if not self.check_access(key_id, is_admin, collection_id):
            return None

        # Get persons by collection_id
        person_df = PersonRepo().get_df(collection_id)

        if person_df.empty:
            return None
        
        # Image Encoding:
        embed_service = PersonEmbeddingService()
        face_obj = PersonImageService.extract_face(image, only_one=True)
        embedding = embed_service.encode(face_obj[0]['face'])

        # Get embeddings df 
        embed_ids = person_df['face_embed_id'].tolist()
        embed_df = embed_service.repository.get_embeds_df(embed_ids)

        # Retrieval
        embed_ids_result = embed_service.retrieval(embed_df, embedding, limit, score)

        if embed_ids_result == None:
            return None
        
        result = person_df.loc[person_df['face_embed_id'].isin(embed_ids_result)]
        return result.to_json()