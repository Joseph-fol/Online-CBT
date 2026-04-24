import React from 'react'
import './StudentResult.css'

const StudentResult = () => {
  return (
    <>
    <div className='student-result-top-section'>
      <div>
        <h2 className='fw-bold'>Student Result</h2>
      </div>

      <div className='student-result-top-section_button'>
        <button className='the-btn'> <svg xmlns="http://www.w3.org/2000/svg" width="1.3em" height="1.3em" viewBox="0 0 24 24"><path fill="#fff" d="M11 13H5v-2h6V5h2v6h6v2h-6v6h-2z" /></svg>New Report</button>
      </div>

    </div>
    </>
  )
}

export default StudentResult