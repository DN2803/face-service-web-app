from app.packages.image.services.ImageService import ImageService
from app.packages.image.repositories.PersonImageRepo import PersonImageRepo

import uuid

class PersonImageService(ImageService):
    def __init__(self):
        self.repository = PersonImageRepo()
        self.IMG_DIR = 'Person'

    def store(self, face_np, person_id):
        """ Store the given face image and update database
        Returns:
            result: an object of PersonFaceImage
        """
        img_name = str(uuid.uuid4())
        img_url = self._upload_to_cloud(face_np, self.IMG_DIR, img_name)
        img_obj = self.repository.add_img(img_name=img_name,img_url=img_url, person_id=person_id)

        return img_obj
    
    def get_images_by_person_id(self, person_id):
        result = []
        img_objs = self.repository.get_by_person_id(person_id)
        
        for img_obj in img_objs:
            url = self.get_download_link(img_obj.img_url) #img_url is a path at the moment
            result.append({'id': img_obj.id, 'url': url})
        
        return result

    def get_image_objs_by_person_id(self, person_id) -> list:
        return self.repository.get_by_person_id(person_id)