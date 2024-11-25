from app.packages.image.repositories.ImageRepo import ImageRepo
from app.packages.image.models.PersonFaceImage import PersonFaceImage
from app.config.Database import db

class PersonImageRepo(ImageRepo):
    def __init__(self):
        super().__init__(PersonFaceImage, db.session)

    def get_by_person_id(self, person_id):
        return self._get_by('person_id', person_id, all=True)

    def get_images(self, person_id):
        df = self._get_dataframe(['img_name','person_id'],'person_id', person_id)
        return df.to_dict(orient='records')