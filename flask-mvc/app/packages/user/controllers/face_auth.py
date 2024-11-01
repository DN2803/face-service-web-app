from flask import Blueprint, request, jsonify
from app.packages.user.services.UserService import UserService
face_auth_bp = Blueprint('face_auth', __name__)

@face_auth_bp.route('/api/register-face-id', methods=['POST'])
def register_face_id(): 
    try:
        data = request.json
        message = UserService().add_face_id(data['email'], data['image'])

        return jsonify(message=message), 200
    except Exception as e:
        print(e)
        return jsonify({"error": str(e)}), 400

@face_auth_bp.route('/api/login-face-id', methods=['POST'])
def login_by_face_id():
    try:
        data = request.json
        is_valid = False

        if data['email'] and data['image']:
            is_valid = UserService().validate_face_login(data['email'], data['image'])
        else:
            return jsonify(error="Invalid face login syntax"), 400

        if is_valid:
            return jsonify(message="Login successful."), 200
        else:
            return jsonify(error="Invalid credentials."), 401
    except Exception as e:
        print(e)
        return jsonify(error=str(e)), 400