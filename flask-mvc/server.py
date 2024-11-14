#Flask MVC

__author__ = "Nguyen Huu Loc"
__version__ = "1.0"
__email__ = "21120497@student.hcmus.edu.vn"

from app import app
from app.config.DeployConfig import config
from flask_jwt_extended import JWTManager

if __name__ == '__main__':
    app.config['JWT_SECRET_KEY'] = config.JWT_SECRET_KEY
    app.config['JWT_TOKEN_LOCATION'] = ['headers', 'cookies']
    app.config['JWT_COOKIE_SECURE'] = config.JWT_COOKIE_SECURE
    app.config['JWT_COOKIE_CSRF_PROTECT'] = False
    jwt = JWTManager(app)

    app.run(host=config.HOST, port=config.PORT, debug=config.DEBUG)
