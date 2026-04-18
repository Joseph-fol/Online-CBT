import React from 'react'
// import Navbar from './component/Navbar'
// import StudentDashboard from './student/StudentDashboard'
// import AssignedObject from './student/AssignedObject'
// import QuestionBank from './admin/pages/QuestionBank'
// import Subject from './admin/pages/Subject'
// import StudentResult from './admin/pages/StudentResult'
// import Sidebar from './admin/Sidebar'
import { Routes, Route } from 'react-router-dom'
import LandingPage from './component/LandingPage'
import AdminSignin from './admin/AdminSignin'
import SigninPage from './student/SigninPage'
import SignupPage from './student/SignupPage'
import ForgotPassword from './student/ForgotPassword'
import AdminDashboard from './admin/AdminDashboard'
import Subject from './admin/pages/Subject'
import QuestionBank from './admin/pages/QuestionBank'
import StudentResult from './admin/pages/StudentResult'
import AdminOverview from './admin/pages/AdminOverview'
import Settings from './admin/pages/Settings'
import Support from './admin/pages/Support'
import StudentDashboard from './student/StudentDashboard'

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
        <Route path="studentDashboard" element={<StudentDashboard/>}/>
        <Route path="/createStudentAccount" element={<SignupPage/>}/>
        <Route path="/forgotPassword" element={<ForgotPassword/>}/>
        <Route path="/admin" element={<AdminDashboard /> }>
          <Route index element={<AdminOverview />} />
          <Route path="subjects" element={<Subject />} />
          <Route path="question-bank" element={<QuestionBank />} />
          <Route path="student-result" element={<StudentResult />} />
          <Route path="settings" element={<Settings />} />
          <Route path="support" element={<Support />} />
        </Route>
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