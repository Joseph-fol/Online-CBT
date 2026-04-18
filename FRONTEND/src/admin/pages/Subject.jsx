import React from 'react'
import './Subject.css'

const subjects = [
  {
    category: 'Department: STEM',
    updatedAt: 'Last updated Oct 12',
    title: 'Advanced Quantum Mechanics',
    description:
      'Fundamental theories of wave-particle duality, Schrödinger equations, and practical applications in modern particle physics labs.',
    questions: '124 Questions',
    students: '490 Students',
    accent: '#6c63ff',
  },
  {
    category: 'Department: Humanities',
    updatedAt: 'Last updated Oct 11',
    title: 'Post-Industrial Economics',
    description:
      'A comprehensive study of shifts from manufacturing-based economies to service and information-based global structures.',
    questions: '245 Questions',
    students: '1,240 Students',
    accent: '#6366f1',
  },
  {
    category: 'Department: Medicine',
    updatedAt: 'Last updated Sep 20',
    title: 'Anatomy & Physiology II',
    description:
      'Focusing on internal organ systems, metabolic processes, and homeostatic regulation within the human cardiovascular system.',
    questions: '512 Questions',
    students: '480 Students',
    accent: '#c47a3f',
  },
]

const Subject = () => {
  return (
    <section className='admin-subjects'>
      <div className='admin-subjects__header'>
        <div>
          <h2 className='admin-subjects__title'>Manage Subjects</h2>
          <p className='admin-subjects__subtitle'>Curate and organize your academic disciplines and their respective test banks.</p>
        </div>

        <button type='button' className='admin-subjects__add-button'>
          <span className='admin-subjects__add-icon'>+</span>
          Add Subject
        </button>
      </div>

      <div className='admin-subjects__list'>
        {subjects.map((subject) => (
          <article key={subject.title} className='admin-subject-card' style={{ '--accent-color': subject.accent }}>
            <div className='admin-subject-card__body'>
              <div className='admin-subject-card__meta-row'>
                <span className='admin-subject-card__meta'>{subject.category}</span>
                <span className='admin-subject-card__meta'>{subject.updatedAt}</span>
              </div>

              <h3 className='admin-subject-card__title'>{subject.title}</h3>
              <p className='admin-subject-card__description'>{subject.description}</p>

              <div className='admin-subject-card__stats'>
                <span className='admin-subject-card__stat'>
                  <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' aria-hidden='true'>
                    <path fill='currentColor' d='M12 3a9 9 0 1 0 9 9a9 9 0 0 0-9-9m1 13h-2v-2h2Zm0-4h-2V7h2Z' />
                  </svg>
                  {subject.questions}
                </span>
                <span className='admin-subject-card__stat'>
                  <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' aria-hidden='true'>
                    <path fill='currentColor' d='M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3s1.34 3 3 3m-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5S5 6.34 5 8s1.34 3 3 3m0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5C15 14.17 10.33 13 8 13m8 0c-.29 0-.62.02-.97.05C16.96 13.8 18 14.88 18 16.5V19h6v-2.5c0-2.33-4.67-3.5-8-3.5' />
                  </svg>
                  {subject.students}
                </span>
              </div>
            </div>

            <div className='admin-subject-card__actions'>
              <button type='button' className='admin-subject-card__icon-button' aria-label={`Edit ${subject.title}`}>
                <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' aria-hidden='true'>
                  <path fill='currentColor' d='M3 17.25V21h3.75L17.81 9.94l-3.75-3.75zM20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83l3.75 3.75z' />
                </svg>
              </button>

              <button type='button' className='admin-subject-card__icon-button is-danger' aria-label={`Delete ${subject.title}`}>
                <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' aria-hidden='true'>
                  <path fill='currentColor' d='M9 3.75h6l.75 1.5H21v1.5H3v-1.5h5.25zM6 8.25h12l-1 11.25A1.5 1.5 0 0 1 15.5 21h-7a1.5 1.5 0 0 1-1.5-1.5z' />
                </svg>
              </button>
            </div>
          </article>
        ))}
      </div>

      <div className='admin-subjects__footer'>
        <p className='admin-subjects__count'>Showing 1 to 3 of 24 subjects</p>

        <div className='admin-subjects__pagination' aria-label='Pagination'>
          <button type='button' className='admin-subjects__page-nav' aria-label='Previous page'>
            <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' aria-hidden='true'>
              <path fill='currentColor' d='M15.41 7.41L14 6l-6 6l6 6l1.41-1.41L10.83 12z' />
            </svg>
          </button>

          <button type='button' className='admin-subjects__page is-active'>1</button>
          <button type='button' className='admin-subjects__page'>2</button>
          <button type='button' className='admin-subjects__page'>3</button>
          <span className='admin-subjects__ellipsis'>...</span>

          <button type='button' className='admin-subjects__page-nav' aria-label='Next page'>
            <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' aria-hidden='true'>
              <path fill='currentColor' d='m8.59 16.59l1.41 1.41l6-6l-6-6l-1.41 1.41L13.17 12z' />
            </svg>
          </button>
        </div>
      </div>
    </section>
  )
}

export default Subject