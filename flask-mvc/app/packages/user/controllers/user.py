from flask import Blueprint, jsonify, request
from flask_jwt_extended import verify_jwt_in_request, get_jwt_identity

from app.packages.user.services.UserService import UserService
from app.packages.api.services.ProjectService import ProjectService
from app.packages.api.services.KeyAuthService import KeyAuthService

user_bp = Blueprint('user', __name__, url_prefix='/api/user')

@user_bp.route('/register-face-id', methods=['POST'])
def register_face_id():
    try:
        verify_jwt_in_request(fresh=True, locations='cookies')
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
        verify_jwt_in_request(fresh=True, locations='cookies')
        user_id = get_jwt_identity()
        
        info = UserService().get_base_info(user_id)
        return jsonify(info=info), 200
    
    except Exception as e:
        print(e)
        return jsonify(error=str(e)), 400

@user_bp.route('/my-project', methods=['GET', 'POST', 'PATCH'])
def user_project():
    try:
        verify_jwt_in_request(fresh=True, locations='cookies')
        user_id = get_jwt_identity()

        project_service = ProjectService()

        if request.method == 'GET':
            projects = project_service.get_projects(user_id)
            return jsonify(projects=projects), 200

        data = request.json

        if request.method == 'POST':
            info = project_service.create_project(user_id, data['project_name'])
            response = jsonify(
                info=info,
                message='Created new Project successfully!'
            )
            return response, 201

        if request.method == 'PATCH':
            key = request.headers.get('X-API-Key')

            if 'new_project_name' not in data:
                raise Exception('The request lacks new_project_name parameter.')

            key_obj, _ = KeyAuthService().check_key(key, check_rate_limit=False)
            project_service.rename_project(key_obj, data['new_project_name'])

            return jsonify(message="The project's name has been changed successfully!"), 200
    except Exception as e:
        print(e)
        return jsonify(error=str(e)), 400

@user_bp.route('/my-project/team', methods=['GET', 'POST', 'PATCH', 'DELETE'])
def team_management():
    try:
        verify_jwt_in_request(fresh=True, locations='cookies')

        key = request.headers.get('X-API-Key')
        key_auth_service = KeyAuthService()
        admin_key_obj, is_admin = key_auth_service.check_key(key, check_rate_limit=False)

        if not is_admin: raise Exception('Given API Key is not an admin key!')

        project_service = ProjectService()

        if request.method == 'GET':
            team = project_service.get_project_team(admin_key_obj.id)
            return jsonify(team=team), 200

        if request.method == 'DELETE':
            project_service.delete_dev(admin_key_obj.id, request.args['dev_key'])

        data = request.json

        if request.method == 'POST':
            verify_jwt_in_request(refresh=True, locations='json')
            dev_id = get_jwt_identity()
            scope = data['scope']

            if len(scope) == 0: raise Exception('A scope must include at least one collection id!')

            if not key_auth_service.check_access(admin_key_obj.id, scope):
                raise Exception('Given collection ids in "scope" is inaccessible!')

            dev_key = project_service.add_dev(admin_key_obj, dev_id, scope)
            response = jsonify(
                dev_key=dev_key,
                message='Added new developer to the project successfully!'
            )
            return response, 201

        if request.method == 'PATCH':
            collection_ids = data['scope']['new_col_ids'] + data['scope']['removed_col_ids']

            if not key_auth_service.check_access(admin_key_obj.id, collection_ids):
                raise Exception('Given collection ids in "scope" is inaccessible!')

            new_scope = project_service.update_dev_scope(
                admin_key_id = admin_key_obj.id, 
                dev_key = data['dev_key'],
                new_ids = data['scope']['new_col_ids'],
                removed_ids = data['scope']['removed_col_ids']
            )
            response = jsonify(
                new_scope=new_scope,
                message="The developer's scope has been changed successfully"
            )
            return response, 200
    except Exception as e:
        print(e)
        return jsonify(error=str(e)), 400