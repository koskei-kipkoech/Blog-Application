import { useParams, useNavigate } from 'react-router-dom';
import './postdetail.css';
import { useState, useEffect } from 'react';

export default function Postdetails() {
    const { postId } = useParams();
    const [post, setPost] = useState(null);
    const [newComment, setNewComment] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const userId = localStorage.getItem('userId');
    if (!userId) {
        console.log('User ID not found in localStorage');
    }
    

    useEffect(() => {
        
        fetch(`http://127.0.0.1:5555/post/${postId}`)
            .then((response) => response.json())
            .then((data) => setPost(data))
            .catch((error) => console.error('Error fetching post details', error));
    }, [postId]);

    const handleCommentChange = (e) => {
        setNewComment(e.target.value);
    };

    const handleSubmitComment = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) {
            setError("Comment cannot be empty.");
            return;
        }

        try {
            const response = await fetch(`http://127.0.0.1:5555/comments/post/${postId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ content: newComment }), 
            });

            if (!response.ok) {
                throw new Error("Failed to add comment.");
            }

            const addedComment = await response.json();
            setPost((prevPost) => ({
                ...prevPost,
                comments: [...prevPost.comments, addedComment], 
            }));

            setNewComment('');
            setError('');
        } catch (err) {
            console.error('Error adding comment:', err);
            setError("Failed to add comment.");
        }
    };
    const handleUpdateClick = () => {
        navigate(`/update/${postId}`); 
    };
    const handleDeleteClick = () => {
        const confirmDelete = window.confirm("Are you sure you want to delete this post?");
        if (confirmDelete) {
            const token = localStorage.getItem("token"); 
            if (!token) {
                alert("You need to be logged in to delete a post.");
                return;
            }
    
            fetch(`http://127.0.0.1:5555/post/${postId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`, 
                    'Content-Type': 'application/json'
                },
            })
            .then((response) => {
                if (!response.ok) {
                    return response.json().then((data) => {
                        throw new Error(data.message || "Failed to delete the post.");
                    });
                }
                // Navigate back to the home page after deletion
                navigate('/');
            })
            .catch((error) => {
                console.error('Error deleting post:', error);
                alert(error.message);
            });
        }
    };
    

    if (!post) {
        return <p>Loading post...</p>;
    }

    return (
        <div className="post-container">
            <h1 className="post-title">{post.title}</h1>
            <span className="post-author">Author: {post.user_id}</span>
            
            <img src={post.image} alt={post.title} className="post-image" />
            <p className="post-content">{post.content}</p>
            <div className="post-meta">
                <span className="post-category">Category: {post.categories.join(', ')}</span>
                <span className="post-category">Read: {post.minutes_to_read} mins</span>
                <span className="post-date">Posted on: {new Date(post.created_at).toLocaleDateString()}</span>
                <span className='update' onClick={handleUpdateClick}>✏️</span>
                <span className='delete' onClick={handleDeleteClick}>🗑️</span>
            </div>

            {/* Comments Section */}
            <div className="comments-section">
                <h3>Comments</h3>
                <ul className="comments-list">
                    {post.comments.map((comment) => (
                        <li key={comment.id} className="comment-item">
                            <strong>{comment.username}:</strong> {comment.content}
                        </li>
                    ))}
                </ul>

                {/* New Comment Form */}
                <form onSubmit={handleSubmitComment} className="comment-form">
                    <textarea
                        value={newComment}
                        onChange={handleCommentChange}
                        placeholder="Write your comment here..."
                        className="comment-input"
                    />
                    <button type="submit" className="comment-submit">Post Comment</button>
                    {error && <p className="error-message">{error}</p>}
                </form>
            </div>
        </div>
    );
}
