from flask import Blueprint, request, jsonify
from app.packages.user.services.AuthService import AuthService

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/api/register', methods=['POST'])
def register():
    try:
        data = request.json
        AuthService().register(**data)
        return jsonify({"message": "User registered successfully."}), 201
    except Exception as e:
        print(e)
        return jsonify({"error": str(e)}), 400

@auth_bp.route('/api/login', methods=['POST'])
def login():
    try:
        data = request.json
        is_valid, token = AuthService().validate_login(data['email'], data['password'])

        if is_valid:
            return jsonify(message="Login successful.", token=token), 200
        else:
            return jsonify({"error": "Invalid credentials."}), 401
    except Exception as e:
        print(e)
        return jsonify({"error": str(e)}), 400
    
@auth_bp.route('/api/email_exist', methods=['POST'])
def isExistEmail():
    data = request.json  
    if not data or 'email' not in data:
        return jsonify({"error": "Missing email"}), 400
    if AuthService().isExistEmail(data['email']) : 
        return jsonify({"message": "Email exists"}), 200
    else:
        return jsonify({"error": "Email does not exist"}), 404   