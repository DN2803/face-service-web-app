from flask import request, jsonify
import base64
import cv2
import numpy as np

from .auth_controller import AuthController
from ..services.face_service import FaceService
from app import app


class FaceController(AuthController):
    def __init__(self, service=None):
        if service is None:
            service = FaceService()  # Khởi tạo instance của FaceService
        super().__init__(service)
    def __json2image (self, image_data):
        if not image_data:  # Validate data
            return None
                # Tách phần prefix "data:image/jpeg;base64," (nếu có) để lấy dữ liệu base64
        header, encoded = image_data.split(',', 1)
        image_bytes = base64.b64decode(encoded)  # Giải mã dữ liệu base64
        # Chuyển đổi byte stream thành numpy array
        image_array = np.frombuffer(image_bytes, dtype=np.uint8)
        # Giải mã dữ liệu hình ảnh từ numpy array
        image = cv2.imdecode(image_array, cv2.IMREAD_COLOR)
        return image

    def login(self, data): 
        image_data = self.__json2image(data["image"])
        data["image"] = image_data
        return super().login(data)
    
    def isExistFaceID(self, data):
        is_not_empty = self.service.check_faceID(data=data)
        if is_not_empty:  
            return jsonify({"message": "FaceID status True"}), 200
        else:
            return jsonify({"error": "User not found"}), 404
        
    def removeFaceID(self, data):
        is_done = self.service.remove_faceID(data=data)
        if is_done:  
            return jsonify({"message": "Removed FaceID"}), 200
        else:
            return jsonify({"error": "User not found"}), 404
    def addFaceID(self, data): 
        image_data = self.__json2image(data["image"])
        data["image"] = image_data
        is_done = self.service.add_faceID(data=data)
        if is_done:  
            return jsonify({"message": "Removed FaceID"}), 200
        else:
            return jsonify({"error": "User not found"}), 404

face_controller = FaceController()
@app.route('/api/face_exist', methods= ['POST'])
def check_face_auth():
    data = request.json  
    if not data or 'email' not in data:
        return jsonify({"error": "Missing email"}), 400
    return face_controller.isExistFaceID(data=data) 

@app.route('/api/remove_face_auth', methods=['POST'])
def remove_face_auth():
    data = request.json  
    if not data or 'email' not in data:
        return jsonify({"error": "Missing email"}), 400
        
    updated_user = face_controller.removeFaceID(data)
        
    if updated_user:  
        return jsonify({"message": "FaceID status deleted successfully"}), 200
    else:
        return jsonify({"error": "User not found"}), 404

@app.route('/api/create_face_auth', methods=['POST'])
def create_new_auth_method():
    data = request.json
    
    if not data or 'image' not in  data or 'email' not in data:  # Validate data
        return jsonify({"error": "Missing required fields"}), 400
    return face_controller.addFaceID(data)
   