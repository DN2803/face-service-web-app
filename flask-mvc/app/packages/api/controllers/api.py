# from flask import Blueprint, request, jsonify
# from app.packages.api.services.KeyService import KeyService

# api_bp = Blueprint('api', __name__, url_prefix='/api/project')

# @api_bp.route('/add/person', methods=['POST'])
# def add_person():
#     try:
#         data = request.json
#         user_id = AuthService().register(**data)
#         print(f'User {user_id} registered sucessfully')
#         return jsonify(message="User registered successfully."), 201
#     except Exception as e:
#         print(e)
#         return jsonify(error = str(e)), 400

# @api_bp.route('/add/collection', methods=['POST'])
# def add_collection():
#     try:
#         data = request.json
#         key, exp = UserService().create_project(user_id, data['project_name'])

#         return jsonify(key=key, exp=exp), 201

#     except Exception as e:
#         print(e)
#         return jsonify(error=str(e)), 400
    