import { useEffect, useState, useContext } from 'react';

import './Servers.css'
import ServersCard from './serversCard';
import UserContext from '../userContext.js';
function Servers(){
    const [servers, setServers] = useState([]);
    const { username } = useContext(UserContext);

    useEffect(() => {
        const fetchServers = async () => {
        try {
            const res = await fetch('http://localhost:5000/getServers');
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
        // Do something with the    server ID, like load server-specific data
         try {
        const res = await fetch('http://localhost:5000/joinServers', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: username,
                server_id: id
            })
        });

        const data = await res.json();
        if (res.ok) {
           console.log('Successfully joined server:', id);
        } else {
            console.error(data.error || 'Failed to join server.')
        }
        } catch (error) {
            console.log("Error: Unable to reach backend.");
        }
    };

    return(
        <div className='servers-list'>
            {servers.map((server) => (
                <ServersCard key={server.server_id} serverName={server.server_name} onClick={() => handleServerClick(server.server_id)}/>
            ))}

            
            
            
        </div>

    );


}

export default Servers