import React from 'react'
// import Navbar from './component/Navbar'
// import StudentDashboard from './student/StudentDashboard'
// import AssignedObject from './student/AssignedObject'
// import QuestionBank from './admin/pages/QuestionBank'
// import Subject from './admin/pages/Subject'
// import StudentResult from './admin/pages/StudentResult'
// import Sidebar from './admin/Sidebar'
import { Routes, Route } from 'react-router-dom'
// import AdminDashboard from './admin/AdminDashboard'
import LandingPage from './component/LandingPage'
import AdminSignin from './admin/AdminSignin'
import SigninPage from './student/SigninPage'
import SignupPage from './student/SignupPage'
import ForgotPassword from './student/ForgotPassword'

const App = () => {
  return (
    <>
        {/* <Navbar/> */}
        {/* <StudentDashboard/> */}
        {/* <AssignedObject/> */}

        {/* <QuestionBank/> */}
        {/* <Subject/> */}
        {/* <StudentResult/> */}
      <Routes>
        <Route path="/" element={<LandingPage/>}/>
        <Route path="/AdminSignin" element={<AdminSignin/>}/>
        <Route path="/studentSignin" element={<SigninPage/>}/>
        <Route path="/createStudentAccount" element={<SignupPage/>}/>
        <Route path="//forgotPassword" element={<ForgotPassword/>}/>
      </Routes>

    {/* <Router>
      <div className='App'>
        <Sidebar/>
      </div>
    </Router> */}
    </>
  )
}

export default App