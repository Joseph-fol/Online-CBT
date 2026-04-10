import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

import React from 'react'
import ReactDOM from 'react-dom/client'
import ActiveQuizView from './component/ActiveQuizView.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
      <ActiveQuizView/>
      {/* <App /> */}
  </React.StrictMode>,
)
