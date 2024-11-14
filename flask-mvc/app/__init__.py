from flask import Flask
from flask_cors import CORS

app = Flask("app")
CORS(app, supports_credentials=True)

# import blueprints and register them
from app.controllers.hello import hello_bp
app.register_blueprint(hello_bp)

from app.packages.user.controllers.auth import auth_bp
app.register_blueprint(auth_bp)

from app.packages.user.controllers.user import user_bp
app.register_blueprint(user_bp)

from app.packages.image.controllers.image import image_bp
app.register_blueprint(image_bp)

# from app.packages.api.controllers.api import api_bp
# app.register_blueprint(api_bp)