from flask import Flask, request, make_response, jsonify
from flask_cors import CORS
from flask_migrate import Migrate
from flask_restful import Resource
from models import db, User, Post, UserPost, Comment

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///blog.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.json.compact = False

CORS(app)
migrate = Migrate(app, db)

db.init_app(app)

class Users(Resource):
    def get(self):
        pass
    def post(self):
        pass

class UserById(Resource):
    def get(self, id):
        pass
    def patch(self):
        pass

    def delete(self, id):
        pass


if __name__ == '__main__':
    app.run(debug=True)