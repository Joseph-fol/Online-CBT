import React from 'react'
import { NavLink, Link } from 'react-router-dom'
import { FiHome, FiBook, FiDatabase, FiBarChart2, FiSettings, FiHelpCircle } from 'react-icons/fi'
import './Sidebar.css'

const navItems = [
  { to: '/admin', label: 'Dashboard', icon: FiHome, end: true },
  { to: '/admin/subjects', label: 'Subjects', icon: FiBook },
  { to: '/admin/question-bank', label: 'Question Bank', icon: FiDatabase },
  { to: '/admin/student-result', label: 'Student Result', icon: FiBarChart2 },
  { to: '/admin/settings', label: 'Settings', icon: FiSettings },
  { to: '/admin/support', label: 'Support', icon: FiHelpCircle },
]

const Sidebar = ({ isOpen = false, onNavigate }) => {
  return (
    <aside className={`admin-sidebar ${isOpen ? 'is-open' : ''}`}>
      <div className='admin-sidebar__brand'>
        <div>
          <h1 className='admin-sidebar__title'>Online CBT</h1>
          <p className='admin-sidebar__eyebrow'>Admin User</p>
        </div>
      </div>

      <nav className='admin-sidebar__nav' aria-label='Admin sidebar navigation'>
        {navItems.map((item) => {
          const Icon = item.icon
          return (
            <NavLink key={item.to} to={item.to} end={item.end} className={({ isActive }) => `admin-sidebar__link ${isActive ? 'is-active' : ''}`
            } onClick={onNavigate} >
              <Icon className='admin-sidebar__icon' />
              <span>{item.label}</span>
            </NavLink>
          )
        })}
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