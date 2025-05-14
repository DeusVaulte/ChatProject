import { useState } from 'react'
import './Signup.css'
import wallpapertest from './assets/wallpaper-test.jpg'

function Login({onSuccess}) {
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
        const res = await fetch('http://localhost:5000/login', {
            
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });

        const data = await res.json();
        if (res.ok) {
            setStatusMsg('Login successful!');
            setShowPopup(true);
            console.log('Login successful!');
            setTimeout(() => setShowPopup(false), 3000);
            console.log("Submitted:", formData);
            onSuccess(formData.username); // Switch to app
        } else {
            setStatusMsg('Login Failed! || incorrect credentials');
            setShowPopup(true);
            console.log(data.error || 'Login failed.');
        }
        } catch (error) {
            console.log( error || "Error: Unable to reach backend.");
        }
        
    };

    return(

        <div className='signup-area'>
            {showPopup && (
                <div className="popup-notification">
                    <h1>{statusMsg}</h1>
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

                            <button className='custom-button'>Sign up</button>
                        </div>

                        <div className='button-area'>
                            <button className='custom-button' type="submit">Login</button>
                        </div>

                        

                    </div>
                    
                    
                   

                   

                </form>
                

                
                
            </div>
            

        </div>
        

    );

}

export default Login