from flask import Blueprint, request, jsonify
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address

from app import app
from app.packages.image.services import FaceService

image_bp = Blueprint('image', __name__)

__demo_limiter = Limiter(
    get_remote_address,
    app=app,
    default_limits=["200 per day", "50 per hour"]  # Đặt giới hạn mặc định
)

@image_bp.route('/api/function/detection', methods=['POST'])
@__demo_limiter.limit("10 per minute")
def dectection():
    try:
        data = request.json
        face_objs = FaceService.extract_faces(data['image'])
        result = [face_obj['facial_area'] for face_obj in face_objs]

        return jsonify(result=result), 200
    except Exception as e:
        print(e)
        return jsonify(error=str(e)), 400

@image_bp.route('/api/function/anti-spoofing', methods=['POST'])
@__demo_limiter.limit("10 per minute")
def anti_spoofing():
    try:
        data = request.json
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
    except Exception as e:
        print(e)
        return jsonify(error=str(e)), 400

@image_bp.route('/api/function/comparison', methods=['POST'])
@__demo_limiter.limit("10 per minute")
def comparison():
    try:
        data = request.json
        is_matched, score = FaceService.verify(
            data['image1'],
            data['image2'],
            data['threshold']
        )
        result = {
            'is_matched': is_matched,
            'score': score   
        }

        return jsonify(result=result), 200
    except Exception as e:
        print(e)
        return jsonify(error=str(e)), 400