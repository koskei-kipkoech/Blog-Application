import "./navbar.css"
import { Link } from 'react-router-dom';


export default function TopBar() {

    return (
        <div className='top' >
            <div className="topLeft">
                <i className="topIcon fa-brands fa-linkedin"></i>
                <i className="topIcon fa-brands fa-github"></i>
                <i className="topIcon fa-brands fa-skype"></i>
                <i className="topIcon fa-brands fa-x-twitter"></i>
            </div>
            <div className="topCenter">
                <ul className="topList">
                    <li className="topListItem" ><Link className="link" to='/'>HOME</Link></li>
                    <li className="topListItem" ><Link className="link" to='/about'>ABOUT</Link></li>
                    <li className="topListItem" ><Link className="link" to='/postform'>ADDPOST</Link></li>
                    <li className="topListItem" ><Link className="link" to='/postdetails'>FAVOURITES</Link></li>
                    <li className="topListItem" ><Link className="link" to='/favliked'>LIKED</Link></li>
                    <li className="topListItem" ><Link className="link" to='/'>LOGOUT</Link></li>

                    
                </ul>
            </div>
            <div className="topRight">
                <Link className="link" to='settings'><i className="topSearchIcon fa-solid fa-gear"></i></Link>
                <Link className="link" to='/'><i className="topSearchIcon fa-solid fa-magnifying-glass"></i></Link>
                <Link className="link" id='login' to='/login'>Login</Link>
            </div>
        </div>
    )
}