import React, { useState, useEffect } from 'react';
import './postform.css';
import { useNavigate } from 'react-router-dom';


export default function Postform() {
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        title: '',
        image: '',
        content: '',
        category: [],  
        preview: '',
        minutes_to_read: 0
    });

    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch('http://127.0.0.1:5555/categories');
                if (response.ok) {
                const data = await response.json();
                setCategories(data); 
                } else {
                console.error('Failed to fetch categories');
                }
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
            };
        
            fetchCategories();
        }, []);
        
        const handleCategoryClick = (categoryId) => {
            setFormData((prevData) => {
                const newCategories = new Set(prevData.category);
                if (newCategories.has(categoryId)) {
                    newCategories.delete(categoryId);
                } else {
                    newCategories.add(categoryId);
                }
                return { ...prevData, category: Array.from(newCategories) };
            });
        };
        

        const handleChange = (e) => {
            const { name, value, checked } = e.target;
            const categoryId = Number(value); 
        
            if (name === "category") {
                setFormData((prevData) => {
                    let newCategories = [...prevData.category];
        
                    if (checked) {
                        if (!newCategories.includes(categoryId)) {
                            newCategories.push(categoryId);
                        }
                    } else {
                        newCategories = newCategories.filter((id) => id !== categoryId);
                    }
                    return { ...prevData, category: newCategories };
                });
            } else {
                setFormData((prevData) => ({ ...prevData, [name]: value }));
            }
        };
        const handleSubmit = async (e) => {
            e.preventDefault();
        
            const token = localStorage.getItem('token');
            if (!token) {
                alert('Token is required for authentication.');
                return;
            }
        
            const { title, image, content, category, preview, minutes_to_read } = formData;
        
            const postData = {
                title,
                content,
                preview,
                minutes_to_read,
                image,
                category,  
            };
        
            try {
                const response = await fetch('http://127.0.0.1:5555/post', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(postData)
                });
        
                const data = await response.json();
                if (response.ok) {
                    alert('Post created successfully');
                    navigate('/')
                } else {
                    alert(`Error: ${data.message}`);
                }
            } catch (error) {
                console.error('Error creating post:', error);
                alert('There was an error creating the post.');
            }
        };
        

    return (
        <div className="postform-container">
            <h2 className="form-title">Create a New Post</h2>
            <form className="post-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="title">Post Title</label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={formData.title}
                        placeholder="Enter post title"
                        required
                        onChange={handleChange}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="image">Post Image URL</label>
                    <input
                        type="url"
                        id="image"
                        name="image"
                        value={formData.image}
                        placeholder="Enter image URL"
                        onChange={handleChange}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="content">Post Content</label>
                    <textarea
                        id="content"
                        name="content"
                        value={formData.content}
                        rows="4"
                        placeholder="Write your post content here"
                        required
                        onChange={handleChange}
                    ></textarea>
                </div>

                <div>
                    <label htmlFor=''>Categories Available</label>
                    {categories.map((category) => (
                        <div key={category.id} onClick={() => handleCategoryClick(category.id)}>
                            <input
                                type="checkbox"
                                id={`category-${category.id}`}
                                checked={formData.category.includes(category.id)}
                                readOnly
                            />
                            <label htmlFor={`category-${category.id}`}>{category.name}</label>
                        </div>
                    ))}
                </div>
                <div className="form-group">
                    <label htmlFor="preview">Post Preview</label>
                    <textarea
                        id="preview"
                        name="preview"
                        value={formData.preview}
                        rows="2"
                        placeholder="Enter a brief preview of the post"
                        required
                        onChange={handleChange}
                    ></textarea>
                </div>

                <div className="form-group">
                    <label htmlFor="minutes_to_read">Minutes to Read</label>
                    <input
                        type="number"
                        id="minutes_to_read"
                        name="minutes_to_read"
                        value={formData.minutes_to_read}
                        placeholder="Enter estimated reading time"
                        required
                        onChange={handleChange}
                    />
                </div>

                <button type="submit" className="submit-button">
                    Submit Post
                </button>
            </form>
        </div>
    );
}
