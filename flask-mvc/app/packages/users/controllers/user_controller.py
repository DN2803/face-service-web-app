
from flask import request, jsonify
from ..services.user_service import UserService
from app.controllers.base_controller import BaseController
from app import app
class UserController(BaseController): 
    def __init__(self, service = UserService()): 
        super().__init__(service)

    def create(self, data):
        return super().create(data)
    

user_controller = UserController()

@app.route('/api/register', methods=['POST'])
def create_user():
    data = request.json
    if not data or 'email' not in data or 'password' not in data:  # Validate data
        return jsonify({"error": "Missing required fields"}), 400

    result = user_controller.create(data)
    return result
