import React from 'react'

const PerformanceHistoryPage = () => {
  return (
    <section className='px-3 px-md-4 py-4 py-md-5'>
      <div className='container-fluid'>
        <div className='bg-white rounded-3 p-4 p-md-5'>
          <h3 className='fw-semibold mb-2'>Performance History</h3>
          <p className='text-muted mb-4'>Track your latest exam attempts and outcomes.</p>

          <div className='table-responsive'>
            <table className='table table-hover table-light'>
              <thead>
                <tr>
                  <th scope='col'>DATE TAKEN</th>
                  <th scope='col'>SUBJECT</th>
                  <th scope='col'>SCORE</th>
                  <th scope='col'>STATUS</th>
                </tr>
              </thead>

              <tbody>
                <tr>
                  <th scope='row' className='fw-medium'>Oct 24, 2026</th>
                  <td>Advanced Macroeconomics</td>
                  <td className='fw-medium'>85%</td>
                  <td className='text-success'>Pass</td>
                </tr>
                <tr>
                  <th scope='row' className='fw-medium'>Oct 20, 2026</th>
                  <td>Linear Algebra</td>
                  <td className='fw-medium'>92%</td>
                  <td className='text-success'>Pass</td>
                </tr>
                <tr>
                  <th scope='row' className='fw-medium'>Oct 15, 2026</th>
                  <td>System Programming</td>
                  <td className='fw-medium'>74%</td>
                  <td className='text-warning'>Average</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  )
}

export default PerformanceHistoryPage