import React, { useMemo, useState } from 'react'
import './QuestionBank.css'

const QuestionBank = () => {
  const [formValues, setFormValues] = useState({
    subject: '',
    questionType: 'multiple',
    difficulty: 'intermediate',
    marks: '2',
    questionText: '',
    optionA: '',
    optionB: '',
    optionC: '',
    optionD: '',
    correctAnswer: 'A',
    topicTag: '',
    solutionExplanation: '',
  })

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormValues((current) => ({ ...current, [name]: value }))
  }

  const selectedAnswerText = useMemo(() => {
    const optionMap = {
      A: formValues.optionA,
      B: formValues.optionB,
      C: formValues.optionC,
      D: formValues.optionD,
    }

    return optionMap[formValues.correctAnswer] || 'No answer selected yet'
  }, [formValues.correctAnswer, formValues.optionA, formValues.optionB, formValues.optionC, formValues.optionD])

  return (
    <section className='question-bank'>
      <header className='question-bank__header'>
        <div>
          <h2 className='question-bank__title'>Question Bank</h2>
          <p className='question-bank__subtitle'>Create and manage examination questions for different subjects and levels.</p>
        </div>
        <button type='button' className='question-bank__header-action'>Save Template</button>
      </header>

      <div className='question-bank__grid'>
        <article className='question-bank__panel'>
          <h3 className='question-bank__panel-title'>Create Question</h3>

          <form className='question-bank__form' onSubmit={(event) => event.preventDefault()}>
            <div className='question-bank__field-grid'>
              <label className='question-bank__field'>
                <span>Subject</span>
                <input
                  type='text'
                  name='subject'
                  value={formValues.subject}
                  onChange={handleChange}
                  placeholder='Type subject name'
                />
              </label>

              <label className='question-bank__field'>
                <span>Question Type</span>
                <select name='questionType' value={formValues.questionType} onChange={handleChange}>
                  <option value='multiple'>Multiple Choice</option>
                  <option value='truefalse'>True / False</option>
                  <option value='short'>Short Answer</option>
                </select>
              </label>

              <label className='question-bank__field'>
                <span>Difficulty</span>
                <select name='difficulty' value={formValues.difficulty} onChange={handleChange}>
                  <option value='beginner'>Beginner</option>
                  <option value='intermediate'>Intermediate</option>
                  <option value='advanced'>Advanced</option>
                </select>
              </label>

              <label className='question-bank__field'>
                <span>Marks</span>
                <input type='number' min='1' name='marks' value={formValues.marks} onChange={handleChange} />
              </label>
            </div>

            <label className='question-bank__field'>
              <span>Question Text</span>
              <textarea
                rows='4'
                name='questionText'
                value={formValues.questionText}
                onChange={handleChange}
                placeholder='Type the full question statement here...'
              />
            </label>

            <div className='question-bank__options'>
              <label className='question-bank__field'>
                <span>Option A</span>
                <input type='text' name='optionA' value={formValues.optionA} onChange={handleChange} placeholder='First option' />
              </label>
              <label className='question-bank__field'>
                <span>Option B</span>
                <input type='text' name='optionB' value={formValues.optionB} onChange={handleChange} placeholder='Second option' />
              </label>
              <label className='question-bank__field'>
                <span>Option C</span>
                <input type='text' name='optionC' value={formValues.optionC} onChange={handleChange} placeholder='Third option' />
              </label>
              <label className='question-bank__field'>
                <span>Option D</span>
                <input type='text' name='optionD' value={formValues.optionD} onChange={handleChange} placeholder='Fourth option' />
              </label>
            </div>

            <div className='question-bank__field-grid'>
              <label className='question-bank__field'>
                <span>Correct Answer</span>
                <select name='correctAnswer' value={formValues.correctAnswer} onChange={handleChange}>
                  <option value='A'>Option A</option>
                  <option value='B'>Option B</option>
                  <option value='C'>Option C</option>
                  <option value='D'>Option D</option>
                </select>
              </label>

              <label className='question-bank__field'>
                <span>Topic Tag</span>
                <input
                  type='text'
                  name='topicTag'
                  value={formValues.topicTag}
                  onChange={handleChange}
                  placeholder='e.g. Thermodynamics'
                />
              </label>
            </div>

            <label className='question-bank__field'>
              <span>Solution Explanation</span>
              <textarea
                rows='3'
                name='solutionExplanation'
                value={formValues.solutionExplanation}
                onChange={handleChange}
                placeholder='Explain the expected answer for reviewers and tutors...'
              />
            </label>

            <div className='question-bank__actions'>
              <button type='button' className='question-bank__button question-bank__button--muted'>Save Draft</button>
              <button type='submit' className='question-bank__button question-bank__button--primary'>Publish Question</button>
            </div>
          </form>
        </article>

        <aside className='question-bank__panel question-bank__panel--compact'>
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

            <p className='question-bank__preview-solution'>
              {formValues.solutionExplanation || 'Solution explanation will be shown here.'}
            </p>
          </div>
        </aside>
      </div>
    </section>
  )
}

export default QuestionBank