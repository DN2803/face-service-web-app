import os

class CloudStorageConfig:
    def __init__(self):
        CloudStorageConfig.CLOUD_NAME = os.getenv('CLOUD_NAME')
        CloudStorageConfig.CLOUD_API_KEY = os.getenv('CLOUD_API_KEY')
        CloudStorageConfig.CLOUD_API_SECRET = os.getenv('CLOUD_API_SECRET')

config = CloudStorageConfig()