import React, { useEffect, useState } from 'react'
import AssignedObjectCard from './AssignedObjectCard'
import axios from 'axios'
import { Link } from 'react-router-dom'
import API_BASE_URL from '../utils/api.config'
import { getAuthHeader } from '../utils/auth'

const AssignedObject = () => {
    const [questions, setQuestions] = useState([])
    const [loading, setLoading] = useState(true)
    const [uniqueSubjects, setUniqueSubjects] = useState([])

    useEffect(() => {
        // Fetch both questions and active subjects to prevent deleted subjects from appearing
        Promise.all([
            axios.get(`${API_BASE_URL}/user/getAllQuestions?_t=${Date.now()}`, { headers: getAuthHeader() }),
            axios.get(`${API_BASE_URL}/subjects`, { headers: getAuthHeader() }).catch(err => {
                console.warn("Failed to fetch subjects:", err)
                return { data: null } // Return null to signal failure
            })
        ])
            .then(([questionsResponse, subjectsResponse]) => {
                // Safely extract questions
                const questionsArray = questionsResponse.data.questionsArray || questionsResponse.data.questions || questionsResponse.data || []
                setQuestions(questionsArray)

                // Safely extract active subjects
                const activeSubjects = subjectsResponse.data?.subjects
                const hasSubjectsData = Array.isArray(activeSubjects)
                
                const activeSubjectMap = {}
                if (hasSubjectsData) {
                    activeSubjects.forEach(s => {
                        activeSubjectMap[s.name] = s
                    })
                }

                if (Array.isArray(questionsArray)) {
                    // Group ONLY published questions by subject (students shouldn't see drafts)
                    const subjectMap = {}
                    const publishedQuestions = questionsArray.filter(q => q.status === 'published' || !q.status)

                    publishedQuestions.forEach(question => {
                        // If we successfully fetched subjects, ONLY include questions if their subject exists
                        // If fetching subjects failed, fallback to showing all published questions
                        if (!hasSubjectsData || activeSubjectMap[question.subject]) {
                            if (!subjectMap[question.subject]) {
                                const subjectDetails = hasSubjectsData ? activeSubjectMap[question.subject] : null
                                subjectMap[question.subject] = {
                                    subject: question.subject,
                                    description: subjectDetails?.description || question.description,
                                    duration: subjectDetails?.duration || question.duration,
                                    questionCount: 0,
                                    firstQuestionId: question._id || question.id
                                }
                            }
                            subjectMap[question.subject].questionCount += 1
                        }
                    })

                    const uniqueSubjectsArray = Object.values(subjectMap)
                    setUniqueSubjects(uniqueSubjectsArray)
                }
            })
            .catch((error) => {
                console.error("Error fetching assigned subjects:", error)
                // If token is expired (401) or invalid, clear invalid data and force a fresh login
                if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                    localStorage.removeItem('token')
                    localStorage.removeItem('studentData')
                    window.location.href = '/studentSignin'
                }
            })
            .finally(() => {
                setLoading(false)
            })
    }, [])

    const subjectsAssigned = {
        backgroundColor: "#f8f9fa",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        margin: "0px auto",
        padding: "20px 0 2px 0px"
    }


    const recentPerformance = {
        backgroundColor: "#f3f4f5",
        padding: "30px 25px",
        marginTop: "30px",
        borderRadius: "17px"
    }

    const year = new Date
    const thisYear = year.getFullYear()

    return (
        <>
            <div style={{ backgroundColor: "#f8f9fa", padding: "20px" }}>
                <div className='container'>
                    <div style={subjectsAssigned}>
                        <div>
                            <h3 style={{ color: "#121d38", fontWeight: "bold" }}>Assigned Subjects</h3>
                            <p className='fw-medium' style={{ fontSize: " 14px" }}>Select a curated curriculum to begin your assessment.</p>
                        </div>

                        <div className='fw-bold'>
                            <Link to="/student/available-assessments" className='text-decoration-none d-flex align-items-center gap-1' style={{ color: "#121d38" }}>
                                <span style={{ fontSize: " 14px" }}>View all curriculum </span>
                                <svg xmlns="http://www.w3.org/2000/svg" width="1.2em" height="1.2em" viewBox="0 0 24 24"><g fill="none"><path d="M24 0v24H0V0zM12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.019-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z" /><path fill="#121d38" d="m15.06 5.283l5.657 5.657a1.5 1.5 0 0 1 0 2.12l-5.656 5.658a1.5 1.5 0 0 1-2.122-2.122l3.096-3.096H4.5a1.5 1.5 0 0 1 0-3h11.535L12.94 7.404a1.5 1.5 0 0 1 2.122-2.121Z" /></g></svg>
                            </Link>
                        </div>
                    </div>
                </div>


                {/* First Div */}
                <div className='container'>
                    <div className='row g-4'>
                        {loading ? (<p className='text-center py-5 mx-auto px-5'><svg xmlns="http://www.w3.org/2000/svg" width="3.5em" height="3.5em" viewBox="0 0 24 24"><rect width="10" height="10" x="1" y="1" fill="#ab3500" rx="1"><animate id="SVG7JagGz2Y" fill="freeze" attributeName="x" begin="0;SVGgDT19bUV.end" dur="0.17s" values="1;13" /><animate id="SVGpS1BddYk" fill="freeze" attributeName="y" begin="SVGc7yq8dne.end" dur="0.17s" values="1;13" /><animate id="SVGboa7EdFl" fill="freeze" attributeName="x" begin="SVG0ZX9C6Fa.end" dur="0.17s" values="13;1" /><animate id="SVG6rrusL2C" fill="freeze" attributeName="y" begin="SVGTOnnO5Dr.end" dur="0.17s" values="13;1" /></rect><rect width="10" height="10" x="1" y="13" fill="#ab3500" rx="1"><animate id="SVGc7yq8dne" fill="freeze" attributeName="y" begin="SVG7JagGz2Y.end" dur="0.17s" values="13;1" /><animate id="SVG0ZX9C6Fa" fill="freeze" attributeName="x" begin="SVGpS1BddYk.end" dur="0.17s" values="1;13" /><animate id="SVGTOnnO5Dr" fill="freeze" attributeName="y" begin="SVGboa7EdFl.end" dur="0.17s" values="1;13" /><animate id="SVGgDT19bUV" fill="freeze" attributeName="x" begin="SVG6rrusL2C.end" dur="0.17s" values="13;1" /></rect></svg></p>) : (
                            uniqueSubjects.map((subject) => (
                                <div className='col-12 col-md-4' key={subject.subject}>
                                    <div>
                                        <AssignedObjectCard
                                            cardSvg={<svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 16 16"><path fill="#ab3500" fill-rule="evenodd" d="M8 0a1 1 0 0 1 1 1v1.17c1.1.389 1.91 1.4 1.99 2.61l2.95 5.48a.5.5 0 0 1 .06.237v5a.5.5 0 0 1-.943.232l-4.13-7.88a3 3 0 0 1-1.86 0l-4.13 7.88a.5.5 0 0 1-.942-.232v-5a.5.5 0 0 1 .06-.237l2.95-5.48v.01a3.01 3.01 0 0 1 1.82-2.56l.167-.063V.997a1 1 0 0 1 1-1zM3 10.6v2.84l3.18-6.08a3 3 0 0 1-.871-1.06l-2.31 4.3zm7.69-4.3a3.06 3.06 0 0 1-.871 1.06l3.19 6.08V10.6l-2.31-4.3zM8 2.97a2 2 0 1 0-.001 4.001A2 2 0 0 0 8 2.97" clip-rule="evenodd" /></svg>}
                                            title={subject.subject}
                                            description={subject.description}
                                            question={`${subject.questionCount} QUESTION`}

                                            questionSvg={<svg xmlns="http://www.w3.org/2000/svg" width="1.2em" height="1.2em" viewBox="0 0 24 24"><path fill="#ab3500" d="M12 21q-3.775 0-6.387-1.162T3 17V7q0-1.65 2.638-2.825T12 3t6.363 1.175T21 7v10q0 1.675-2.613 2.838T12 21m0-11.975q2.225 0 4.475-.638T19 7.025q-.275-.725-2.512-1.375T12 5q-2.275 0-4.462.638T5 7.025q.35.75 2.538 1.375T12 9.025M12 14q1.05 0 2.025-.1t1.863-.288t1.675-.462T19 12.525v-3q-.65.35-1.437.625t-1.675.463t-1.863.287T12 11t-2.05-.1t-1.888-.288T6.4 10.15T5 9.525v3q.625.35 1.4.625t1.663.463t1.887.287T12 14m0 5q1.15 0 2.338-.175t2.187-.462t1.675-.65t.8-.738v-2.45q-.65.35-1.437.625t-1.675.463t-1.863.287T12 16t-2.05-.1t-1.888-.288T6.4 15.15T5 14.525V17q.125.375.788.725t1.662.638t2.2.462T12 19" /></svg>}

                                            minutes={`${subject.duration} MINS`}
                                            minutesSvg={<svg xmlns="http://www.w3.org/2000/svg" width="1.0em" height="1.0em" viewBox="0 0 20 20"><path fill="#ab3500" d="M10 0c5.523 0 10 4.477 10 10s-4.477 10-10 10S0 15.523 0 10S4.477 0 10 0m0 1.395a8.605 8.605 0 1 0 0 17.21a8.605 8.605 0 0 0 0-17.21m-.93 4.186c.385 0 .697.313.697.698v4.884h5.884a.698.698 0 0 1 0 1.395H9.07a.7.7 0 0 1-.698-.698V6.28c0-.386.312-.699.698-.699" /></svg>}
                                            questionId={subject.firstQuestionId}
                                            cardBtn={"Start Quiz"}
                                        />
                                    </div>
                                </div>
                            )))
                        }
                        {!loading && uniqueSubjects.length === 0 && (
                            <p>No question(s) found in the database.</p>
                        )}
                    </div>
                </div>


                {/* <div style={recentPerformance} className='container my-5'>
                    <div className='d-flex justify-content-between align-items-center mb-4'>
                        <div>
                            <h3 style={{ color: "#110d43", fontWeight: "bold" }}>Recent Performance</h3>
                        </div>

                        <div className='fw-bold' style={{ color: "#110d43", fontSize: "16px" }}>
                            FULL HISTORY
                        </div>
                    </div>

                    <div className='row g-3 my-3'>
                        <div className='col-lg-6 col-12'>
                            <div className='bg-white p-4 rounded-3'>
                                <h2 className='fw-bold fs-1' style={{ color: "#110d43" }}>88%</h2>
                                <div>
                                    <h5 className='fw-bold'>Micro-Economics Final</h5>
                                    <p>Completed 2 days ago • Rank: 4th of 120</p>
                                </div>
                            </div>
                        </div>

                        <div className='col-lg-6 col-12'>
                            <div className='bg-white p-4 rounded-3'>
                                <h2 className='fw-bold fs-1' style={{ color: "#110d43" }}>94%</h2>
                                <div>
                                    <h5 className='fw-bold'>Linear Algebra Quiz</h5>
                                    <p>Completed yesterday • Rank: 1st of 85</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div> */}

                <footer className='container py-3 buttom-0' style={{ backgroundColor: "#f8f9fa", marginTop: "30px" }}>
                    <div className='d-flex justify-content-between' style={{ fontSize: "12px" }}>
                        <p> © {thisYear} Online CBT | Excel in your academic performance</p>

                        <div className=''>
                            <ul className='d-flex gap-3'>
                                <li style={{ listStyle: "none" }}><a href="#" style={{ textDecoration: "none", color: "black", fontWeight: "medium", fontSize: "12px" }}>Support</a></li>

                                <Link to="/privacy-policy" className='text-decoration-none'>
                                    <li style={{ listStyle: "none" }}><a href="#" style={{ textDecoration: "none", color: "black", fontWeight: "medium", fontSize: "12px" }}>Privacy</a></li>
                                </Link>
                            </ul>
                        </div>
                    </div>
                </footer>
            </div >
        </>
    )
}

export default AssignedObject