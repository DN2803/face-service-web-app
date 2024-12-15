from flask import Blueprint, request, jsonify
from werkzeug.exceptions import Forbidden

from app.packages.api.services.KeyAuthService import KeyAuthService
from app.packages.api.services.PersonService import PersonService
from app.packages.api.services.CollectionService import CollectionService

api_bp = Blueprint('api', __name__, url_prefix='/api/project')

def _get_api_key():
    key = request.headers.get('X-API-Key')

    if not key: raise Exception('API key is required!')

    return key

@api_bp.route('/person', methods=['POST'])
def person():
    key = _get_api_key()
    data = request.json
    
    if 'collection_id' not in data:
        raise Exception('The request is missing the <collection_id> parameter!')

    KeyAuthService().validate(key, [data['collection_id']])

    if request.method == 'POST':
        person_info = PersonService().add_person(**data)
        response = jsonify(
            person_info=person_info,
            message="Added new Person successfully."
        )
        return response, 201

@api_bp.route('/person/<int:person_id>', methods=['PATCH', 'DELETE'])
def person_id(person_id):
    key = _get_api_key()
    data = request.json if request.method=='PATCH' else request.args
    
    if 'collection_id' not in data:
        raise Exception('The request is missing the <collection_id> parameter!')

    collection_ids = [data['collection_id']]

    if 'old_collection_id' in data and data['old_collection_id'] != data['collection_id']: 
        collection_ids.append(data['old_collection_id'])

    KeyAuthService().validate(key, collection_ids)

    person_service = PersonService()

    if request.method == 'PATCH':
        person = person_service.update_person(person_id, **data)
        return jsonify(message='Updated person successfully!', person=person), 200

    if request.method == 'DELETE':
        person_service.delete_person(person_id, data['collection_id'])
        return jsonify(message='Deleted person successfully!'), 200

@api_bp.route('/persons', methods=['GET'])
def persons():
    key = _get_api_key()
    data = request.args.copy() if request.method=='GET' else request.json

    if 'collection_ids' not in data:
        raise Exception('The request is missing the <collection_ids> parameter!')

    collection_ids = [int(id) for id in data['collection_ids'].split(',')]
    data.pop('collection_ids')
    KeyAuthService().validate(key, collection_ids)

    person_service = PersonService()
    if request.method == 'GET':
        if 'limit' not in data:
            raise Exception('The request is missing the <limit> parameter!')

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

@api_bp.route('/collection', methods=['POST'])
def collection():
    key = _get_api_key()
    key_obj, is_admin = KeyAuthService().check_key(key)

    collection_service = CollectionService()
    data = request.json

    if request.method == 'POST':
        if not is_admin:
            raise Forbidden('Cannot create a collection with Dev Key!')

        info = collection_service.add_collection(key_obj.id, **data)

        response = jsonify(
            collection_info=info,
            message="Added new Collection successfully."
        )
        return response, 201

@api_bp.route('/collection/<int:collection_id>', methods=['PATCH','DELETE'])
def collection_id(collection_id):
    key = _get_api_key()
    KeyAuthService().validate(key, [collection_id])

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

@api_bp.route('/collections', methods=['GET'])
def collections():
    key = _get_api_key()
    key_obj, _ = KeyAuthService().check_key(key)
    collections = CollectionService().get_collections(key_obj.id)

    response = jsonify(
        count=len(collections),
        collections=collections
    )
    return response, 200

@api_bp.route('/search', methods=['POST'])
def search():
    key = _get_api_key()
    data = request.json
    
    if 'collection_ids' not in data or len(data['collection_ids']) == 0:
        raise Exception('The request is missing the <collection_ids> parameter!')

    KeyAuthService().validate(key, data['collection_ids'])

    result = PersonService().search(**data)

    return jsonify(result=result), 200