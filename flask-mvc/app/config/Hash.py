from werkzeug.security import check_password_hash, generate_password_hash

class Hash:

    def __init__(self):
        pass
       
    def cekHash(self, pwHash, password):
        return check_password_hash(pwHash, password)

    def getHash(self, password):
        self.pasHash = generate_password_hash(password)
