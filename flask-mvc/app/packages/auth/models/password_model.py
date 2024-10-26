from app.config.Database import db
from .auth_model import AuthModel


class PasswordModel(AuthModel):
    def __init__(self, mongo=db):
        super().__init__(mongo)
    
    def get_authen_method(self, email):
        print (email)
        user = super().get_by_email(email)
        print (user)
        if user: 
            return user["password"]
        else:
            return None
    def create_new_password(self, email, save_data):
        user = self.collection.find_one({"email": email})
        if user:
            update_result = super().update({"email": email}, save_data)
            
            # Check if the update was successful
            if update_result.modified_count > 0:
                return {"message": "change password successfully"}, 201
            else:
                return {"message": "No changes made to the user"}, 400
        else:
            return {"error": "User not found"}, 404
