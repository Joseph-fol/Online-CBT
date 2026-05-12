import React from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { removeToken } from '../utils/auth'
import './StudentNavbar.css'

const StudentNavbar = ({ isSidebarOpen, onToggleSidebar }) => {
  const navigate = useNavigate()

  const handleLogout = () => {
    removeToken()
    navigate('/studentSignin')
  }
  return (
    <header className='student-navbar'>
      <div className='student-navbar__top'>
        <div className='student-navbar__left'>
          <button
            type='button'
            className={`student-navbar__toggle ${isSidebarOpen ? 'is-open' : ''}`}
            aria-label='Toggle sidebar navigation'
            aria-expanded={isSidebarOpen}
            onClick={onToggleSidebar}
          >
            <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' aria-hidden='true'>
              <path fill='currentColor' d='M3 6h18v2H3zm0 5h18v2H3zm0 5h18v2H3z' />
            </svg>
          </button>

          <Link to='/student/dashboard' className='student-navbar__brand'>
            STUDENT PORTAL
          </Link>
        </div>

        <nav className='student-navbar__center' aria-label='Top navigation'>
          <NavLink to='/student/performance-history' className='student-navbar__history'>
            My History
          </NavLink>
        </nav>

        <div className='student-navbar__actions'>
          <button type='button' className='student-navbar__icon-button' aria-label='Notifications'>
            <svg xmlns='http://www.w3.org/2000/svg' width='1.3em' height='1.3em' viewBox='0 0 24 24' aria-hidden='true'>
              <path fill='currentColor' d='M12 2a6 6 0 0 0-6 6v3.54l-.79 2.37A1 1 0 0 0 6.16 15h11.68a1 1 0 0 0 .95-1.32L18 11.54V8a6 6 0 0 0-6-6m0 20a3 3 0 0 1-2.82-2h5.64A3 3 0 0 1 12 22' />
            </svg>
          </button>

          <button type='button' className='student-navbar__icon-button' aria-label='Settings'>
            <svg xmlns='http://www.w3.org/2000/svg' width='1.3em' height='1.3em' viewBox='0 0 24 24' aria-hidden='true'>
              <path fill='currentColor' d='M10.825 22q-.675 0-1.162-.45t-.588-1.1L8.85 18.8q-.325-.125-.612-.3t-.563-.375l-1.55.65q-.625.275-1.25.05t-.975-.8l-1.175-2.05q-.35-.575-.2-1.225t.675-1.075l1.325-1Q4.5 12.5 4.5 12.337v-.675q0-.162.025-.337l-1.325-1Q2.675 9.9 2.525 9.25t.2-1.225L3.9 5.975q.35-.575.975-.8t1.25.05l1.55.65q.275-.2.575-.375t.6-.3l.225-1.65q.1-.65.588-1.1T10.825 2h2.35q.675 0 1.163.45t.587 1.1l.225 1.65q.325.125.613.3t.562.375l1.55-.65q.625-.275 1.25-.05t.975.8l1.175 2.05q.35.575.2 1.225t-.675 1.075l-1.325 1q.025.175.025.338v.674q0 .163-.05.338l1.325 1q.525.425.675 1.075t-.2 1.225l-1.2 2.05q-.35.575-.975.8t-1.25-.05l-1.5-.65q-.275.2-.575.375t-.6.3l-.225 1.65q-.1.65-.587 1.1t-1.163.45zM11 20h1.975l.35-2.65q.775-.2 1.438-.587t1.212-.938l2.475 1.025l.975-1.7l-2.15-1.625q.125-.35.175-.737T17.5 12t-.05-.787t-.175-.738l2.15-1.625l-.975-1.7l-2.475 1.05q-.55-.575-1.212-.962t-1.438-.588L13 4h-1.975l-.35 2.65q-.775.2-1.437.588t-1.213.937L5.55 7.15l-.975 1.7l2.15 1.6q-.125.375-.175.75t-.05.8q0 .4.05.775t.175.75l-2.15 1.625l.975 1.7l2.475-1.05q.55.575 1.213.963t1.437.587zm1.05-4.5q1.45 0 2.475-1.025T15.55 12t-1.025-2.475T12.05 8.5q-1.475 0-2.487 1.025T8.55 12t1.013 2.475T12.05 15.5M12 12'/>
            </svg>
          </button>

          <Link to='/student/dashboard' className='student-navbar__user-chip'>
            <span className='student-navbar__user-dot' aria-hidden='true'>S</span>
            Student User
          </Link>

          <button 
            onClick={handleLogout}
            className='student-navbar__logout'
            type='button'
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  )
}

export default StudentNavbar