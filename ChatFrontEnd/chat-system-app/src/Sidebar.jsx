import { useContext } from 'react';
import './Sidebar.css'
import SidebarItem from './Sidebar/SidebarItem';
import SidebarLogo from './Sidebar/SidebarLogo';
import UserContext from './userContext.js';

function Sidebar({onSelect}){
    const { username } = useContext(UserContext);

    return(
        <div className='sidebar'>
            <SidebarLogo/>
            <h1>Welcome, {username}</h1>
            <SidebarItem label="Server" onClick={() => onSelect('home')}/>
            <SidebarItem label="Servers List" onClick={() => onSelect('servers')}/>
            <SidebarItem label="Settings" onClick={() => onSelect('settings')}/>
            
        </div>


    );



}

export default Sidebar