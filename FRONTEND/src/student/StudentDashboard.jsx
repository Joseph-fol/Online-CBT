import React from 'react'
import './StudentDashboard.css'

const StudentDashboard = () => {
    return (
        <>
            <section className='student-dashboard-shell'>
                <div className='student-dashboard-banner'>
                    <div className='student-dashboard-content'>
                        <p> WELCOME BACK, SCHOLAR</p>
                        <h2>Your Academic Journey, <br /> Curated for Excellence.</h2>
                        <p className='fs-6 py-2'>You have 3 pending examinations this week. Your average score has improved by 12% since last month. Keep up the momentum.</p>

                        <div className='student-dashboard-actions'>
                            <button className='dashboard-button dashboard-button-light'>View Analytics</button>
                            <button className='dashboard-button dashboard-button-outline'>Schedule Season</button>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default StudentDashboard