import React from 'react'
import Navbar from './component/Navbar'
import StudentDashboard from './component/student/StudentDashboard'
import AssignedObject from './component/student/AssignedObject'

const App = () => {
  return (
    <>
        <Navbar/>
        <StudentDashboard/>
        <AssignedObject/>
    </>
  )
}

export default App