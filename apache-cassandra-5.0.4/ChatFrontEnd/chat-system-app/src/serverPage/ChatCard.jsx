import './ChatCard.css'
import profilePicture from './profile-picture.png'
function ChatCard({message, username}){
    
    return(
        <div className='chat-card'>
            <div className='picture-area'>
                <img src={profilePicture} alt="profile picture" />
            </div>
            <div className='username-area'>
                <h1>{username}</h1>
            </div>
            <div className='message-area'>
                <p>{message}</p>
            </div>

        </div>
    );

}

export default ChatCard