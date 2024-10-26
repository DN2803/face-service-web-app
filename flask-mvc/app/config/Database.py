# from pymongo import MongoClient

# # Kết nối đến MongoDB (thay đổi URL nếu cần)
# client = MongoClient('mongodb://localhost:27017/')

# # Lựa chọn database
# db = client['demo-app-react-face-auth']

import mysql.connector

connection = mysql.connector(
    host = "localhost",
    user = "root",
    password = ""
)

cursor = connection.cursor()

