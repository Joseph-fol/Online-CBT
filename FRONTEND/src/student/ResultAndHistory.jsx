import React, { useState, useEffect } from 'react'
import StudentNavbar from './StudentNavbar'
import axios from 'axios'
import API_BASE_URL from '../utils/api.config'

const ResultAndHistory = () => {
    const [results, setResults] = useState([])
    const [loading, setLoading] = useState(true)
    const [studentEmail, setStudentEmail] = useState('')
    const [latestScore, setLatestScore] = useState(0)

    useEffect(() => {
        // Get student email from JWT token
        const jwtToken = localStorage.getItem('token')
        let email = ''
        if (jwtToken) {
            try {
                const base64Url = jwtToken.split('.')[1]
                const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
                const jsonPayload = decodeURIComponent(atob(base64).split('').map((c) => {
                    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
                }).join(''))
                email = JSON.parse(jsonPayload).email
                setStudentEmail(email)
            } catch (error) {
                console.error("Error decoding JWT:", error)
                setLoading(false)
                return
            }
        }

        // Fetch exam results
        if (email) {
            axios.get(`${API_BASE_URL}/user/exam/student-results?studentEmail=${email}`)
                .then((response) => {
                    const data = response.data.results || []
                    setResults(data)
                    if (data.length > 0) {
                        setLatestScore(parseFloat(data[0].score))
                    }
                    setLoading(false)
                })
                .catch((error) => {
                    console.error("Error fetching results:", error)
                    setLoading(false)
                })
        }
    }, [])

    // Format date
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric' }
        return new Date(dateString).toLocaleDateString('en-US', options)
    }

    // Format time spent
    const formatTimeSpent = (seconds) => {
        if (!seconds) return 'N/A'
        const minutes = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${minutes}m ${secs}s`
    }

    if (loading) {
        return (
            <>
                <StudentNavbar />
                <div className='mx-auto' style={{ backgroundColor: "#f8f9fa", minHeight: '100vh' }}>
                    <div className='d-flex justify-content-center align-items-center' style={{ minHeight: '60vh' }}>
                        <h4>Loading your results...</h4>
                    </div>
                </div>
            </>
        )
    }

    return (
        <>
            <StudentNavbar />
            <div className='mx-auto' style={{ backgroundColor: "#f8f9fa" }}>
                <div className='col-lg-8 col-md-10 mx-auto pt-5 container' >
                    {results.length > 0 ? (
                        <div className='bg-white' style={{ borderTop: "4px solid #ab3500", borderRadius: "5px" }}>
                            <div className='mx-auto mt-5 alert alert-success' style={{
                                padding: "10px", width: "59px", borderRadius: "10px",
                            }}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="2.5em" height="2.5em" viewBox="0 0 48 48"><g fill="none" stroke="#0b581d" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4"><path d="m24 4l5.253 3.832l6.503-.012l1.997 6.188l5.268 3.812L41 24l2.021 6.18l-5.268 3.812l-1.997 6.188l-6.503-.012L24 44l-5.253-3.832l-6.503.012l-1.997-6.188l-5.268-3.812L7 24l-2.021-6.18l5.268-3.812l1.997-6.188l6.503.012z" /><path d="m17 24l5 5l10-10" /></g></svg>
                            </div>

                            <div className='px-5 py-4 text-center'>
                                <h3 className='fw-semibold '>Latest Test Result</h3>
                                <p style={{ color: "#64748b" }}>Your most recent exam performance</p>
                                <p className='text-center fw-bold'>FINAL SCORE</p>
                                <h1 className='fw-bold' style={{ fontSize: "70px", color: latestScore >= 50 ? "#10b981" : "#dc2626" }}>
                                    {latestScore.toFixed(2)}%
                                </h1>
                                <p style={{ color: latestScore >= 50 ? "#10b981" : "#dc2626", fontWeight: "600" }}>
                                    {latestScore >= 50 ? "✓ PASSED" : "✗ FAILED"}
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className='bg-white p-5 text-center' style={{ borderTop: "4px solid #ab3500", borderRadius: "5px" }}>
                            <p style={{ color: "#64748b" }}>No exam results yet. Start taking exams to see your scores here.</p>
                        </div>
                    )}
                </div>

                {results.length > 0 && (
                    <div className='container col-lg-8 col-md-10 py-4'>
                        <div className='d-flex justify-content-between align-items-center'>
                            <h5 className='fs-5 fw-bold'>Exam History</h5>
                            <p className='fs-6' style={{ color: "#64748b" }}>Total Exams: {results.length}</p>
                        </div>

                        <div className='table-responsive'>
                            <table className="table table-hover table-light">
                                <thead style={{ backgroundColor: "#f8f9fa" }}>
                                    <tr>
                                        <th scope="col" style={{ color: "#0f172a" }}>DATE TAKEN</th>
                                        <th scope="col" style={{ color: "#0f172a" }}>SUBJECT</th>
                                        <th scope="col" style={{ color: "#0f172a" }}>QUESTIONS</th>
                                        <th scope="col" style={{ color: "#0f172a" }}>CORRECT</th>
                                        <th scope="col" style={{ color: "#0f172a" }}>SCORE</th>
                                        <th scope="col" style={{ color: "#0f172a" }}>STATUS</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {results.map((result, index) => (
                                        <tr key={index}>
                                            <td className='fw-medium' style={{ color: "#475569" }}>
                                                {formatDate(result.submittedAt)}
                                            </td>
                                            <td>
                                                <span className='fw-bold' style={{ color: "#0f172a" }}>
                                                    {result.subject.charAt(0).toUpperCase() + result.subject.slice(1)}
                                                </span>
                                            </td>
                                            <td style={{ color: "#475569" }}>
                                                {result.totalQuestions}
                                            </td>
                                            <td style={{ color: "#475569" }}>
                                                {result.correctAnswers}
                                            </td>
                                            <td className='fw-bold' style={{ color: "#ab3500" }}>
                                                {result.score}%
                                            </td>
                                            <td>
                                                <span
                                                    className='badge fw-semibold'
                                                    style={{
                                                        backgroundColor: parseFloat(result.score) >= 50 ? "#d1fae5" : "#fee2e2",
                                                        color: parseFloat(result.score) >= 50 ? "#065f46" : "#991b1b"
                                                    }}
                                                >
                                                    {result.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Statistics Summary */}
                        <div className='row mt-5 mb-4'>
                            <div className='col-md-4 mb-3'>
                                <div className='bg-white p-4 rounded-3' style={{ borderLeft: "4px solid #ab3500" }}>
                                    <p style={{ color: "#64748b", margin: "0" }}>Total Exams</p>
                                    <h3 className='fw-bold' style={{ color: "#0f172a", margin: "10px 0 0 0" }}>
                                        {results.length}
                                    </h3>
                                </div>
                            </div>
                            <div className='col-md-4 mb-3'>
                                <div className='bg-white p-4 rounded-3' style={{ borderLeft: "4px solid #10b981" }}>
                                    <p style={{ color: "#64748b", margin: "0" }}>Passed</p>
                                    <h3 className='fw-bold' style={{ color: "#10b981", margin: "10px 0 0 0" }}>
                                        {results.filter(r => parseFloat(r.score) >= 50).length}
                                    </h3>
                                </div>
                            </div>
                            <div className='col-md-4 mb-3'>
                                <div className='bg-white p-4 rounded-3' style={{ borderLeft: "4px solid #dc2626" }}>
                                    <p style={{ color: "#64748b", margin: "0" }}>Failed</p>
                                    <h3 className='fw-bold' style={{ color: "#dc2626", margin: "10px 0 0 0" }}>
                                        {results.filter(r => parseFloat(r.score) < 50).length}
                                    </h3>
                                </div>
                            </div>
                        </div>

                        {/* Average Score */}
                        <div className='bg-white p-4 rounded-3 mb-4' style={{ textAlign: 'center' }}>
                            <p style={{ color: "#64748b", margin: "0" }}>Average Score</p>
                            <h2 className='fw-bold' style={{ color: "#ab3500", margin: "10px 0 0 0" }}>
                                {(results.reduce((sum, r) => sum + parseFloat(r.score), 0) / results.length).toFixed(2)}%
                            </h2>
                        </div>
                    </div>
                )}
            </div>
        </>
    )
}

export default ResultAndHistory