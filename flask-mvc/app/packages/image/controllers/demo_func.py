from flask import Blueprint, request, jsonify
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address

from app import app
from app.packages.image.services import FaceService

demo_bp = Blueprint('demo', __name__)

__demo_limiter = Limiter(
    get_remote_address,
    app=app,
    default_limits=["200 per day", "50 per hour"]  # Đặt giới hạn mặc định
)

@demo_bp.route('/api/demo/detection', methods=['POST'])
@__demo_limiter.limit("10 per minute")
def dectection():
    data = request.json

    if 'image' not in data:
        raise Exception('The request is missing the <image> parameter!')

    face_objs = FaceService.extract_faces(data['image'])
    result = [face_obj['facial_area'] for face_obj in face_objs]

    return jsonify(result=result), 200

@demo_bp.route('/api/demo/anti-spoofing', methods=['POST'])
@__demo_limiter.limit("10 per minute")
def anti_spoofing():
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

@demo_bp.route('/api/demo/comparison', methods=['POST'])
@__demo_limiter.limit("10 per minute")
def comparison():
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