import React from 'react'

const StudentDashboard = () => {
    const dashboard = {
        backgroundColor: "#f8f9fa",
        padding: "50px",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItem: "center",
        color: "white"
    }

    const dashboardBanner = {
        backgroundColor: "#392bd1",
        padding: "40px",
        width: "80%",
        borderRadius: "10px"
    }

    return (
        <>
        <div style={dashboard}>
            <div  style={dashboardBanner}>
                <div style={{width:"70%"}}>
                    <p> WELCOME BACK, SCHOLAR</p>
                    <h2 style={{fontSize: "50px", fontWeight: "bold"}}>Your Academic Journey, <br /> Curated for Excellence.</h2>
                    <p className='fs-6 py-2'>You have 3 pending examinations this week. Your average score has improved by 12% since last month. Keep up the momentum.</p>

                    <div className='d-flex gap-3'>
                        <button className='rounded-none border-0 px-5 py-3 fw-medium'>View Analytics</button>
                        <button className='border border-danger border-1 border-white text-white px-5 py-3 fw-medium' style={{background:"#392bd1"}}>Schedule Season </button>
                    </div>
                </div>
            </div>

        </div>
        </>
    )
}

export default StudentDashboard