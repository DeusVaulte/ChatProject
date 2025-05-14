import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Signup from './Signup.jsx'
import Central from './Central.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Central/>
  </StrictMode>,
)