"""
    Example Controllers
"""

from flask import Blueprint, render_template
"""
    Import MOdels
from app.models.Hello import Hello
//Call HelloService
"""

hello_bp = Blueprint('hello', __name__)

#route index
@hello_bp.route('/', methods = ['GET'])
def index():
    data = {
        "title": "Hello World",
        "body": "Flask simple MVC"
    }
    return render_template('index.html.j2', data = data)
