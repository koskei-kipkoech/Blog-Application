import './postlist.css';
import { useEffect, useState } from 'react';
import {Link} from 'react-router-dom'

export default function Postlist() {
    const[posts, setPosts] = useState([]);
    useEffect(() => {
        fetch('http://127.0.0.1:5555/posts')
            .then((response) => response.json())
            .then((data) => setPosts(data))
            .catch((error) => console.error('Error fetching post'))
    }, []);

    const handleLike = (postId) => {
        fetch(`http://127.0.0.1:5555/post/${postId}/like`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' }
        })
        .then((response) => response.json())
        .then((data) => {
            setPosts(prevPosts =>
                prevPosts.map(post =>
                    post.id === postId ? { ...post, is_liked: !post.is_liked } : post
                )
            );
        })
        .catch((error) => console.error('Error updating like status', error));
    };

    // Function to toggle Favorite
    const handleFavorite = (postId) => {
        fetch(`http://127.0.0.1:5555/post/${postId}/favorite`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' }
        })
        .then((response) => response.json())
        .then((data) => {
            setPosts(prevPosts =>
                prevPosts.map(post =>
                    post.id === postId ? { ...post, is_favourite: data.is_favourite } : post
                )
            );
        })
        .catch((error) => console.error('Error updating favorite status', error));
    };
    return (<>
        <h1 className="title">Blog Posts</h1>
        <div className="postlist-container">
            {posts.length > 0 ? (
                posts.map((post) => (
                    <div key={post.id} className="post-card">
                        <Link className='link' to={`/postdetails/${post.id}`} id="post-title">
                            <h2>{post.title}</h2>
                        </Link>
                        <img
                            src={post.image || 'https://via.placeholder.com/150'} // Fallback image if none provided
                            alt={post.title}
                            className="post-image"
                        />
                        <p className="post-content">
                            {post.preview}
                        </p>
                        <div className="post-meta">
                            <span className="post-author">Author: {post.user_id}</span>
                            <span className="post-category">Category: {post.categories.join(', ')}</span>
                            <span className='post-minutes'>{post.minutes_to_read} mins read</span>
                            <span className="post-date">
                                Posted on: {new Date(post.created_at).toLocaleDateString()}
                            </span>
                        </div>
                        <div className="post-actions">
                            <button 
                                className={`like-button ${post.is_liked ? 'liked' : ''}`} 
                                onClick={() => handleLike(post.id)}
                            >
                                {post.is_liked ? 'Unlike' : 'Like'}
                            </button>
                            <button 
                                className={`favorite-button ${post.is_favourite ? 'favorited' : ''}`} 
                                onClick={() => handleFavorite(post.id)}
                            >
                                {post.is_favourite ? 'Unfavorite' : 'Favorite'}
                            </button>
                        </div>
                    </div>
                ))
            ) : (
                <p>Loading posts...</p>
            )}
        </div>
    </>);
}
