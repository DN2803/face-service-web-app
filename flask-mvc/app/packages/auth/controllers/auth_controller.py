from flask import request, jsonify
from app.packages.auth.services.auth_service import *
from ..services.auth_service import AuthService
from app.controllers.base_controller import BaseController

from app import app


class AuthController(BaseController):
    def __init__(self, service=AuthService()):
        super().__init__(service)

    def login(self, data):
        token = self.service.authenticate(data)
        if token:
            return jsonify({"message": "Login successful", "token": token}), 200
        else:
            return jsonify({"error": "Authentication failed"}), 401

    def isExistEmail(self, data):
        if self.service.isUserEmail(data):
            return jsonify({"message": "Email exists"}), 200
        else:
            return jsonify({"error": "Email does not exist"}), 404


# Initialize controllers with service instances
auth_controller = AuthController()

# Route to check if email exists
@app.route('/api/email_exist', methods=['POST'])
def isExistEmail():
    data = request.json  
    if not data or 'email' not in data:
        return jsonify({"error": "Missing email"}), 400
    return auth_controller.isExistEmail(data)  


# Route to handle login
@app.route('/api/login', methods=['POST'])
def login():
    data = request.json  # Fixed request.json()
    from .face_controller import face_controller
    from .password_controller import password_controller
    if data:
        if 'password' in data:
            return password_controller.login(data)
        elif 'image' in data:
            return face_controller.login(data)
    else:
        return jsonify({"error": "Missing authentication method"}), 400

