// main.jsx
// Entry point — mounts React app into index.html

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'  // Global styles loaded here
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)