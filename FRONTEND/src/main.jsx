import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

import React from 'react'
// import ReactDOM from 'react-dom/client'
// // import ActiveQuizView from './student/ActiveQuizView.jsx'
// import LandingPage from './component/LandingPage.jsx'
// import SignupPage from './student/SignupPage.jsx'
// import SigninPage from './student/SigninPage.jsx'
// import StudentDashboard from './student/StudentDashboard.jsx'
// import AssignedObject from './student/AssignedObject.jsx'
// import ResultAndHistory from './student/ResultAndHistory.jsx'
// import ForgotPassword from './student/ForgotPassword.jsx'
// import AdminSignin from './admin/AdminDashboard.jsx'
// import AdminDashboard from './admin/AdminDashboard.jsx'
import { BrowserRouter } from 'react-router-dom'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* <SignupPage/> */}
    {/* <SigninPage/> */}
    {/* <LandingPage/> */}
      {/* <ActiveQuizView/> */}
      <BrowserRouter>
        <App />
      </BrowserRouter>
      {/* <ResultAndHistory/> */}
      {/* <ForgotPassword/> */}
      {/* <AdminSignin/> */}
      {/* <AdminDashboard/> */}
  </StrictMode>,
)
