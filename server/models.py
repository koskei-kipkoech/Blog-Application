from datetime import datetime
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy_serializer import SerializerMixin
from sqlalchemy import CheckConstraint
from email_validator import validate_email, EmailNotValidError
from sqlalchemy.orm import validates
from flask_bcrypt import Bcrypt

bcrypt = Bcrypt()
db = SQLAlchemy()

# User Model
class User(db.Model, SerializerMixin):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(255), nullable=False)
    email = db.Column(db.String(255), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    is_author = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, onupdate=datetime.utcnow)

    author = db.relationship('Author', back_populates='user', uselist=False)

#validation for user
    @validates('email')
    def validate_email(self,key, email):
        try:
            validate_email(email)
            return email
        except EmailNotValidError:
            raise ValueError('Invalid Email Address')
        
    def set_password(self, password):
        self.password = bcrypt.generate_password_hash(password).decode('utf-8')
    
    def check_password(self, password):
        return bcrypt.check_password_hash(self.password,password)
    def __repr__(self):
        return f'<User {self.username}>'


# Author Model
class Author(db.Model, SerializerMixin):
    __tablename__ = 'author'

    id = db.Column(db.Integer, primary_key=True)
    bio = db.Column(db.Text, nullable=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), unique=True, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, onupdate=datetime.utcnow)

    user = db.relationship('User', back_populates='author')
    posts = db.relationship('Post', back_populates='author')

    def __repr__(self):
        return f'<Author {self.user.username}>'


# Category Model
class Category(db.Model, SerializerMixin):
    __tablename__ = 'category'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, onupdate=datetime.utcnow)

    posts = db.relationship('Post', back_populates='categories', secondary='post_category')

    def __repr__(self):
        return f'<Category {self.name}>'


# Post Model
class Post(db.Model, SerializerMixin):
    __tablename__ = 'posts'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    image = db.Column(db.String(255), nullable=True)
    content = db.Column(db.Text, nullable=False)
    preview = db.Column(db.String(255), nullable=True)  # New column for preview
    minutes_to_read = db.Column(db.Integer, nullable=True) 
    author_id = db.Column(db.Integer, db.ForeignKey('author.id'), nullable=False)
    category_id = db.Column(db.Integer, db.ForeignKey('category.id'), nullable=True)
    is_favourite = db.Column(db.Boolean, default=False)
    is_liked = db.Column(db.Boolean, default=False)
    published = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, onupdate=datetime.utcnow)

    author = db.relationship('Author', back_populates='posts')
    comments = db.relationship('Comment', back_populates='post')
    categories = db.relationship('Category', back_populates='posts', secondary='post_category')

    __table_args__ =(CheckConstraint('minutes_to_read >=0', name='check_minutes_to_read'),)
    def __repr__(self):
        return f'<Post {self.title}>'


# Comment Model
class Comment(db.Model, SerializerMixin):
    __tablename__ = 'comments'

    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.Text, nullable=False)
    post_id = db.Column(db.Integer, db.ForeignKey('posts.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    post = db.relationship('Post', back_populates='comments')

    def __repr__(self):
        return f'<Comment {self.content[:30]}>'


# PostCategory Model (Associative Table for Many-to-Many Relationship)
class PostCategory(db.Model, SerializerMixin):
    __tablename__ = 'post_category'

    id = db.Column(db.Integer, primary_key=True)
    post_id = db.Column(db.Integer, db.ForeignKey('posts.id'), nullable=False)
    category_id = db.Column(db.Integer, db.ForeignKey('category.id'), nullable=False)

    def __repr__(self):
        return f'<PostCategory Post:{self.post_id} Category:{self.category_id}>'
