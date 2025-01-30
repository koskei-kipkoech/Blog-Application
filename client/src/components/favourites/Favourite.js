import { useState, useEffect } from 'react';
import './favourite.css';

export default function FavouriteLikedPost() {
    const [likedPosts, setLikedPosts] = useState([]);
    const [favoritePosts, setFavoritePosts] = useState([]);

    // Fetch liked posts
    useEffect(() => {
        const fetchLikedPosts = async () => {
            const response = await fetch('/posts/liked', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}` // Assuming you have a JWT token stored
                }
            });
            const data = await response.json();
            setLikedPosts(data);
        };

        // Fetch favorite posts
        const fetchFavoritePosts = async () => {
            const response = await fetch('/posts/favorites', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}` // Assuming you have a JWT token stored
                }
            });
            const data = await response.json();
            setFavoritePosts(data);
        };

        fetchLikedPosts();
        fetchFavoritePosts();
    }, []);

    return (
        <div className="container">
            <div className="main-content">
                <h2>Favorite Posts</h2>
                <ul>
                    {favoritePosts.map(post => (
                        <li key={post.id}>
                            <h3>{post.title}</h3>
                            {post.image && <img src={post.image} alt={post.title} />}
                            <p>{post.preview}</p>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="sidebar">
                <h2>Liked Posts</h2>
                <ul>
                    {likedPosts.map(post => (
                        <li key={post.id}>
                            <h3>{post.title}</h3>
                            {post.image && <img src={post.image} alt={post.title} />}
                            <p>{post.preview}</p>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
