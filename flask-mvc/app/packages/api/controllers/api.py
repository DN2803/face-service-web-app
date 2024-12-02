from flask import Blueprint, request, jsonify
from flask_limiter import Limiter

from app import app
from app.packages.api.services.KeyService import KeyService
from app.packages.api.services.PersonService import PersonService
from app.packages.api.services.CollectionService import CollectionService

api_bp = Blueprint('api', __name__, url_prefix='/api/project')

def _get_api_key():
    key = request.headers.get('X-API-Key')
    return key if key else None

__key_limiter = Limiter(
    key_func=_get_api_key,
    app=app,
    default_limits=['200 per day']
)

@api_bp.route('/person', methods=['POST', 'PATCH', 'DELETE'])
@__key_limiter.limit('20 per minute')
def person():
    try:
        key = _get_api_key()        
        data = request.json
        
        if 'collection_id' not in data:
            raise Exception('The request lacks collection_id parameter!')

        validated = KeyService().validate(key, [data['collection_id']])

        if not validated:
            return jsonify(error='Invalid API Key or collection is inaccessible!'), 401

        if request.method == 'POST':
            person_info = PersonService().add_person(**data)
            response = jsonify(
                person_info=person_info,
                message="Added new Person successfully."
            )
            return response, 201
    except Exception as e:
        print(e)
        return jsonify(error = str(e)), 400

@api_bp.route('/person/<int:person_id>', methods=['PATCH', 'DELETE'])
@__key_limiter.limit('20 per minute')
def person_id(person_id):
    try:
        key = _get_api_key()        
        data = request.json if request.method=='PATCH' else request.args
        
        if 'collection_id' not in data:
            raise Exception('The request lacks collection_id parameter!')

        collection_ids = [data['collection_id']]

        if 'old_collection_id' in data: collection_ids.append(data['old_collection_id'])

        validated = KeyService().validate(key, collection_ids)

        if not validated:
            return jsonify(error='Invalid API Key or collection is inaccessible!'), 401

        person_service = PersonService()

        if request.method == 'PATCH':
            person = person_service.update_person(person_id, **data)
            return jsonify(message='Updated person successfully!', person=person), 200

        if request.method == 'DELETE':
            person_service.delete_person(person_id, data['collection_id'])
            return jsonify(message='Deleted person successfully!'), 200
    except Exception as e:
        print(e)
        return jsonify(error = str(e)), 400

@api_bp.route('/persons', methods=['GET'])
@__key_limiter.limit('20 per minute')
def persons():
    try:
        key = _get_api_key()
        data = request.args.copy() if request.method=='GET' else request.json

        if 'collection_ids' not in data:
            raise Exception('The request lacks collection ids!')

        collection_ids = [int(id) for id in data['collection_ids'].split(',')]
        data.pop('collection_ids')
        validated = KeyService().validate(key, collection_ids)

        if not validated:
            return jsonify(error='Invalid API Key or one or more collections is inaccessible!'), 401

        person_service = PersonService()
        if request.method == 'GET':
            if 'limit' not in data:
                raise Exception('The request lacks max number of result!')

            persons = person_service.get_persons(collection_ids, **data)

            response = jsonify(
                count=len(persons),
                persons=persons
            )
            return response, 200

        # if request.method == 'DELETE':
        #     if not data or 'person_ids' not in data:
        #         raise Exception('Not enough parameters!')

        #     if person_service.delete_persons(**data):
        #         return jsonify(message='Delete Successfully!'), 200
        #     else:
        #         raise Exception('Person not found or inaccessible!')
    except Exception as e:
        print(e)
        return jsonify(error=str(e)), 400

@api_bp.route('/collection', methods=['POST'])
@__key_limiter.limit('20 per minute')
def collection():
    try:
        key = _get_api_key()
        key_id, is_admin = KeyService().check_key(key)

        if not key_id:
            return jsonify(error='Invalid API Key!'), 401

        collection_service = CollectionService()
        data = request.json

        if request.method == 'POST':
            if not is_admin:
                raise Exception('Cannot create a collection with Dev Key!')

            info = collection_service.add_collection(key_id, **data)

            response = jsonify(
                collection_info=info,
                message="Added new Collection successfully."
            )
            return response, 201
    except Exception as e:
        print(e)
        return jsonify(error = str(e)), 400

@api_bp.route('/collection/<int:collection_id>', methods=['PATCH','DELETE'])
@__key_limiter.limit('20 per minute')
def collection_id(collection_id):
    try:
        key = _get_api_key()
        validated = KeyService().validate(key, [collection_id])

        if not validated:
            return jsonify(error='Invalid API Key or collection is inaccessible!'), 401

        collection_service = CollectionService()

        if request.method == 'PATCH':
            data = request.json
            collection = collection_service.update_collection(
                collection_id,
                **data
            )
            return jsonify(message='Updated collection successfully!', collection=collection), 200

        if request.method == 'DELETE':
            collection_service.delete_collection(collection_id)
            return jsonify(message='Deleted collection successfully!'), 200
    except Exception as e:
        print(e)
        return jsonify(error = str(e)), 400

@api_bp.route('/collections', methods=['GET'])
@__key_limiter.limit('20 per minute')
def collections():
    try:
        key = _get_api_key()
        key_id, is_admin = KeyService().check_key(key)

        if not key_id:
            return jsonify(error='Invalid API Key!'), 401

        collections = CollectionService().get_collections(key_id, is_admin)

        response = jsonify(
            count=len(collections),
            collections=collections
        )
        return response, 200
    except Exception as e:
        print(e)
        return jsonify(error = str(e)), 400

@api_bp.route('/search', methods=['POST'])
@__key_limiter.limit('20 per minute')
def search():
    try:
        key = _get_api_key()
        data = request.json
        
        if 'collection_ids' not in data or len(data['collection_ids']) == 0:
            raise Exception('The request lacks collection_ids parameter!')

        validated = KeyService().validate(key, data['collection_ids'])

        if not validated:
            return jsonify(error='Invalid API Key or one or more collections is inaccessible!'), 401

        result = PersonService().search(**data)

        return jsonify(result=result), 200
    except Exception as e:
        print(e)
        return jsonify(error = str(e)), 400