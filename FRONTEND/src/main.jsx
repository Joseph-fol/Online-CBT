import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import React from 'react'
import { HashRouter } from 'react-router-dom'
import { registerSW } from 'virtual:pwa-register'
registerSW({immediate: true}) 

createRoot(document.getElementById('root')).render(
  <StrictMode>
      <HashRouter>
        <App />
      </HashRouter>
  </StrictMode>,
)
