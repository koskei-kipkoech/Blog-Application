from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_migrate import Migrate
from flask_restful import Api
from werkzeug.security import generate_password_hash, check_password_hash
import jwt
import datetime
from functools import wraps

from models import db, User, Post, UserType, PostCategory, Category, Comment

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///myblog.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.json.compact = False

CORS(app)
migrate = Migrate(app, db)

db.init_app(app)
api = Api(app)

BLACKLIST = set()
SECRET_KEY = 'secret'

def token_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        token = request.headers.get('Authorization')  
        if not token:
            return jsonify({"message": "Token is missing!"}), 400
        try:
            token = token.replace("Bearer ", "")  
            decoded_token = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])  
            current_user = User.query.get(decoded_token['user_id'])  
            if not current_user:
                return jsonify({"message": "User not found!"}), 404
        except jwt.ExpiredSignatureError:
            return jsonify({"message": "Token has expired!"}), 401
        except jwt.InvalidTokenError:
            return jsonify({"message": "Invalid token!"}), 401
        return f(current_user, *args, **kwargs)  
    return decorated_function


#register route
@app.route('/register', methods=['POST'])
def register_user():
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')
    user_type_id = data.get('user_type_id')
    if not username or not email or not password or not user_type_id:
        return jsonify({"message": "Missing required fields"}), 400
    user_type = UserType.query.get(user_type_id)
    if not user_type:
        return jsonify({"message": "Invalid user type"}), 400
    existing_user = User.query.filter_by(username=username).first()
    if existing_user:
        return jsonify({"message": "User already exists"}), 400
    new_user = User(username=username, email=email, usertype_id=user_type_id)
    new_user.set_password(password)
    db.session.add(new_user)
    db.session.commit()
    return jsonify({"message": "User created successfully"}), 201


#login route
@app.route('/login', methods=['POST'])
def login_user():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    if not username or not password:
        return jsonify({"message": "Missing credentials"}), 400
    user = User.query.filter_by(username=username).first()
    if not user or not user.check_password(password):
        return jsonify({"message": "Invalid credentials"}), 401

    token = jwt.encode({'user_id': user.id, 'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=2)}, SECRET_KEY, algorithm='HS256')
    response = jsonify({
        'message': 'Login successful',
        'user' : { 'id' : user.id,'username' : user.username},
        'token' :token
        })
    response.set_cookie('token',token, httponly=True, secure=True)
    return response, 200


@app.route('/updateuser', methods=['PATCH'])
def update_user():
    token = request.headers.get('Authorization')
    if not token:
        return jsonify({"message": "Token is missing!"}), 400
    try:
        token = token.replace("Bearer ", "")
        data = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
        user_id = data['user_id']
        user = User.query.get(user_id)
        if not user:
            return jsonify({"message": "User not found"}), 404
        new_email = request.json.get('email')
        new_password = request.json.get('password')
        if new_email:
            user.email = new_email
        if new_password:
            user.set_password(new_password)
        db.session.commit()
        return jsonify({"message": "User details updated successfully"}), 200
    except jwt.ExpiredSignatureError:
        return jsonify({"message": "Token has expired"}), 401
    except jwt.InvalidTokenError:
        return jsonify({"message": "Invalid token"}), 401
    except Exception as e:
        return jsonify({"message": f"Something went wrong: {str(e)}"}), 500
    

@app.route('/deleteuser', methods=['DELETE'])
@token_required  
def delete_user(current_user):
    if not current_user:
        return jsonify({"message": "User not found"}), 404
    db.session.delete(current_user)
    db.session.commit()

    return jsonify({"message": "User deleted successfully"}), 200


#logout route
@app.route('/logout', methods=['POST'])
def logout_user():
    token = request.headers.get('Authorization')
    if not token:
        return jsonify({"message": "Token is missing!"}), 400
    try:
        token = token.replace("Bearer ", "")
        BLACKLIST.add(token)
        return jsonify({"message": "Logged out successfully"}), 200
    except Exception as e:
        return jsonify({"message": f"Something went wrong: {str(e)}"}), 500
    
    
#all posts
@app.route('/posts', methods=['GET'])
def get_all_posts():
    posts = Post.query.all()
    return jsonify([post.to_dict() for post in posts]), 200


#post per user
@app.route('/posts/user/<int:user_id>', methods=['GET'])
def get_posts_by_user(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({"message": "User not found"}), 404
    posts = Post.query.filter_by(user_id=user_id).all()
    return jsonify([post.to_dict() for post in posts]), 200


@app.route('/categories', methods=['GET'])
def get_categories():
    categories = Category.query.all()  
    category_list = [{"id": category.id, "name": category.name} for category in categories]
    return jsonify(category_list)


#post in a category
@app.route('/posts/category/<int:category_id>', methods=['GET'])
def get_posts_by_category(category_id):
    category = Category.query.get(category_id)
    if not category:
        return jsonify({"message": "Category not found"}), 404
    posts = category.posts  
    return jsonify([post.to_dict() for post in posts]), 200


@app.route('/post/<int:post_id>', methods=['GET'])
def get_post(post_id):
    post = Post.query.get(post_id)
    if not post:
        return jsonify({"message": "Post not found"}), 404
    comments = post.comments  
    comments_with_usernames = [
        {
            'id': comment.id,
            'content': comment.content,
            'created_at': comment.created_at,
            'username': comment.post.user.username 
        } for comment in comments
    ]
    post_data = {
        'title': post.title,
        'user_id': post.user.id,
        'image': post.image,
        'content': post.content,
        'categories': [category.name for category in post.categories],
        'minutes_to_read': post.minutes_to_read,
        'created_at': post.created_at,
        'comments': comments_with_usernames
    }
    return jsonify(post_data), 200


@app.route('/post', methods=['POST'])
@token_required
def create_post(current_user):
    data = request.get_json()
    required_fields = ['title', 'content', 'preview', 'minutes_to_read', 'category']  
    missing_fields = [field for field in required_fields if field not in data or not data[field]]
    if missing_fields:
        return jsonify({"message": f"Missing or empty fields: {', '.join(missing_fields)}"}), 400

    try:
        minutes_to_read = int(data['minutes_to_read'])
        if minutes_to_read <= 0:
            raise ValueError
    except ValueError:
        return jsonify({"message": "minutes_to_read must be a positive integer"}), 400
    title = data['title'].strip()
    content = data['content'].strip()
    preview = data['preview'].strip()
    image = data.get('image', None)  
    is_favourite = data.get('is_favourite', False)  
    is_liked = data.get('is_liked', False)  
    published = data.get('published', False)  
    category_ids = data['category']
    categories = Category.query.filter(Category.id.in_(category_ids)).all()
    if len(categories) != len(category_ids):
        return jsonify({"message": "Some categories were not found"}), 400
    post = Post(
        title=title,
        content=content,
        preview=preview,
        image=image,
        minutes_to_read=minutes_to_read,
        is_favourite=is_favourite,
        is_liked=is_liked,
        published=published,
        user_id=current_user.id
    )
    post.categories = categories
    db.session.add(post)
    db.session.commit()
    return jsonify(post.to_dict()), 201


@app.route('/post/<int:post_id>', methods=['PATCH'])
@token_required
def update_post(current_user, post_id):
    post = db.session.get(Post, post_id)
    if not post:
        return jsonify({"message": "Post not found"}), 404
    data = request.get_json()
    # Updating post fields
    if 'title' in data and data['title'].strip():
        post.title = data['title'].strip()
    if 'content' in data and data['content'].strip():
        post.content = data['content'].strip()
    if 'preview' in data and data['preview'].strip():
        post.preview = data['preview'].strip()
    if 'image' in data and data['image']:
        post.image = data['image']
    if 'minutes_to_read' in data:
        try:
            minutes_to_read = int(data['minutes_to_read'])
            if minutes_to_read <= 0:
                raise ValueError
            post.minutes_to_read = minutes_to_read
        except ValueError:
            return jsonify({"message": "minutes_to_read must be a positive integer"}), 400
    if 'is_favourite' in data:
        post.is_favourite = bool(data['is_favourite'])
    if 'is_liked' in data:
        post.is_liked = bool(data['is_liked'])
    if 'published' in data:
        post.published = bool(data['published'])
    
    # Updating categories
    if 'categories' in data:
        category_ids = data['categories']
        if not isinstance(category_ids, list):
            return jsonify({"message": "Categories must be a list of IDs"}), 400
        valid_categories = Category.query.filter(Category.id.in_(category_ids)).all()
        if len(valid_categories) != len(category_ids):
            return jsonify({"message": "One or more categories are invalid"}), 400
        post.categories = valid_categories  
    
    # Updating comments (optional)
    if 'comments' in data:
        comments_data = data['comments']
        if not isinstance(comments_data, list):
            return jsonify({"message": "Comments must be a list"}), 400
        for comment in comments_data:
            if 'content' not in comment or not comment['content'].strip():
                return jsonify({"message": "Each comment must have content"}), 400
            new_comment = Comment(
                content=comment['content'].strip(),
                user_id=current_user.id,  
                post_id=post.id
            )
            db.session.add(new_comment)
    try:
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Failed to update the post.", "error": str(e)}), 500
    return jsonify(post.to_dict()), 200


@app.route('/post/<int:post_id>', methods=['DELETE'])
@token_required
def delete_post(current_user, post_id):
    post = Post.query.get_or_404(post_id)
    if post.user_id != current_user.id:
        return jsonify({"message": "You can only delete your own posts"}), 403
    db.session.delete(post)
    db.session.commit()
    return jsonify({"message": "Post deleted successfully"}), 200


@app.route('/posts/liked', methods=['GET'])
@token_required
def get_liked_posts(current_user):
    liked_posts = Post.query.filter(Post.user_id == current_user.id, Post.is_liked==True).all()
    return jsonify([{"id": post.id, "title": post.title, "image": post.image, "preview": post.preview} for post in liked_posts])


@app.route('/posts/favorites', methods=['GET'])
@token_required
def get_favorite_posts(current_user):
    favorite_posts = Post.query.filter(Post.user_id == current_user.id, Post.is_favourite==True).all()
    return jsonify([{"id": post.id, "title": post.title, "image": post.image, "preview": post.preview} for post in favorite_posts])

@app.route('/post/<int:post_id>/like', methods=['PATCH'])
@token_required
def toggle_like_post(current_user, post_id):
    post = db.session.get(Post, post_id)
    if not post:
        return jsonify({"message": "Post not found"}), 404
    data = request.get_json()
    if data is None:
        return jsonify({"message": "Invalid request"}), 400  
    post.is_liked = not post.is_liked  
    db.session.commit()
    return jsonify({"is_liked": post.is_liked}), 200  


@app.route('/post/<int:post_id>/favorite', methods=['PATCH'])
@token_required
def toggle_favorite_post(current_user, post_id):
    post = db.session.get(Post, post_id)
    if not post:
        return jsonify({"message": "Post not found"}), 404
    data = request.get_json()
    if data is None:
        return jsonify({"message": "Invalid request"}), 400  
    post.is_favourite = not post.is_favourite  
    db.session.commit()
    return jsonify({"is_favourite": post.is_favourite}), 200  

@app.route('/comments/post/<int:post_id>', methods=['GET'])
def get_comments_for_post(post_id):
    post = Post.query.get(post_id)
    if not post:
        return jsonify({"message": "Post not found"}), 404
    comments = post.comments  
    comments_with_usernames = [
        {
            'id': comment.id,
            'content': comment.content,
            'created_at': comment.created_at,
            'username': comment.post.user.username  
        } for comment in comments
    ]
    return jsonify(comments_with_usernames), 200


@app.route('/comments/post/<int:post_id>', methods=['POST'])
def add_comment(post_id):
    post = Post.query.get(post_id)
    if not post:
        return jsonify({"message": "Post not found"}), 404
    data = request.get_json()
    new_comment = Comment(content=data['content'], post_id=post_id)
    db.session.add(new_comment)
    db.session.commit()
    return jsonify({
        'id': new_comment.id,
        'content': new_comment.content,
        'created_at': new_comment.created_at,
        'username': post.user.username  
    }), 201

@app.route('/search', methods=['GET'])
def search():
    query = request.args.get('query', '')
    category = request.args.get('category', '')
    if not query:
        return jsonify({"message": "Query parameter is required"}), 400
    try:
        posts = Post.query.filter(Post.title.ilike(f'%{query}%') | Post.content.ilike(f'%{query}%')).all()
        if not posts:
            posts = []
        comments = Comment.query.filter(Comment.content.ilike(f'%{query}%')).all()
        users = User.query.filter(User.username.ilike(f'%{query}%')).all()
        if category:
            posts = [post for post in posts if any(cat.name == category for cat in post.categories)]
        result_posts = [post.to_dict() for post in posts]
        result_comments = [comment.to_dict() for comment in comments]
        result_users = [user.to_dict() for user in users]

        return jsonify({
            'posts': result_posts,
            'comments': result_comments,
            'users': result_users
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
if __name__ == '__main__':
    app.run(port=5555, debug=True)
