import { useState } from 'react'
import './Signup.css'
import wallpapertest from './assets/wallpaper-test.jpg'

function Signup({onSuccess}) {
    const [formData, setFormData] = useState({
    username: '',
    password: ''
    });
    const [statusMsg, setStatusMsg] = useState('');
    const [showPopup, setShowPopup] = useState(false);
    const handleChange = (e) => {
        setFormData({
        ...formData, // keep the other fields unchanged
        [e.target.name]: e.target.value // update the changed field
        });
    };
    const handleSkip = (e) =>{
        onSuccess();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
        const res = await fetch('http://localhost:5000/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });

        const data = await res.json();
        if (res.ok) {
            
            
            setStatusMsg('Signup successful!');
            setShowPopup(true);
            onSuccess(); // Switch to login
        } else {
            setStatusMsg('Signup Failed!');
            setShowPopup(true);
            console.log(data.error || 'Signup failed.');
        }
        } catch (error) {
            setStatusMsg('Error: Unable to reach backend.' || error);
            setShowPopup(true);
            console.log( error || "Error: Unable to reach backend.");
        }
        console.log("Submitted:", formData);
    };

    return(

        <div className='signup-area'>
            {showPopup && (
                <div className="popup-notification">
                    {statusMsg}
                </div>
            )}
            <div className='signup-grid'>

                <div className='wallpaper-area'>
                    <img src={wallpapertest} alt="Wallpaper" />
                </div>

                <form onSubmit={handleSubmit}>

                    <div className='username'>
                        <input className='custom-input' required type="text" name="username" placeholder="Username" value={formData.username} onChange={handleChange}/>

                    </div>

                    <div className='password'>
                        <input className='custom-input' required type="text" name="password" placeholder="Password" value={formData.password} onChange={handleChange}/>

                    </div>

                    <div className='button-container'>
                        <div className='login-button'>

                            <button className='custom-button' onClick={handleSkip}>Login</button>
                        </div>

                        <div className='button-area'>
                            <button className='custom-button' type="submit">Sign Up</button>
                        </div>
                        {statusMsg && <p className="status-message">{statusMsg}</p>}

                    </div>
                    
                    
                   

                   
                    
                </form>
                

                
                
            </div>
            

        </div>
        

    );

}

export default Signup