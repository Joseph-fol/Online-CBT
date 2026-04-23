import React from 'react'
import { Link } from 'react-router-dom'

const stats = [
  { label: 'TOTAL STUDENTS', value: '120' },
  { label: 'ACTIVE SUBJECTS', value: '12' },
  { label: 'QUESTION BANK', value: '25' },
  { label: 'AVERAGE SCORE', value: '76%' },
]

const AdminOverview = () => {
  return (
    <section className='admin-overview'>
      <div className='admin-overview-top-section'>
        <div className='admin-overview__hero'>
          <p className='admin-overview__eyebrow'>Dashboard</p>
          <h2 className='admin-overview__title'>Welcome back, Admin.</h2>
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
        {stats.map((item) => (
          <article key={item.label} className='admin-overview__card'>
            <span className='admin-overview__card-label'>{item.label}</span>
            <span className='admin-overview__card-value'>{item.value}</span>
          </article>
        ))}
      </div>

      <div className='col-lg-12 col-md-10 py-4 '>
        <div className='d-flex justify-content-between'>
          <h5 className='fs-5'>Recent Activity History </h5>
        </div>

        <div className='admin-overview__table-wrap'>
          <table className='table table-hover table-light'>
            <thead>
              <tr>
                <th scope="col">STUDENT NAME</th>
                <th scope="col">SUBJECT</th>
                <th scope="col">SCORE</th>
                <th scope="col">TIME SUBMITTED</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <th scope="row" className='fw-medium'>Adesola Micheal</th>
                <td>
                  <span className=''>Advanced Macroeconomics</span>
                </td>
                <td className='fw-medium'>85%</td>
                <td className=''>2 min ago</td>
              </tr>
              <tr>
                <th scope="row" className='fw-medium'>Adesola Micheal</th>
                <td>
                  <span className=''>Advanced Macroeconomics</span>
                </td>
                <td className='fw-medium'>85%</td>
                <td className=''>2 min ago</td>
              </tr>
              <tr>
                <th scope="row" className='fw-medium'>Adesola Micheal</th>
                <td>
                  <span className=''>Advanced Macroeconomics</span>
                </td>
                <td className='fw-medium'>85%</td>
                <td className=''>2 min ago</td>
              </tr>
              <tr>
                <th scope="row" className='fw-medium'>Adesola Micheal</th>
                <td>
                  <span className=''>Advanced Macroeconomics</span>
                </td>
                <td className='fw-medium'>85%</td>
                <td className=''>2 min ago</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}

export default AdminOverview