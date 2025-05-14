import { useState } from 'react'

import './App.css'
import Sidebar from './Sidebar';
import Servers from './servers/servers';
import Navbar1 from './navbar/navbar1.jsx';
import Navbar2 from './navbar/navbar2.jsx';
import ServerPages from './serverPage/serverPages.jsx';
function App() {

  const [selectedServerId, setSelectedServerId] = useState(null);
  const [currentView, setCurrentView] = useState('home');
    return(
      
      <div className='main-body'>

        <aside>
          <Sidebar onSelect={setCurrentView}/>
        </aside>

        <nav>
          {currentView === 'servers' && <Navbar2 onServerClick={setSelectedServerId} />}
          {currentView === 'home' && <Navbar2 onServerClick={setSelectedServerId} />}
        </nav>

        <main>
          {currentView === 'home' && <ServerPages serverId={selectedServerId} />}
          {currentView === 'servers' && <Servers/>}
          {currentView === 'settings' && <h2>Settings Page</h2> }
        </main>
        
      </div>


    );
}

export default App
