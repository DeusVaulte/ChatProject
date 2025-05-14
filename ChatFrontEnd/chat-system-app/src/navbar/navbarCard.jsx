
import './navbarCard.css'

function navbarCard({serverName, onClick}){

    return(
        <div className='navbar-card' onClick={onClick}>
            <h1>{serverName}</h1>
        </div>

    );


}

export default navbarCard