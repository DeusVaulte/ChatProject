import { useState } from 'react';
import Signup from './Signup.jsx';
import Login from './Login.jsx';
import App from './App.jsx';
import UserContext from './userContext.js';
function Central(){

    const [screen, setScreen] = useState('signup'); // signup is first Displayed
    const [username, setUsername] = useState(null); // global username

    const handleSignupSuccess = () => setScreen('login');
    const handleLoginSuccess = (uname) => {
        setUsername(uname);
        setScreen('app')
    };

    return(
        <UserContext.Provider value={{ username, setUsername }}>
            
                {screen === 'signup' && <Signup onSuccess={handleSignupSuccess} />}
                {screen === 'login' && <Login onSuccess={handleLoginSuccess} />}
                {screen === 'app' && <App />}
            

        </UserContext.Provider>
        

    );


}

export default Central