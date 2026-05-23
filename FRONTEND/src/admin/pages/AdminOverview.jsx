import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import API_BASE_URL from '../../utils/api.config'
import { getAuthHeader } from '../../utils/auth'
import logo from '../../assets/Online-cbt.jpg'

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

  const handlePrint = (result) => {
    const printWindow = window.open('', '_blank')
    const score = parseFloat(result.score)
    const statusText = score >= 50 ? 'Pass' : 'Fail'
    let statusColor = score >= 50 ? '#198754' : '#dc3545'

    const dateTaken = formatDate(result.submittedAt || result.createdAt || result.date)
    const subject = result.subject || result.subjectName || 'N/A'
    const studentName = result.studentName || result.studentEmail.split('@')[0]
    const logoUrl = new URL(logo, window.location.origin).href

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Exam Result - ${studentName} - ${subject}</title>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 40px; color: #333; max-width: 800px; margin: 0 auto; }
            .header { text-align: center; border-bottom: 2px solid #ab3500; padding-bottom: 20px; margin-bottom: 30px; }
            .title { color: #ab3500; margin: 0; font-size: 28px; }
            .subtitle { margin: 10px 0 0 0; color: #666; font-weight: normal; }
            .detail-row { display: flex; justify-content: space-between; margin-bottom: 15px; border-bottom: 1px solid #eee; padding-bottom: 10px; }
            .label { font-weight: bold; color: #555; }
            .value { font-size: 1.1em; }
            .score-container { text-align: center; margin-top: 40px; padding: 30px; background-color: #f8f9fa; border-radius: 10px; border: 1px solid #e9ecef; }
            .score-label { font-weight: bold; color: #555; letter-spacing: 2px; }
            .score { font-size: 4em; font-weight: bold; margin: 10px 0; color: ${statusColor}; }
            .status { font-size: 1.5em; font-weight: bold; color: ${statusColor}; text-transform: uppercase; }
            .footer { margin-top: 50px; text-align: center; color: #888; font-size: 0.9em; border-top: 1px solid #eee; padding-top: 20px; }
            .action-buttons { text-align: right; margin-bottom: 30px; }
            .btn { padding: 10px 20px; font-weight: 600; cursor: pointer; border-radius: 6px; border: none; font-size: 14px; margin-left: 10px; transition: opacity 0.2s; }
            .btn:hover { opacity: 0.8; }
            .btn-print { background-color: #ab3500; color: white; }
            .btn-close { background-color: #6c757d; color: white; }
            @media print {
              body { padding: 0; }
              .score-container { background-color: #f8f9fa !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
              .d-print-none { display: none !important; }
            }
          </style>
        </head>
        <body>
          <div class="action-buttons d-print-none">
            <button class="btn btn-close" onclick="window.close()">Close Preview</button>
            <button class="btn btn-print" onclick="window.print()">Print Result</button>
          </div>
          <div class="header">
            <img src=""title">Online CBT</h1>
            <h2 class="subtitle">Official Exam Result Statement</h2>
          </div>
          <div class="detail-row"><span class="label">Student Name:</span><span class="value">${studentName}</span></div>
          <div class="detail-row"><span class="label">Email Address:</span><span class="value">${result.studentEmail}</span></div>
          <div class="detail-row"><span class="label">Date Taken:</span><span class="value">${dateTaken}</span></div>
          <div class="detail-row"><span class="label">Subject:</span><span class="value">${subject}</span></div>
          ${result.totalQuestions ? `<div class="detail-row"><span class="label">Total Questions:</span><span class="value">${result.totalQuestions}</span></div>` : ''}
          ${result.correctAnswers !== undefined ? `<div class="detail-row"><span class="label">Correct Answers:</span><span class="value">${result.correctAnswers}</span></div>` : ''}
          <div class="score-container">
            <div class="score-label">FINAL SCORE</div>
            <div class="score">${result.score}%</div>
            <div class="status">${statusText}</div>
          </div>
          <div class="footer"><p>This is a computer-generated document and does not require a signature.</p><p>Generated on ${new Date().toLocaleString()}</p></div>
        </body>
      </html>
    `)
    printWindow.document.close()
    printWindow.focus()
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
                <th scope="col" className="text-center d-print-none">ACTIONS</th>
              </tr>
            </thead>

            <tbody>
              {recentActivity.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-3">No recent activity found</td>
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
                    <td className='text-center d-print-none'>
                      <button onClick={() => handlePrint(activity)} className='btn btn-sm btn-outline-secondary fw-medium px-2'>
                        Print
                      </button>
                    </td>
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