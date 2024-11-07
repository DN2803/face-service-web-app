from flask import Blueprint, request, jsonify
from flask_jwt_extended import verify_jwt_in_request, get_jwt_identity

from app.packages.user.services.UserService import UserService

face_auth_bp = Blueprint('face_auth', __name__)

@face_auth_bp.route('/api/register-face-id', methods=['POST'])
def register_face_id():
    try:
        verify_jwt_in_request(fresh=True)
        user_id = get_jwt_identity()
        data = request.json
        message = UserService().add_face_id(user_id, data['image'])

        return jsonify(message=message), 200
    except Exception as e:
        print(e)
        return jsonify(error=str(e)), 400

@face_auth_bp.route('/api/login-face-id', methods=['POST'])
def login_by_face_id():
    try:
        verify_jwt_in_request(refresh=True)
        user_id = get_jwt_identity()
        data = request.json
        is_valid = False

        if data['image']:
            is_valid = UserService().validate_face_login(user_id, data['image'])
        else:
            raise Exception("Invalid face login syntax")

        if is_valid:
            access_token = UserService.gen_token(user_id)
            response = jsonify(message="Login successfully.",
                    user_id=user_id,
                    access_token=access_token
                    )
            return response, 200
        else:
            return jsonify(error="Invalid credentials."), 401
    except Exception as e:
        print(e)
        return jsonify(error=str(e)), 400