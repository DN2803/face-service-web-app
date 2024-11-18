from flask import Blueprint, request, jsonify
from flask_limiter import Limiter

from app import app
from app.packages.api.services.KeyService import KeyService

api_bp = Blueprint('api', __name__, url_prefix='/api/project')

def _get_api_key():
    key = request.headers.get('X-API-Key')
    return key if key else None

__key_limiter = Limiter(
    key_func=_get_api_key,
    app=app,
    default_limits=['200 per day']
)

@api_bp.route('/person', methods=['POST','GET','PATCH','DELETE'])
@__key_limiter.limit('20 per minute')
def person():
    try:
        key_service = KeyService()
        key = _get_api_key()
        key_id, is_admin = key_service.check_key(key)

        if not key_id:
            return jsonify(error='Invalid API Key!'), 401

        data = request.json

        if request.method == 'POST':
            person_info = key_service.add_person(key_id, is_admin, **data)
            response = jsonify(
                person_info=person_info,
                message="Added new Person successfully."
            )
            return response, 201

        if request.method == 'GET':
            person_info = key_service.get_person(key_id, is_admin, data['person_id'])
            
            if not person_info:
                raise Exception('Person not found or inaccessible!')

            response = jsonify(
                person_info=person_info
            )
            return response, 200
        
        if request.method == 'PATCH':
            if key_service.update_person(key_id, is_admin, data['person_id']):
                return jsonify(message='Update Successfully!'), 200
            else:
                raise Exception('Person not found or inaccessible!')
            
        if request.method == 'DELETE':
            if key_service.delete_person(key_id, is_admin, data['person_id']):
                return jsonify(message='Delete Successfully!'), 200
            else:
                raise Exception('Person not found or inaccessible!')

    except Exception as e:
        print(e)
        return jsonify(error = str(e)), 400

@api_bp.route('/persons', methods=['GET','DELETE'])
@__key_limiter.limit('20 per minute')
def persons():
    try:
        key_service = KeyService()
        key = _get_api_key()
        key_id, is_admin = key_service.check_key(key)

        if not key_id:
            return jsonify(error='Invalid API Key!'), 401

        data = request.json

        if request.method == 'GET':
            if 'limit' or 'collection_ids' not in data:
                raise Exception('Not enough parameters!')
            
            persons = key_service.get_persons(key_id, is_admin, **data)

            response = jsonify(
                count=len(persons),
                persons=persons
            )
            return response, 200

        if request.method == 'DELETE':
            if key_service.delete_person(key_id, is_admin, data['person_id']):
                return jsonify(message='Delete Successfully!'), 200
            else:
                raise Exception('Person not found or inaccessible!')

    except Exception as e:
        print(e)
        return jsonify(error = str(e)), 400

@api_bp.route('/collection', methods=['POST','GET','PATCH','DELETE'])
@__key_limiter.limit('20 per minute')
def collection():
    try:
        key_service = KeyService()
        key = _get_api_key()
        key_id, is_admin = key_service.check_key(key)

        if not key_id:
            return jsonify(error='Invalid API Key!'), 401

        data = request.json

        if request.method == 'POST':
            if not is_admin:
                raise Exception('Cannot create a collection with Dev Key!')

            info = key_service.add_collection(key_id, **data)

            response = jsonify(
                collection_info=info,
                message="Added new Collection successfully."
            )
            return response, 201

        if request.method == 'GET':
            info = key_service.get_collection(key_id, is_admin, data['person_id'])
            
            if not info: 
                raise Exception('Collection not found or inaccessible!')
            
            response = jsonify(
                collection_info=info
            )
            return response, 200
        
        if request.method == 'PATCH':
            pass

        if request.method == 'DELETE':
            pass
    except Exception as e:
        print(e)
        return jsonify(error = str(e)), 400

@api_bp.route('/collections', methods=['GET'])
@__key_limiter.limit('20 per minute')
def collections():
    try:
        key_service = KeyService()
        key = _get_api_key()
        key_id, is_admin = key_service.check_key(key)

        if not key_id:
            return jsonify(error='Invalid API Key!'), 401

        if request.method == 'GET':
            collections = key_service.get_collections(key_id, is_admin)

            response = jsonify(
                count=len(collections),
                collections=collections
            )
            return response, 200

    except Exception as e:
        print(e)
        return jsonify(error = str(e)), 400