import axios from 'axios'
import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'

const ExactQuestion = () => {
    const [questionDetail, setQuestionDetail] = useState([])
    const [loading, setLoading] = useState(true)
    const [question, setQuestion] = useState(null)
    const navigate = useNavigate()
    const { id } = useParams()

    const confirmTest = () => {
        const confirmed = window.confirm("Are you sure you want to start your exam/test")
        if (confirmed) {
            // Log the details being passed
            // console.log("Starting Quiz - Subject Details:", {
            //     subject: question?.subject,
            //     description: question?.description,
            //     duration: question?.duration,
            //     totalQuestions: question?.totalQuestion,
            //     marks: question?.marks,
            //     questionId: id
            // });
            navigate(`/student/ActiveQuizView/${question?.subject}`)
        }
    }

    useEffect(() => {
        axios.get(`https://online-cbt.onrender.com/user/question/${id}`)
            .then((response) => {
                // console.log(response.data)
                setQuestionDetail(response.data)
                setQuestion(response.data)
                setLoading(false)
            })

            .catch((error) => {
                setLoading(false)
                console.error("Error fetching details", error);
                alert("Error fetching details");
            })
    }, [id])

    return (
        <div className='container pt-4 pb-4'>
            <div className='d-flex'>
                <p onClick={() => navigate(-1)} className='fw-bold' style={{ cursor: "pointer" }}>Go back</p>
            </div>

            <div style={{ backgroundColor: "#0f172b", padding: "20px", color: "white", fontWeight: "bold", borderRadius: "10px", margin: "20px 0px" }}>
                {question?.subject}

            </div>
            <div>
                <p>Please read the following information before proceeding to your test</p>
                <hr />
                <p className='fw-bold'> Description:   <span className='fw-medium'>
                    {question?.description}
                </span> </p>
                <hr />

                <p className='fw-bold'> Duration:   <span className='fw-medium'>
                    {question?.duration} minutes
                </span> </p>
                <hr />

                <p className='fw-bold'> Time Left:   <span className='fw-medium'>
                    {question?.duration} minutes(s)
                </span> </p>
                <hr />

                <p className='fw-bold'> Total Question:   <span className='fw-medium'>
                    {question?.totalQuestion} question(s)
                </span> </p>
                <hr />

                <p className='fw-bold'>Mark:   <span className='fw-medium'>
                    {question?.marks} mark per question
                </span> </p>
                <hr />
            </div>

            <p className='fw-bold'>Note   <span className='fw-medium'>
                Please make sure you complete the test in a quiet and comfortable place.
            </span> </p>
            <hr />

            <button className='btn btn fw-bold' style={{ backgroundColor: "#ab3500", color: "white" }} onClick={confirmTest} >Start Now</button>
        </div>
    )
}

export default ExactQuestion