import './postlist.css';

export default function Postlist() {
    return (
        <div className="postlist-container">
            <div key="id" className="post-card">
                <h2 className="post-title">Sample Post Title</h2>
                <img
                    src="https://img.freepik.com/free-photo/orange-purple-confetti-with-copy-space_23-2148294709.jpg?t=st=1738056679~exp=1738060279~hmac=c3e7c0bbded54dbee3a0d731e59378e480cc48af568427520eaa582ee8e01bb9&w=1380"
                    alt="Sample Title"
                    className="post-image"
                />
                <p className="post-content">
                    This is a sample post content to display how the layout looks.
                </p>
                <div className="post-meta">
                    <span className="post-author">Author: John Doe</span>
                    <span className="post-category">Category: Technology</span>
                    <span className="post-date">Posted on: 01 Jan 2025</span>
                </div>
                <div className="post-actions">
                    <button className="like-button">Like</button>
                    <button className="favorite-button">Favorite</button>
                </div>
            </div>
            <div key="id" className="post-card">
                <h2 className="post-title">Sample Post Title</h2>
                <img
                    src="https://img.freepik.com/free-photo/orange-purple-confetti-with-copy-space_23-2148294709.jpg?t=st=1738056679~exp=1738060279~hmac=c3e7c0bbded54dbee3a0d731e59378e480cc48af568427520eaa582ee8e01bb9&w=1380"
                    alt="Sample Title"
                    className="post-image"
                />
                <p className="post-content">
                    This is a sample post content to display how the layout looks.
                </p>
                <div className="post-meta">
                    <span className="post-author">Author: John Doe</span>
                    <span className="post-category">Category: Technology</span>
                    <span className="post-date">Posted on: 01 Jan 2025</span>
                </div>
                <div className="post-actions">
                    <button className="like-button">Like</button>
                    <button className="favorite-button">Favorite</button>
                </div>
            </div>
            
        </div>
    );
}
