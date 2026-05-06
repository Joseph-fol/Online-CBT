import axios from 'axios'
import React, { useState } from 'react'
import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

const ActiveQuizView = () => {
    const [selectedOption, setSelectedOption] = useState("")

    const { subject } = useParams();
    const navigate = useNavigate();

    // --- 1. STATE MANAGEMENT ---
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);

    // Tracking the user's progress
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState({});

    // Timer and Grading State
    const [timeLeft, setTimeLeft] = useState(null); // Time in total seconds
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [finalScore, setFinalScore] = useState(0);

    useEffect(() => {
        // Log the subject being accessed
        // Fetch questions by subject
        axios.get(`http://localhost:2114/user/subject/${subject}`)
        .then((response) => {
            const data = response.data
            // console.log("Questions fetched for subject:", subject);
            // console.log("Subject data:", data);
            setQuestions(data)
            setLoading(false)
        })
        .catch((error) => {
            // console.error("Error fetching questions for subject:", subject);
            // console.error("Error details:", error)
            setLoading(false)
        })
    }, [subject])

    // Get current question
    const currentQuestion = questions[currentIndex]
    
    // Get options from current question
    const options = currentQuestion ? [
        { id: "A", text: currentQuestion.options?.A },
        { id: "B", text: currentQuestion.options?.B },
        { id: "C", text: currentQuestion.options?.C },
        { id: "D", text: currentQuestion.options?.D }
    ].filter(opt => opt.text) : []

    if (loading) {
        return (
            <div className='d-flex justify-content-center align-items-center' style={{ minHeight: '100vh' }}>
                <div className='text-center'>
                    <h4>Loading questions...</h4>
                </div>
            </div>
        )
    }

    if (questions.length === 0) {
        return (
            <div className='d-flex justify-content-center align-items-center' style={{ minHeight: '100vh' }}>
                <div className='text-center'>
                    <h4>No questions found for {subject}</h4>
                    <button onClick={() => navigate(-1)} className='btn btn-primary mt-3'>Go Back</button>
                </div>
            </div>
        )
    }

    return (
        <>
            <div className='container-sm col-lg-9 bg-white font-sans '>
                <div className='d-flex justify-content-between pt-4' >
                    <div className='me-2'>
                        <span className='fw-medium text-black'>{subject.toUpperCase()}</span>
                        <span><h4 className='fw-bold' style={{ color: "#ab3500" }}>{currentQuestion?.description || "Quiz"}</h4></span>
                    </div>

                    <div className='alert alert-danger fw-bold px-4 py-2 fs-sm-5 text-center justify-content-center align-items-center gap-2 '>
                        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="#58151c" d="M12 20a8 8 0 0 0 8-8a8 8 0 0 0-8-8a8 8 0 0 0-8 8a8 8 0 0 0 8 8m0-18a10 10 0 0 1 10 10a10 10 0 0 1-10 10C6.47 22 2 17.5 2 12A10 10 0 0 1 12 2m.5 5v5.25l4.5 2.67l-.75 1.23L11 13V7z" /></svg> <span>01:42</span>
                    </div>
                </div>
                <p></p>
            </div>

            <div style={{ backgroundColor: "#f8f9fa" }} className='pb-5' >
                <div className='container col-lg-7 py-4 py-lg-5 d-flex justify-content-between'>
                    <div style={{ backgroundColor: "#edeeef", color: "black" }} className='px-4 fw-medium py-2 rounded-3'>
                        Question {currentIndex + 1} of {questions.length}
                    </div>

                    <div>
                        <button className='btn fw-medium' style={{ color: "#0f172b" }}> Mark for Reviews</button>
                    </div>
                </div>

                <button className='container border border-0 bg-light px-3 my-2 text-secondary text-start fw-bold d-block d-lg-none d-md-none'>Review All <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="#6b6868" d="M22 12.999V20a1 1 0 0 1-1 1h-8v-8.001zm-11 0V21H3a1 1 0 0 1-1-1v-7.001zM11 3v7.999H2V4a1 1 0 0 1 1-1zm10 0a1 1 0 0 1 1 1v6.999h-9V3z" /></svg></button>

                <div className='container col-11 col-lg-7 bg-white p-4 rounded-4'>
                    {/* Question */}
                    <h4 className='mb-4'>{currentQuestion?.questionText} </h4>

                    {/* Answer */}
                    <div className='d-flex flex-column gap-3'>
                        {
                            options.map((option) => {
                                const isSelected = selectedOption === option.id

                                return (
                                    <button
                                        key={option.id}
                                        onClick={() => setSelectedOption(option.id)}
                                        className="btn text-start d-flex align-items-center p-3 rounded-3" // Kept layout classes only
                                        style={{
                                            width: '100%', // Ensures it fills container
                                            borderWidth: '2px',
                                            borderStyle: 'solid',
                                            // Logic for Border, Background, and Shadow
                                            borderColor: isSelected ? '#ab3500' : 'transparent',
                                            backgroundColor: isSelected ? '#ffffff' : '#f8f9fa',
                                            boxShadow: isSelected ? '0 .125rem .25rem rgba(0,0,0,.075)' : 'none',
                                            transition: 'all 0.2s ease-in-out',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        <div
                                            className="d-flex flex-shrink-0 align-items-center justify-content-center rounded-2 me-3 fw-bold"
                                            style={{
                                                width: '36px',
                                                height: '36px',
                                                backgroundColor: isSelected ? '#ab3500' : '#ffffff',
                                                color: isSelected ? '#ffffff' : '#6c757d',
                                                border: isSelected ? 'none' : '1px solid #dee2e6'
                                            }}
                                        >
                                            {option.id}
                                        </div>

                                        <span
                                            style={{
                                                fontSize: '1rem',
                                                fontWeight: isSelected ? '600' : '400',
                                                color: isSelected ? '#212529' : '#6c757d'
                                            }}
                                        >
                                            {option.text}
                                        </span>
                                    </button>

                                )
                            })
                        }
                    </div>

                    <div className='py-5 d-flex flex-wrap justify-content-between align-items-center'>
                        <div>
                            <button 
                                onClick={() => {
                                    if (currentIndex > 0) {
                                        setCurrentIndex(currentIndex - 1)
                                        setSelectedOption("")
                                    }
                                }}
                                disabled={currentIndex === 0}
                                className='py-2 px-2 px-lg-5 fw-bold border-1 bg-white d-flex align-items-center gap-1' 
                                style={{ 
                                    color: currentIndex === 0 ? "#ccc" : "#0f172b", 
                                    borderColor: "#ab3500",
                                    opacity: currentIndex === 0 ? 0.5 : 1,
                                    cursor: currentIndex === 0 ? 'not-allowed' : 'pointer'
                                }}
                            > 
                                <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24"><path fill="#0f172b" d="M10.707 8.707a1 1 0 0 0-1.414-1.414l-4 4a1 1 0 0 0 0 1.414l4 4a1 1 0 0 0 1.414-1.414L8.414 13H18a1 1 0 1 0 0-2H8.414z" /></svg> 
                                Previous
                            </button>
                        </div>

                        <div className='d-flex gap-4 align-items-center flex-wrap'>
                            <button className='btn text-secondary fw-bold d-none d-lg-block d-md-block'>Review All <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="#6b6868" d="M22 12.999V20a1 1 0 0 1-1 1h-8v-8.001zm-11 0V21H3a1 1 0 0 1-1-1v-7.001zM11 3v7.999H2V4a1 1 0 0 1 1-1zm10 0a1 1 0 0 1 1 1v6.999h-9V3z" /></svg></button>

                            <button 
                                onClick={() => {
                                    if (currentIndex < questions.length - 1) {
                                        setCurrentIndex(currentIndex + 1)
                                        setSelectedOption("")
                                    } else {
                                        alert("You have reached the last question. Please submit your exam.")
                                    }
                                }}
                                className='py-2 px-4 fw-bold border border-1 d-flex align-items-center gap-2' 
                                style={{ 
                                    backgroundColor: "#ab3500", 
                                    color: "white",
                                    cursor: 'pointer'
                                }}
                            > 
                                {currentIndex === questions.length - 1 ? "Submit" : "Next"} 
                                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 16 16"><path fill="#ffffff" fillRule="evenodd" d="M2 8a.75.75 0 0 1 .75-.75h8.69L8.22 4.03a.75.75 0 0 1 1.06-1.06l4.5 4.5a.75.75 0 0 1 0 1.06l-4.5 4.5a.75.75 0 0 1-1.06-1.06l3.22-3.22H2.75A.75.75 0 0 1 2 8" clipRule="evenodd" /></svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ActiveQuizView