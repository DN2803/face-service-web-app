from flask import Blueprint, jsonify, send_from_directory
import os
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