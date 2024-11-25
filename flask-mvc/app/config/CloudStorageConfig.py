import os

class CloudStorageConfig:
    def __init__(self):
        CloudStorageConfig.CLOUD_NAME = os.getenv('CLOUD_NAME')
        CloudStorageConfig.CLOUD_API_KEY = os.getenv('CLOUD_API_KEY')
        CloudStorageConfig.CLOUD_API_SECRET = os.getenv('CLOUD_API_SECRET')

from dotenv import load_dotenv
def _get_config():
    env = os.getenv('ENV', 'local')

    if env == 'production':
        load_dotenv('.env.production')
    elif env == 'local':
        load_dotenv('.env.dev.local')
    
    return CloudStorageConfig()

config = _get_config()