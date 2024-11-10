from flask import Blueprint, jsonify, request
from flask_jwt_extended import verify_jwt_in_request, get_jwt_identity

from app.packages.user.services.UserService import UserService

user_bp = Blueprint('user', __name__, url_prefix='/api/user')

@user_bp.route('/register-face-id', methods=['POST'])
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

@user_bp.route('/my-info', methods=['POST'])
def get_info():
    try:
        verify_jwt_in_request(fresh=True)
        user_id = get_jwt_identity()
        
        info = UserService().get_base_info(user_id)
        return jsonify(info=info), 200
    
    except Exception as e:
        print(e)
        return jsonify(error=str(e)), 400

@user_bp.route('/my-projects', methods=['POST'])
def get_projects():
    try:
        verify_jwt_in_request(fresh=True)
        user_id = get_jwt_identity()
        
        projects = UserService().get_projects(user_id)
        return jsonify(projects=projects), 200

    except Exception as e:
        print(e)
        return jsonify(error=str(e)), 400