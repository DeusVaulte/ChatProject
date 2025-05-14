import './ServersCard.css'

import serverCardWallpaper from './serverCard.png'

function ServersCard({serverName, onClick}){

    return(
        <div className='server-card'>
            <div className='server-wallpaper'>
                <img src={serverCardWallpaper} alt="Wallpaper" />
            </div>
            <div className='server-name-area'>
                <div className='server-name'>
                    <h1>{serverName}</h1>
                </div>
                <button className='custom-button' onClick={onClick}> Join </button>
            </div>
            

        </div>
    );

}

export default ServersCard
