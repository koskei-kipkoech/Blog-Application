from sqlalchemy import Index
from datetime import datetime
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy_serializer import SerializerMixin
from sqlalchemy import CheckConstraint, UniqueConstraint
from email_validator import validate_email, EmailNotValidError
from sqlalchemy.orm import validates
from flask_bcrypt import Bcrypt

bcrypt = Bcrypt()
db = SQLAlchemy()

# UserType Model
class UserType(db.Model, SerializerMixin):
    __tablename__ = 'user_types'

    id = db.Column(db.Integer, primary_key=True)
    type_name = db.Column(db.String(50), nullable=False, unique=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, onupdate=datetime.utcnow)

    users = db.relationship('User', back_populates='user_type')

    def __repr__(self):
        return f"<UserType {self.type_name}>"

# User Model
class User(db.Model, SerializerMixin):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), nullable=False, unique=True)
    email = db.Column(db.String(255), nullable=False, unique=True)
    password_hash = db.Column(db.String(255), nullable=False)
    usertype_id = db.Column(db.Integer, db.ForeignKey('user_types.id'), nullable=False, default=1)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, onupdate=datetime.utcnow)

    user_type = db.relationship('UserType', back_populates='users')
    posts = db.relationship('Post', back_populates='user', cascade='all, delete-orphan')

    @validates('username')
    def validate_username(self, key, username):
        if not username.isalnum():
            raise ValueError('Username should only contain letters and numbers.')
        if len(username) < 3 or len(username) > 30:
            raise ValueError('Username must be between 3 and 30 characters.')
        return username

    @validates('email')
    def validate_email(self,key, email):
        try:
            validate_email(email)
            return email
        except EmailNotValidError:
            raise ValueError('Invalid Email Address')
        
        
    def set_password(self, password):
        self.password_hash = bcrypt.generate_password_hash(password).decode('utf-8')
    
    def check_password(self, password):
        return bcrypt.check_password_hash(self.password_hash, password)

    def __repr__(self):
        return f"<User {self.username}>"

# Category Model
class Category(db.Model, SerializerMixin):
    __tablename__ = 'categories'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False, unique=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, onupdate=datetime.utcnow)

    posts = db.relationship('Post', secondary='post_category', back_populates='categories')

    def to_dict(self):
        return{
            'id': self.id,
            'name': self.name,

        }
    def __repr__(self):
        return f"<Category {self.name}>"

# Post Model
class Post(db.Model, SerializerMixin):
    __tablename__ = 'posts'
    __table_args__ = (
        CheckConstraint('minutes_to_read > 0', name='check_minutes_to_read'),
        Index('ix_post_user_id', 'user_id')  
    )

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    image = db.Column(db.String(500), nullable=True)
    content = db.Column(db.Text, nullable=False)
    preview = db.Column(db.String(500), nullable=False)
    minutes_to_read = db.Column(db.Integer, nullable=False, default=1)  
    is_favourite = db.Column(db.Boolean, default=False)
    is_liked = db.Column(db.Boolean, default=False)
    published = db.Column(db.Boolean, default=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))     
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, onupdate=datetime.utcnow)

    user = db.relationship('User', back_populates='posts')
    comments = db.relationship('Comment', back_populates='post', cascade='all, delete-orphan')
    categories = db.relationship('Category', secondary='post_category', back_populates='posts')

    def to_dict(self):
        return {
            "id": self.id,
            'title': self.title,
            'content' : self.content,
            'image' : self.image,
            'preview' : self.preview,
            'minutes_to_read': self.minutes_to_read,
            'is_favourite': self.is_favourite,
            'is_liked': self.is_liked,
            'published': self.published,
            'user_id': self.user.username if self.user else None,
            'categories': [category.name for category in self.categories],
            'comments': [comment.id for comment in self.comments],
            'created_at' :  self.created_at
        }

    def __repr__(self):
        return f"<Post {self.title}>"

# PostCategory Model (Associative Table)
class PostCategory(db.Model):
    __tablename__ = 'post_category'
    __table_args__ = (
        UniqueConstraint('post_id', 'category_id', name='uq_post_category'),  
    )

    id = db.Column(db.Integer, primary_key=True)
    post_id = db.Column(db.Integer, db.ForeignKey('posts.id'), nullable=False)
    category_id = db.Column(db.Integer, db.ForeignKey('categories.id'), nullable=False)

    def __repr__(self):
        return f"<PostCategory post_id={self.post_id} category_id={self.category_id}>"

# Comment Model
class Comment(db.Model):
    __tablename__ = 'comments'

    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.Text, nullable=False)
    post_id = db.Column(db.Integer, db.ForeignKey('posts.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    post = db.relationship('Post', back_populates='comments')

    def to_dict(self):
        return{
            "id": self.id,
            'content' : self.content,
            'created_at': self.created_at,
            'username' : Comment.user.username
        }

    def __repr__(self):
        return f"<Comment {self.id} on Post {self.post_id}>"
