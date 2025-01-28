import "./navbar.css"

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
                    <li className="topListItem" >HOME</li>
                    <li className="topListItem" >ABOUT</li>
                    <li className="topListItem" >NEWPOST</li>
                    <li className="topListItem" >FAVOURITEPOSTS</li>
                    <li className="topListItem" >LOGOUT</li>

                    
                </ul>
            </div>
            <div className="topRight">
            <i className="topSearchIcon fa-solid fa-gear"></i>
            <i className="topSearchIcon fa-solid fa-magnifying-glass"></i>
            </div>
        </div>
    )
}