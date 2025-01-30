import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import "./login.css";

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setErrorMessage("");
    
        try {
            const response = await fetch("http://127.0.0.1:5555/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });
            if (!response.ok) {
                throw new Error(`Login Failed ${response.status}`);
            }
    
            const data = await response.json();
            if (response.status === 200) {
                console.log('Logged in user', data.user);
                login(data.user, data.token); // Pass both user and token
                navigate("/"); // Redirect after login
            } else {
                setErrorMessage(data.message);
            }
        } catch (error) {
            setErrorMessage(error.message || "Login failed. Please try again.");
        }
    };
    

    return (
        <div className="login">
        <span className="loginTitle">Login</span>
        <form className="loginForm" onSubmit={handleLogin}>
            <label>Username</label>
            <input
            className="loginInput"
            type="text"
            placeholder="Enter your username..."
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            />
            <label>Password</label>
            <input
            className="loginInput"
            type="password"
            placeholder="Enter your password..."
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            />
            <button className="loginButton" type="submit">Login</button>
        </form>
        {errorMessage && <p className="error">{errorMessage}</p>}
        <button className="loginRegisterButton">
            <Link className="link" to="/register">Register</Link>
        </button>
        </div>
    );
}
