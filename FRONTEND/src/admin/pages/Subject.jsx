import React, { useState, useEffect } from 'react'
import './Subject.css'
import { subjectApi } from '../../utils/subjectApi'
import { questionApi } from '../../utils/questionApi'
import { toast } from 'react-toastify'
import { showConfirm } from '../../utils/toastUtils'

const Subject = () => {
  const [subjects, setSubjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingSubjectId, setEditingSubjectId] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    department: '',
    description: '',
    duration: '',
  })

  // Fetch subjects on component mount
  useEffect(() => {
    fetchSubjects()
  }, [])

  const fetchSubjects = () => {
    setLoading(true)
    setError(null)
    
    subjectApi.getAllSubjects()
      .then((response) => {
        console.log('Subjects fetched:', response.subjects)
        setSubjects(response.subjects || [])
        setLoading(false)
      })
      .catch((error) => {
        console.error('Failed to fetch subjects:', error)
        setError('Failed to load subjects. Please try again.')
        setLoading(false)
        toast.error('Failed to load subjects')
      })
  }

  const handleAddSubject = (e) => {
    e.preventDefault()

    if (!formData.name || !formData.department || !formData.duration) {
      toast.error('Please fill in all required fields')
      return
    }

    subjectApi.createSubject(formData)
      .then((response) => {
        console.log('Subject created:', response.subject)
        setSubjects([...subjects, response.subject])
        setFormData({ name: '', department: '', description: '', duration: '' })
        setShowAddModal(false)
        toast.success('Subject created successfully!')
        fetchSubjects()
      })
      .catch((error) => {
        console.error('Failed to create subject:', error)
        toast.error(error.response?.data?.message || 'Failed to create subject')
      })
  }

  const handleDeleteSubject = (subject) => {
    showConfirm(
      "Delete Subject",
      `Are you sure you want to delete "${subject.name}"? All questions in its question bank will also be deleted permanently.`,
      "Yes, Delete",
      "Cancel"
    ).then((result) => {
      if (result.isConfirmed) {
        subjectApi.deleteSubject(subject._id)
          .then(() => {
            setSubjects(subjects.filter(s => s._id !== subject._id))
            toast.success('Subject deleted successfully!')
            
            // Automatically delete all questions linked to this subject
            questionApi.getAllQuestions()
              .then(res => {
                const questionsArray = res.questionsArray || []
                const questionsToDelete = questionsArray.filter(q => q.subject === subject.name)
                
                if (questionsToDelete.length > 0) {
                  const deletePromises = questionsToDelete.map(q => questionApi.deleteQuestion(q._id || q.id))
                  Promise.all(deletePromises)
                    .then(() => console.log(`Successfully deleted ${questionsToDelete.length} associated questions.`))
                    .catch(err => console.error('Error deleting associated questions:', err))
                }
              })
              .catch(err => console.error('Error fetching questions for cleanup:', err))
              
          })
          .catch((error) => {
            console.error('Failed to delete subject:', error)
            toast.error('Failed to delete subject')
          })
      }
    })
  }

  const handleEditSubject = (subject) => {
    setEditingSubjectId(subject._id)
    setFormData({
      name: subject.name,
      department: subject.department,
      description: subject.description,
      duration: subject.duration,
    })
    setShowEditModal(true)
  }

  const handleUpdateSubject = (e) => {
    e.preventDefault()

    if (!formData.name || !formData.department || !formData.duration) {
      toast.error('Please fill in all required fields')
      return
    }

    subjectApi.updateSubject(editingSubjectId, formData)
      .then((response) => {
        console.log('Subject updated:', response.subject)
        setSubjects(subjects.map(s => s._id === editingSubjectId ? response.subject : s))
        setFormData({ name: '', department: '', description: '', duration: '' })
        setShowEditModal(false)
        setEditingSubjectId(null)
        toast.success('Subject updated successfully!')
      })
      .catch((error) => {
        console.error('Failed to update subject:', error)
        toast.error(error.response?.data?.message || 'Failed to update subject')
      })
  }

  const handleCancelEdit = () => {
    setShowEditModal(false)
    setEditingSubjectId(null)
    setFormData({ name: '', department: '', description: '', duration: '' })
  }

  const getAccentColor = (index) => {
    const colors = ['#6c63ff', '#6366f1', '#c47a3f', '#f59e0b', '#10b981', '#8b5cf6']
    return colors[index % colors.length]
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
  }

  const filteredSubjects = subjects.filter(subject =>
    subject.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    subject.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
    subject.description?.toLowerCase().includes(searchTerm.toLowerCase())
  )
  return (
    <section className='admin-subjects'>
      <div className='admin-subjects__header'>
        <div>
          <h2 className='admin-subjects__title'>Manage Subjects</h2>
          <p className='admin-subjects__subtitle'>Curate and organize your academic disciplines and their respective test banks.</p>
        </div>

        <button type='button' className='admin-subjects__add-button' onClick={() => setShowAddModal(true)}>
          <span className='admin-subjects__add-icon'>+</span>
          Add Subject
        </button>
      </div>

      {/* Search Bar */}
      <div className='admin-subjects__search'>
        <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
          <circle cx='11' cy='11' r='8'></circle>
          <path d='m21 21-4.35-4.35'></path>
        </svg>
        <input
          type='text'
          placeholder='Search by subject name, department, or description...'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className='admin-subjects__search-input'
        />
        {searchTerm && (
          <button
            type='button'
            onClick={() => setSearchTerm('')}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '0.25rem',
              color: '#9ca3af',
              display: 'flex',
              alignItems: 'center',
              fontSize: '1.2rem',
            }}
            title='Clear search'
          >
            ✕
          </button>
        )}
      </div>

      {/* Loading State */}
      {loading && (
        <div className='admin-subjects__loading'>
          <p>Loading subjects...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className='admin-subjects__error'>
          <p>{error}</p>
          <button onClick={fetchSubjects}>Retry</button>
        </div>
      )}

      {/* Subjects List */}
      {!loading && !error && filteredSubjects.length > 0 && (
        <div className='admin-subjects__list'>
          {filteredSubjects.map((subject, index) => (
            <article key={subject._id} className='admin-subject-card' style={{ '--accent-color': getAccentColor(index) }}>
              <div className='admin-subject-card__body'>
                <div className='admin-subject-card__meta-row'>
                  <span className='admin-subject-card__meta'>Department: {subject.department}</span>
                  <span className='admin-subject-card__meta'>Updated {formatDate(subject.updatedAt)}</span>
                </div>

                <h3 className='admin-subject-card__title'>{subject.name}</h3>
                <p className='admin-subject-card__description'>{subject.description || 'No description provided'}</p>

                <div className='admin-subject-card__stats'>
                  <span className='admin-subject-card__stat'>
                    <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' aria-hidden='true'>
                      <path fill='currentColor' d='M12 3a9 9 0 1 0 9 9a9 9 0 0 0-9-9m1 13h-2v-2h2Zm0-4h-2V7h2Z' />
                    </svg>
                    {subject.duration} min
                  </span>
                </div>
              </div>

              <div className='admin-subject-card__actions'>
                <button 
                  type='button' 
                  className='admin-subject-card__icon-button' 
                  aria-label={`Edit ${subject.name}`}
                  onClick={() => handleEditSubject(subject)}
                >
                  <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' aria-hidden='true'>
                    <path fill='currentColor' d='M3 17.25V21h3.75L17.81 9.94l-3.75-3.75zM20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83l3.75 3.75z' />
                  </svg>
                </button>

                <button 
                  type='button' 
                  className='admin-subject-card__icon-button is-danger' 
                  aria-label={`Delete ${subject.name}`}
                  onClick={() => handleDeleteSubject(subject)}
                >
                  <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' aria-hidden='true'>
                    <path fill='currentColor' d='M9 3.75h6l.75 1.5H21v1.5H3v-1.5h5.25zM6 8.25h12l-1 11.25A1.5 1.5 0 0 1 15.5 21h-7a1.5 1.5 0 0 1-1.5-1.5z' />
                  </svg>
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && subjects.length === 0 && (
        <div className='admin-subjects__empty'>
          <p>No subjects found. Click "Add Subject" to create one.</p>
        </div>
      )}

      {/* No Search Results */}
      {!loading && !error && subjects.length > 0 && filteredSubjects.length === 0 && (
        <div className='admin-subjects__empty'>
          <p>
            <strong>No matches found</strong> for "{searchTerm}"
            <br />
            <span style={{ fontSize: '0.9em', color: '#6b7280' }}>Try searching with different keywords or clear the search</span>
          </p>
        </div>
      )}

      {/* Add Subject Modal */}
      {showAddModal && (
        <div className='admin-subjects__modal-overlay' onClick={() => setShowAddModal(false)}>
          <div className='admin-subjects__modal' onClick={(e) => e.stopPropagation()}>
            <h3 className='admin-subjects__modal-title'>Add New Subject</h3>
            
            <form onSubmit={handleAddSubject} className='admin-subjects__form'>
              <div className='admin-subjects__form-group'>
                <label htmlFor='name'>Subject Name *</label>
                <input
                  type='text'
                  id='name'
                  placeholder='e.g., CSC 101'
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className='admin-subjects__form-group'>
                <label htmlFor='department'>Department *</label>
                <input
                  type='text'
                  id='department'
                  placeholder='e.g., Computer Science'
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  required
                />
              </div>

              <div className='admin-subjects__form-group'>
                <label htmlFor='duration'>Duration (minutes) *</label>
                <input
                  type='number'
                  id='duration'
                  placeholder='e.g., 60'
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                  required
                  min='1'
                />
              </div>

              <div className='admin-subjects__form-group'>
                <label htmlFor='description'>Description</label>
                <textarea
                  id='description'
                  placeholder='Enter subject description'
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows='4'
                />
              </div>

              <div className='admin-subjects__modal-actions'>
                <button type='button' onClick={() => setShowAddModal(false)} className='admin-subjects__btn-cancel'>
                  Cancel
                </button>
                <button type='submit' className='admin-subjects__btn-submit'>
                  Create Subject
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Subject Modal */}
      {showEditModal && (
        <div className='admin-subjects__modal-overlay' onClick={handleCancelEdit}>
          <div className='admin-subjects__modal' onClick={(e) => e.stopPropagation()}>
            <h3 className='admin-subjects__modal-title'>Edit Subject</h3>
            
            <form onSubmit={handleUpdateSubject} className='admin-subjects__form'>
              <div className='admin-subjects__form-group'>
                <label htmlFor='edit-name'>Subject Name *</label>
                <input
                  type='text'
                  id='edit-name'
                  placeholder='e.g., CSC 101'
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className='admin-subjects__form-group'>
                <label htmlFor='edit-department'>Department *</label>
                <input
                  type='text'
                  id='edit-department'
                  placeholder='e.g., Computer Science'
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  required
                />
              </div>

              <div className='admin-subjects__form-group'>
                <label htmlFor='edit-duration'>Duration (minutes) *</label>
                <input
                  type='number'
                  id='edit-duration'
                  placeholder='e.g., 60'
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                  required
                  min='1'
                />
              </div>

              <div className='admin-subjects__form-group'>
                <label htmlFor='edit-description'>Description</label>
                <textarea
                  id='edit-description'
                  placeholder='Enter subject description'
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows='4'
                />
              </div>

              <div className='admin-subjects__modal-actions'>
                <button type='button' onClick={handleCancelEdit} className='admin-subjects__btn-cancel'>
                  Cancel
                </button>
                <button type='submit' className='admin-subjects__btn-submit'>
                  Update Subject
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className='admin-subjects__footer'>
        <p className='admin-subjects__count'>
          {searchTerm ? (
            <>
              Showing <strong>{filteredSubjects.length}</strong> of <strong>{subjects.length}</strong> subject{subjects.length !== 1 ? 's' : ''}
              {filteredSubjects.length === 0 && ' • No matches'}
            </>
          ) : (
            <>
              Total: <strong>{subjects.length}</strong> subject{subjects.length !== 1 ? 's' : ''}
            </>
          )}
        </p>
      </div>
    </section>
  )
}

export default Subject