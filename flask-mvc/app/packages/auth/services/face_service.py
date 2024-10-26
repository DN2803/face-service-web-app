from facenet_pytorch import InceptionResnetV1, MTCNN
import numpy as np
from numpy.linalg import norm
import cv2
# Khởi tạo model FaceNet
model = InceptionResnetV1(pretrained='vggface2').eval()

# Sử dụng MTCNN để phát hiện và cắt khuôn mặt
mtcnn = MTCNN(keep_all=False, device='cpu')  # Giữ lại chỉ một khuôn mặt


import jwt
import os
from datetime import datetime, timedelta



from .auth_service import AuthService
from ..models.face_model import FaceModel

def compare(embedding1, embedding2, threshold=0.6):
    # Chuẩn hóa L2 các vector đặc trưng
    embedding1_norm = embedding1 / norm(embedding1)
    embedding2_norm = embedding2 / norm(embedding2)

    # Tính khoảng cách Euclid
    euclidean_distance = np.linalg.norm(embedding1_norm - embedding2_norm)
    # Quyết định nếu hai khuôn mặt có thể là cùng một người
    if euclidean_distance < threshold:
        return True
    else:
        return False
class FaceService(AuthService):
    def __init__(self, model = FaceModel()):
        super().__init__(model)


    
    def authenticate(self, data): 
        # Kiểm tra xem email có tồn tại không
        user = self.model.get_by_email(data["email"])
        if not user:
            raise Exception('Email không tồn tại')
        face = mtcnn(data["image"])

        if face is None:
            return None, None
        # Chuyển đổi khuôn mặt thành vector đặc trưng
        face_embedding = model(face.unsqueeze(0))  # Thêm chiều batch
        input_face_feature = face_embedding.squeeze(0).detach().numpy()
        if compare(input_face_feature, np.array(user['face_feature'])):
                # Tạo JWT token nếu tìm thấy người dùng
            token = jwt.encode({
                'email': user['email'],
                'exp': datetime.utcnow() + timedelta(hours=1)  # Thời gian hết hạn là 1 giờ
            }, os.getenv('JWT_SECRET_KEY'), algorithm="HS256")
            return user, token

        # Nếu không tìm thấy người dùng nào phù hợp
        return None, None
    
    def check_faceID(self, data):
        if (self.model.get_authen_method(data["email"])):
            return True
        else:
            return False
        
    def remove_faceID(self, data):
        if (self.model.remove_face_feature(data["email"])):
            return True
        else:
            return False

    def add_faceID(self, data):
        face = mtcnn(data["image"])
        storage_path = os.getenv('FACE_STORAGE_PATH', 'faces')

        if face is not None:
            # Convert the tensor face to a PIL image
            face_image = face.permute(1, 2, 0).mul(255).byte().numpy()  # Convert tensor to numpy array

            # Save the PIL image to a file (e.g., save as 'face_image.jpg')
            # Define the file path where the image will be saved
            image_path_save = f"face_{data['email']}.jpg"
            image_path = os.path.join(storage_path, image_path_save)
            
            # Ensure the directory exists
            os.makedirs(os.path.dirname(image_path), exist_ok=True)
            # Save the PIL image to the specified file path
            cv2.imwrite(image_path, face_image)
            # Chuyển đổi khuôn mặt thành vector đặc trưng
            face_embedding = model(face.unsqueeze(0))  # Thêm chiều batch
            feature = face_embedding.squeeze(0).detach().numpy().tolist()

            save_data = {
            "face_feature": feature,  # Face feature vector
            "face_image_path": image_path_save  # File path to the saved image
        }

            
            self.model.create_face_feature(data["email"], save_data)
            return True
        return False

    