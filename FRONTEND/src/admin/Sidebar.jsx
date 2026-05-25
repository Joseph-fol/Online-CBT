import React, { useState } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { FiHome, FiBook, FiDatabase, FiBarChart2, FiSettings, FiMessageSquare } from 'react-icons/fi'
import './Sidebar.css'
import { showSuccess, showError } from '../utils/toastUtils'

const navItems = [
  { to: '/admin', label: 'Dashboard', icon: FiHome, end: true },
  { to: '/admin/subjects', label: 'Subjects', icon: FiBook },
  { to: '/admin/question-bank', label: 'Question Bank', icon: FiDatabase },
  { to: '/admin/student-result', label: 'Student Result', icon: FiBarChart2 },
  { to: '/admin/settings', label: 'Settings', icon: FiSettings },
]

const Sidebar = ({ isOpen = false, onNavigate }) => {
  const [showFeedbackModal, setShowFeedbackModal] = useState(false)
  const [feedbackTitle, setFeedbackTitle] = useState('')
  const [feedbackEmail, setFeedbackEmail] = useState('')
  const [feedbackMessage, setFeedbackMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      const response = await fetch("https://formspree.io/f/mdajlbdg", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          subject: feedbackTitle,
          email: feedbackEmail,
          message: feedbackMessage
        })
      })

      if (response.ok) {
        setIsSubmitting(false)
        setShowFeedbackModal(false)
        setFeedbackTitle('')
        setFeedbackEmail('')
        setFeedbackMessage('')
        showSuccess('Thank you for your feedback!')
      } else {
        throw new Error("Failed to submit to Formspree")
      }
    } catch (error) {
      console.error(error)
      setIsSubmitting(false)
      showError('Failed to send feedback. Please try again.')
    }
  }

  return (
    <>
      <aside className={`admin-sidebar ${isOpen ? 'is-open' : ''} d-flex flex-column`}>
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

        <div className='mt-auto w-100 pb-3'>
          <button
            onClick={() => setShowFeedbackModal(true)}
            className='btn w-100 d-flex align-items-center justify-content-center gap-2 mb-3'
            style={{ backgroundColor: 'transparent', color: '#fff', border: '1px solid rgba(255,255,255,0.2)' }}
          >
            <FiMessageSquare /> Give Feedback
          </button>

          <Link
            to='/admin/question-bank'
            className='admin-sidebar__cta mb-0'
            onClick={onNavigate}
          >
            Create New Exam
          </Link>
        </div>
      </aside>

      {/* Feedback Modal */}
      {showFeedbackModal && (
        <div 
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" 
          style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }} 
          onClick={() => setShowFeedbackModal(false)}
        >
          <div className="bg-white rounded-3 shadow-lg p-0" style={{ width: '90%', maxWidth: '500px' }} onClick={e => e.stopPropagation()}>
            <div className="d-flex justify-content-between align-items-center p-4 pb-0">
              <h5 className="fw-bold mb-0">Give Feedback</h5>
              <button type="button" className="btn-close shadow-none" onClick={() => setShowFeedbackModal(false)}></button>
            </div>
            <div className="p-4">
              <p className="text-muted mb-4">We value your feedback. Let us know how we can improve the app.</p>

              <form onSubmit={handleFeedbackSubmit}>
                <div className="mb-3">
                  <label className="form-label fw-medium" style={{ fontSize: "13px" }}>SUBJECT / TITLE</label>
                  <input  
                    type="text" 
                    name="subject"
                    className="form-control border-0 bg-light rounded-2 py-3 shadow-none" 
                    placeholder="e.g. Bug report, Feature request"
                    value={feedbackTitle}
                    onChange={(e) => setFeedbackTitle(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-medium" style={{ fontSize: "13px" }}>YOUR EMAIL</label>
                  <input  
                    type="email" 
                    name="email"
                    className="form-control border-0 bg-light rounded-2 py-3 shadow-none" 
                    placeholder="e.g. you@example.com"
                    value={feedbackEmail}
                    onChange={(e) => setFeedbackEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="form-label fw-medium" style={{ fontSize: "13px" }}>YOUR FEEDBACK</label>
                  <textarea 
                    name="message"
                    className="form-control border-0 bg-light rounded-2 py-2 shadow-none" 
                    rows="4" 
                    placeholder="Tell us what you think..."
                    value={feedbackMessage}
                    onChange={(e) => setFeedbackMessage(e.target.value)}
                    required
                  ></textarea>
                </div>
                <button 
                  type="submit" 
                  className="btn w-100 text-white fw-medium py-2" 
                  style={{ backgroundColor: '#ab3500' }}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  )
} 
  

export default Sidebar