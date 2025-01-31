import { useState, useEffect } from 'react';

export default function Search() {
    const [query, setQuery] = useState('');
    const [category, setCategory] = useState('');
    const [categories, setCategories] = useState([]); // To store categories
    const [results, setResults] = useState({ posts: [], comments: [], users: [] });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch('http://127.0.0.1:5555/categories');
                if (!response.ok) throw new Error('Failed to fetch categories');
                const data = await response.json();
                setCategories(data);
            } catch (err) {
                setError(err.message);
            }
        };

        fetchCategories();
    }, []);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!query.trim()) {
            setError("Please enter a search term");
            return;
        }
        setLoading(true);
        setError('');
        try {
            const response = await fetch(`http://127.0.0.1:5555/search?query=${query}&category=${category}`);
            if (!response.ok) throw new Error('Failed to fetch search results');
            const data = await response.json();
            setResults(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="search-container">
            <form onSubmit={handleSearch}>
                <input
                    type="text"
                    placeholder="Search posts, comments, or users..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
                <select onChange={(e) => setCategory(e.target.value)} value={category}>
                    <option value="">All Categories</option>
                    {categories.length > 0 ? (
                        categories.map((cat) => (
                            <option key={cat.id} value={cat.name}>
                                {cat.name}
                            </option>
                        ))
                    ) : (
                        <option disabled>Loading categories...</option>
                    )}
                </select>
                <button type="submit" disabled={loading}>
                    {loading ? 'Searching...' : 'Search'}
                </button>
            </form>

            {error && <p style={{ color: 'red' }}>{error}</p>}

            <div className="search-results">
                <h2>Search Results</h2>

                <h3>Posts</h3>
                {results.posts.length > 0 ? (
                    results.posts.map((post) => (
                        <div key={post.id}>
                            <h4>{post.title}</h4>
                            <p>{post.content}</p>
                        </div>
                    ))
                ) : (
                    <p>No posts found</p>
                )}

                <h3>Comments</h3>
                {results.comments.length > 0 ? (
                    results.comments.map((comment) => (
                        <div key={comment.id}>
                            <p>{comment.content}</p>
                        </div>
                    ))
                ) : (
                    <p>No comments found</p>
                )}

                <h3>Users</h3>
                {results.users.length > 0 ? (
                    results.users.map((user) => (
                        <div key={user.id}>
                            <h4>{user.username}</h4>
                        </div>
                    ))
                ) : (
                    <p>No users found</p>
                )}
            </div>
        </div>
    );
}
