from flask import Flask
from flask_cors import CORS

app = Flask("app")
CORS(app)

from datetime import timedelta
app.permanent_session_lifetime = timedelta(minutes=1)

# import blueprints and register them
from app.controllers.hello import hello_bp
app.register_blueprint(hello_bp)

from app.packages.user.controllers.auth import auth_bp
app.register_blueprint(auth_bp)

# from app.packages.user.controllers.face_auth import face_auth_bp
# app.register_blueprint(face_auth_bp)

from app.packages.image.controllers.image import image_bp
app.register_blueprint(image_bp)