#Flask MVC

__author__ = "Vo Hoai Viet"
__version__ = "1.0"
__email__ = "vhviet@fit.hcmus.edu.vn"

from app import app
from app.config.DeployConfig import config

if __name__ == '__main__':
    app.run(host=config.HOST, port=config.PORT, debug=config.DEBUG)
