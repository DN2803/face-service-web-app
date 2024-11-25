from app.config.CloudStorageConfig import config as cloud_config

import cloudinary
import cloudinary.uploader as uploader
import cloudinary.api

class StorageApp:
    config = cloudinary.config(
        cloud_name = cloud_config.CLOUD_NAME, 
        api_key = cloud_config.CLOUD_API_KEY, 
        api_secret = cloud_config.CLOUD_API_SECRET,
        secure=True
    )

    def __init__(self):
        print(f'Setting up and configure the Cloudinary SDK: Credentials: {self.config.cloud_name}, {self.config.api_key}')

    def upload(self, file, folder, public_id):
        response = uploader.upload(
            file=file,
            folder=folder,
            public_id=public_id,
            resource_type='image',
            format='jpg'
        )

        return response['secure_url']

    def delete(self, file_path):
        response = uploader.destroy(public_id=file_path, resource_type = 'image')

        if response['result'] != 'ok':
            print(f'Failed to delete {file_path} on Cloudinary')

storage_app = StorageApp()
