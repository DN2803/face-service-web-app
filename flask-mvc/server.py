# Flask MVC

__author__ = "Vo Hoai Viet"
__version__ = "1.0"
__email__ = "vhviet@fit.hcmus.edu.vn"
import os
from app import app
from dotenv import load_dotenv
from datetime import timedelta

load_dotenv()

# Thiết lập secret key từ biến môi trường
app.secret_key = os.getenv('SECRET_KEY')  # Đã thiết lập trong file server của bạn

if __name__ == '__main__':
    # Directly call environment variables without changing defaults
    host = os.environ.get('FLASK_HOST') 
    port = os.environ.get('FLASK_PORT')  
    app.run(host=host or '127.0.0.1', port=int(port) if port else 8080, debug=True)
