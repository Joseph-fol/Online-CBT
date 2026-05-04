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

    if (loading) return <p style={{ padding: '20px' }}>Loading book details...</p>;
    if (!question) return <p style={{ padding: '20px' }}>question not found.</p>;

    useEffect(() => {
        // axios.get("http://localhost:2114/user/getAllQuestions")
        axios.get(`https://online-cbt.onrender.com/user/getAllQuestions/${id}`)
            .then((response) => {
                setLoading(false)
                console.log(response.data.questionsArray)
                setQuestionDetail(response.data.questionsArray)
            })
            .catch((error) => {
                console.error("Error fetching specific question", error);
            })
    }, [id])

    return (
        <div className='container pt-4'>
            <div className='d-flex'>
                <p onClick={() => navigate(-1)} className='fw-bold' style={{ cursor: "pointer" }}>Go back</p>
            </div>

            <div style={{ backgroundColor: "#0f172b", padding: "20px", color: "white", fontWeight: "bold", borderRadius: "10px", margin: "20px 0px" }}>
                { question.title }

            </div>
            <div>
                <p>Please read the following information before proceeding to your test</p>
            </div>
        </div>
    )
}

export default ExactQuestion