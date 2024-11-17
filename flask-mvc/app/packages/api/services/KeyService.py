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
        
        res = KeySchema().dump(key_obj)
        return res

    def get_key_by_id(self, key_id):
        return self.repository.get_key_by_id(key_id)

    def check_key(self, key):
        return self.repository.check_key(key)

    #----------------------PERSON----------------------#
    def _person_img_process(self, images, person_id):
        face_img_ids = []
        face_imgs = []
        img_service = PersonImageService()
        embed_service = PersonEmbeddingService()

        for image in images:
            try:
                face_objs = img_service.extract_face(image, only_one=True)
                face_img = face_objs[0]['face']

                if len(face_imgs) != 1:
                    face_imgs.append(face_img)
                
                img_obj = img_service.store(face_img, person_id)
                face_img_ids.append(img_obj.id)
                
            except Exception as e:
                print('Ignore invalid image storing: ' + str(e))
                continue

        embedding = embed_service.encode(face_img[0])
        embed = embed_service.add_embedding(embedding, img_obj.id)

        return face_img_ids, embed.id

    def add_person(self, key_id, **kwargs):
        schema = PersonSchema()
        images = kwargs.pop('images')
        print(images)
        validated_data = schema.load(data=kwargs)
        person = None

        # link to collection
        if 'collection_id' in validated_data:
            key_obj = AccessCollectionRepo().get_key(validated_data['collection_id'])

            if not key_obj or key_obj.id != key_id:
                raise Exception('Cannot add Person to this Collection!')
        else:
            collection_obj = CollectionRepo().add_collection(name='.', description='.')
            AccessCollectionRepo().link(collection_obj.id, key_id)
            validated_data['collection_id'] = collection_obj.id

        person_repo = PersonRepo()
        person = person_repo.add_person(**validated_data)
        img_id_list, embed_id = self._person_img_process(images, person.id)
        person_repo.update_info(person, avt_id = img_id_list[0], face_embed_id=embed_id)
        person_info = schema.dump(person)
        return person_info, img_id_list

    def add_collection(self, key_id, **kwargs):
        schema = CollectionSchema()
        validated_data = schema.load(data=kwargs)

        collection_obj = CollectionRepo().add_collection(**validated_data)
        AccessCollectionRepo().link(collection_obj.id, key_id)

        res = schema.dump(collection_obj)
        return res
