import { useState } from 'react';
import './setting.css';

export default function Settings() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleUpdate = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem('token'); // Retrieve the JWT token from local storage
        if (!token) {
            setMessage('Authentication token is missing!');
            return;
        }

        const updatedData = {
            email,
            password
        };

        try {
            const response = await fetch('http://127.0.0.1:5555/updateuser', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` // Include the Bearer Token
                },
                body: JSON.stringify(updatedData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to update profile');
            }

            const result = await response.json();
            setMessage(result.message);
        } catch (error) {
            console.error('Error updating profile:', error);
            setMessage(error.message || 'Failed to update profile');
        }
    };

    return (
        <div className="settings">
            <div className="settingsWrapper">
                <div className="settingsTitle">
                    <span className="settingUpdateTitle">Update Your Account</span>
                    <span className="settingDeleteTitle">Delete Account</span>
                </div>
                <form className="settingsForm" onSubmit={handleUpdate}>    
                    <label>Email</label>
                    <input
                        type="email"
                        placeholder="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <label>Password</label>
                    <input
                        type="password"
                        placeholder="New password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button className="settingsSubmit" type="submit">Update</button>
                    {message && <span style={{color: message.includes("successfully") ? "green" : "red", textAlign: "center", marginTop: "20px"}}>{message}</span>}
                </form>
            </div>
        </div>
    );
}
