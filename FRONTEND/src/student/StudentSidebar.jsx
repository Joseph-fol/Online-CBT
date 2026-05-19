import React from 'react'
import { NavLink } from 'react-router-dom'
import { FiHome, FiClipboard, FiTrendingUp } from 'react-icons/fi'
import './StudentSidebar.css'

const StudentSidebar = ({ isOpen = false, onNavigate }) => {
  return (
    <aside className={`student-sidebar ${isOpen ? 'is-open' : ''}`} aria-label='Student navigation'>
      <div className='student-sidebar__brand'>
        <h3>Online CBT</h3>
        <p>STUDENT PORTAL</p>
      </div>

      <nav className='student-sidebar__nav'>
        <NavLink to='/student/dashboard' className='student-sidebar__item' onClick={onNavigate}>
          <FiHome className='student-sidebar__icon' />
          <span>Dashboard</span>
        </NavLink>

        <NavLink to='/student/available-assessments' className='student-sidebar__item' onClick={onNavigate}>
          <FiClipboard className='student-sidebar__icon' />
          <span>Available Assessments</span>
        </NavLink>

        <NavLink to='/student/performance-history' className='student-sidebar__item' onClick={onNavigate}>
          <FiTrendingUp className='student-sidebar__icon' />
          <span>Performance History</span>
        </NavLink>
      </nav>
    </aside>
  )
}

export default StudentSidebar