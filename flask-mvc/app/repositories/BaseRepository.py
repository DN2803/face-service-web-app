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

    # def _get_dataframe(self, select_cols=None, filter_col=None, filter_value=None):
    #     if select_cols:
    #         model_columns = [getattr(self.model, col) for col in select_cols]
    #     else:
    #         model_columns = self.model

    #     filter = dict()

    #     if filter_col and filter_value:
    #         filter[filter_col]=filter_value

    #     query = self.session.query(model_columns).filter(**filter).statement

    #     df = pd.read_sql(query, con=db.engine)

    #     return df

    def _update_by_obj(self, obj, **kwargs):
        for key, value in kwargs.items():
            if not hasattr(obj, key):
                print(f'WARNING: ignore update unfound attribute {key} of {obj}')
            setattr(obj, key, value)

        self.session.commit()

        return obj

    def _delete(self, obj):
        self.session.delete(obj)
        self.session.commit()