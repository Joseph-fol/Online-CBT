import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

import React from 'react'
import ReactDOM from 'react-dom/client'
import ActiveQuizView from './component/student/ActiveQuizView.jsx'
import LandingPage from './component/LandingPage.jsx'
import SignupPage from './component/student/SignupPage.jsx'
import SigninPage from './component/student/SigninPage.jsx'
import StudentDashboard from './component/student/StudentDashboard.jsx'
import AssignedObject from './component/student/AssignedObject.jsx'
import ResultAndHistory from './component/student/ResultAndHistory.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* <SignupPage/> */}
    {/* <SigninPage/> */}
    <LandingPage/>
      {/* <ActiveQuizView/> */}
      {/* <App /> */}
      {/* <ResultAndHistory/> */}
  </React.StrictMode>,
)
