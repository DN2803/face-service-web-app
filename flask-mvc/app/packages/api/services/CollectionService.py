from app.services.BaseService import BaseService
from app.packages.api.models.Collection import CollectionSchema
from app.packages.api.repositories.CollectionRepo import CollectionRepo
from app.packages.api.repositories.AccessCollectionRepo import AccessCollectionRepo

class CollectionService(BaseService):
    def __init__(self):
        self.repository = CollectionRepo()
        self.schema = CollectionSchema()

    #----------------------COLLECTION----------------------#
    def add_collection(self, key_id, **kwargs):
        validated_data = self.schema.load(data=kwargs)

        if validated_data['name'] == 'Base':
            raise Exception("Naming a collection 'Base' is invalid.")

        validated_data['admin_key_id'] = key_id
        collection_obj = self.repository.add_collection(**validated_data)

        res = self.schema.dump(collection_obj)
        return res

    def update_collection(self, collection_id, **kwargs):
        validated_data = self.schema.load(data=kwargs)
        collection_obj = self.repository.get_collection_by_id(collection_id)
        collection_obj = self.repository.update(collection=collection_obj, **validated_data)
        result = self.schema.dump(collection_obj)

        return result

    def delete_collection(self, collection_id):
        collection_obj = self.repository.get_collection_by_id(collection_id)
        self.repository.delete(collection_obj)

    #----------------------COLLECTIONs----------------------#
    def get_collections(self, key_id, is_admin):
        collections = None

        if is_admin:
            collections = CollectionRepo().get_collections_by_key_id(key_id)
        else:
            collection_ids = AccessCollectionRepo().get_collection_ids(key_id)
            collections = CollectionRepo().get_collections(collection_ids)

        result =  CollectionSchema(many=True).dump(collections)
        return result