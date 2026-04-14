import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

import React from 'react'
import ReactDOM from 'react-dom/client'
import ActiveQuizView from './component/ActiveQuizView.jsx'
import LandingPage from './component/LandingPage.jsx'
import SignupPage from './component/student/SignupPage.jsx'
import StudentDashboard from './component/StudentDashboard.jsx'
import AssignedObject from './component/AssignedObject.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* <SignupPage/> */}
    {/* <LandingPage/> */}
      {/* <ActiveQuizView/> */}
      <App />
      {/* <AssignedObject/> */}
  </React.StrictMode>,
)
