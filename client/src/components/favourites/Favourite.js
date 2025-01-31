import { useState, useEffect } from 'react';
import './favourite.css';
import { Link } from 'react-router-dom';

export default function FavouriteLikedPost() {
    const [likedPosts, setLikedPosts] = useState([]);
    const [favoritePosts, setFavoritePosts] = useState([]);
    const [loadingLiked, setLoadingLiked] = useState(true);
    const [loadingFavorite, setLoadingFavorite] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        console.log("Token:", token); // Check token value
        if (!token) {
            setError("Token is missing! User might not be authenticated.");
            console.error("Token is missing!");
            return;
        }

        // Fetch liked posts
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
                console.log('Liked posts data:', data); // Debugging data
                setLikedPosts(data);
            } catch (error) {
                setError(`Error fetching liked posts: ${error.message}`);
                console.error("Error fetching liked posts:", error);
            } finally {
                setLoadingLiked(false);
            }
        };

        // Fetch favorite posts
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
                console.log('Favorite posts data:', data); // Debugging data
                setFavoritePosts(data);
            } catch (error) {
                setError(`Error fetching favorite posts: ${error.message}`);
                console.error("Error fetching favorite posts:", error);
            } finally {
                setLoadingFavorite(false);
            }
        };

        fetchLikedPosts();
        fetchFavoritePosts();
    }, []);

    return (
        <div className="container">
            {error && <p className="error-message">{error}</p>}
            <div className="main-content">
                <h2>Favorite Posts</h2>
                {loadingFavorite ? (
                    <p>Loading favorite posts...</p>
                ) : favoritePosts.length > 0 ? (
                    <ul>
                        {favoritePosts.map(post => (
                            <li key={post.id}>
                                <h3><Link className='link' to={`/postdetails/${post.id}`}>{post.title}</Link></h3>
                                {post.image && <img className='fav' src={post.image} alt={post.title} />}
                                <p>{post.preview}</p>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No favorite posts found.</p>
                )}
            </div>
            <div className="sidebar">
                <h2>Liked Posts</h2>
                {loadingLiked ? (
                    <p>Loading liked posts...</p>
                ) : likedPosts.length > 0 ? (
                    <ul>
                        {likedPosts.map(post => (
                            <li key={post.id}>
                                <h3>{post.title}</h3>
                                {post.image && <img className='likeds' src={post.image} alt={post.title} />}
                                <p>{post.preview}</p>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No liked posts found.</p>
                )}
            </div>
        </div>
    );
}
