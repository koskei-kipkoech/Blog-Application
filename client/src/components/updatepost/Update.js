import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './update.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:5555';

export default function UpdatePost() {
    const { postId } = useParams();
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    const [formData, setFormData] = useState({
        title: '',
        image: '',
        content: '',
        preview: '',
        minutes_to_read: '',
        categories: [],  
    });

    const [categories, setCategories] = useState([]);  
    const [loading, setLoading] = useState(false); 

    // Helper function to handle fetch requests
    const fetchData = async (url, options = {}) => {
        try {
            const response = await fetch(url, options);
            if (!response.ok) throw new Error('Failed to fetch data.');
            return await response.json();
        } catch (error) {
            console.error(error);
            alert(`Error: ${error.message || 'An error occurred while fetching data'}`);
            throw error;
        }
    };

    // Fetch categories and post data
    useEffect(() => {
        if (!token) {
            alert("Please log in to update posts.");
            navigate('/login');
            return;
        }

        setLoading(true);

        Promise.all([
            fetchData(`${API_URL}/categories`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            }),
            fetchData(`${API_URL}/post/${postId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            }),
        ])
            .then(([categoriesData, postData]) => {
                setCategories(categoriesData);
                setFormData({
                    title: postData.title,
                    image: postData.image,
                    content: postData.content,
                    preview: postData.preview,
                    minutes_to_read: postData.minutes_to_read,
                    categories: postData.categories.map(category => category.id),  
                });
            })
            .catch(() => {
                navigate('/');
            })
            .finally(() => setLoading(false));
    }, [postId, token, navigate]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
    
        if (name === 'categories') {
            setFormData((prevData) => {
                const updatedCategories = checked
                    ? [...prevData.categories, value]
                    : prevData.categories.filter((id) => id !== value);
    
                return { ...prevData, categories: updatedCategories };
            });
        } else {
            setFormData((prevData) => ({
                ...prevData,
                [name]: value,
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        if (!formData.title || !formData.content || !formData.minutes_to_read || formData.categories.length === 0) {
            alert("Please fill in all required fields and select at least one category.");
            return;
        }
    
        if (!token) {
            alert("Please log in to update posts.");
            navigate('/login');
            return;
        }
        const updatedCategories = formData.categories.map(id => parseInt(id, 10)).filter(id => !isNaN(id));
        try {
            const response = await fetch(`${API_URL}/post/${postId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    ...formData,
                    categories: updatedCategories,
                }),
            });
    
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to update post.');
            }
    
            alert('Post updated successfully! Click OK!');
            navigate('/');
        } catch (error) {
            console.error('Error updating post:', error);
            alert(`Error: ${error.message}`);
        }
    };
    

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="postform-container">
            <h2 className="form-title">Update Post</h2>
            <form className="post-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="title">Post Title</label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="Enter post title"
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="image">Post Image URL</label>
                    <input
                        type="url"
                        id="image"
                        name="image"
                        value={formData.image}
                        onChange={handleChange}
                        placeholder="Enter image URL"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="content">Post Content</label>
                    <textarea
                        id="content"
                        name="content"
                        value={formData.content}
                        onChange={handleChange}
                        placeholder="Write your post content here"
                        required
                    ></textarea>
                </div>
                <div className="form-group">
                    <label htmlFor="preview">Post Preview</label>
                    <textarea
                        id="preview"
                        name="preview"
                        value={formData.preview}
                        onChange={handleChange}
                        placeholder="Enter a brief preview of the post"
                        required
                    ></textarea>
                </div>
                <div className="form-group">
                    <label htmlFor="minutes_to_read">Minutes to Read</label>
                    <input
                        type="number"
                        id="minutes_to_read"
                        name="minutes_to_read"
                        value={formData.minutes_to_read}
                        onChange={handleChange}
                        placeholder="Enter estimated reading time"
                        required
                    />
                </div>

                {/* Category Checkboxes */}
                <div className="form-group">
                    <label htmlFor="categories">Categories</label>
                    {categories.map((category) => (
                        <div key={category.id}>
                            <input
                                type="checkbox"
                                id={`category-${category.id}`}
                                name="categories"
                                value={category.id}
                                checked={formData.categories.includes(category.id.toString())}
                                onChange={handleChange}
                            />
                            <label htmlFor={`category-${category.id}`}>{category.name}</label>
                        </div>
                    ))}
                </div>

                <button type="submit" className="submit-button">Update Post</button>
            </form>
        </div>
    );
}
