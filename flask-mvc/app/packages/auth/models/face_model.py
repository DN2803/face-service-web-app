from app.config.Database import db

from .auth_model import AuthModel

class FaceModel(AuthModel): 
    def __init__(self, mongo=db):
        super().__init__(mongo=mongo)
    def get_authen_method(self, email):
        user = super().get_by_email(email)
        if user and "face_feature" in user: 
            return user["face_feature"]
        else:
            return None

    def remove_face_feature(self, email):
        result = self.collection.find_one_and_update(
            {"email": email},
            {"$unset": {"face_feature": 1,"face_image_path": 1}},  # Unset the Face_feature field
            return_document=True
        )
        print(result)
        return result
    def create_face_feature(self, email, save_data):
        user = self.collection.find_one({"email": email})
        if user:
            update_result = super().update({"email": email}, save_data)
            
            # Check if the update was successful
            if update_result.modified_count > 0:
                return {"message": "Face feature added successfully"}, 201
            else:
                return {"message": "No changes made to the user"}, 400
        else:
            return {"error": "User not found"}, 404
