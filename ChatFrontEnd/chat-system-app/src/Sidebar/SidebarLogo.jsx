import './SidebarLogo.css'
import logo from './Logo.png'
function SidebarLogo(){

    return(
        <div className='imgdiv'>
            <img src={logo} alt="logo" height="100%"/>
        </div>

    );

}

export default SidebarLogo