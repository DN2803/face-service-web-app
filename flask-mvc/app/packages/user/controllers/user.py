from flask import Blueprint, request, jsonify
from app.packages.user.services.UserService import UserService

user_bp = Blueprint('user', __name__)

@user_bp.route('/api/user/<user_id>', methods=['POST'])
def get_info():
    try:
        pass
    except Exception as e:
        print(e)
        return jsonify({"error": str(e)}), 400