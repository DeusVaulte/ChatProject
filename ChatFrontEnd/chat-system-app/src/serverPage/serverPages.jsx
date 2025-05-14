import { useEffect, useState, useContext } from 'react';
import './serverPages.css'
import ChatCard from './ChatCard.jsx'
import SendButton from './send-button.png'
import UserContext from '../userContext.js';
function serverPages({ serverId }){
    const { username } = useContext(UserContext);
    const [messages, setMessages] = useState([]);
    const [messageText, setMessageText] = useState('');
    useEffect(() => {
      let interval;

      if (serverId) {
        const fetchMessages = async () => {
          try {
            const res = await fetch(`http://localhost:5000/getMessages?server_id=${serverId}`);
            const data = await res.json();
            console.log("Fetched messages:", data);
            setMessages(data);
          } catch (error) {
            console.error("Failed to fetch messages:", error);
          }
        };

        // Fetch once immediately
        fetchMessages();

        // Then set up polling every 5 seconds
        interval = setInterval(fetchMessages, 500);
      }

      // Cleanup interval on unmount or when serverId changes
      return () => clearInterval(interval);
    }, [serverId]);

// Send message to Flask backend
  const handleSendMessage = async () => {
    if (!messageText.trim()) return;

    try {
      const res = await fetch('http://localhost:5000/sendMessage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          server_id: serverId,
          username: username,
          messages: messageText,
        }),
      });

      if (res.ok) {
        setMessageText(''); // Clear input
        const newMessages = await res.json();
        
      }
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  };


    return(
        
        <div className='server-pages-container'>
            <div className='server-pages'>
                
                
                {Array.isArray(messages) && messages.map((msg) => (
                    <ChatCard key={msg.message_id} message={msg.messages} username={msg.username} />
                ))}
            
          

            </div>
            <div className='server-input'>
                <textarea className="custom-textarea" placeholder={"Type your message here..."} value={messageText}  onChange={(e) => setMessageText(e.target.value)}/>
                <button className='send-button' onClick={handleSendMessage}> 
                    <img src={SendButton}/>
                </button>
            </div>
        </div>
        
        

    )

}

export default serverPages