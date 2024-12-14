from flask import Blueprint, request, jsonify

from app.packages.api.services.KeyAuthService import KeyAuthService
from app.packages.image.services import FaceService

api_func_bp = Blueprint('api_func', __name__, url_prefix='/api/function')

@api_func_bp.before_request
def validate_key():
    key = request.headers.get('X-API-Key')

    if not key: raise Exception('API key is required!')

    KeyAuthService.check_key(key)

@api_func_bp.route('/detection', methods=['POST'])
def api_dectection():
    data = request.json

    if 'image' not in data:
        raise Exception('The request is missing the <image> parameter!')

    face_objs = FaceService.extract_faces(data['image'])
    result = [face_obj['facial_area'] for face_obj in face_objs]

    return jsonify(result=result), 200

@api_func_bp.route('/anti-spoofing', methods=['POST'])
def api_anti_spoofing():
    data = request.json

    if 'image' not in data:
        raise Exception('The request is missing the <image> parameter!')

    face_objs = FaceService.extract_faces(
        data['image'],
        anti_spoofing=True,
        only_one=True
    )
    result = {
        'is_real': face_objs[0]['is_real'],
        'antispoof_score': face_objs[0]['antispoof_score']   
    }

    return jsonify(result=result), 200

@api_func_bp.route('/comparison', methods=['POST'])
def api_comparison():
    data = request.json
    if 'image1' not in data or 'image2' not in data :
        raise Exception('The request lacks sufficient parameters!')
    
    is_matched, score = FaceService.verify(
        data['image1'],
        data['image2'],
        threshold=0.66
    )
    result = {
        'is_matched': is_matched,
        'score': score   
    }

    return jsonify(result=result), 200