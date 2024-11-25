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

                img_obj = img_service.store(face_img, person_id)
                result.append({'id': img_obj.id, 'url': img_obj.img_url})

                embedding = embed_service.encode(face_img)
                embed_service.add_embedding(embedding, img_obj.id, person_id)
            except Exception as e:
                print('Ignore invalid image storing: ' + str(e))
                continue

        return result

    def add_person(self, **kwargs):
        images = kwargs.pop('images')

        if len(images) == 0: raise Exception('No images found!')
        
        validated_data = self.schema.load(data=kwargs)
        person = self.repository.add_person(**validated_data)
        images = self._person_img_process(images, person.id)

        if len(images) == 0: 
            self.repository.delete_person(person)
            raise Exception('No faces found in the given images')

        person_info = self.schema.dump(person)
        person_info['images'] = images

        return person_info

    def update_person(self, person_id, **kwargs):
        old_collection_id = kwargs.pop('old_collection_id')
        new_images = kwargs.pop('new_images')
        removed_image_ids = kwargs.pop('removed_image_ids')
        validated_data = self.schema.load(data=kwargs)
        person_obj = self.repository.get_person(person_id)

        if not person_obj or person_obj.collection_id != old_collection_id:
            raise Exception('Person not found or inaccessible!')

        # Do the Image process first
        img_service = PersonImageService()
        old_images = img_service.get_image_objs_by_person_id(person_obj.id)
        validated_removed_image_ids = []

        for i in range(0, len(old_images)):
            if old_images[i].id in removed_image_ids:
                validated_removed_image_ids.append(i)

        images = self._person_img_process(new_images, person_id)

        if len(images) == 0 and len(old_images) == len(validated_removed_image_ids):
            raise Exception('Unable delete all images as no new images were added!')

        while len(validated_removed_image_ids) > 0:
            index = validated_removed_image_ids.pop()
            img_service.remove(old_images.pop(index))

        for rest_img in old_images:
            images.append({'id': rest_img.id, 'url': rest_img.img_url})

        # Then update person infomation
        person_obj = self.repository.update_info(person_obj, **validated_data)
        result = self.schema.dump(person_obj)
        result['images'] = images

        return result

    def delete_person(self, person_id, collection_id):
        person_obj = self.repository.get_person(person_id)

        if not person_obj or person_obj.collection_id != int(collection_id):
            raise Exception('Person not found or inaccessible!')

        #remove cloud images
        img_service = PersonImageService()
        image_objs = img_service.get_image_objs_by_person_id(person_id)

        for image_obj in image_objs:
            img_service.remove(image_obj)

        self.repository.delete_person(person=person_obj)

    #----------------------PERSONs----------------------#
    def get_persons(self, collection_ids, **kwargs):        
        limit =  kwargs['limit']        
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

    # def delete_persons(self, **kwargs):
    #     person_ids, collection_ids = kwargs['person_ids'], kwargs['collection_ids']
        
    #     for person_id in person_ids:
    #         person_obj = self.repository.get_person(person_id)

    #         if not person_obj or person_obj.collection_id not in collection_ids:
    #             print(f'Ignore deleting unfound/inaccessible person {person_obj.id}!')

    #         self.repository.delete_person(person=person_obj)

    #----------------------SEARCH----------------------#
    def search(self, **kwargs):
        collection_id = kwargs.pop('collection_id')
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
        matched_person_ids = embed_service.retrieval(embed_df, embedding, limit, score)

        if len(matched_person_ids) == 0:
            return []

        result = person_df.loc[person_df['id'].isin(matched_person_ids)]
        result= result.to_dict(orient='records')
        #TODO: return person images?
        return result