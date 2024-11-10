import os

class CloudStorageConfig:
    def __init__(self):        
        CloudStorageConfig.ENDPOINT = 'https://graph.microsoft.com/v1.0'
        CloudStorageConfig.CLIENT_ID = os.getenv('CLIENT_ID')
        CloudStorageConfig.CLIENT_SECRET = os.getenv('CLIENT_SECRET')
        CloudStorageConfig.TENANT_ID = os.getenv('TENANT_ID')
        CloudStorageConfig.SCOPES = ['Files.ReadWrite']
        CloudStorageConfig.AUTHORITY_URL=f'https://login.microsoftonline.com/{self.TENANT_ID}'
        
        with open('refresh_token.txt') as f:
            refresh_token = f.read()
        CloudStorageConfig.REFRESH_TOKEN = refresh_token

from dotenv import load_dotenv
def _get_config():
    env = os.getenv('ENV', 'local')

    if env == 'production':
        load_dotenv('.env.production')
    elif env == 'local':
        load_dotenv('.env.dev.local')
    
    return CloudStorageConfig()

config = _get_config()