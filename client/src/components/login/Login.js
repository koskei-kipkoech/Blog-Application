import { Link } from 'react-router-dom'
import './login.css'
import {useState} from 'react'

export default function Login(){
    const [username,setUsername] = useState('')
    const [password,setPassword] = useState('')
    const [errorMessage,setErrorMessage] = useState('')

    const handleLogin = async(e) => {
        e.preventDefault()
        const response  = await  fetch('http://127.0.0.1:5555/login',{
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({username, password})
        });
        const data = await response.json();
        if (response.status ===200){
            alert('Login successful')
            console.log(data.token);
        }else{
            setErrorMessage(data.message);
        }
    };

    return(
        <div className="login">
            <span className="loginTitle">Login</span>
            <form className="loginForm" onSubmit={handleLogin}>
                <label>Username</label>
                <input className="loginInput" type="text" placeholder="Enter your username..." value={username} onChange={(e) => setUsername(e.target.value)}/>
                <label>Password</label>
                <input className="loginInput" type="password" placeholder="Enter your password..." value={password} onChange={(e) => setPassword(e.target.value)}/>
                <button className="loginButton" type="submit">Login</button>
            </form>
            {errorMessage && <p className='error'>{errorMessage}</p>}
            <button className="loginRegisterButton"><Link className='link' to='/register'>Register</Link></button>
            
        </div>
    )
}

