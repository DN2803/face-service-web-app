from flask import jsonify, request

class BaseController:
    def __init__(self, service):
        self.service = service
    
    def get_all(self):
        data = self.service.get_all()
        return jsonify(data), 200
    
    def get_by_id(self, object_id):
        data = self.service.get_by_id(object_id)
        if data:
            return jsonify(data), 200
        return jsonify({"error": "Not found"}), 404
    
    def create(self, data):
        data = request.json
        self.service.create(data)
        return jsonify({"message": "Created successfully"}), 201
    
    def update(self, object_id):
        data = request.json
        self.service.update(object_id, data)
        return jsonify({"message": "Updated successfully"}), 200
    
    def delete(self, object_id):
        self.service.delete(object_id)
        return jsonify({"message": "Deleted successfully"}), 204
