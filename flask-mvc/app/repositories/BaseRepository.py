import pandas as pd
from app.config.Database import db

class BaseRepository:
    def __init__(self, model, session):
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

    def _get_by(self, column: str, value, all = False):
        column_attr = getattr(self.model, column, None)

        if column_attr is None:
            raise Exception(f'{self.model.__name__} table does not have "{column}" column')

        filter = dict()
        filter[column] = value

        if all:
            return self.model.query.filter_by(**filter).all()
        else:
            return self.model.query.filter_by(**filter).first()

    def _get_dataframe(self, drop_cols):
        query = self.session.query(self.model).statement
        df = pd.read_sql(query, con=db.engine)
        
        if drop_cols:
            df = df.drop(columns=drop_cols)

        return df

    def _update_by_id(self, id, **kwargs):
        obj = self._get_by('id', id)

        for key, value in kwargs.items():
            if not hasattr(obj, key):
                print(f'WARNING: ignore update unfound table column: {key}')
            setattr(obj, key, value)

        self.session.commit()

    def _delete(self, obj):
        self.session.delete(obj)
        self.session.commit()