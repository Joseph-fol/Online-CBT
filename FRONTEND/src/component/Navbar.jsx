import React from 'react'
import { Link, NavLink } from 'react-router-dom'
import './Navbar.css'

const Navbar = ({ isSidebarOpen, onToggleSidebar }) => {

  return (
    <header className='admin-navbar'>
      <div className='admin-navbar__top'>
        <div className='admin-navbar__left'>
          <button
            type='button'
            className={`admin-navbar__toggle ${isSidebarOpen ? 'is-open' : ''}`}
            aria-label='Toggle sidebar navigation'
            aria-expanded={isSidebarOpen}
            onClick={onToggleSidebar}
          >
            <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' aria-hidden='true'>
              <path fill='currentColor' d='M3 6h18v2H3zm0 5h18v2H3zm0 5h18v2H3z' />
            </svg>
          </button>

          <Link to='/admin' className='admin-navbar__brand'>Academic Curator CBT</Link>
        </div>

        <nav className='admin-navbar__center' aria-label='Top navigation'>
          <NavLink to='/admin/student-result' className='admin-navbar__history'>
            My History
          </NavLink>
        </nav>

        <div className='admin-navbar__actions'>
          <button type='button' className='admin-navbar__icon-button' aria-label='Notifications'>
            <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' aria-hidden='true'>
              <path fill='currentColor' d='M12 2a6 6 0 0 0-6 6v3.54l-.79 2.37A1 1 0 0 0 6.16 15h11.68a1 1 0 0 0 .95-1.32L18 11.54V8a6 6 0 0 0-6-6m0 20a3 3 0 0 1-2.82-2h5.64A3 3 0 0 1 12 22' />
            </svg>
          </button>

          <Link to='/admin/settings' className='admin-navbar__icon-button' aria-label='Settings'>
            <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' aria-hidden='true'>
              <path fill='currentColor' d='m19.14 12.94l1.43-1.1a.5.5 0 0 0 .12-.64l-1.36-2.35a.5.5 0 0 0-.6-.22l-1.67.67a6.8 6.8 0 0 0-1.16-.67l-.25-1.77A.5.5 0 0 0 15.16 6h-2.72a.5.5 0 0 0-.5.43l-.25 1.77c-.4.16-.79.38-1.16.67l-1.67-.67a.5.5 0 0 0-.6.22L6.9 10.77a.5.5 0 0 0 .12.64l1.43 1.1a5.9 5.9 0 0 0 0 1.33l-1.43 1.1a.5.5 0 0 0-.12.64l1.36 2.35a.5.5 0 0 0 .6.22l1.67-.67c.37.29.76.51 1.16.67l.25 1.77a.5.5 0 0 0 .5.43h2.72a.5.5 0 0 0 .5-.43l.25-1.77c.4-.16.79-.38 1.16-.67l1.67.67a.5.5 0 0 0 .6-.22l1.36-2.35a.5.5 0 0 0-.12-.64l-1.43-1.1c.06-.44.06-.89 0-1.33M13.8 13.2a2.55 2.55 0 1 1-3.6-3.6a2.55 2.55 0 0 1 3.6 3.6' />
            </svg>
          </Link>

          <Link to='/admin' className='admin-navbar__user-chip'>
            <span className='admin-navbar__user-dot' aria-hidden='true'>A</span>
            Admin User
          </Link>

          <Link to='/AdminSignin' className='admin-navbar__logout'>
            Logout
          </Link>
        </div>
      </div>

    </header>
  )
}

export default Navbar