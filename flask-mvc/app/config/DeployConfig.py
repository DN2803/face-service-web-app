import os

class DeployConfig:
    #singleton
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(DeployConfig, cls).__new__(cls)
            
            cls._instance.SECRET_KEY = os.getenv('SECRET_KEY', 'huulocnkt')
            cls._instance.SQLALCHEMY_DATABASE_URI = os.getenv('SQLALCHEMY_DATABASE_URI', 'sqlite:///project.db')

            cls._instance.HOST = os.getenv('HOST', 'localhost')
            cls._instance.PORT = os.getenv('PORT', '8080')
            cls._instance.DEBUG = os.getenv('DEBUG', 'True')

        return cls._instance

from dotenv import load_dotenv
def get_config():
    env = os.getenv('ENV', 'local')

    if env == 'production':
        load_dotenv('.env.production')
    elif env == 'local':
        load_dotenv('.env.dev.local')
    
    return DeployConfig()

config = get_config()