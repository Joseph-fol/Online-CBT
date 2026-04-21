import React from 'react'
import { NavLink, Link } from 'react-router-dom'
import './Sidebar.css'

const navItems = [
  { to: '/admin', label: 'Dashboard', end: true },
  { to: '/admin/subjects', label: 'Subjects' },
  { to: '/admin/question-bank', label: 'Question Bank' },
  { to: '/admin/student-result', label: 'Student Result' },
  { to: '/admin/settings', label: 'Settings' },
  { to: '/admin/support', label: 'Support' },
]

const Sidebar = ({ isOpen = false, onNavigate }) => {
  return (
    <aside className={`admin-sidebar ${isOpen ? 'is-open' : ''}`}>
      <div className='admin-sidebar__brand'>
        <div>
          <p className='admin-sidebar__eyebrow'>Curator Admin</p>
          <h1 className='admin-sidebar__title'></h1>
        </div>
      </div>

      <nav className='admin-sidebar__nav' aria-label='Admin sidebar navigation'>
        {navItems.map((item) => (
          <NavLink key={item.to} to={item.to} end={item.end} className={({ isActive }) => `admin-sidebar__link ${isActive ? 'is-active' : ''}`
            } onClick={onNavigate} >
            {item.label}
          </NavLink>
        ))}
      </nav>

      <Link
        to='/admin/question-bank'
        className='admin-sidebar__cta'
        onClick={onNavigate}
      >
        Create New Exam
      </Link>

    </aside>
  )
}

export default Sidebar