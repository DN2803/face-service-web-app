from flask import Blueprint, request, jsonify
from app.packages.auth.services.AuthService import AuthService

auth_bp = Blueprint('auth', __name__)
auth_service = AuthService()

@auth_bp.route('/api/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')
        auth_service.register_user(username, password)
        return jsonify({"message": "User registered successfully."}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@auth_bp.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    if auth_service.validate_login(username, password):
        return jsonify({"message": "Login successful."})
        
    return jsonify({"message": "Invalid credentials."}), 401