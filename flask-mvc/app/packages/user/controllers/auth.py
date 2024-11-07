from flask import Blueprint, request, jsonify
from flask_jwt_extended import verify_jwt_in_request, get_jwt_identity
from app.packages.user.services.AuthService import AuthService

auth_bp = Blueprint('auth', __name__,url_prefix='/api/auth')

@auth_bp.route('/register/check-email', methods=['POST'])
def check_email():
    try:
        data = request.json
        user_id = AuthService().check_email(data['email'])

        if user_id:            
            raise Exception('This email already exists!')
        else:
            return jsonify(message="This email is available for registration!"), 200
    except Exception as e:
        print(e)
        return jsonify(error = str(e)), 400

@auth_bp.route('/register/submit', methods=['POST']) #request input: see UserSchema
def register():
    try:
        data = request.json
        user_id = AuthService().register(**data)
        print(f'User {user_id} registered sucessfully')
        return jsonify(message="User registered successfully."), 201
    except Exception as e:
        print(e)
        return jsonify(error = str(e)), 400

@auth_bp.route('/login/identify', methods=['POST']) #request input: email
def indentify():
    try:
        data = request.json
        user_id, user_name, user_is_faceid = AuthService().check_email(data['email'])
        
        if user_id:
            refresh_token = AuthService.gen_token(user_id, refresh=True)
            response = jsonify(message="Email exists",
                               user_name=user_name,
                               is_faceid = user_is_faceid,
                               refresh_token=refresh_token
                               )
            return response, 200
        else:
            raise Exception('This email does not exist')
    except Exception as e:
        print(e)
        return jsonify(error = str(e)), 400

@auth_bp.route('/login/validate/password', methods=['POST']) #request input: pw
def validate():
    try:
        verify_jwt_in_request(refresh=True)
        data = request.json
        user_id = get_jwt_identity()
        is_valid = AuthService().validate_login(user_id, data['password'])

        if is_valid:
            access_token = AuthService.gen_token(user_id)
            response = jsonify(message="Login successfully.",
                               user_id=user_id,
                               access_token=access_token
                               )
            return response, 200
        else:
            return jsonify(error="Invalid credentials."), 401
    except Exception as e:
        print(e)
        return jsonify(error = str(e)), 400

@auth_bp.route('/login/validate/face-id', methods=['POST'])
def validate_face_id():
    try:
        verify_jwt_in_request(refresh=True)
        user_id = get_jwt_identity()
        data = request.json
        is_valid = False

        if data['image']:
            is_valid = AuthService().validate_face_login(user_id, data['image'])
        else:
            raise Exception("Invalid face login syntax")

        if is_valid:
            access_token = AuthService.gen_token(user_id)
            response = jsonify(message="Login successfully.",
                    user_id=user_id,
                    access_token=access_token
                    )
            return response, 200
        else:
            return jsonify(error="Invalid credentials."), 401
    except Exception as e:
        print(e)
        return jsonify(error=str(e)), 400
    
@auth_bp.route('/refresh-token', methods=['POST'])
def refresh():
    try:
        verify_jwt_in_request(refresh=True)
        user_id = get_jwt_identity()
        new_refresh_token = AuthService.gen_token(user_id, refresh=True)
        return jsonify(refresh_token=new_refresh_token), 200
    except Exception as e:
        print(e)
        return jsonify(error = str(e)), 400