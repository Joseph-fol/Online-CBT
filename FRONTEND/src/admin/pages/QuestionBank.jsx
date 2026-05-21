import React, { useEffect, useRef, useState } from 'react'
import './QuestionBank.css'
import { useFormik } from 'formik'
import * as yup from "yup"
import { showSuccess, showError, showInfo, showConfirm } from '../../utils/toastUtils'
import API_BASE_URL from '../../utils/api.config'
import { questionApi } from '../../utils/questionApi'

const QuestionBank = () => {
  const [allQuestions, setAllQuestions] = useState([])
  const [filteredDraftQuestions, setFilteredDraftQuestions] = useState([])
  const [filteredSavedQuestions, setFilteredSavedQuestions] = useState([])
  const [editingId, setEditingId] = useState(null)
  const [editingStatus, setEditingStatus] = useState('draft')
  const [subjects, setSubjects] = useState([])
  const [selectedSubject, setSelectedSubject] = useState('')
  const [isNewSubject, setIsNewSubject] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const formSectionRef = useRef(null)

  // Fetch existing subjects and saved questions on component mount
  useEffect(() => {
    fetchAllQuestions()
  }, [])

  // Filter saved questions whenever selectedSubject changes
  useEffect(() => {
    if (selectedSubject && selectedSubject !== 'new') {
      const subjectQuestions = allQuestions.filter(q => q.subject === selectedSubject)
      setFilteredDraftQuestions(subjectQuestions.filter(q => q.status === 'draft'))
      setFilteredSavedQuestions(subjectQuestions.filter(q => q.status !== 'draft'))
    } else {
      setFilteredDraftQuestions([])
      setFilteredSavedQuestions([])
    }
  }, [selectedSubject, allQuestions])

  const fetchAllQuestions = () => {
    questionApi.getAllQuestions()
      .then((response) => {
        const questionsArray = response.questionsArray
        
        // Convert database questions to displayable format
        const formattedQuestions = questionsArray.map(q => ({
          id: q._id,
          subject: q.subject,
          description: q.description,
          questionText: q.questionText,
          marks: q.marks,
          duration: q.duration,
          totalQuestion: q.totalQuestion,
          score: q.score,
          correctAnswer: q.correctAnswer,
          status: q.status || 'published',
          options: [
            { key: 'A', text: q.options?.A || '' },
            { key: 'B', text: q.options?.B || '' },
            { key: 'C', text: q.options?.C || '' },
            { key: 'D', text: q.options?.D || '' }
          ]
        }))
        
        setAllQuestions(formattedQuestions)
        
        // Extract unique subjects
        const subjectMap = {}
        questionsArray.forEach(question => {
          if (!subjectMap[question.subject]) {
            subjectMap[question.subject] = {
              name: question.subject,
              description: question.description,
              duration: question.duration,
              marks: question.marks,
              totalQuestion: question.totalQuestion,
              score: question.score
            }
          }
        })
        const uniqueSubjectsArray = Object.values(subjectMap)
        setSubjects(uniqueSubjectsArray)
      })
      .catch((error) => {
        console.error("Error fetching subjects:", error)
        showError("Failed to load questions")
      })
  }

  // Handle subject selection and auto-fill fields
  const handleSubjectSelect = (subjectName) => {
    setSelectedSubject(subjectName)
    
    if (subjectName === "new") {
      setIsNewSubject(true)
      formik.setValues({
        subject: "",
        description: "",
        marks: '2',
        duration: "",
        totalQuestion: "",
        score: "",
        questionText: '',
        optionA: '',
        optionB: '',
        optionC: '',
        optionD: '',
        correctAnswer: ''
      })
      return
    }
    
    setIsNewSubject(false)
    const selectedSubject = subjects.find(s => s.name === subjectName)
    if (selectedSubject) {
      formik.setValues({
        subject: selectedSubject.name,
        description: selectedSubject.description,
        marks: String(selectedSubject.marks),
        duration: String(selectedSubject.duration),
        totalQuestion: String(selectedSubject.totalQuestion),
        score: String(selectedSubject.score),
        questionText: '',
        optionA: '',
        optionB: '',
        optionC: '',
        optionD: '',
        correctAnswer: ''
      })
    }
  }

  const handleEditQuestion = (question) => {
    showConfirm(
      "Edit Question",
      `Are you sure you want to edit this ${question.status === 'draft' ? 'draft' : 'published'} question? Unsaved changes in the form will be lost.`,
      "Yes, Edit",
      "Cancel"
    ).then((result) => {
      if (result.isConfirmed) {
        formik.setValues({
          subject: question.subject || '',
          marks: String(question.marks) || '',
          questionText: question.questionText || '',
          optionA: question.options?.find((opt) => opt.key === 'A')?.text || '',
          optionB: question.options?.find((opt) => opt.key === 'B')?.text || '',
          optionC: question.options?.find((opt) => opt.key === 'C')?.text || '',
          optionD: question.options?.find((opt) => opt.key === 'D')?.text || '',
          correctAnswer: question.correctAnswer || '',
          duration: String(question.duration) || '',
          totalQuestion: String(question.totalQuestion) || '',
          score: String(question.score) || '',
          description: question.description || ''
        })
        setEditingId(question.id)
        setEditingStatus(question.status)

        requestAnimationFrame(() => {
          formSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
        })
      }
    })
  }

  const handleDeleteQuestion = (questionId) => {
    showConfirm(
      "Delete Question",
      "Are you sure you want to delete this question? This cannot be undone.",
      "Yes, Delete",
      "Cancel"
    ).then((result) => {
      if (result.isConfirmed) {
        questionApi.deleteQuestion(questionId)
          .then(() => {
            setAllQuestions((prev) => prev.filter((item) => item.id !== questionId))
            showSuccess("Question deleted successfully!")
            if (editingId === questionId) {
              setEditingId(null)
            }
          })
          .catch((error) => {
            console.error('Error deleting question:', error)
            showError(error.response?.data?.message || 'Failed to delete question')
          })
      }
    })
  }

  const handlePublishAll = () => {
    showConfirm(
      "Publish All Drafts",
      `Are you sure you want to publish all ${filteredDraftQuestions.length} draft questions for ${selectedSubject}?`,
      "Yes, Publish All",
      "Cancel"
    ).then((result) => {
      if (result.isConfirmed) {
        setIsSubmitting(true);
        
        const updatePromises = filteredDraftQuestions.map(q => {
          const payload = {
            subject: q.subject,
            description: q.description,
            marks: String(q.marks),
            duration: String(q.duration),
            totalQuestion: String(q.totalQuestion),
            score: String(q.score),
            questionText: q.questionText,
            optionA: q.options[0].text,
            optionB: q.options[1].text,
            optionC: q.options[2].text,
            optionD: q.options[3].text,
            correctAnswer: q.correctAnswer,
            status: 'published'
          };
          return questionApi.updateQuestion(q.id, payload);
        });

        Promise.all(updatePromises)
          .then(() => {
            showSuccess("All drafts published successfully!");
            fetchAllQuestions();
          })
          .catch(err => {
            console.error(err);
            showError("Failed to publish some questions.");
          })
          .finally(() => {
            setIsSubmitting(false);
          });
      }
    })
  }

  const handlePublishSingle = (q) => {
    showConfirm(
      "Publish Question",
      "Are you sure you want to publish this question?",
      "Yes, Publish",
      "Cancel"
    ).then((result) => {
      if (result.isConfirmed) {
        setIsSubmitting(true);
        const payload = {
          subject: q.subject,
          description: q.description,
          marks: String(q.marks),
          duration: String(q.duration),
          totalQuestion: String(q.totalQuestion),
          score: String(q.score),
          questionText: q.questionText,
          optionA: q.options[0].text,
          optionB: q.options[1].text,
          optionC: q.options[2].text,
          optionD: q.options[3].text,
          correctAnswer: q.correctAnswer,
          status: 'published'
        };

        questionApi.updateQuestion(q.id, payload)
          .then(() => {
            showSuccess("Question published successfully!");
            fetchAllQuestions();
          })
          .catch(err => {
            console.error(err);
            showError("Failed to publish question.");
          })
          .finally(() => {
            setIsSubmitting(false);
          });
      }
    })
  }

  const formik = useFormik({
    initialValues: {
      subject: "",
      marks: '2',
      questionText: '',
      optionA: '',
      optionB: '',
      optionC: '',
      optionD: '',
      correctAnswer: '',
      duration: "",
      totalQuestion: "",
      score: "",
      description: ""
    },

    onSubmit: (values, { resetForm }) => {
      const actionText = editingId 
        ? (editingStatus === 'draft' ? "update this draft" : "update this published question")
        : "save this question as a draft";
        
      showConfirm(
        "Confirm Save",
        `Are you sure you want to ${actionText}?`,
        "Yes",
        "No"
      ).then((result) => {
        if (result.isConfirmed) {
          setIsSubmitting(true)

          const payload = { ...values, status: editingId ? editingStatus : 'draft' };

          if (editingId) {
            questionApi.updateQuestion(editingId, payload)
              .then(() => {
                fetchAllQuestions()
                setEditingId(null)
                resetForm()
                showSuccess("Question updated successfully!")
                setIsSubmitting(false)
              })
              .catch((error) => {
                console.error(error)
                showError(error.response?.data?.message || "Failed to update question. Please try again.")
                setIsSubmitting(false)
              })
          } else {
            questionApi.addQuestion(payload)
            .then(() => {
                setEditingId(null)
                resetForm()
                showSuccess("Draft saved successfully!")
                fetchAllQuestions()
                setIsSubmitting(false)
              })
            .catch((error) => {
              console.error(error)
              showError(error.response?.data?.message || "Failed to save question. Please try again.")
              setIsSubmitting(false)
            })
          }
        }
      })
    },
    validationSchema: yup.object({
      subject: yup.string().required("Subject Domain is required"),
      questionText: yup.string().required("Question Text is required"),
      optionA: yup.string().required("Option A is required"),
      optionB: yup.string().required("Option B is required"),
      optionC: yup.string().required("Option C is required"),
      optionD: yup.string().required("Option D is required"),
      marks: yup.string().required("Mark for grading is required"),
      duration: yup.string().required("Duration for grading is required"),
      totalQuestion: yup.string().required("Total Question is required"),
      score: yup.string().required("Score for grading is required"),
      correctAnswer: yup.string().required("Correct Answer is required"),
      description: yup.string().required("Description is required"),
    })
  })

  useEffect(() => {
    const marks = Number(formik.values.marks)
    const totalQuestion = Number(formik.values.totalQuestion)

    if (Number.isFinite(marks) && Number.isFinite(totalQuestion) && totalQuestion !== 0) {
      formik.setFieldValue('score', String(marks * totalQuestion), false)
      return
    }

    formik.setFieldValue('score', '', false)
  }, [formik.values.marks, formik.values.totalQuestion])

  return (
    <section className='question-bank'>
      <header className='question-bank__header'>
        <div>
          <h2 className='question-bank__title'>Question Bank</h2>
          <p className='question-bank__subtitle'>Construct high-fidelity test questions with our editorial-grade editor. Preview results in real-time as they will appear to students.</p>
        </div>
      </header>

      <div className='question-bank__grid'>
        <article className='question-bank__panel' ref={formSectionRef}>
          <h4 className='py-3'>Create Question</h4>

          <form className='question-bank__form' onSubmit={formik.handleSubmit}>
            <div className='question-bank__field-grid'>

              <label className='question-bank__field'>
                <span>SELECT SUBJECT</span>
                <select
                  name='subject'
                  value={formik.values.subject}
                  onChange={(e) => handleSubjectSelect(e.target.value)}
                  onBlur={formik.handleBlur}
                >
                  <option value=''>Choose a subject</option>
                  {subjects.map((subject) => (
                    <option key={subject.name} value={subject.name}>
                      {subject.name}
                    </option>
                  ))}
                  <option value='new'>+ Create New Subject</option>
                </select>
                {formik.touched.subject ? <p className='text-danger'>{formik.errors.subject}</p> : ""}
              </label>

              {isNewSubject && (
                <label className='question-bank__field'>
                  <span>SUBJECT NAME (NEW)</span>
                  <input
                    type='text'
                    name='subject'
                    value={formik.values.subject}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder='Enter new subject name'
                  />
                  {formik.touched.subject ? <p className='text-danger'>{formik.errors.subject}</p> : ""}
                </label>
              )}

              <label className='question-bank__field'>
                <span>DESCRIPTION {!isNewSubject && formik.values.subject && '(Auto-filled)'}</span>
                <input
                  type='text'
                  name='description'
                  value={formik.values.description}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder='Description of the subject'
                  readOnly={!isNewSubject && !!formik.values.subject}
                  style={{backgroundColor: !isNewSubject && formik.values.subject ? '#f0f0f0' : '#fff'}}
                />
                {formik.touched.subject ? <p className='text-danger'>{formik.errors.description}</p> : ""}
              </label>

              <label className='question-bank__field'>
                <span>QUESTION TEXTS</span>
                <textarea
                  rows='4'
                  name='questionText'
                  value={formik.values.questionText}
                  onChange={formik.handleChange} onBlur={formik.handleBlur}
                  placeholder='Type the full question statement here...'
                />
                {formik.touched.questionText ? <p className='text-danger'>{formik.errors.questionText}</p> : ""}
              </label>
            </div>


            <div className='question-bank__options'>
              <label className='question-bank__field'>
                <span>OPTION A </span>
                <input type='text' name='optionA' value={formik.values.optionA} onChange={formik.handleChange} onBlur={formik.handleBlur}
                  placeholder='Add option A..' />
                {formik.touched.optionA ? <p className='text-danger'>{formik.errors.optionA}</p> : ""}
              </label>

              <label className='question-bank__field'>
                <span>OPTION B</span>
                <input type='text' name='optionB' value={formik.values.optionB} onChange={formik.handleChange} onBlur={formik.handleBlur}
                  placeholder='Add option B..' />
                {formik.touched.optionB ? <p className='text-danger'>{formik.errors.optionB}</p> : ""}
              </label>

              <label className='question-bank__field'>
                <span>OPTION C</span>
                <input type='text' name='optionC' value={formik.values.optionC} onChange={formik.handleChange} onBlur={formik.handleBlur}
                  placeholder='Add option C..' />
                {formik.touched.optionC ? <p className='text-danger'>{formik.errors.optionC}</p> : ""}
              </label>

              <label className='question-bank__field'>
                <span>OPTION D</span>
                <input type='text' name='optionD' value={formik.values.optionD} onChange={formik.handleChange} onBlur={formik.handleBlur}
                  placeholder='Add option D..' />
                {formik.touched.optionD ? <p className='text-danger'>{formik.errors.optionD}</p> : ""}
              </label>
            </div>

            <div className='question-bank__field-grid'>
              <label className='question-bank__field'>
                <span>CORRECT ANSWER</span>
                <select name='correctAnswer' value={formik.values.correctAnswer} onChange={formik.handleChange} onBlur={formik.handleBlur}
                >
                  <option value=''>Choose an option</option>
                  <option value='A' >Option A</option>
                  <option value='B'>Option B</option>
                  <option value='C'>Option C</option>
                  <option value='D'>Option D</option>
                </select>
                {formik.touched.correctAnswer ? <p className='text-danger'>{formik.errors.correctAnswer}</p> : ""}
              </label>
            </div>

            <div className='text-secondary fw-bold'>
            OTHER DETAILS
            </div>

            <div className='question-bank__options'>
              <label className='question-bank__field'>
                <span>MARK (PER QUESTION) {!isNewSubject && formik.values.subject && '(Auto-filled)'}</span>
                <input type='number' min='1' name='marks' value={formik.values.marks} onChange={formik.handleChange} onBlur={formik.handleBlur}
                  readOnly={!isNewSubject && !!formik.values.subject}
                  style={{backgroundColor: !isNewSubject && formik.values.subject ? '#f0f0f0' : '#fff'}}
                />
                {formik.touched.marks ? <p className='text-danger'>{formik.errors.marks}</p> : ""}
              </label>

              <label className='question-bank__field'>
                <span>DURATIONS (Minutes) {!isNewSubject && formik.values.subject && '(Auto-filled)'}</span>
                <input type='number' min='1' name='duration' value={formik.values.duration} placeholder='e.g., 50' onChange={formik.handleChange} onBlur={formik.handleBlur}
                  readOnly={!isNewSubject && !!formik.values.subject}
                  style={{backgroundColor: !isNewSubject && formik.values.subject ? '#f0f0f0' : '#fff'}}
                />
                {formik.touched.duration ? <p className='text-danger'>{formik.errors.duration}</p> : ""}
              </label>

              <label className='question-bank__field'>
                <span>TOTAL QUESTIONS {!isNewSubject && formik.values.subject && '(Auto-filled)'}</span>
                <input type='number' min='1' name='totalQuestion' placeholder='e.g., 20' value={formik.values.totalQuestion} onChange={formik.handleChange} onBlur={formik.handleBlur}
                  readOnly={!isNewSubject && !!formik.values.subject}
                  style={{backgroundColor: !isNewSubject && formik.values.subject ? '#f0f0f0' : '#fff'}}
                />
                {formik.touched.totalQuestion ? <p className='text-danger'>{formik.errors.totalQuestion}</p> : ""}
              </label>

              <label className='question-bank__field'>
                <span>TOTAL SCORE {!isNewSubject && formik.values.subject && '(Auto-calculated)'}</span>
                <input type='number' min='1' name='score' placeholder='e.g., 20' value={formik.values.score}
                  readOnly={true}
                  style={{backgroundColor: '#f0f0f0'}}
                />
                {formik.touched.score ? <p className='text-danger'>{formik.errors.score}</p> : ""}
              </label>
            </div>

            <div className='question-bank__actions'>
              <button 
                type='submit' 
                className='question-bank__button question-bank__button--primary' 
                disabled={!formik.isValid || isSubmitting}
                style={{
                  opacity: isSubmitting ? 0.6 : 1,
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  width: editingId ? 'auto' : '100%'
                }}
              >
                {isSubmitting ? (
                  <>
                    <span style={{ marginRight: '0.5rem' }}>⏳</span>
                    {editingId ? 'Updating...' : 'Saving Draft...'}
                  </>
                ) : (
                  editingId ? 'Update Question' : 'Save as Draft'
                )}
              </button>
              {editingId && (
                <button 
                  type='button' 
                  className='question-bank__button question-bank__button--muted'
                  onClick={() => {
                showConfirm(
                  "Cancel Editing",
                  "Are you sure you want to clear the form and cancel editing?",
                  "Yes, Cancel",
                  "No"
                ).then((result) => {
                  if (result.isConfirmed) {
                    formik.resetForm()
                    setEditingId(null)
                  }
                })
                  }}
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </article>

        <aside className='question-bank__panel question-bank__panel--compact'>
          <h3 className='question-bank__panel-title'>STUDENT PREVIEW {editingId && '(Editing)'}</h3>
          <div className='question-bank__preview'>

            <p className='question-bank_question-number p-2 w-50 text-center text-white fw-bold'> 
              QUESTION {String(filteredDraftQuestions.length + 1).padStart(2, '0')} 
            </p>

            <h4 className='question-bank__preview-question'>
              {formik.values.questionText || 'Your question preview will appear here as you type.'}
            </h4>

            <ul className='question-bank__preview-options'>
              <li><strong>A.</strong> {formik.values.optionA || 'Option A'}</li>
              <li><strong>B.</strong> {formik.values.optionB || 'Option B'}</li>
              <li><strong>C.</strong> {formik.values.optionC || 'Option C'}</li>
              <li><strong>D.</strong> {formik.values.optionD || 'Option D'}</li>
            </ul>

            {/* <p className='question-bank__preview-answer'>
              <span>Correct Answer:</span> {formik.values.correctAnswer ? `Option ${formik.values.correctAnswer} - ${selectedAnswerText}` : 'No answer selected yet'}
            </p> */}

          </div>
        </aside>
      </div>

      <div className='instruction_display my-4'>
        <p className='fw-medium'>Instruction for creating the Exam</p>
        <ul>
          <li>Set a clear and descriptive exam title</li>
          <li>Ensure duration is appropriate for the number of questions</li>
        </ul>
      </div>

      <div className='displayDraft my-4'>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4 className='displayDraft__title m-0'>Draft Questions in Database</h4>
          {filteredDraftQuestions.length > 0 && (
            <button 
              type="button"
              className="btn" 
              style={{ backgroundColor: '#ab3500', color: 'white', fontWeight: 'bold' }}
              onClick={handlePublishAll}
              disabled={isSubmitting}
            >
              Publish All {filteredDraftQuestions.length} Drafts
            </button>
          )}
        </div>

        {!selectedSubject || selectedSubject === 'new' ? (
          <p className='displayDraft__empty'>Please select a subject to view its drafts.</p>
        ) : filteredDraftQuestions.length === 0 ? (
          <p className='displayDraft__empty'>No draft questions found for {selectedSubject}.</p>
        ) : (
          <div className='displayDraft__list'>
            {filteredDraftQuestions.map((item, index) => (
              <article className='displayDraft__card' key={item.id}>
                <div className='displayDraft__card-header'>
                  <span className='displayDraft__number'>{index + 1}</span>
                  <h5 className='displayDraft__question'>{item.questionText}</h5>
                </div>

                <p className='displayDraft__meta'>
                  <strong>Subject:</strong> {item.subject || 'N/A'} | <strong>Description:</strong> {item.description || 'N/A'}
                </p>

                <p className='displayDraft__meta'>
                  <strong>Total Questions:</strong> {item.totalQuestion || 'N/A'} | <strong>Duration:</strong> {item.duration || 'N/A'} mins | <strong>Marks:</strong> {item.marks || 'N/A'}
                </p>

                <ul className='displayDraft__options'>
                  {item.options.map((option) => {
                    const isCorrect = item.correctAnswer === option.key

                    return (
                      <li key={`${item.id}-${option.key}`} className={isCorrect ? 'displayDraft__option displayDraft__option--correct' : 'displayDraft__option'}>
                        <span className={isCorrect ? 'displayDraft__option-icon displayDraft__option-icon--correct' : 'displayDraft__option-icon'} aria-hidden='true'>
                          {isCorrect ? '✓' : '○'}
                        </span>
                        <span>{option.text}</span>
                      </li>
                    )
                  })}
                </ul>

                <div className='displayDraft__actions'>
                  <button
                    type='button'
                    className='displayDraft__action-btn'
                    style={{ backgroundColor: '#10b981', color: 'white', borderColor: '#10b981', marginRight: '8px' }}
                    onClick={() => handlePublishSingle(item)}
                  >
                    Publish
                  </button>
                  <button
                    type='button'
                    className='displayDraft__action-btn displayDraft__action-btn--edit'
                    onClick={() => handleEditQuestion(item)}
                  >
                    Edit
                  </button>
                  <button
                    type='button'
                    className='displayDraft__action-btn displayDraft__action-btn--delete'
                    onClick={() => handleDeleteQuestion(item.id)}
                  >
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      <div className='instruction_display my-4'>
        <h4 className='displayDraft__title'>
          Published Questions in Database
          {selectedSubject && selectedSubject !== 'new' && (
            <span style={{ fontSize: '0.8em', fontWeight: 'normal', marginLeft: '10px' }}>
              - {selectedSubject}
            </span>
          )}
        </h4>

        {!selectedSubject || selectedSubject === 'new' ? (
          <p className='displayDraft__empty'>Please select a subject to view its published questions.</p>
        ) : filteredSavedQuestions.length === 0 ? (
          <p className='displayDraft__empty'>No published questions found for {selectedSubject}.</p>
        ) : (
          <div className='displayDraft__list'>
            {filteredSavedQuestions.map((item, index) => (
              <article className='displayDraft__card' key={item.id}>
                <div className='displayDraft__card-header'>
                  <span className='displayDraft__number'>{index + 1}</span>
                  <h5 className='displayDraft__question'>{item.questionText}</h5>
                </div>

                <p className='displayDraft__meta'>
                  <strong>Subject:</strong> {item.subject || 'N/A'} | <strong>Description:</strong> {item.description || 'N/A'}
                </p>

                <p className='displayDraft__meta'>
                  <strong>Total Questions:</strong> {item.totalQuestion || 'N/A'} | <strong>Duration:</strong> {item.duration || 'N/A'} mins | <strong>Marks:</strong> {item.marks || 'N/A'}
                </p>

                <ul className='displayDraft__options'>
                  {item.options.map((option) => {
                    const isCorrect = item.correctAnswer === option.key

                    return (
                      <li key={`${item.id}-${option.key}`} className={isCorrect ? 'displayDraft__option displayDraft__option--correct' : 'displayDraft__option'}>
                        <span className={isCorrect ? 'displayDraft__option-icon displayDraft__option-icon--correct' : 'displayDraft__option-icon'} aria-hidden='true'>
                          {isCorrect ? '✓' : '○'}
                        </span>
                        <span>{option.text}</span>
                      </li>
                    )
                  })}
                </ul>

                <div className='displayDraft__actions'>
                  <button
                    type='button'
                    className='displayDraft__action-btn displayDraft__action-btn--edit'
                    onClick={() => handleEditQuestion(item)}
                  >
                    Edit
                  </button>
                  <button
                    type='button'
                    className='displayDraft__action-btn displayDraft__action-btn--delete'
                    onClick={() => handleDeleteQuestion(item.id)}
                  >
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default QuestionBank