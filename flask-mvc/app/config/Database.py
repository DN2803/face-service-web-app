from app import app
from app.config.DeployConfig import config

from flask_sqlalchemy import SQLAlchemy

app.config['SECRET_KEY'] = config.SECRET_KEY
app.config['SQLALCHEMY_DATABASE_URI'] = config.SQLALCHEMY_DATABASE_URI
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

from flask_migrate import Migrate
Migrate(app,db)