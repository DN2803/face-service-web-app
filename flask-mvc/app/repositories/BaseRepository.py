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

    def _batch_insert(self, data_list):
        self.session.bulk_insert_mappings(self.model, data_list)
        self.session.commit()

    def _get_by(
        self,
        select_cols: str|list[str], #SELECT
        column: str, operator: str, value, #WHERE
        all = False,
        return_type='obj'
    ):
        if select_cols == 'all':
            query = self.session.query(self.model)
        elif isinstance(select_cols, list):
            model_columns = [getattr(self.model, col) for col in select_cols]
            query = self.session.query(*model_columns)

        column_attr = getattr(self.model, column, None)

        if operator == 'equal' and isinstance(value, str):
            query = query.filter(column_attr == value)
        elif operator == 'in' and isinstance(value, list):
            query = query.filter(column_attr.in_(value))

        if return_type == 'obj':
            return query.all() if all else query.first()
        elif return_type == 'df':
            return pd.read_sql(query.statement, con=db.engine)

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