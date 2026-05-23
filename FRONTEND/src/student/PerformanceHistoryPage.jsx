import React, { useState, useEffect } from 'react'
import axios from 'axios'
import API_BASE_URL from '../utils/api.config'
import logo from '../assets/Online-cbt.jpg'

const PerformanceHistoryPage = () => {
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getResults = () => {
      const studentData = localStorage.getItem('studentData')
      if (studentData) {
        const parsedData = JSON.parse(studentData)
        const studentEmail = parsedData.email
        
        axios.get(`${API_BASE_URL}/user/exam/student-results?studentEmail=${studentEmail}`)
          .then((response) => {
            const data = response.data
            setResults(data.results || [])
          })
          .catch((error) => {
            console.error("Error fetching performance history:", error)
            setResults([])
          })
          .finally(() => {
            setLoading(false)
          })
      } else {
        setLoading(false)
      }
    }

    getResults()
  }, [])

  // Helper function to format the date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    const options = { year: 'numeric', month: 'short', day: 'numeric' }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  // Helper function to dynamically set status based on score
  const getStatus = (score) => {
    const numScore = Number(score)
    if (numScore >= 70) return { text: 'Excellent', className: 'text-success' }
    if (numScore >= 50) return { text: 'Pass', className: 'text-primary' }
    return { text: 'Fail', className: 'text-danger' }
  }

  // Handle printing a specific result
  const handlePrint = (result) => {
    const printWindow = window.open('', '_blank')
    const status = getStatus(result.score)
    
    // Map bootstrap classes to actual colors for the print view
    let statusColor = '#dc3545' // danger
    if (status.className === 'text-success') statusColor = '#198754'
    if (status.className === 'text-primary') statusColor = '#0d6efd'

    const dateTaken = formatDate(result.submittedAt || result.createdAt || result.date)
    const subject = result.subject || result.subjectName || 'N/A'
    const logoUrl = new URL(logo, window.location.origin).href

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Exam Result - ${subject}</title>
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
          <div class="detail-row"><span class="label">Date Taken:</span><span class="value">${dateTaken}</span></div>
          <div class="detail-row"><span class="label">Subject:</span><span class="value">${subject}</span></div>
          ${result.totalQuestions ? `<div class="detail-row"><span class="label">Total Questions:</span><span class="value">${result.totalQuestions}</span></div>` : ''}
          ${result.correctAnswers !== undefined ? `<div class="detail-row"><span class="label">Correct Answers:</span><span class="value">${result.correctAnswers}</span></div>` : ''}
          <div class="score-container">
            <div class="score-label">FINAL SCORE</div>
            <div class="score">${result.score}%</div>
            <div class="status">${status.text}</div>
          </div>
          <div class="footer"><p>This is a computer-generated document and does not require a signature.</p><p>Generated on ${new Date().toLocaleString()}</p></div>
        </body>
      </html>
    `)
    printWindow.document.close()
    printWindow.focus()
  }

  // Handle sharing the results
  const handleShare = async (result) => {
    const shareData = {
      title: 'My Exam Results',
      text: `I scored ${result.score}% in my ${result.subject || result.subjectName || 'exam'}!`,
      url: window.location.href
    }

    if (navigator.share) {
      try {
        await navigator.share(shareData)
      } catch (err) {
        console.error('Error sharing:', err)
      }
    } else {
      // Fallback for browsers that do not support Web Share API
      navigator.clipboard.writeText(`${shareData.title} - ${shareData.text}\n${shareData.url}`)
      alert('Link copied to clipboard!')
    }
  }

  return (
    <section className='px-3 px-md-4 py-4 py-md-5'>
      <div className='container-fluid'>
        <div className='bg-white rounded-3 p-4 p-md-5'>
          <div className='d-flex flex-column flex-sm-row justify-content-between align-items-sm-center mb-4'>
            <div>
              <h3 className='fw-semibold mb-2'>Performance History</h3>
              <p className='text-muted mb-0'>Track your latest exam attempts and outcomes.</p>
            </div>
          </div>

          <div className='table-responsive'>
            <table className='table table-hover table-light'>
              <thead>
                <tr>
                  <th scope='col'>DATE TAKEN</th>
                  <th scope='col'>SUBJECT</th>
                  <th scope='col'>SCORE</th>
                  <th scope='col'>STATUS</th>
                  <th scope='col' className='d-print-none text-center'>ACTIONS</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="5" className="text-center py-4 text-muted">Loading your results...</td>
                  </tr>
                ) : results.length > 0 ? (
                  results.map((result, index) => {
                    const status = getStatus(result.score)
                    return (
                      <tr key={result.id || result._id || index}>
                        <th scope='row' className='fw-medium'>{formatDate(result.submittedAt || result.createdAt || result.date)}</th>
                        <td>{result.subject || result.subjectName || 'N/A'}</td>
                        <td className='fw-medium'>{result.score}%</td>
                        <td className={status.className}>{status.text}</td>
                        <td className='d-print-none text-center'>
                          <div className='d-flex gap-2 justify-content-center'>
                            <button onClick={() => handlePrint(result)} className='btn btn-sm btn-outline-secondary fw-medium px-2'>Print</button>
                            <button onClick={() => handleShare(result)} className='btn btn-sm btn-outline-primary fw-medium px-2'>Share</button>
                          </div>
                        </td>
                      </tr>
                    )
                  })
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center py-4 text-muted">No performance history found. Take an exam to see your results here!</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  )
}

export default PerformanceHistoryPage