from flask import Blueprint, request, jsonify
from flask import session as flask_session
from app.packages.user.services.UserService import UserService

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/api/register/check-email', methods=['POST'])
def check_email():
    try:
        data = request.json
        user_id = UserService().check_email(data['email'])
        
        if user_id:            
            raise Exception('This email already exists!')
        else:            
            return jsonify({"message": "This email is available for registration!"}), 200
    except Exception as e:
        print(e)
        return jsonify(error = str(e)), 400

@auth_bp.route('/api/register/sumbit', methods=['POST']) #request input: see UserSchema
def register():
    try:
        data = request.json
        user_id = UserService().register(**data)
        print(f'User {user_id} registered sucessfully')
        return jsonify({"message": "User registered successfully."}), 201
    except Exception as e:
        print(e)
        return jsonify(error = str(e)), 400

@auth_bp.route('/api/login/identify', methods=['POST']) #request input: email
def indentify():
    try:
        data = request.json
        user_id = UserService().check_email(data['email'])
        
        if user_id:
            flask_session['user_id'] = user_id
            return jsonify({"message": "Email exists"}), 200
        else:
            raise Exception('This email does not exist')
    except Exception as e:
        print(e)
        return jsonify(error = str(e)), 400
    
@auth_bp.route('/api/login/validate', methods=['POST']) #request input: pw
def validate():
    try:
        data = request.json
        user_id = flask_session.get('user_id')
        is_valid = UserService().validate_login(user_id, data['password'])

        if is_valid:
            flask_session.pop('user_id', None)
            return jsonify(message="Login successful."), 200
        else:
            return jsonify({"error": "Invalid credentials."}), 401
    except Exception as e:
        print(e)
        return jsonify(error = str(e)), 400