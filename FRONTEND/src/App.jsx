import React from 'react'
import Navbar from './component/Navbar'
import StudentDashboard from './component/StudentDashboard'
import AssignedObject from './component/AssignedObject'

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