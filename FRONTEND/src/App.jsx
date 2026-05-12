import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
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
import StudentLayout from './student/StudentLayout'
import AvailableAssessmentsPage from './student/AvailableAssessmentsPage'
import PerformanceHistoryPage from './student/PerformanceHistoryPage'
import PageNotFound from './component/PageNotFound'
import ExactQuestion from './student/ExactQuestion'
import ActiveQuizView from './student/ActiveQuizView'
import ProtectedRoute from './component/ProtectedRoute'

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage/>}/>
        <Route path="/AdminSignin" element={<AdminSignin/>}/>
        <Route path="/studentSignin" element={<SigninPage/>}/>
        <Route path="/studentDashboard" element={<Navigate to='/student/dashboard' replace />} />
        <Route path="/createStudentAccount" element={<SignupPage/>}/>
        <Route path="/question/:id" element={<ExactQuestion/>}/>
        <Route path="/forgotPassword" element={<ForgotPassword/>}/>
        <Route path="/student-history" element={<Navigate to='/student/performance-history' replace />} />
        <Route path='*' element={<PageNotFound/>}/>

        <Route path='/student' element={<ProtectedRoute><StudentLayout /></ProtectedRoute>}>
          <Route index element={<Navigate to='dashboard' replace />} />
          <Route path='dashboard' element={<StudentDashboard />} />
          <Route path='available-assessments' element={<AvailableAssessmentsPage />} />
          <Route path='performance-history' element={<PerformanceHistoryPage />} />
          <Route path='ActiveQuizView/:subject' element={<ActiveQuizView />} />
        </Route>
        
        <Route path="/admin" element={<AdminDashboard/> }>
          <Route index element={<AdminOverview />} />
          <Route path="subjects" element={<Subject />} />
          <Route path="question-bank" element={<QuestionBank />} />
          <Route path="student-result" element={<StudentResult />} />
          <Route path="settings" element={<Settings />} />
          <Route path="support" element={<Support />} />
        </Route>
      </Routes>  
    </>
  )
}

export default App