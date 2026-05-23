import axios from 'axios'
import React, { useState } from 'react'
import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { showInfo } from '../utils/toastUtils'
import Swal from 'sweetalert2'
import API_BASE_URL from '../utils/api.config'
import { getAuthHeader } from '../utils/auth'

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
    const [timerActive, setTimerActive] = useState(false);

    useEffect(() => {
        // Check if exam already started (from localStorage)
        const examStartTime = localStorage.getItem('examStartTime');
        const totalExamDuration = localStorage.getItem('totalExamDuration');

        if (examStartTime && totalExamDuration) {
            // Exam already in progress - restore the timer
            const now = Date.now();
            const elapsedSeconds = Math.floor((now - parseInt(examStartTime)) / 1000);
            const remaining = parseInt(totalExamDuration) - elapsedSeconds;

            if (remaining > 0) {
                setTimeLeft(remaining);
                setTimerActive(true);

                // Fetch questions to restore
                axios.get(`${API_BASE_URL}/user/subject/${subject}`)
                    .then((response) => {
                        setQuestions(response.data);
                        setLoading(false);
                    })
                    .catch(() => setLoading(false));
                return;
            } else {
                // Time expired
                showInfo("Time's up! Your exam has been submitted.");
                localStorage.removeItem('examStartTime');
                localStorage.removeItem('totalExamDuration');
                setLoading(false);
                return;
            }
        }

        // Start new exam
        axios.get(`${API_BASE_URL}/user/subject/${subject}`)
            .then((response) => {
                const data = response.data
                setQuestions(data)

                // Multiply duration by 60 to convert minutes to seconds
                const durationInSeconds = data[0].duration * 60;

                // Store exam start time and duration in localStorage
                localStorage.setItem('examStartTime', Date.now().toString());
                localStorage.setItem('totalExamDuration', durationInSeconds.toString());

                setTimeLeft(durationInSeconds);
                setTimerActive(true);
                console.log(durationInSeconds);
                setLoading(false)
            })
            .catch((error) => {
                setLoading(false)
            })
    }, [subject])

    // Timer countdown effect - calculates based on localStorage start time
    useEffect(() => {
        if (!timerActive || !localStorage.getItem('examStartTime')) {
            return;
        }

        const interval = setInterval(() => {
            const examStartTime = localStorage.getItem('examStartTime');
            const totalDuration = parseInt(localStorage.getItem('totalExamDuration'));

            if (examStartTime && totalDuration) {
                const now = Date.now();
                const elapsedSeconds = Math.floor((now - parseInt(examStartTime)) / 1000);
                const remaining = totalDuration - elapsedSeconds;

                if (remaining <= 0) {
                    setTimeLeft(0);
                    setTimerActive(false);
                    showInfo("Time's up! Your exam has been submitted.");
                    handleSubmitExam(true);
                    return;
                }

                setTimeLeft(remaining);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [timerActive])

    // Warning alerts for time running out
    useEffect(() => {
        if (!timerActive || timeLeft === null) return;

        // 5 minutes warning
        if (timeLeft === 300) {
            Swal.fire({
                title: '5 Minutes Remaining!',
                text: 'You have 5 minutes left to complete the exam. Please hurry up!',
                icon: 'warning',
                iconColor: '#f59e0b',
                confirmButtonColor: '#ab3500',
                confirmButtonText: 'Okay',
                timer: 5000,
                timerProgressBar: true,
                didOpen: (modal) => {
                    modal.querySelector('.swal2-title').style.color = '#0f172a'
                    modal.querySelector('.swal2-html-container').style.color = '#475569'
                }
            });
        }

        // 1 minute warning
        if (timeLeft === 60) {
            Swal.fire({
                title: '⏰ 1 Minute Left!',
                text: 'Only 1 minute remaining! You must submit soon.',
                icon: 'warning',
                iconColor: '#ef4444',
                confirmButtonColor: '#ab3500',
                confirmButtonText: 'Okay',
                timer: 4000,
                timerProgressBar: true,
                didOpen: (modal) => {
                    modal.querySelector('.swal2-title').style.color = '#0f172a'
                    modal.querySelector('.swal2-html-container').style.color = '#475569'
                }
            });
        }
    }, [timeLeft, timerActive])

    // Check if time is expired - prevent answering
    const isTimeExpired = timerActive === false && timeLeft === 0;

    // Format seconds to MM:SS
    const formatTime = (seconds) => {
        if (seconds === null) return "00:00";
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }

    // Determine timer color based on time remaining
    const getTimerColor = () => {
        if (!timerActive) return '#dc2626'; // Red when expired
        if (timeLeft === null) return '#ab3500'; // Default
        if (timeLeft <= 60) return '#dc2626'; // Red - less than 1 min
        if (timeLeft <= 300) return '#f59e0b'; // Amber - less than 5 min
        return '#ab3500'; // Orange - normal
    }

    const getTimerBgColor = () => {
        if (!timerActive) return '#fee2e2'; // Light red when expired
        if (timeLeft === null) return '#f5e6d3'; // Default
        if (timeLeft <= 60) return '#fee2e2'; // Light red - less than 1 min
        if (timeLeft <= 300) return '#fef3c7'; // Light amber - less than 5 min
        return '#f5e6d3'; // Light orange - normal
    }

    // Handle exam submission
    const handleSubmitExam = (isAutoSubmit = false) => {
        // Function to perform actual submission
        const performSubmission = () => {
            // Calculate score
            let correct = 0;
            questions.forEach(question => {
                if (selectedAnswers[question._id] === question.correctAnswer) {
                    correct++;
                }
            });

            const score = (correct / questions.length) * 100;

            // Get student email from stored student data or localStorage
            let studentEmail = '';
            
            // First try to get from studentData (more reliable)
            const studentData = localStorage.getItem('studentData');
            if (studentData) {
                try {
                    const parsed = JSON.parse(studentData);
                    studentEmail = parsed.email;
                    console.log("Student email from studentData:", studentEmail);
                } catch (error) {
                    console.error("Error parsing studentData:", error);
                }
            }
            
            // Fallback: decode JWT token if studentData not available
            if (!studentEmail) {
                const jwtToken = localStorage.getItem('token');
                if (jwtToken) {
                    try {
                        const base64Url = jwtToken.split('.')[1];
                        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                        const jsonPayload = decodeURIComponent(atob(base64).split('').map((c) => {
                            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                        }).join(''));
                        studentEmail = JSON.parse(jsonPayload).email;
                        console.log("Student email extracted from JWT:", studentEmail);
                    } catch (error) {
                        console.error("Error decoding JWT:", error);
                    }
                }
            }

            // Calculate time spent
            const examDuration = questions.length > 0 ? questions[0].duration * 60 : 0;
            const timeSpent = Math.max(0, (timeLeft !== null ? examDuration - timeLeft : 0));

            // Prepare exam result data
            const examResultData = {
                studentEmail: studentEmail,
                subject: subject,
                totalQuestions: questions.length,
                correctAnswers: correct,
                answers: selectedAnswers,
                timeSpent: timeSpent
            };

            console.log("Sending exam result data:", examResultData);
            console.log("✓ studentEmail:", studentEmail ? "✅ " + studentEmail : "❌ EMPTY");
            console.log("✓ subject:", subject ? "✅ " + subject : "❌ EMPTY");
            console.log("✓ totalQuestions:", questions.length ? "✅ " + questions.length : "❌ EMPTY");
            console.log("✓ correctAnswers:", correct !== undefined ? "✅ " + correct : "❌ EMPTY");
            console.log("Auth headers:", getAuthHeader());

            // Save exam result to database
            axios.post(`${API_BASE_URL}/user/exam/save-result`, examResultData, { headers: getAuthHeader() })
                .then((response) => {
                    console.log("✅ Exam result saved successfully!");
                    console.log("Response data:", response.data);

                    // Set the exam as submitted and display results
                    setFinalScore(score);
                    setIsSubmitted(true);
                    setTimerActive(false);

                    // Clear exam timer from localStorage
                    localStorage.removeItem('examStartTime');
                    localStorage.removeItem('totalExamDuration');

                    // Log submission details
                    console.log("Exam Submitted", {
                        subject: subject,
                        totalQuestions: questions.length,
                        correctAnswers: correct,
                        score: score.toFixed(2) + "%",
                        answers: selectedAnswers
                    });

                    // Show success modal
                    Swal.fire({
                        title: 'Exam Submitted!',
                        html: `<p style="color: #475569; margin: 10px 0;">Your exam has been submitted successfully.</p>
                               <p style="color: #0f172a; font-size: 24px; font-weight: bold; margin: 15px 0;">Score: <span style="color: #ab3500;">${score.toFixed(2)}%</span></p>`,
                        icon: 'success',
                        iconColor: '#10b981',
                        confirmButtonColor: '#ab3500',
                        confirmButtonText: 'View Results',
                        allowOutsideClick: false,
                        didOpen: (modal) => {
                            modal.querySelector('.swal2-title').style.color = '#0f172a'
                        }
                    });
                })
                .catch((error) => {
                    console.error("Error saving exam result:");
                    console.error("Error message:", error.message);
                    console.error("Error response status:", error.response?.status);
                    console.error("Error response data:", error.response?.data);
                    console.error("Full error:", error);

                    // Get error message from backend
                    const backendMessage = error.response?.data?.message || 
                                         error.response?.data?.error ||
                                         error.message || 
                                         'Failed to save exam result';

                    // Still show results but show a warning about database save
                    Swal.fire({
                        title: 'Exam Submitted',
                        html: `<p style="color: #475569; margin: 10px 0;">Your exam has been processed.</p>
                               <p style="color: #0f172a; font-size: 24px; font-weight: bold; margin: 15px 0;">Score: <span style="color: #ab3500;">${score.toFixed(2)}%</span></p>
                               <p style="color: #dc2626; margin: 10px 0; font-size: 13px;"> Note: ${backendMessage}</p>`,
                        icon: 'warning',
                        iconColor: '#f59e0b',
                        confirmButtonColor: '#ab3500',
                        confirmButtonText: 'Continue',
                        allowOutsideClick: false,
                        didOpen: (modal) => {
                            modal.querySelector('.swal2-title').style.color = '#0f172a'
                        }
                    });

                    // Still show results
                    setFinalScore(score);
                    setIsSubmitted(true);
                    setTimerActive(false);

                    // Clear exam timer from localStorage
                    localStorage.removeItem('examStartTime');
                    localStorage.removeItem('totalExamDuration');
                });
        };

        // If auto-submit (time expired), submit directly without confirmation
        if (isAutoSubmit) {
            performSubmission();
            return;
        }

        // Otherwise, show confirmation modal first
        Swal.fire({
            title: 'Submit Exam?',
            text: 'Are you sure you want to submit the exam? You cannot change your answers after submission.',
            icon: 'question',
            iconColor: '#ab3500',
            showCancelButton: true,
            confirmButtonColor: '#ab3500',
            cancelButtonColor: '#6c757d',
            confirmButtonText: 'Yes, Submit',
            cancelButtonText: 'Cancel',
            didOpen: (modal) => {
                modal.querySelector('.swal2-title').style.color = '#0f172a'
                modal.querySelector('.swal2-html-container').style.color = '#475569'
            }
        }).then((result) => {
            if (result.isConfirmed) {
                performSubmission();
            }
        });
    }

    // Get current question
    const currentQuestion = questions[currentIndex]

    // Restore selected answer for current question
    useEffect(() => {
        if (currentQuestion && selectedAnswers[currentQuestion._id]) {
            setSelectedOption(selectedAnswers[currentQuestion._id])
        } else {
            setSelectedOption("")
        }
    }, [currentIndex, currentQuestion, selectedAnswers])

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

    // Show results after submission
    if (isSubmitted) {
        return (
            <div className='d-flex justify-content-center align-items-center' style={{ minHeight: '100vh' }}>
                <div className='text-center'>
                    <h2 className='fw-bold' style={{ color: "#ab3500" }}>Exam Submitted!</h2>
                    <h3 className='my-4'>Your Score: {finalScore.toFixed(2)}%</h3>
                    <p className='text-muted mb-4'>Thank you for completing the exam.</p>
                    <button onClick={() => navigate(-2)} className='btn' style={{ backgroundColor: "#ab3500", color: "white" }}>
                        Back to Assessments
                    </button>
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

                    <div className='alert alert-danger fw-bold px-4 py-2 fs-sm-5 text-center justify-content-center align-items-center gap-2 ' style={{ backgroundColor: getTimerBgColor(), borderColor: getTimerColor(), borderWidth: '2px', color: getTimerColor() }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill={getTimerColor()} d="M12 20a8 8 0 0 0 8-8a8 8 0 0 0-8-8a8 8 0 0 0-8 8a8 8 0 0 0 8 8m0-18a10 10 0 0 1 10 10a10 10 0 0 1-10 10C6.47 22 2 17.5 2 12A10 10 0 0 1 12 2m.5 5v5.25l4.5 2.67l-.75 1.23L11 13V7z" /></svg> 
                        <span>{formatTime(timeLeft)}</span>
                        {timeLeft && timeLeft <= 300 && <span style={{ marginLeft: '0.5rem', fontSize: '0.9em' }}>⚠️ Hurry!</span>}
                        {!timerActive && timeLeft === 0 && <span style={{ marginLeft: '0.5rem', fontSize: '0.9em' }}>TIME EXPIRED</span>}
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

                {/* Time Expired Banner */}
                {isTimeExpired && (
                    <div className='container col-lg-7 mb-3 alert alert-danger d-flex align-items-center gap-2' style={{ backgroundColor: '#fee2e2', borderColor: '#dc2626' }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2">
                            <circle cx="12" cy="12" r="10"></circle>
                            <line x1="12" y1="8" x2="12" y2="12"></line>
                            <line x1="12" y1="16" x2="12.01" y2="16"></line>
                        </svg>
                        <strong style={{ color: '#dc2626' }}>Time's Up! Your exam has been automatically submitted.</strong>
                    </div>
                )}

                {/* Disabled Answer Notice */}
                {isTimeExpired && (
                    <div className='container col-lg-7 mb-3 alert alert-warning d-flex align-items-center gap-2' style={{ backgroundColor: '#fef3c7', borderColor: '#f59e0b' }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="1.2em" height="1.2em" viewBox="0 0 24 24" fill="#f59e0b">
                            <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" />
                        </svg>
                        <span style={{ color: '#92400e' }}>You can no longer answer questions. The exam has been submitted automatically.</span>
                    </div>
                )}

                <button className='container border border-0 bg-light px-3 my-2 text-secondary text-start fw-bold d-block d-lg-none d-md-none'>Review All <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="#6b6868" d="M22 12.999V20a1 1 0 0 1-1 1h-8v-8.001zm-11 0V21H3a1 1 0 0 1-1-1v-7.001zM11 3v7.999H2V4a1 1 0 0 1 1-1zm10 0a1 1 0 0 1 1 1v6.999h-9V3z" /></svg></button>

                <div className='container col-11 col-lg-7 bg-white p-4 rounded-4 mb-4'>
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
                                        onClick={() => {
                                            // Prevent answering if time is expired
                                            if (isTimeExpired) {
                                                Swal.fire({
                                                    title: 'Time Expired',
                                                    text: 'You cannot answer questions after time has expired.',
                                                    icon: 'error',
                                                    iconColor: '#dc2626',
                                                    confirmButtonColor: '#ab3500',
                                                    didOpen: (modal) => {
                                                        modal.querySelector('.swal2-title').style.color = '#0f172a'
                                                    }
                                                });
                                                return;
                                            }

                                            setSelectedOption(option.id)
                                            // Store the answer
                                            setSelectedAnswers({
                                                ...selectedAnswers,
                                                [currentQuestion._id]: option.id
                                            })
                                        }}
                                        disabled={isTimeExpired}
                                        className="btn text-start d-flex align-items-center p-3 rounded-3" // Kept layout classes only
                                        style={{
                                            width: '100%', // Ensures it fills container
                                            borderWidth: '2px',
                                            borderStyle: 'solid',
                                            // Logic for Border, Background, and Shadow
                                            borderColor: isSelected ? '#ab3500' : 'transparent',
                                            backgroundColor: isTimeExpired ? '#f3f4f6' : (isSelected ? '#ffffff' : '#f8f9fa'),
                                            boxShadow: isSelected ? '0 .125rem .25rem rgba(0,0,0,.075)' : 'none',
                                            transition: 'all 0.2s ease-in-out',
                                            cursor: isTimeExpired ? 'not-allowed' : 'pointer',
                                            opacity: isTimeExpired ? 0.6 : 1
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
                                    }
                                }}
                                disabled={currentIndex === 0 || isTimeExpired}
                                className='py-2 px-2 px-lg-5 fw-bold border-1 bg-white d-flex align-items-center gap-1'
                                style={{
                                    color: (currentIndex === 0 || isTimeExpired) ? "#ccc" : "#0f172b",
                                    borderColor: "#ab3500",
                                    opacity: (currentIndex === 0 || isTimeExpired) ? 0.5 : 1,
                                    cursor: (currentIndex === 0 || isTimeExpired) ? 'not-allowed' : 'pointer'
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
                                        handleSubmitExam()
                                    }
                                }}
                                disabled={isTimeExpired}
                                className='py-2 px-4 fw-bold border border-1 d-flex align-items-center gap-2'
                                style={{
                                    backgroundColor: isTimeExpired ? "#ccc" : "#ab3500",
                                    color: "white",
                                    cursor: isTimeExpired ? 'not-allowed' : 'pointer',
                                    opacity: isTimeExpired ? 0.6 : 1
                                }}
                            >
                                {currentIndex === questions.length - 1 ? "Submit" : "Next"}
                                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 16 16"><path fill="#ffffff" fillRule="evenodd" d="M2 8a.75.75 0 0 1 .75-.75h8.69L8.22 4.03a.75.75 0 0 1 1.06-1.06l4.5 4.5a.75.75 0 0 1 0 1.06l-4.5 4.5a.75.75 0 0 1-1.06-1.06l3.22-3.22H2.75A.75.75 0 0 1 2 8" clipRule="evenodd" /></svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Question Navigator */}
                <div className='container col-11 col-lg-7 bg-white p-3 rounded-4 mb-3'>
                    {/* <p className='fw-bold mb-2' style={{ fontSize: "14px", color: "#0f172b" }}>Question Navigator</p> */}
                    <div className='d-flex flex-wrap gap-2' style={{ maxHeight: "150px", overflowY: "auto", padding: "5px 0" }}>
                        {questions.map((q, index) => {
                            const isCurrent = index === currentIndex;
                            const isAnswered = selectedAnswers[q._id] !== undefined;

                            let bgColor = "#f8f9fa";
                            let textColor = "#6c757d";
                            let borderColor = "#dee2e6";

                            if (isAnswered) {
                                bgColor = "#ab3500";
                                textColor = "white";
                                borderColor = "#ab3500";
                            }

                            return (
                                <button
                                    key={q._id || index}
                                    onClick={() => setCurrentIndex(index)}
                                    className="btn d-flex align-items-center justify-content-center fw-bold"
                                    style={{
                                        width: "35px",
                                        height: "35px",
                                        padding: "0",
                                        backgroundColor: bgColor,
                                        color: textColor,
                                        border: `1px solid ${borderColor}`,
                                        boxShadow: isCurrent ? '0 0 0 2px #0f172b' : 'none',
                                        borderRadius: "6px",
                                        transition: "all 0.2s"
                                    }}
                                >
                                    {index + 1}
                                </button>
                            )
                        })}
                    </div>
                    <div className='d-flex flex-wrap gap-3 mt-3' style={{ fontSize: "12px", color: "#64748b" }}>
                        <div className='d-flex align-items-center gap-1'>
                            <div style={{ width: "12px", height: "12px", backgroundColor: "#ab3500", borderRadius: "3px" }}></div> Answered
                        </div>
                        <div className='d-flex align-items-center gap-1'>
                            <div style={{ width: "12px", height: "12px", backgroundColor: "#f8f9fa", border: "1px solid #dee2e6", borderRadius: "3px" }}></div> Unanswered
                        </div>
                        <div className='d-flex align-items-center gap-1'>
                            <div style={{ width: "12px", height: "12px", backgroundColor: "transparent", border: "1px solid #dee2e6", boxShadow: "0 0 0 2px #0f172b", borderRadius: "3px", margin: "2px" }}></div> Current
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ActiveQuizView