from flask import request, jsonify
from .auth_controller import AuthController
from ..services.password_service import PasswordService
from ..services.OTP import OTP
from app import app
class PasswordController(AuthController):
    def __init__(self, service = PasswordService()):
        super().__init__(service)

    def resetPassword(self, data):
        is_done = self.service.resetPassword(data)
        if is_done:  
            return jsonify({"message": "Reseted password"}), 200
        else:
            return jsonify({"error": "User not found"}), 404
        
    
password_controller = PasswordController()

@app.route('/api/send_otp', methods=['POST'])
def send_otp():
    data = request.json  
    if not data or 'email' not in data:
        return jsonify({"error": "Missing email"}), 400
    if not password_controller.service.isUserEmail(data):
        return jsonify({"error": "Email does not exist"}), 404
    else:
        otp = OTP(receiver_email=data['email'])
        if otp.send_otp_email(): 
            return jsonify({"message": "OTP sent to user's email!"})
        else:
            return jsonify({"error": "Could n't send to user's email!"})

@app.route('/api/verify_otp', methods=['POST'])
def verify_otp():
    data = request.json  
    if not data or 'email' not in data or 'otp' not in data:
        return jsonify({"error": "Missing email"}), 400
    if not password_controller.service.isUserEmail(data):
        return jsonify({"error": "Email does not exist"}), 404
    else:
        otp = OTP(receiver_email=data['email'])
        if otp.verify_otp(data['email'], data['otp']): 
            return jsonify({"message": "OTP ok"}), 200
        else:
            return jsonify({"error": "OTP is wrong"}), 400
@app.route('/api/reset_password', methods=['POST'])
def reset_password():
    data = request.json  
    print(data)
    if not data or 'email' not in data or 'password' not in data:
        return jsonify({"error": "Missing email or password"}), 400
    if not password_controller.service.isUserEmail(data):
        return jsonify({"error": "Email does not exist"}), 404
    return password_controller.resetPassword(data)