from flask import Flask, jsonify
from flask_cors import CORS

app = Flask("app")
CORS(app, supports_credentials=True)

# handle exception to response appropriate http status code
from werkzeug.exceptions import HTTPException
@app.errorhandler(Exception)
def handle_exception(e):
    print(e)
    if isinstance(e, HTTPException):
        return jsonify(error=e.description), e.code
    else:
        return jsonify(error=str(e)), 400

# import blueprints and register them
from app.controllers.hello import hello_bp
app.register_blueprint(hello_bp)

from app.packages.user.controllers.auth import auth_bp
app.register_blueprint(auth_bp)

from app.packages.user.controllers.user import user_bp
app.register_blueprint(user_bp)

from app.packages.image.controllers.demo_func import demo_bp
app.register_blueprint(demo_bp)

from app.packages.api.controllers.api import api_bp
app.register_blueprint(api_bp)

from app.packages.api.controllers.api_func import api_func_bp
app.register_blueprint(api_func_bp)