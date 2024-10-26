class BaseRepository:
    def __init__(self, model, session):
        print("Base Repository")
        self.model = model
        self.session = session
    
    # CRUD
    def _create(self, **kwargs):
        obj = self.model()
        for key, value in kwargs.items():
            if not hasattr(self.model, key):
                print(f'WARNING: ignore create unfound attribute: {key}')
            setattr(obj, key, value)
        self.session.add(obj)
        self.session.commit()
        return obj

    def _get_by(self, column, value):
        column_attr = getattr(self.model, column, None)

        if column_attr is None:
            raise Exception(f'{self.model.__name__} table does not have "{column}" column')

        filter = dict()
        filter[column] = value

        return self.model.query.filter_by(**filter).first()

    def _update(self, **kwargs):
        for key, value in kwargs.items():
            if not hasattr(self.model, key):
                print(f'WARNING: ignore update unfound table column: {key}')
            setattr(self.model, key, value)

        self.session.commit()
