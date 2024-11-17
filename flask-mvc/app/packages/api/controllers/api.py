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
        key_id = key_service.check_key(key)

        if not key_id:
            return jsonify(error='Invalid API Key!'), 401

        data = request.json

        if request.method == 'POST':
            person_info = key_service.add_person(key_id, **data)
            response = jsonify(
                person_info=person_info,
                message="Added new Person successfully."
            )
            return response, 201

        if request.method == 'GET':
            person_info, img_urls = key_service.get_person(data['person_id'])
            response = jsonify(
                person_info=person_info,
                images=img_urls
            )
            return response, 200
        if request.method == 'PATCH':
            pass
        if request.method == 'DELETE':
            pass
    except Exception as e:
        print(e)
        return jsonify(error = str(e)), 400

@api_bp.route('/collection', methods=['POST','GET','PATCH','DELETE'])
@__key_limiter.limit('20 per minute')
def collection():
    try:
        key_service = KeyService()
        key = _get_api_key()
        key_id = key_service.check_key(key)

        if not key_id:
            return jsonify(error='Invalid API Key!'), 401

        data = request.json

        if request.method == 'POST':
            info = key_service.add_collection(key_id, **data)
            response = jsonify(
                collection_info=info,
                message="Added new Collection successfully."
            )
            return response, 201

        if request.method == 'GET':
            info = key_service.get_person(data['person_id'])
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
    