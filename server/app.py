from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_migrate import Migrate
from flask_restful import Api
from werkzeug.security import generate_password_hash, check_password_hash
import jwt
import datetime
from functools import wraps

from models import db, User, Post, UserType,PostCategory,Category, Comment

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///myblog.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.json.compact = False

CORS(app)
migrate = Migrate(app, db)

db.init_app(app)
api = Api(app)

BLACKLIST = set()



if __name__ == '__main__':
    app.run(port=5555, debug=True)
