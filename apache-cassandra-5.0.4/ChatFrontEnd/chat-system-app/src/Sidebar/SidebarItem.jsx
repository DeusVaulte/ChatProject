import './SidebarItem.css'


function SidebarItem({label, onClick}){
    const handleClick = () => {
    window.location.href = href;
    };
    return(

        <div className='sidebarItem' onClick={onClick} style={{ cursor: 'pointer' }}>
           <h1> {label} </h1>            
        </div>


    );


}

export default SidebarItem