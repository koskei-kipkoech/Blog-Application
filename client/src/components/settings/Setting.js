import './setting.css'

export default function Settings(){
    return(
            <div className="settings">
                <div className="settingsWrapper">
                    <div className="settingsTitle">
                        <span className="settingUpdateTitle">Update Your Account</span>
                        <span className="settingDeleteTitle">Delete Account</span>
                    </div>
                    <form className="settingsForm" >    
                        <label>Username</label>
                        <input
                            type="text"
                            placeholder='username'
                        />
                        <label>Email</label>
                        <input
                            type="email"
                            placeholder='email'
                        />
                        <label>Password</label>
                        <input type="password" />
                        <button className="settingsSubmit" type="submit">Update</button>
                        <span style={{color:"green", textAlign:"center",marginTop:"20px"}}>Profile Has Been Updated...</span>
                    </form>
                </div>
            </div>
        );
}
