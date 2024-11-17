import msal
import time
import httpx

from app.config.CloudStorageConfig import config

class StorageApp: #TODO: singleton with n instances
    app = None
    access_token = ''
    token_exp = None
    refresh_token = config.REFRESH_TOKEN
    scopes = config.SCOPES

    endpoint = f'{config.ENDPOINT}/me/drive/items/root:/Image Storage'
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

    def __gen_access_token(self):
        token_response = self.app.acquire_token_by_refresh_token(self.refresh_token, self.scopes)

        if 'access_token' in token_response:
            self.access_token = token_response['access_token']
            self.token_exp = token_response['id_token_claims']['exp']
            self.refresh_token = token_response['refresh_token']
            self.headers = {
                'Authorization': f'Bearer {self.access_token}'
            }
            
            with open('refresh_token.txt', 'w') as f:
                f.write(self.refresh_token)
                print('New refresh token has been saved!')
        else:
            raise Exception('Failed to get access_token: '+ str(token_response))

    # def __gen_share_link(self, folder_name, file_name):
    #     url = f'{self.endpoint}/{folder_name}/{file_name}:/createLink'
    #     response = httpx.post(url, headers=self.headers, json=self.payload)

    #     if response.is_success:
    #         return response.json()['link']['webUrl']
    #     else:
    #         raise Exception('Failed to create OneDrive share link!')

    def upload(self, file_path, content):
        # no need to check if file_name exists cause using uuid 
        url = f'{self.endpoint}/{file_path}:/content'
        
        if time.time() > self.token_exp:
            self.__gen_access_token()

        response = httpx.put(url, headers=self.headers, data=content)

        if not response.is_success:
            raise Exception('Failed to upload to OneDrive!')

    def gen_download_link(self, file_path):
        url = f'{self.endpoint}/{file_path}:/content'

        if time.time() > self.token_exp:
            self.__gen_access_token()

        response = httpx.get(url, headers=self.headers, follow_redirects=True)

        if response.is_success:
            return response.url
        else:
            raise Exception('Failed to generate download link!')

    def delete(self, file_path):
        url = f'{self.endpoint}/{file_path}'

        if time.time() > self.token_exp:
            self.__gen_access_token()

        response = httpx.delete(url, headers=self.headers)

        if not response.is_success:
            raise Exception(f'Failed to delete {file_path} from OneDrive!')
        
storage_app = StorageApp()
