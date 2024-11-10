import msal
from datetime import datetime
import httpx

from app.config.CloudStorageConfig import config

class StorageApp: #TODO: singleton with n instances
    app = None
    access_token = ''
    token_exp = None
    refresh_token = config.REFRESH_TOKEN
    scopes = config.SCOPES

    endpoint = f'{config.ENDPOINT}/me/drive/items/root:'
    headers = {}
    payload = {
        'type': 'view',
        'scope': 'anonymous'
    }

    def __init__(self):
        self.app = msal.ConfidentialClientApplication(
            client_id = config.CLIENT_ID,
            client_credential = config.CLIENT_SECRET,
            authority = config.AUTHORITY_URL
        )
        try:
            self.__gen_access_token()
        except Exception as e:
            print(e)

    def __del__(self):        
        print(self.refresh_token)
        with open('refresh_token.txt', 'w') as f:
            f.write(self.refresh_token)

    def __gen_access_token(self):
        print('Acquiring new token...')
        token_response = self.app.acquire_token_by_refresh_token(self.refresh_token, self.scopes)

        if 'access_token' in token_response:
            self.access_token = token_response['access_token']
            self.token_exp = token_response['id_token_claims']['exp']
            self.refresh_token = token_response['refresh_token']
            self.headers = {
                'Authorization': f'Bearer {self.access_token}'
            }
        else:
            raise Exception('Failed to get access_token: '+ str(token_response))

    def __gen_share_link(self, folder_name, file_name):
        url = f'{self.endpoint}/{folder_name}/{file_name}:/createLink'
        response = httpx.post(url, headers=self.headers, json=self.payload)

        if response.is_success:
            return response.json()['link']['webUrl']
        else:
            raise Exception('Failed to create OneDrive share link!')

    def upload(self, folder_name, file_name, content):
        # no need to check if file_name exists cause using uuid 
        url = f'{self.endpoint}/{folder_name}/{file_name}:/content'
        
        if datetime.now() > datetime.fromtimestamp(self.token_exp):
            self.gen_access_token()

        response = httpx.put(url, headers=self.headers, data=content)

        if response.is_success:
            return self.__gen_share_link(folder_name, file_name)
        else:
            raise Exception('Failed to upload to OneDrive!')

    def delete(self, folder_name, file_name):
        url = f'{self.endpoint}/{folder_name}/{file_name}'

        if datetime.now() > datetime.fromtimestamp(self.token_exp):
            self.__gen_access_token()

        response = httpx.delete(url, headers=self.headers)

        if not response.is_success:
            raise Exception('Failed to delete {folder_name}/{file_name} from OneDrive!')
        
storage_app = StorageApp()
