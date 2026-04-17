import React from 'react'
import Navbar from './component/Navbar'
import StudentDashboard from './student/StudentDashboard'
import AssignedObject from './student/AssignedObject'

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