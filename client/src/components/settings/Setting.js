import { useState } from 'react';
import './setting.css';

export default function Settings() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    // Function to handle updating user details
    const handleUpdate = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem('token'); 
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
                    'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify(updatedData),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to update profile');
            }
            const result = await response.json();
            setMessage(result.message);
            setEmail('');
            setPassword('');
            setTimeout(() => {
                setMessage('');
            }, 3000);
        } catch (error) {
            console.error('Error updating profile:', error);
            setMessage(error.message || 'Failed to update profile');
        }
    };
    const handleDelete = async () => {
        const token = localStorage.getItem('token'); 
        if (!token) {
            setMessage('Authentication token is missing!');
            return;
        }
        try {
            const response = await fetch('http://127.0.0.1:5555/deleteuser', {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}` 
                }
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to delete account');
            }
            const result = await response.json();
            setMessage(result.message);
            localStorage.removeItem('token'); 
            setTimeout(() => {
                window.location.href = '/login'; 
            }, 2000); 
        } catch (error) {
            console.error('Error deleting account:', error);
            setMessage(error.message || 'Failed to delete account');
        }
    };
    return (
        <div className="settings">
            <div className="settingsWrapper">
                <div className="settingsTitle">
                    <span className="settingUpdateTitle">Update Your Account</span>
                    <span className="settingDeleteTitle" onClick={handleDelete}>Delete Account</span>
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
