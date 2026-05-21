import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import API_BASE_URL from '../../utils/api.config'
import { getAuthHeader } from '../../utils/auth'

const AdminOverview = () => {
  const [adminName, setAdminName] = useState('Admin')
  const [stats, setStats] = useState([
    { label: 'TOTAL STUDENTS', value: '0' },
    { label: 'ACTIVE SUBJECTS', value: '0' },
    { label: 'QUESTION BANK', value: '0' },
    { label: 'AVERAGE SCORE', value: '0%' },
  ])
  const [loading, setLoading] = useState(true)
  const [recentActivity, setRecentActivity] = useState([])

  useEffect(() => {
    const adminData = localStorage.getItem('adminData')
    if (adminData) {
      try {
        const admin = JSON.parse(adminData)
        setAdminName(admin.fullName || 'Admin')
      } catch (err) {
        console.error('Error parsing admin data:', err)
      }
    }
  }, [])

  useEffect(() => {
    fetchDashboardStats()
    fetchRecentActivity()
  }, [])

  const fetchDashboardStats = () => {
    setLoading(true)
    axios.get(`${API_BASE_URL}/user/dashboard-stats`)
      .then((response) => {
        const { totalStudents, totalSubjects, totalQuestions, averageScore } = response.data
        
        setStats([
          { label: 'TOTAL STUDENTS', value: totalStudents.toString() },
          { label: 'ACTIVE SUBJECTS', value: totalSubjects.toString() },
          { label: 'QUESTION BANK', value: totalQuestions.toString() },
          { label: 'AVERAGE SCORE', value: `${averageScore}%` },
        ])
        setLoading(false)
      })
      .catch((error) => {
        console.error('Error fetching dashboard stats:', error)
        setLoading(false)
      })
  }

  const fetchRecentActivity = () => {
    axios.get(`${API_BASE_URL}/user/exam/all-results`, { headers: getAuthHeader() })
      .then((response) => {
        const results = response.data.results || []
        // Display the 5 most recent activities
        setRecentActivity(results.slice(0, 5))
      })
      .catch((error) => {
        console.error('Error fetching recent activity:', error)
      })
  }

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now - date
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return "Just now"
    if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
    return date.toLocaleDateString()
  }

  return (
    <section className='admin-overview'>
      <div className='admin-overview-top-section'>
        <div className='admin-overview__hero'>
          <p className='admin-overview__eyebrow'>Dashboard</p>
          <h2 className='admin-overview__title'>Welcome back, {adminName}.</h2>
          <p className='admin-overview__text'>Use the dashboard to manage subjects, question banks, and monitor student results with precision and real-time oversight.</p>
        </div>

        <div className='admin-overview-top_button'>
          <Link to="/admin/question-bank">
            <button> <svg xmlns="http://www.w3.org/2000/svg" width="1.3em" height="1.3em" viewBox="0 0 24 24"><path fill="#fff" d="M11 13H5v-2h6V5h2v6h6v2h-6v6h-2z" /></svg>Create New Subject</button>
          </Link>

          <Link to="/admin/student-result">
            <button><svg xmlns="http://www.w3.org/2000/svg" width="1.3em" height="1.3em" viewBox="0 0 32 32"><path fill="#fff" d="M14 23h8v2h-8zm-4 0h2v2h-2zm4-5h8v2h-8zm-4 0h2v2h-2zm4-5h8v2h-8zm-4 0h2v2h-2z" /><path fill="#fff" d="M25 5h-3V4a2 2 0 0 0-2-2h-8a2 2 0 0 0-2 2v1H7a2 2 0 0 0-2 2v21a2 2 0 0 0 2 2h18a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2M12 4h8v4h-8Zm13 24H7V7h3v3h12V7h3Z" /></svg> See Results</button>
          </Link>
        </div>
      </div>

      <div className='admin-overview__stats'>
        {loading ? (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '20px' }}>
            <p>Loading statistics...</p>
          </div>
        ) : (
          stats.map((item) => (
            <article key={item.label} className='admin-overview__card'>
              <span className='admin-overview__card-label'>{item.label}</span>
              <span className='admin-overview__card-value'>{item.value}</span>
            </article>
          ))
        )}
      </div>

      <div className='col-lg-12 col-md-10 py-4'>
        <div className='d-flex justify-content-between'>
          <h5 className='fs-5'>Recent Activity History </h5>
        </div>

        <div className='admin-overview__table-wrap bg-secondary' >
          <table className='table table-hover table-light'>
            <thead>
              <tr>
                <th scope="col">STUDENT NAME</th>
                <th scope="col">SUBJECT</th>
                <th scope="col">SCORE</th>
                <th scope="col">TIME SUBMITTED</th>
              </tr>
            </thead>

            <tbody>
              {recentActivity.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center py-3">No recent activity found</td>
                </tr>
              ) : (
                recentActivity.map((activity, index) => (
                  <tr key={activity.id || index}>
                    <th scope="row" className='fw-medium'>{activity.studentName || activity.studentEmail.split('@')[0]}</th>
                    <td>
                      <span className=''>{activity.subject}</span>
                    </td>
                    <td className='fw-medium'>{activity.score}%</td>
                    <td className=''>{formatTimeAgo(activity.submittedAt)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}

export default AdminOverview