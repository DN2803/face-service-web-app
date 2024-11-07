from app.packages.image.services.ImageService import ImageService
from app.packages.image.repositories.PersonImageRepo import PersonImageRepo
from app.packages.image import IMAGE_DIR, SOURCE_IMG_DIR

import os

__USER_IMG_DIR = os.path.join(IMAGE_DIR, 'User')
os.makedirs(__USER_IMG_DIR, exist_ok=True)

class PersonImageService(ImageService):
    def __init__(self):
        self.repository = PersonImageRepo()
