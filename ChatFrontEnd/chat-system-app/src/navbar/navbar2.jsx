import { useEffect, useState, useContext } from 'react'
import './navbar.css'
import UserContext from '../userContext.js';
import NavbarCard from './navbarCard.jsx'


function navbar2({ onServerClick }){
    const { username } = useContext(UserContext);
    const [servers, setServers] = useState([]);
    useEffect(() => {
        const fetchServers = async () => {
        try {
            const res = await fetch(`http://localhost:5000/getJoinedServers?username=${username}`);
            const data = await res.json();
            setServers(data);
        } catch (error) {
            console.error("Failed to fetch servers:", error);
        }
        };
        fetchServers();
    }, []);

    const handleServerClick = async (id) => {
        console.log("Clicked server ID:", id);
        onServerClick(id);
    };

    return(
        <div className='navbar-area'>
            {servers.map((server) => (
                <NavbarCard key={server.server_id} serverName={server.server_name} onClick={() => handleServerClick(server.server_id)}  />
            ))}

            
        </div>

    );


}

export default navbar2