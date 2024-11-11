from app import app
from app.config.DeployConfig import config

from flask_jwt_extended import JWTManager

app.config['JWT_SECRET_KEY'] = config.JWT_SECRET_KEY
app.config['JWT_TOKEN_LOCATION'] = ['cookies']
app.config['JWT_COOKIE_SECURE'] = config.JWT_COOKIE_SECURE
app.config['JWT_COOKIE_CSRF_PROTECT'] = True

jwt = JWTManager(app)