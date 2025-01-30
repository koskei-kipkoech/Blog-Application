import { useState, useEffect } from 'react';
import './favourite.css';
import { Link } from 'react-router-dom'

export default function FavouriteLikedPost() {
    const [likedPosts, setLikedPosts] = useState([]);
    const [favoritePosts, setFavoritePosts] = useState([]);

    // Fetch liked posts
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error("Token is missing! User might not be authenticated.");
            return;
        }
    
        const fetchLikedPosts = async () => {
            try {
                const response = await fetch('http://127.0.0.1:5555/posts/liked', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (!response.ok) throw new Error("Failed to fetch liked posts");
                const data = await response.json();
                setLikedPosts(data);
            } catch (error) {
                console.error("Error fetching liked posts:", error);
            }
        };
    
        const fetchFavoritePosts = async () => {
            try {
                const response = await fetch('http://127.0.0.1:5555/posts/favorites', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (!response.ok) throw new Error("Failed to fetch favorite posts");
                const data = await response.json();
                setFavoritePosts(data);
            } catch (error) {
                console.error("Error fetching favorite posts:", error);
            }
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
                            <h3><Link className='link' to={`/postdetails/${post.id}`}>{post.title}</Link></h3>
                            {post.image && <img className='fav' src={post.image} alt={post.title} />}
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
                            {post.image && <img className='likeds' src={post.image} alt={post.title} />}
                            <p>{post.preview}</p>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
