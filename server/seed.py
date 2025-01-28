#!/usr/bin/env python3

from random import randint
from faker import Faker
from datetime import datetime

from app import app
from models import db, User, Author, Post, Category, Comment, PostCategory

fake = Faker()

with app.app_context():
    # Clearing existing data
    print("Deleting all records...")
    Comment.query.delete()
    PostCategory.query.delete()
    Post.query.delete()
    Category.query.delete()
    Author.query.delete()
    User.query.delete()

    # Creating Users
    print("Creating users...")
    users = []
    for _ in range(10):  # Create 10 users for example
        username = fake.first_name()
        email = fake.email()
        password = fake.password()
        user = User(username=username, email=email, password=password)
        users.append(user)

    db.session.add_all(users)
    db.session.commit()

    # Creating Authors
    print("Creating authors...")
    authors = []
    for user in users:
        bio = fake.paragraph(nb_sentences=3)
        author = Author(bio=bio, user_id=user.id)
        authors.append(author)

    db.session.add_all(authors)
    db.session.commit()

    # Creating Categories
    print("Creating categories...")
    categories = ['Technology', 'Health', 'Science', 'Lifestyle', 'Business']
    category_objects = []
    for category_name in categories:
        category = Category(name=category_name)
        category_objects.append(category)

    db.session.add_all(category_objects)
    db.session.commit()

    # Creating posts
    print("Creating posts...")
    posts = []
    for _ in range(20):  # Create 20 posts for example
        title = fake.sentence(nb_words=5)
        content = fake.paragraph(nb_sentences=8)
        preview = content[:25] + '...'  # Truncate the content for preview
        minutes_to_read = randint(1, 10)
        author = fake.random_element(authors)
        category = fake.random_element(category_objects)
        image = fake.image_url()  # This will generate a random image URL

        post = Post(
            title=title,
            content=content,
            preview=preview,
            minutes_to_read=minutes_to_read,
            author_id=author.id,
            category_id=category.id,
            image=image,  # Add the image URL here
            is_favourite=False,
            is_liked=False,
            published=True
        )
        posts.append(post)

    db.session.add_all(posts)
    db.session.commit()

    # Creating PostCategory (Associative table for many-to-many relationship)
    print("Creating post categories...")
    post_categories = []
    for post in posts:
        # You can randomly assign categories to posts, ensuring there's a relation
        categories_for_post = fake.random_elements(category_objects, length=randint(1, 3), unique=True)
        for category in categories_for_post:
            post_category = PostCategory(post_id=post.id, category_id=category.id)
            post_categories.append(post_category)

    db.session.add_all(post_categories)
    db.session.commit()

    # Creating Comments
    print("Creating comments...")
    comments = []
    for post in posts:
        content = fake.sentence(nb_words=10)
        comment = Comment(content=content, post_id=post.id)
        comments.append(comment)

    db.session.add_all(comments)
    db.session.commit()

    print("Complete!")
