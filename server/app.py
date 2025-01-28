from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_migrate import Migrate
from flask_restful import Api
from werkzeug.security import generate_password_hash, check_password_hash
import jwt
import datetime
from functools import wraps

from models import db, User, Post, Author,PostCategory,Category, Comment

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///trial.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.json.compact = False

CORS(app)
migrate = Migrate(app, db)

db.init_app(app)
api = Api(app)

BLACKLIST = set()

@app.route('/protected')
def protected():
    token = request.headers.get('Authorization')
    if not token:
        return jsonify({'message': 'Please log in!'}), 401

    token = token.split(' ')[1] if ' ' in token else token

    try:
        payload = jwt.decode(token, 'secret', algorithms=['HS256'])
        user_id = payload['user_id']
    except jwt.ExpiredSignatureError:
        return jsonify({'message': 'Token has expired!'}), 401
    except jwt.InvalidTokenError:
        return jsonify({'message': 'Invalid token!'}), 401

    return jsonify({'message': f'You are logged in as user {user_id}!'})

def requires_authentication(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({'message': 'Unauthorized access'}), 403
        
        token = token.split(' ')[1] if ' ' in token else token
        
        try:
            payload = jwt.decode(token, 'secret', algorithms=['HS256'])
            user_id = payload['user_id']
        except jwt.ExpiredSignatureError:
            return jsonify({'message': 'Token expired'}), 403
        except jwt.InvalidTokenError:
            return jsonify({'message': 'Invalid token'}), 403
        
        return f(*args, **kwargs)
    return decorated_function

@app.route('/auth/protected', methods=['POST'])
@requires_authentication
def protected_route():
    return jsonify({'message': 'This is a protected route.'})

@app.route('/auth/register', methods=['POST'])
def register():
    data = request.get_json()
    password_hash = generate_password_hash(data['password'])
    user = User(username=data['username'], email=data['email'], password=password_hash)
    db.session.add(user)
    db.session.commit()
    return jsonify({"message": "User created successfully!"}), 201

@app.route('/auth/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(email=data['email']).first()
    if user and check_password_hash(user.password, data['password']):
        token = jwt.encode({
            "user_id": user.id,
            "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=1)
        }, 'secret', algorithm='HS256')
        return jsonify({"token": token}), 200
    return jsonify({"message": "Invalid credentials!"}), 401

@app.route('/auth/logout', methods=['POST'])
@requires_authentication
def logout():
    token = request.headers.get('Authorization')
    token = token.split(' ')[1] if ' ' in token else token

    # Add the token to the blacklist
    BLACKLIST.add(token)

    return jsonify({"message": "Successfully logged out!"}), 200

@app.route('/auth/update', methods=['PATCH'])
@requires_authentication
def update_user():
    token = request.headers.get('Authorization').split(' ')[1]
    payload = jwt.decode(token, 'secret', algorithms=['HS256'])
    user_id = payload['user_id']

    user = User.query.get(user_id)
    if not user:
        return jsonify({"message": "User not found"}), 404

    data = request.get_json()

    # Update only the fields provided in the request
    if 'username' in data:
        user.username = data['username']
    if 'email' in data:
        user.email = data['email']
    if 'password' in data:
        user.password = generate_password_hash(data['password'])

    db.session.commit()

    return jsonify({"message": "User updated successfully"}), 200

if __name__ == '__main__':
    app.run(port=5555, debug=True)
