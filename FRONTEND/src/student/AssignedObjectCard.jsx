import React from 'react'

const AssignedObjectCard = ({title, description, question, cardSvg, questionSvg, minutes, minutesSvg, cardBtn }) => {
    return (
        <>
            <div className='bg-white p-4 rounded-3 h-100'>
                <div style={{ backgroundColor: "#f8f9fa", padding: "10px", width: "50px", borderRadius: "10px", marginBottom: "17px"}}>
                    {cardSvg}
                </div>
                <h5 className='fw-bold fs-5'>{title}</h5>
                <p style={{ fontSize: " 14px" }}>{description}</p>

                <div className='d-flex justify-content-between py-3'>
                    <div className='fw-medium'>
                        {questionSvg}
                        <span style={{ fontSize: " 14px" }}>{question}</span>
                    </div>

                    <div className='fw-medium fs-6'>
                        {minutesSvg}
                        <span style={{ fontSize: " 14px" }}> {minutes}</span>
                    </div>
                </div>
                <button className='w-100 text-white my-3 py-2 fw-medium border border-none' style={{ backgroundColor: "#ab3500" }}>{cardBtn}</button>
            </div>
        </>
    )
}

export default AssignedObjectCard