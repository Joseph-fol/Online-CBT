import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../component/Navbar'
import Sidebar from './Sidebar'
import './AdminDashboard.css'

const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className='admin-shell'>
      <Sidebar isOpen={sidebarOpen} onNavigate={() => setSidebarOpen(false)} />

      <div className='admin-shell__content'>
        <Navbar
          isSidebarOpen={sidebarOpen}
          onToggleSidebar={() => setSidebarOpen((current) => !current)}
        />

        <main className='admin-shell__main'>
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default AdminDashboard