from flask import Blueprint, request, jsonify
from app.packages.user.services.AuthService import AuthService

face_auth_bp = Blueprint('face_auth', __name__)

@face_auth_bp.route('/api/register-face-id', methods=['POST'])
def register_face_id(): 
    """
    add face id for exist user
    """
    try:
        data = request.json
        AuthService().register(**data)
        return jsonify({"message": "User registered successfully."}), 201
    except Exception as e:
        print(e)
        return jsonify({"error": str(e)}), 400

@face_auth_bp.route('/api/login', methods=['POST'])
def login_by_face_id():
    try:
        data = request.json
        is_valid, token = AuthService().validate_login(data['email'], data['password'])

        if is_valid:
            return jsonify(message="Login successful.", token=token), 200
        else:
            return jsonify({"error": "Invalid credentials."}), 401
    except Exception as e:
        print(e)
        return jsonify({"error": str(e)}), 400