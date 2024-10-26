class BaseRepository:
    def __init__(self, model, session):
        print("Base repo")
        self.model = model
        self.session = session