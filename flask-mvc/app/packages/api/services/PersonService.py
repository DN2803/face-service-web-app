from app.services.BaseService import BaseService
from app.packages.api.models.Person import PersonSchema
from app.packages.api.repositories.PersonRepo import PersonRepo
from app.packages.embedding.services.PersonEmbeddingService import PersonEmbeddingService
from app.packages.image.services.PersonImageService import PersonImageService

class PersonService(BaseService):
    def __init__(self):
        self.repository = PersonRepo()
        self.schema = PersonSchema()

    #----------------------PERSON----------------------#
    def _person_img_process(self, images, person_id):
        result = []
        img_service = PersonImageService()
        embed_service = PersonEmbeddingService()

        for image in images:
            try:
                face_objs = img_service.extract_face(image, only_one=True)
                face_img = face_objs[0]['face']

                img_id, img_url = img_service.store(face_img, person_id)
                result.append({'id': img_id, 'url': img_url})

                embedding = embed_service.encode(face_img)
                embed_service.add_embedding(embedding, img_id, person_id)
            except Exception as e:
                print('Ignore invalid image storing: ' + str(e))
                continue

        return result

    def add_person(self, **kwargs):
        images = kwargs.pop('images')

        if len(images) == 0: raise Exception('No images found!')

        images = self._person_img_process(images, person.id)

        if len(images) == 0: raise Exception('No faces found in the given images')

        validated_data = self.schema.load(data=kwargs)
        person = self.repository.add_person(**validated_data)
        person_info = self.schema.dump(person)
        person_info['images'] = images

        return person_info

    def update_person(self, person_id, **kwargs):
        old_collection_id = kwargs['old_collection_id']
        new_images = kwargs.pop('new_images')
        removed_image_ids = kwargs.pop('removed_image_ids')
        validated_data = self.schema.load(data=kwargs)
        person_obj = self.repository.get_person(person_id)

        if not person_obj or person_obj.collection_id != old_collection_id:
            raise Exception('Person not found or inaccessible!')

        # Do the Image process first
        img_service = PersonImageService()
        old_images = img_service.get_image_objs_by_person_id(person_obj.id)
        removed_image_list = []

        for old_image in old_images:
            if old_image.id in removed_image_ids:
                removed_image_list.append(old_image)

        images = self._person_img_process(new_images, person_id)

        if len(images) == 0 and len(old_images) == len(removed_image_list):
            raise Exception('Unable delete all images as no new images were added!')

        for i in range(0, len(removed_image_list)):
            img_service.remove(removed_image_list.pop(i))

        for rest_img in removed_image_list:
            images.append({'id': rest_img.id, 'url': rest_img.img_url})

        # Then update person infomation
        person_obj = self.repository.update_info(person_obj, **validated_data)
        result = self.schema.dump(person_obj)
        result['images'] = images

        return result

    def delete_person(self, person_id, collection_id):
        person_obj = self.repository.get_person(person_id)

        if not person_obj or person_obj.collection_id != collection_id:
            raise Exception('Person not found or inaccessible!')

        self.repository.delete_person(person=person_obj)
    
    #----------------------PERSONs----------------------#
    def get_persons(self, **kwargs):        
        collection_ids, limit = kwargs['collection_ids'], kwargs['limit']        
        last_id = kwargs['last_id'] if 'last_id' in kwargs else 0

        persons = self.repository.get_persons(limit, last_id, collection_ids)
        img_service = PersonImageService()
        result = []

        for person in persons:
            info = self.schema.dump(person)
            images =  img_service.get_images_by_person_id(person.id)
            info['images'] = images
            result.append(info)

        return result
    
    def delete_persons(self, **kwargs):
        person_ids, collection_ids = kwargs['person_ids'], kwargs['collection_ids']
        
        for person_id in person_ids:
            person_obj = self.repository.get_person(person_id)

            if not person_obj or person_obj.collection_id not in collection_ids:
                print(f'Ignore deleting unfound/inaccessible person {person_obj.id}!')

            self.repository.delete_person(person=person_obj)
    
    #----------------------SEARCH----------------------#
    
    def search(self, **kwargs):
        collection_id = kwargs['collection_id'],
        image, score, limit = kwargs['image'], kwargs['score'], kwargs['limit']

        # Get persons by collection_id
        person_df = PersonRepo().get_df(collection_id)

        if person_df.empty: return []
        
        # Image Encoding:
        embed_service = PersonEmbeddingService()
        face_obj = PersonImageService.extract_face(image, only_one=True)
        embedding = embed_service.encode(face_obj[0]['face'])

        # Get embeddings df by person_ids
        person_ids = person_df['id'].tolist()
        embed_df = embed_service.repository.get_embeds_df(person_ids)

        # Retrieval
        embed_ids_result = embed_service.retrieval(embed_df, embedding, limit, score)

        if embed_ids_result == None:
            return None
        
        result = person_df.loc[person_df['face_embed_id'].isin(embed_ids_result)]
        return result.to_json()