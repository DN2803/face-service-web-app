from flask import Blueprint, request, jsonify, send_from_directory
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
import os

from app import app
from app.packages.image.services.ImageService import ImageService
from app.packages.image import IMAGE_DIR

image_bp = Blueprint('image', __name__)

@image_bp.route('/download/<path:filepath>')
def download_image(filepath):
    try:
        path = os.path.join(IMAGE_DIR, filepath)
        path = os.path.normpath(path)
        dir, filename = os.path.split(path)

        return send_from_directory(dir, filename)
    except Exception as e:
        return jsonify(error=str(e)), 404

__demo_limiter = Limiter(
    get_remote_address,
    app=app,
    default_limits=["200 per day", "50 per hour"]  # Đặt giới hạn mặc định
)

@image_bp.route('/api/demo/detection', methods=['POST'])
@__demo_limiter.limit("10 per minute")
def demo_dectection():
    try:
        data = request.json
        face_objs = ImageService.extract_face(data['image'])
        result = [face_obj['facial_area'] for face_obj in face_objs]

        return jsonify(result=result), 200
    except Exception as e:
        print(e)
        return jsonify(error=str(e)), 400

@image_bp.route('/api/demo/anti-spoofing', methods=['POST'])
@__demo_limiter.limit("10 per minute")
def demo_anti_spoofing():
    try:
        data = request.json
        face_objs = ImageService.extract_face(data['image'],anti_spoofing=True, only_one=True)
        face_obj = face_objs[0]
        result = {
            'is_real': face_obj['is_real'],
            'antispoof_score': face_obj['antispoof_score']   
        }

        return jsonify(result=result), 200
    except Exception as e:
        print(e)
        return jsonify(error=str(e)), 400

@image_bp.route('/api/demo/comparison', methods=['POST'])
@__demo_limiter.limit("10 per minute")
def comparison():
    try:
        data = request.json
        is_matched, score = ImageService.compare(data['image1'], data['image2'], threshold=0.66)
        result = {
            'is_matched': is_matched,
            'score': score   
        }

        return jsonify(result=result), 200
    except Exception as e:
        print(e)
        return jsonify(error=str(e)), 400