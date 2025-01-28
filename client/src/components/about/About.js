import React from "react";
import "./about.css";

export default function About() {
    return (
        <div className="about">
            <div className="aboutContainer">
                <img 
                    className="aboutImage" 
                    src="https://img.freepik.com/premium-photo/coffee-mug-by-notebook_53876-131365.jpg?w=1380" 
                    alt="About Us" 
                />
                <div className="aboutContent">
                    <h1>About My Blog</h1>
                    <p>
                        Welcome to My blog! Here, i share engaging content about
                        Music, Technology, Projects, News and also Lifestyle. My goal is to provide you with valuable insights,
                        inspiration, and updates that enrich your life and spark new ideas.
                    </p>
                    <h2>Why Follow Us?</h2>
                    <ul>
                        <li>👉 Regularly updated with fresh, high-quality content</li>
                        <li>👉 Diverse topics to suit a wide range of interests</li>
                        <li>👉 Engaging community of like-minded readers</li>
                    </ul>
                    <h2>My Goal</h2>
                    <p>
                        To be a leading Software developer and impact people lives positively.
                    </p>
                </div>
            </div>
        </div>
    );
}