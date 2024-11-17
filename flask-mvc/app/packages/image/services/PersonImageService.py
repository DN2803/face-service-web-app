from app.packages.image.services.ImageService import ImageService
from app.packages.image.repositories.PersonImageRepo import PersonImageRepo

import uuid

class PersonImageService(ImageService):
    IMG_DIR = 'Person'

    def __init__(self):
        self.repository = PersonImageRepo()

    def store(self, face_np, person_id):
        """ Store the given face image and update database
        Returns:
            result: an object of PersonFaceImage
        """
        img_name = str(uuid.uuid4()) + '.jpg'
        img_path = f'{self.IMG_DIR}/{img_name}'
        self._upload_to_cloud(face_np, img_path)
        img_obj = self.repository.add_img(img_url=img_path, person_id=person_id)
        download_link = self.get_download_link(img_path)

        return img_obj.id, download_link