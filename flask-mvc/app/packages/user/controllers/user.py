from flask import Blueprint, jsonify, request
from flask_jwt_extended import verify_jwt_in_request, get_jwt_identity

from app.packages.user.services.UserService import UserService
from app.packages.api.services.ProjectService import ProjectService
from app.packages.api.services.KeyAuthService import KeyAuthService

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

@user_bp.route('/my-info', methods=['GET'])
def get_info():
    try:
        verify_jwt_in_request(fresh=True)
        user_id = get_jwt_identity()
        
        info = UserService().get_base_info(user_id)
        return jsonify(info=info), 200
    
    except Exception as e:
        print(e)
        return jsonify(error=str(e)), 400

@user_bp.route('/my-project', methods=['GET', 'POST', 'PATCH'])
def user_project():
    try:
        verify_jwt_in_request(fresh=True)
        user_id = get_jwt_identity()

        if request.method == 'GET':
            projects = ProjectService().get_projects(user_id)
            return jsonify(projects=projects), 200

        data = request.json

        if request.method == 'POST':
            info = ProjectService().create_project(user_id, data['project_name'])
            response = jsonify(
                info=info,
                message='Created new Project successfully!'
            )
            return response, 201
        
        if request.method == 'PATCH':
            key = request.headers.get('X-API-Key')

            if 'new_project_name' not in data:
                raise Exception('The request lacks new_project_name parameter.')

            key_obj, _ = KeyAuthService().check_key(key)

            if not key_obj: 
                return jsonify(error='Invalid API Key!'), 401

            ProjectService().rename_project(key_obj, data['new_project_name'])

            return jsonify(message="The project's name has been changed successfully!"), 200
    except Exception as e:
        print(e)
        return jsonify(error=str(e)), 400

from flask_jwt_extended import decode_token

@user_bp.route('/my-project/team', methods=['GET', 'POST', 'PATCH', 'DELETE'])
def team_management():
    try:
        verify_jwt_in_request(fresh=True)
        user_id = get_jwt_identity()

        key = request.headers.get('X-API-Key')
        key_auth_service = KeyAuthService()
        admin_key_obj, is_admin = key_auth_service.check_key(key)

        if not admin_key_obj: raise Exception('Invalid API Key!')

        if not is_admin: raise Exception('Given API Key is not an admin key!')

        if request.method == 'GET':
            team = ProjectService().get_project_team(admin_key_obj.id)
            return jsonify(team=team), 200

        if request.method == 'DELETE':
            #TODO: delete func
            pass

        data = request.json

        if not key_auth_service.check_access(admin_key_obj.id, True, data['scopes']):
            raise Exception('Given collections is inaccessible!')

        if request.method == 'POST':
            payload = decode_token(data['dev_token'])
            dev_id = payload['user_id']

            dev_key = ProjectService().add_dev(admin_key_obj, dev_id, data['scopes'])
            response = jsonify(
                dev_key=dev_key,
                message='Added new developer to the project successfully!'
            )
            return response, 201

        # if request.method == 'PATCH':
        #     #old and new scope
        #     key = request.headers.get('X-API-Key')
            
        #     if 'new_project_name' not in data:
        #         raise Exception('The request lacks new_project_name parameter.')

        #     ProjectService().rename_project(user_id, key, data['new_project_name'])
        #     return jsonify(message="The project's name has been changed successfully!"), 200
    except Exception as e:
        print(e)
        return jsonify(error=str(e)), 400