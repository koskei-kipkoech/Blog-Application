import "./navbar.css";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Navbarr() {
    const { user, logout } = useAuth();
    console.log('Navbar = user: ', user);

    return (
        <div className="top">
            <div className="topLeft">
                <i className="topIcon fa-brands fa-linkedin"></i>
                <i className="topIcon fa-brands fa-github"></i>
                <i className="topIcon fa-brands fa-skype"></i>
                <i className="topIcon fa-brands fa-x-twitter"></i>
            </div>
            <div className="topCenter">
                <ul className="topList">
                    <li className="topListItem"><Link className="link" to="/">HOME</Link></li>
                    <li className="topListItem"><Link className="link" to="/about">ABOUT</Link></li>
                    {user ? (
                        <>
                            <li className="topListItem"><Link className="link" to="/postform">ADDPOST</Link></li>
                            <li className="topListItem"><Link className="link" to="/postdetails">FAVOURITES</Link></li>
                            <li className="topListItem"><Link className="link" to="/favliked">FAV/LIKED</Link></li>
                            <li className="topListItem" onClick={logout} style={{ cursor: "pointer" }}>LOGOUT</li>
                        </>
                    ) : (
                        <li className="topListItem"><Link className="link" to="/login">LOGIN</Link></li>
                    )}
                </ul>
            </div>
            <div className="topRight">
                {user ? (
                    <>
                        <Link className="link" to="/settings">
                            <i className="topSearchIcon fa-solid fa-gear"></i>
                        </Link>
                        <Link className="link" to="/">
                            <i className="topSearchIcon fa-solid fa-magnifying-glass"></i>
                        </Link>
                    </>
                ) : (
                    <Link className="link" to="/login" id="login">Login</Link>
                )}
            </div>
        </div>
    );
}
