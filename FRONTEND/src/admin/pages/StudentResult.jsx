import React, { useState, useEffect } from 'react'
import axios from 'axios'
import './StudentResult.css'
import API_BASE_URL from '../../utils/api.config'
import { getAuthHeader } from '../../utils/auth'
import logo from '../../assets/Online-cbt.jpg'

const StudentResult = () => {
  const [allResults, setAllResults] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchAllExamResults()
  }, [])

  const fetchAllExamResults = () => {
    setLoading(true)
    setError(null)
    axios.get(`${API_BASE_URL}/user/exam/all-results`, { headers: getAuthHeader() })
      .then((response) => {
        setLoading(false)
        console.log("All exam results:", response.data)
        setAllResults(response.data.results || [])
      })
      .catch((err) => {
        setLoading(false)
        console.error("Error fetching exam results:", err)
        setError(err.response?.data?.message || "Failed to fetch exam results")
      })
  }

  const formatDate = (dateString) => {
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

  const getScoreColor = (score) => {
    if (score >= 80) return '#27ae60' // Green
    if (score >= 60) return '#f39c12' // Orange
    return '#e74c3c' // Red
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
            <img src="${logoUrl}" alt="Logo" style="width: 80px; height: auto; margin-bottom: 15px; border-radius: 8px;" />
            <h1 class="title">Online CBT</h1>
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
    <>
      <div className='student-result-top-section'>
        <div>
          <h2 className='fw-bold'>Recent Submissions</h2>
        </div>
        <div className='student-result-top-section_button'>
          <button className='the-btn' onClick={fetchAllExamResults}>
            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
              <path d="M0 0h24v24H0z" fill="none" />
              <g class="loading-right-outline">
                <g fill="#fff" fill-rule="evenodd" class="Vector" clip-rule="evenodd">
                  <path d="M12 6.05c-3.869 0-7 3.126-7 6.975a6.97 6.97 0 0 0 3.603 6.1q.662.368 1.4.587a1 1 0 0 1-.568 1.918a9 9 0 0 1-1.801-.755A8.97 8.97 0 0 1 3 13.025c0-4.96 4.032-8.974 9-8.974c1.24 0 2.425.25 3.502.705a1 1 0 1 1-.777 1.843A7 7 0 0 0 12 6.05m-.6 15.012a1 1 0 0 1 .944-1.052a7 7 0 0 0 2.645-.673a1 1 0 0 1 .86 1.805a9 9 0 0 1-3.397.865a1 1 0 0 1-1.052-.945m7.392-12.375a1 1 0 0 1 1.33.479a9 9 0 0 1 .85 3.4a1 1 0 1 1-1.998.1a7 7 0 0 0-.66-2.648a1 1 0 0 1 .478-1.331m-1.544 10.432a1 1 0 0 1-.074-1.412a7.1 7.1 0 0 0 1.4-2.345a1 1 0 1 1 1.883.674a9.1 9.1 0 0 1-1.797 3.009a1 1 0 0 1-1.412.074" />
                  <path d="M13.806 2.233a.857.857 0 0 1 1.15.385l1.332 2.683c.267.537.046 1.19-.493 1.456l-2.691 1.329a.857.857 0 1 1-.758-1.536L14.47 5.5l-1.053-2.118a.857.857 0 0 1 .388-1.149Z" />
                </g>
              </g>
            </svg>

            Refresh
          </button>
        </div>
      </div>

      <div style={{ padding: '20px', backgroundColor: '#fff', borderRadius: '8px', marginTop: '20px' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <p>Loading exam results...</p>
          </div>
        ) : error ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#e74c3c' }}>
            <p>{error}</p>
          </div>
        ) : allResults.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <p>No exam submissions yet</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #f0f0f0', backgroundColor: '#f8f9fa' }}>
                  <th style={{ padding: '15px', textAlign: 'left', fontWeight: '600', color: '#666' }}>STUDENT</th>
                  <th style={{ padding: '15px', textAlign: 'left', fontWeight: '600', color: '#666' }}>SUBJECT</th>
                  <th style={{ padding: '15px', textAlign: 'center', fontWeight: '600', color: '#666' }}>SCORE</th>
                  <th style={{ padding: '15px', textAlign: 'left', fontWeight: '600', color: '#666' }}>TIME SUBMITTED</th>
                  <th style={{ padding: '15px', textAlign: 'center', fontWeight: '600', color: '#666' }}>STATUS</th>
                  <th className='d-print-none' style={{ padding: '15px', textAlign: 'center', fontWeight: '600', color: '#666' }}>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {allResults.map((result, index) => (
                  <tr key={result.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                    <td style={{ padding: '15px', fontWeight: '500', color: '#121d38' }}>
                      {result.studentName || result.studentEmail.split('@')[0]}
                    </td>
                    <td style={{ padding: '15px', color: '#555' }}>{result.subject}</td>
                    <td style={{ padding: '15px', textAlign: 'center', fontWeight: 'bold', color: getScoreColor(parseFloat(result.score)) }}>
                      {result.score}%
                    </td>
                    <td style={{ padding: '15px', color: '#888' }}>
                      {formatDate(result.submittedAt)}
                    </td>
                    <td style={{ padding: '15px', textAlign: 'center' }}>
                      <span style={{
                        padding: '4px 12px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: '600',
                        backgroundColor: result.status === 'Pass' ? '#d4edda' : '#f8d7da',
                        color: result.status === 'Pass' ? '#155724' : '#721c24'
                      }}>
                        {result.status}
                      </span>
                    </td>
                    <td className='d-print-none' style={{ padding: '15px', textAlign: 'center' }}>
                      <button onClick={() => handlePrint(result)} className='btn btn-sm btn-outline-secondary fw-medium px-2'>
                        Print
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  )
}

export default StudentResult