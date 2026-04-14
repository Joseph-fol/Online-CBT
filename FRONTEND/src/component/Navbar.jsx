import React, { useState } from 'react'
import './Navbar.css'

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <>
        <header className='navbar-shell'>
          <div className='navbar-top'>
            <div className='navbar-brand-group'>
              <h5 className='navbar-brand-text fw-bold'>Academic Curator CBT</h5>
              <a href='#' className='navbar-history fw-medium'>My History</a>
            </div>

            <button
              type='button'
              className={`navbar-toggle ${menuOpen ? 'is-open' : ''}`}
              aria-label='Toggle navigation menu'
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((current) => !current)}
            >
              <span />
              <span />
              <span />
            </button>

            <div className='navbar-desktop-actions'>
              <div className='navbar-user-block'>
                <div className='text-end navbar-user-text'>
                  <p className='navbar-user-name'>Julio Caesar</p>
                  <p className='navbar-user-role'>Senior Scholar</p>
                </div>

                <svg xmlns='http://www.w3.org/2000/svg' width='2em' height='2em' viewBox='0 0 1024 1024' aria-hidden='true'><path fill='#64748b' d='M628.7 528.9A416 416 0 0 1 928 928H96a416 416 0 0 1 299.3-399.1L512 704zM720 304a208 208 0 1 1-416 0a208 208 0 0 1 416 0'/></svg>
              </div>

              <div className='navbar-action-icons'>
                <button type='button' className='icon-button' aria-label='Settings'>
                  <svg xmlns='http://www.w3.org/2000/svg' width='1.6em' height='1.6em' viewBox='0 0 24 24' aria-hidden='true'><path fill='#64748b' fillRule='evenodd' d='M14.208 4.83q.68.21 1.3.54l1.833-1.1a1 1 0 0 1 1.221.15l1.018 1.018a1 1 0 0 1 .15 1.221l-1.1 1.833q.33.62.54 1.3l2.073.519a1 1 0 0 1 .757.97v1.438a1 1 0 0 1-.757.97l-2.073.519q-.21.68-.54 1.3l1.1 1.833a1 1 0 0 1-.15 1.221l-1.018 1.018a1 1 0 0 1-1.221.15l-1.833-1.1q-.62.33-1.3.54l-.519 2.073a1 1 0 0 1-.97.757h-1.438a1 1 0 0 1-.97-.757l-.519-2.073a7.5 7.5 0 0 1-1.3-.54l-1.833 1.1a1 1 0 0 1-1.221-.15L4.42 18.562a1 1 0 0 1-.15-1.221l1.1-1.833a7.5 7.5 0 0 1-.54-1.3l-2.073-.519A1 1 0 0 1 2 12.72v-1.438a1 1 0 0 1 .757-.97l2.073-.519q.21-.68.54-1.3L4.27 6.66a1 1 0 0 1 .15-1.221L5.438 4.42a1 1 0 0 1 1.221-.15l1.833 1.1q.62-.33 1.3-.54l.519-2.073A1 1 0 0 1 11.28 2h1.438a1 1 0 0 1 .97.757zM12 16a4 4 0 1 0 0-8a4 4 0 0 0 0 8'/></svg>
                </button>

                <button type='button' className='icon-button' aria-label='Notifications'>
                  <svg xmlns='http://www.w3.org/2000/svg' width='1.6em' height='1.6em' viewBox='0 0 24 24' aria-hidden='true'><g fill='none'><path d='m12.594 23.258l-.012.002l-.071.035l-.02.004l-.014-.004l-.071-.036q-.016-.004-.024.006l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.016-.018m.264-.113l-.014.002l-.184.093l-.01.01l-.003.011l.018.43l.005.012l.008.008l.201.092q.019.005.029-.008l.004-.014l-.034-.614q-.005-.019-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.003-.011l.018-.43l-.003-.012l-.01-.01z'/><path fill='#64748b' d='M12 2a7 7 0 0 0-7 7v3.528a1 1 0 0 1-.105.447l-1.717 3.433A1.1 1.1 0 0 0 4.162 18h15.676a1.1 1.1 0 0 0 .984-1.592l-1.716-3.433a1 1 0 0 1-.106-.447V9a7 7 0 0 0-7-7m0 19a3 3 0 0 1-2.83-2h5.66A3 3 0 0 1 12 21'/></g></svg>
                </button>

                <button type='button' className='logout-button'>Logout</button>
              </div>
            </div>
          </div>

          <div className={`navbar-mobile-panel ${menuOpen ? 'open' : ''}`}>
            <a href='#' className='mobile-link'>My History</a>

            <div className='navbar-user-block mobile-user-block'>
              <div className='text-start navbar-user-text'>
                <p className='navbar-user-name'>Julio Caesar</p>
                <p className='navbar-user-role'>Senior Scholar</p>
              </div>

              <svg xmlns='http://www.w3.org/2000/svg' width='2em' height='2em' viewBox='0 0 1024 1024' aria-hidden='true'><path fill='#64748b' d='M628.7 528.9A416 416 0 0 1 928 928H96a416 416 0 0 1 299.3-399.1L512 704zM720 304a208 208 0 1 1-416 0a208 208 0 0 1 416 0'/></svg>
            </div>

            <div className='navbar-action-icons mobile-actions'>
              <button type='button' className='icon-button' aria-label='Settings'>
                <svg xmlns='http://www.w3.org/2000/svg' width='1.6em' height='1.6em' viewBox='0 0 24 24' aria-hidden='true'><path fill='#64748b' fillRule='evenodd' d='M14.208 4.83q.68.21 1.3.54l1.833-1.1a1 1 0 0 1 1.221.15l1.018 1.018a1 1 0 0 1 .15 1.221l-1.1 1.833q.33.62.54 1.3l2.073.519a1 1 0 0 1 .757.97v1.438a1 1 0 0 1-.757.97l-2.073.519q-.21.68-.54 1.3l1.1 1.833a1 1 0 0 1-.15 1.221l-1.018 1.018a1 1 0 0 1-1.221.15l-1.833-1.1q-.62.33-1.3.54l-.519 2.073a1 1 0 0 1-.97.757h-1.438a1 1 0 0 1-.97-.757l-.519-2.073a7.5 7.5 0 0 1-1.3-.54l-1.833 1.1a1 1 0 0 1-1.221-.15L4.42 18.562a1 1 0 0 1-.15-1.221l1.1-1.833a7.5 7.5 0 0 1-.54-1.3l-2.073-.519A1 1 0 0 1 2 12.72v-1.438a1 1 0 0 1 .757-.97l2.073-.519q.21-.68.54-1.3L4.27 6.66a1 1 0 0 1 .15-1.221L5.438 4.42a1 1 0 0 1 1.221-.15l1.833 1.1q.62-.33 1.3-.54l.519-2.073A1 1 0 0 1 11.28 2h1.438a1 1 0 0 1 .97.757zM12 16a4 4 0 1 0 0-8a4 4 0 0 0 0 8'/></svg>
              </button>

              <button type='button' className='icon-button' aria-label='Notifications'>
                <svg xmlns='http://www.w3.org/2000/svg' width='1.6em' height='1.6em' viewBox='0 0 24 24' aria-hidden='true'><g fill='none'><path d='m12.594 23.258l-.012.002l-.071.035l-.02.004l-.014-.004l-.071-.036q-.016-.004-.024.006l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.016-.018m.264-.113l-.014.002l-.184.093l-.01.01l-.003.011l.018.43l.005.012l.008.008l.201.092q.019.005.029-.008l.004-.014l-.034-.614q-.005-.019-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.003-.011l.018-.43l-.003-.012l-.01-.01z'/><path fill='#64748b' d='M12 2a7 7 0 0 0-7 7v3.528a1 1 0 0 1-.105.447l-1.717 3.433A1.1 1.1 0 0 0 4.162 18h15.676a1.1 1.1 0 0 0 .984-1.592l-1.716-3.433a1 1 0 0 1-.106-.447V9a7 7 0 0 0-7-7m0 19a3 3 0 0 1-2.83-2h5.66A3 3 0 0 1 12 21'/></g></svg>
              </button>

              <button type='button' className='logout-button mobile-logout'>Logout</button>
            </div>
          </div>
        </header>

    </>
  )
}

export default Navbar