import os

class DeployConfig:
    def __init__(self):
        DeployConfig.SECRET_KEY = os.getenv('SECRET_KEY', 'huulocnkt')
        DeployConfig.JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY', 'super-secret-key')
        DeployConfig.JWT_COOKIE_SECURE = os.getenv('JWT_COOKIE_SECURE', 'False')
        DeployConfig.SQLALCHEMY_DATABASE_URI = os.getenv('SQLALCHEMY_DATABASE_URI', 'sqlite:///project.db')

        DeployConfig.HOST = os.getenv('HOST', 'localhost')
        DeployConfig.PORT = os.getenv('PORT', '8080')
        DeployConfig.DEBUG = os.getenv('DEBUG', 'True')

from dotenv import load_dotenv
def _get_config():
    env = os.getenv('ENV', 'local')

    if env == 'production':
        load_dotenv('.env.production')
    elif env == 'local':
        load_dotenv('.env.dev.local')
    
    return DeployConfig()

config = _get_config()