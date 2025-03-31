# Blog Application

A full-stack blog application built with React.js frontend and Flask backend. The application features user authentication, role-based access control, blog post management, and commenting system.

## Features

- User authentication (login/register)
- Role-based access control (different user types)
- Blog post creation and management
- Category management for posts
- Commenting system
- Responsive UI design

## Project Structure

```
├── client/          # React frontend
│   ├── public/      # Static files
│   └── src/         # Source files
│       ├── components/
│       ├── context/
│       └── App.js
└── server/          # Flask backend
    ├── app.py       # Main application file
    ├── models.py    # Database models
    ├── migrations/  # Database migrations
    └── seed.py      # Seed data
```

## Prerequisites

- Python 3.x
- Node.js and npm
- SQLite (or your preferred database)

## Installation

### Backend Setup

1. Navigate to the server directory:

   ```bash
   cd server
   ```

2. Create and activate a virtual environment:

   ```bash
   pipenv install
   pipenv shell
   ```

3. Install dependencies:

   ```bash
   pip install -r requirements.txt
   ```

4. Set up the database:

   ```bash
   flask db upgrade
   python seed.py
   ```

5. Start the Flask server:
   ```bash
   flask run
   ```

### Frontend Setup

1. Navigate to the client directory:

   ```bash
   cd client
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

## API Endpoints

- `POST /register` - Register a new user
- `POST /login` - User login
- `GET /posts` - Get all blog posts
- `POST /posts` - Create a new blog post (authenticated)
- `GET /categories` - Get all categories
- `POST /comments` - Add a comment to a post (authenticated)

## User Types

- Regular User: Can read posts and add comments
- Author: Can create and manage their own posts
- Admin: Full access to manage all content

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
