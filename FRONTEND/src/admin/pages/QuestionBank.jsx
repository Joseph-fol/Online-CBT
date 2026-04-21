import React, { useMemo, useState } from 'react'
import './QuestionBank.css'
import { useFormik } from 'formik'
import * as yup from "yup"

const QuestionBank = () => {

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
    },

    onSubmit: (value, {resetForm}) => {
      console.log(value);
      resetForm()
    },
    validationSchema: yup.object({
      subject: yup.string().required("Subject Domain is required"),
      questionText: yup.string().required("Question Text is required"),
      optionA: yup.string().required("Option A is required"),
      optionB: yup.string().required("Option B is required"),
      optionC: yup.string().required("Option C is required"),
      optionD: yup.string().required("Option D is required"),
      marks: yup.string().required("Mark for grading is required"),
      correctAnswer: yup.string().required("Correct Answer is required"),
    })
  })

  // const handleChange = (event) => {
  //   const { name, value } = event.target
  //   setFormValues((current) => ({ ...current, [name]: value }))
  // }

  // const selectedAnswerText = useMemo(() => {
  //   const optionMap = {
  //     A: formValues.optionA,
  //     B: formValues.optionB,
  //     C: formValues.optionC,
  //     D: formValues.optionD,
  //   }

  //   return optionMap[formValues.correctAnswer] || 'No answer selected yet'
  // }, 
  // [formValues.correctAnswer, formValues.optionA, formValues.optionB, formValues.optionC, formValues.optionD])

  return (
    <section className='question-bank'>
      <header className='question-bank__header'>
        <div>
          <h2 className='question-bank__title'>Question Bank</h2>
          <p className='question-bank__subtitle'>Construct high-fidelity test questions with our editorial-grade editor. Preview results in real-time as they will appear to students.</p>
        </div>
      </header>

      <div className='question-bank__grid'>
        <article className='question-bank__panel'>
          <h4 className='py-3'>Create Question</h4>

          <form className='question-bank__form' onSubmit={formik.handleSubmit}>
            <div className='question-bank__field-grid'>
              <label className='question-bank__field'>
                <span>SUBJECT DOMAIN </span>
                <input
                  type='text'
                  name='subject'
                  value={formik.values.subject}
                  onChange={formik.handleChange} onBlur={formik.handleBlur}
                  onBlur={formik.handleBlur}
                  placeholder='Type subject name'
                />
                {formik.touched.subject ? <p className='text-danger'>{formik.errors.subject}</p> : ""}
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
                <span>OPTION A</span>
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
                  <option value='A' selected >Choose an option</option>
                  <option value='A' >Option A</option>
                  <option value='B'>Option B</option>
                  <option value='C'>Option C</option>
                  <option value='D'>Option D</option>
                </select>
                {formik.touched.correctAnswer ? <p className='text-danger'>{formik.errors.correctAnswer}</p> : ""}
              </label>
            </div>

            <label className='question-bank__field'>
              <span>MARKS</span>
              <input type='number' min='1' name='marks' value={formik.values.marks} onChange={formik.handleChange} onBlur={formik.handleBlur}
              />
                {formik.touched.marks ? <p className='text-danger'>{formik.errors.marks}</p> : ""}
            </label>

            <div className='question-bank__actions'>
              <button type='button' className='question-bank__button question-bank__button--muted'>Save Draft</button>
              <button type='submit' className='question-bank__button question-bank__button--primary'>Save Questions</button>
            </div>
          </form>

        </article>

        {/* <aside className='question-bank__panel question-bank__panel--compact'>
          <h3 className='question-bank__panel-title'>Live Preview</h3>
          <div className='question-bank__preview'>
            <p className='question-bank__preview-badge'>
              {(formValues.subject || 'General Subject')} - {formValues.difficulty}
            </p>

            <h4 className='question-bank__preview-question'>
              {formValues.questionText || 'Your question preview will appear here as you type.'}
            </h4>

            <ul className='question-bank__preview-options'>
              <li><strong>A.</strong> {formValues.optionA || 'Option A'}</li>
              <li><strong>B.</strong> {formValues.optionB || 'Option B'}</li>
              <li><strong>C.</strong> {formValues.optionC || 'Option C'}</li>
              <li><strong>D.</strong> {formValues.optionD || 'Option D'}</li>
            </ul>

            <div className='question-bank__preview-meta'>
              <p><span>Type:</span> {formValues.questionType}</p>
              <p><span>Marks:</span> {formValues.marks || '0'}</p>
              <p><span>Topic:</span> {formValues.topicTag || 'Not tagged'}</p>
            </div>

            <p className='question-bank__preview-answer'>
              <span>Correct Answer:</span> Option {formValues.correctAnswer} - {selectedAnswerText}
            </p>


          </div>
        </aside> */}
      </div>
    </section>
  )
}

export default QuestionBank