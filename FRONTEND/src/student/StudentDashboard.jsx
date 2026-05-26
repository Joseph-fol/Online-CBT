import React, { useState, useEffect } from 'react'
import './StudentDashboard.css'
import AssignedObject from './AssignedObject'
import { Link } from 'react-router-dom'

const StudentDashboard = () => {
    const [studentName, setStudentName] = useState('SCHOLAR')

    useEffect(() => {
        const studentData = localStorage.getItem('studentData')
        if (studentData) {
            try {
                const parsedData = JSON.parse(studentData)

                // Handle both fullName and name properties
                setStudentName(parsedData.fullName || parsedData.name || 'SCHOLAR')
            } catch (error) {
                console.error('Error parsing student data:', error)
                setStudentName('SCHOLAR')
            }
        }
    }, [])

    return (
        <>
            <section className='student-dashboard-shell'>
                <div className='student-dashboard-banner'>
                    <div className='student-dashboard-content'>
                        <p className="fs-5"> WELCOME BACK, {studentName.toUpperCase()}</p>
                        <h3>Your Academic Journey, <br /> Curated for Excellence.</h3>

                        {/* <p className='fs-6 py-2'>You have 3 pending examinations this week. Your average score has improved by 12% since last month. Keep up the momentum.</p> */}

                        <div className='student-dashboard-actions'>
                            <Link to='/student/performance-history'>
                                <button className='dashboard-button dashboard-button-light'>Show Result</button>
                            </Link>

                            <Link to='/student/available-assessments'>
                                <button className='dashboard-button dashboard-button-outline'>Start Exam</button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
            <AssignedObject />

        </>
    )
}

export default StudentDashboard