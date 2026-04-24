import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import StudentNavbar from './StudentNavbar'
import StudentSidebar from './StudentSidebar'
import './StudentLayout.css'

const StudentLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className='student-layout'>
      <StudentSidebar
        isOpen={sidebarOpen}
        onNavigate={() => setSidebarOpen(false)}
      />

      <div className='student-layout__content-wrap'>
        <StudentNavbar
          isSidebarOpen={sidebarOpen}
          onToggleSidebar={() => setSidebarOpen((current) => !current)}
        />

        <main className='student-layout__content'>
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default StudentLayout