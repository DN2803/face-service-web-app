#import mysql.connector, json
"""
    Import local package

from app.config.Database import connection as con, cursor as cur
from app.config.DatetimeEncoder import DatetimeEncoder
from app.config.Hash import Hash
"""
"""
    Your Code
"""
from flask_pymongo import PyMongo
from bson.objectid import ObjectId

class BaseModel():
    def __init__(self, collection_name, mongo):
        self.mongo = mongo
        self.collection = mongo[collection_name]
    
    def find(self, query={}):
        return list(self.collection.find(query))
    
    def find_one(self, query):
        return self.collection.find_one(query)
    
    def find_by_id(self, object_id):
        return self.collection.find_one({"_id": ObjectId(object_id)})
    
    def insert(self, data):
        return self.collection.insert_one(data)
    
    def update(self, query, data):
        return self.collection.update_one(query, {"$set": data})
    
    def delete(self, object_id):
        return self.collection.delete_one({"_id": ObjectId(object_id)})
