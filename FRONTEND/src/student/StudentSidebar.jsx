import React from 'react'
import { NavLink } from 'react-router-dom'
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
          Dashboard
        </NavLink>

        <NavLink to='/student/available-assessments' className='student-sidebar__item' onClick={onNavigate}>
          Available Assessments
        </NavLink>

        <NavLink to='/student/performance-history' className='student-sidebar__item' onClick={onNavigate}>
          Performance History
        </NavLink>
      </nav>
    </aside>
  )
}

export default StudentSidebar