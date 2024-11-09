from app.packages.image.services.ImageService import ImageService
from app.packages.image.repositories.PersonImageRepo import PersonImageRepo

class PersonImageService(ImageService):
    def __init__(self):
        self.repository = PersonImageRepo()
