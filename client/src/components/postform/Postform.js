import './postform.css';

export default function Postform() {
    return (
        <div className="postform-container">
            <h2 className="form-title">Create a New Post</h2>
            <form className="post-form">
                <div className="form-group">
                    <label htmlFor="title">Post Title</label>
                    <input
                        type="text"
                        id="title"
                        name="title"
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
                        placeholder="Enter image URL"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="content">Post Content</label>
                    <textarea
                        id="content"
                        name="content"
                        rows="4"
                        placeholder="Write your post content here"
                        required
                    ></textarea>
                </div>

                <div className="form-group">
                    <label htmlFor="category">Category</label>
                    <select id="category" name="category" required>
                        <option value="">Select a category</option>
                        <option value="Technology">Technology</option>
                        <option value="Health">Health</option>
                        <option value="Lifestyle">Lifestyle</option>
                    </select>
                </div>

                <button type="submit" className="submit-button">
                    Submit Post
                </button>
            </form>
        </div>
    );
}
