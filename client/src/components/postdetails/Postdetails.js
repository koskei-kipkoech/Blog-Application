import './postdetail.css';
import { useState } from 'react';

export default function Postdetails() {
    // Static post data
    const post = {
        title: "Understanding React State",
        image: "https://img.freepik.com/free-photo/green-confetti-yellow-background_23-2148294815.jpg?t=st=1738062277~exp=1738065877~hmac=d2d44c27fff51b770c760cfbaf33664d126bfd9ec03a7a050a0daee071e53df8&w=1480",
        content: "React state is an essential concept that helps in handling data changes dynamically in components...",
        author: "John Doe",
        category: "Technology",
        createdAt: "2025-01-28T14:20:00Z"
    };

    // Static comments data
    const [comments, setComments] = useState([
        { id: 1, username: "Alice", content: "Great article! It was very helpful." },
        { id: 2, username: "Bob", content: "I love how you explained React state in such a simple way." },
    ]);

    const [newComment, setNewComment] = useState("");

    // Handle comment submission
    const handleCommentSubmit = (e) => {
        e.preventDefault();
        if (newComment.trim() === "") return;

        const newCommentData = {
            id: comments.length + 1, // Incremental ID
            username: "Guest", // Placeholder username
            content: newComment,
        };

        setComments([...comments, newCommentData]);
        setNewComment(""); // Clear the input field
    };

    return (
        <div className="post-container">
            <h1 className="post-title">{post.title}</h1>
            <img src={post.image} alt={post.title} className="post-image" />
            <p className="post-content">{post.content}</p>

            <div className="post-meta">
                <span className="post-author">Author: {post.author}</span>
                <span className="post-category">Category: {post.category}</span>
                <span className="post-date">Posted on: {new Date(post.createdAt).toLocaleDateString()}</span>
            </div>

            {/* Comments Section */}
            <div className="comments-section">
                <h3>Comments</h3>
                <ul className="comments-list">
                    {comments.map((comment) => (
                        <li key={comment.id} className="comment-item">
                            <strong>{comment.username}:</strong> {comment.content}
                        </li>
                    ))}
                </ul>

                {/* Add Comment Form */}
                <form className="comment-form" onSubmit={handleCommentSubmit}>
                    <textarea
                        className="comment-input"
                        placeholder="Write a comment..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                    ></textarea>
                    <button type="submit" className="comment-submit-btn">
                        Post Comment
                    </button>
                </form>
            </div>
        </div>
    );
}
