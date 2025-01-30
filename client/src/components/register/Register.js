import './register.css'
import React,{useState} from 'react';

export default function Register(){
    const [username,setUsername] = useState('');
    const [email,setEmail] = useState('');
    const [password,setPassword] = useState('');
    const [userType,setUserType] = useState('');
    const [error,setError] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();

        const userData = {
            username,
            email,
            password,
            user_type_id:userType,
        };
        fetch('http://127.0.0.1:5555/register',{
            method: 'POST',
            headers:{
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.message){
                    console.log(data.message);
                }
            })
            .catch((err) => {
                setError('Error registering user')
                console.error('Error',err);
            });

        }
    return(
        <div className="register">
        <span className="registerTitle">Register</span>
        <form className="registerForm" onSubmit={handleSubmit}>
            <label>Username</label>
            <input className="registerInput" type="text" placeholder="Enter your username..." value={username} onChange={(e) => setUsername(e.target.value)} />
            <label>Email</label>
            <input className="registerInput" type="text" placeholder="Enter your email..." value={email} onChange={(e) => setEmail(e.target.value)} />
            <label>Password</label>
            <input className="registerInput" type="password" placeholder="Enter your password..." value={password} onChange={(e) => setPassword(e.target.value)}/>
            <label>User Type</label>
                <select
                    className="registerInput"
                    value={userType}
                    onChange={(e) => setUserType(e.target.value)}>
                    <option value="">Select a user type</option>
                    <option value="1">Reader</option>
                    <option value="2">Admin</option>
                    <option value="3">Author</option>
                </select>
            <button className="registerButton" type="submit">Register</button>
        </form>
        {error && <p className="error">{error}</p>}
        <button className="registerLoginButton">
            Login
        </button>
    </div>
    )
}