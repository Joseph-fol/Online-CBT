import React, { useEffect, useRef, useState } from 'react'
import './QuestionBank.css'
import { useFormik } from 'formik'
import * as yup from "yup"
import axios from 'axios'

const QuestionBank = () => {
  const [draftQuestions, setDraftQuestions] = useState([])
  const [editingDraftId, setEditingDraftId] = useState(null)
  const formSectionRef = useRef(null)

  const buildDraftFromValues = (values, existingId = null) => {
    return {
      id: existingId ?? Date.now(),
      subject: values.subject?.trim() || '',
      description: values.description?.trim() || '',
      questionText: values.questionText?.trim() || '',
      marks: values.marks,
      duration: values.duration,
      totalQuestion: values.totalQuestion,
      score: values.score,
      correctAnswer: values.correctAnswer,
      options: [
        {
          key: 'A',
          text: values.optionA?.trim() || ''
        },
        {
          key: 'B',
          text: values.optionB?.trim() || ''
        },
        {
          key: 'C',
          text: values.optionC?.trim() || ''
        },
        {
          key: 'D',
          text: values.optionD?.trim() || ''
        },
      ],
    }
  }

  const upsertDraft = (draftPayload) => {
    setDraftQuestions((prev) => {
      const existingIndex = prev.findIndex((item) => item.id === draftPayload.id)

      if (existingIndex === -1) {
        return [draftPayload, ...prev]
      }

      const updated = [...prev]
      updated[existingIndex] = draftPayload
      return updated
    })
  }

  const handleEditDraft = (draftItem) => {
    formik.setValues({
      subject: draftItem.subject || '',
      marks: draftItem.marks || '',
      questionText: draftItem.questionText || '',
      optionA: draftItem.options?.find((opt) => opt.key === 'A')?.text || '',
      optionB: draftItem.options?.find((opt) => opt.key === 'B')?.text || '',
      optionC: draftItem.options?.find((opt) => opt.key === 'C')?.text || '',
      optionD: draftItem.options?.find((opt) => opt.key === 'D')?.text || '',
      correctAnswer: draftItem.correctAnswer || '',
      duration: draftItem.duration || '',
      totalQuestion: draftItem.totalQuestion || '',
      score: draftItem.score || '',
      description: draftItem.description || ''
    })
    setEditingDraftId(draftItem.id)

    requestAnimationFrame(() => {
      formSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  }

  const handleDeleteDraft = (draftId) => {
    setDraftQuestions((prev) => prev.filter((item) => item.id !== draftId))

    if (editingDraftId === draftId) {
      setEditingDraftId(null)
    }
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
      // console.log(values)

      axios.post("https://online-cbt.onrender.com/user/addQuestions", values)
        .then(() => {
          const draftPayload = buildDraftFromValues(values, editingDraftId)
          upsertDraft(draftPayload)

          setEditingDraftId(null)
          resetForm()
          alert("Details successfully submitted")
        })
        .catch((error) => {
          console.error(error)
          alert("Failed to save question")
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

  const displayDraft = () => {
    const { questionText, optionA, optionB, optionC, optionD } = formik.values

    if (!questionText.trim() || !optionA.trim() || !optionB.trim() || !optionC.trim() || !optionD.trim()) {
      alert("Add question text and all options before saving draft")
      return
    }

    const draftPayload = buildDraftFromValues(formik.values, editingDraftId)
    upsertDraft(draftPayload)

    if (editingDraftId) {
      setEditingDraftId(null)
      alert("Draft updated successfully")
      return
    }

    alert("Successfully saved as draft")
  }

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
                <span>SUBJECT</span>
                <input
                  type='text'
                  name='subject'
                  value={formik.values.subject}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder='Type subject name'
                />
                {formik.touched.subject ? <p className='text-danger'>{formik.errors.subject}</p> : ""}
              </label>

              <label className='question-bank__field'>
                <span>DESCRIPTION</span>
                <input
                  type='text'
                  name='description'
                  value={formik.values.description}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder='Description of the subject'
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
                <span>MARK (PER QUESTION)</span>
                <input type='number' min='1' name='marks' value={formik.values.marks} onChange={formik.handleChange} onBlur={formik.handleBlur}
                />
                {formik.touched.marks ? <p className='text-danger'>{formik.errors.marks}</p> : ""}
              </label>

              <label className='question-bank__field'>
                <span>DURATIONS (Minutes)</span>
                <input type='number' min='1' name='duration' value={formik.values.duration} placeholder='e.g., 50' onChange={formik.handleChange} onBlur={formik.handleBlur}
                />
                {formik.touched.duration ? <p className='text-danger'>{formik.errors.duration}</p> : ""}
              </label>

              <label className='question-bank__field'>
                <span>TOTAL QUESTIONS</span>
                <input type='number' min='1' name='totalQuestion' placeholder='e.g., 20' value={formik.values.totalQuestion} onChange={formik.handleChange} onBlur={formik.handleBlur} />
                {formik.touched.totalQuestion ? <p className='text-danger'>{formik.errors.totalQuestion}</p> : ""}
              </label>

              <label className='question-bank__field'>
                <span> TOTAL SCORE</span>
                <input type='number' min='1' name='score' placeholder='e.g., 20' value={formik.values.score} readOnly />
                {formik.touched.score ? <p className='text-danger'>{formik.errors.score}</p> : ""}
              </label>
            </div>

            <div className='question-bank__actions'>
              <button type='button' className='question-bank__button question-bank__button--muted' onClick={displayDraft}>{editingDraftId ? 'Update Draft' : 'Save Draft'}</button>
              <button type='submit' className='question-bank__button question-bank__button--primary' disabled={!formik.isValid}>Save Questions</button>
            </div>
          </form>
        </article>

        <aside className='question-bank__panel question-bank__panel--compact'>
          <h3 className='question-bank__panel-title'>STUDENT PREVIEW</h3>
          <div className='question-bank__preview'>
            {/* <p className='question-bank__preview-badge'>
              {(formik.values.subject || 'General Subject')}
            </p> */}

            <p className='question-bank_question-number p-2 w-50 text-center text-white fw-bold'> QUESTION {String(draftQuestions.length + 1).padStart(2, '0')} </p>

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

      <div className='displayDraft'>
        <h4 className='displayDraft__title'>Draft Questions</h4>

        {draftQuestions.length === 0 ? (
          <p className='displayDraft__empty'>No draft question yet. Fill the form and click Save Draft.</p>
        ) : (
          <div className='displayDraft__list'>
            {draftQuestions.map((item, index) => (

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
                    onClick={() => handleEditDraft(item)}
                  >
                    Edit
                  </button>
                  <button
                    type='button'
                    className='displayDraft__action-btn displayDraft__action-btn--delete'
                    onClick={() => handleDeleteDraft(item.id)}
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