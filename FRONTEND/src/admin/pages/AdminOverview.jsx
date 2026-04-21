import React from 'react'

const stats = [
  { label: 'Active exams', value: '12' },
  { label: 'Registered subjects', value: '8' },
  { label: 'Pending reviews', value: '24' },
]

const AdminOverview = () => {
  return (
    <section className='admin-overview'>
      <div className='admin-overview__hero'>
        <p className='admin-overview__eyebrow'>Dashboard</p>
        <h2 className='admin-overview__title'>Welcome back, Admin.</h2>
        <p className='admin-overview__text'>Use the sidebar or top navigation to move between subjects, question bank management, and student results.</p>
      </div>

      <div className='admin-overview__stats'>
        {stats.map((item) => (
          <article key={item.label} className='admin-overview__card'>
            <span className='admin-overview__card-value'>{item.value}</span>
            <span className='admin-overview__card-label'>{item.label}</span>
          </article>
        ))}
      </div>

    </section>
  )
}

export default AdminOverview