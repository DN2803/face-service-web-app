from flask import Blueprint, jsonify
from flask_jwt_extended import verify_jwt_in_request, get_jwt_identity

from app.packages.user.services.UserService import UserService

user_bp = Blueprint('user', __name__)

@user_bp.route('/api/user/my-info', methods=['POST'])
def get_info():
    try:
        verify_jwt_in_request(fresh=True)
        user_id = get_jwt_identity()
        
        info = UserService().get_base_info(user_id)
        return jsonify(info=info), 200
    
    except Exception as e:
        print(e)
        return jsonify(error=str(e)), 400

@user_bp.route('/api/user/my-projects', methods=['POST'])
def get_projects():
    try:
        verify_jwt_in_request(fresh=True)
        user_id = get_jwt_identity()
        
        projects = UserService().get_projects(user_id)
        return jsonify(projects=projects), 200

    except Exception as e:
        print(e)
        return jsonify(error=str(e)), 400

@user_bp.route('/api/user/refresh-token', methods=['POST'])
def refresh():
    try:
        verify_jwt_in_request(refresh=True)
        user_id = get_jwt_identity()
        new_refresh_token = UserService.gen_token(user_id, refresh=True)
        return jsonify(refresh_token=new_refresh_token), 200
    except Exception as e:
        print(e)
        return jsonify(error = str(e)), 400