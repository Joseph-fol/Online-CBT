import React, { useState } from 'react'

const ActiveQuizView = () => {
    const [selectedOption, setSelectedOption] = useState("B")

    const questionText = "In the context of behavioral reinforcement, which mechanism most effectively sustains a habituated response when extrinsic rewards are gradually withdrawn?"

    const options = [
        {
            id: "A",
            text: "Variable-ratio reinforcement scheduling"
        },
        {
            id: "B",
            text: "Intermittent extinction conditioning"
        },
        {
            id: "C",
            text: "Fixed-interval cognitive mapping"
        },
        {
            id: "D",
            text: "Negative reinforcement through omission"
        },

    ]

    return (
        <>
            <div className='container-sm col-lg-9 bg-white font-sans '>
                <div className='d-flex justify-content-between pt-4' >
                    <div>
                        <span className='fw-medium'>ADVANCED PSYCHOMETRICS</span>
                        <span><h4 className='fw-bold' style={{ color: "#392bd1" }}>Cognitive Behavioral Analysis</h4></span>
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
                        Question 14 of 20
                    </div>

                    <div>
                        <button className='btn' style={{ color: "#392bd1" }}> Mark for Reviews</button>
                    </div>
                </div>

                <button className='container border border-0 bg-light px-3 my-2 text-secondary text-start fw-bold d-block d-lg-none d-md-none'>Review All <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="#6b6868" d="M22 12.999V20a1 1 0 0 1-1 1h-8v-8.001zm-11 0V21H3a1 1 0 0 1-1-1v-7.001zM11 3v7.999H2V4a1 1 0 0 1 1-1zm10 0a1 1 0 0 1 1 1v6.999h-9V3z"/></svg></button> 

                <div className='container col-11 col-lg-7 bg-white p-4 rounded-4'>
                    {/* Question */}
                    <h4 className='mb-4'>{questionText} </h4>

                    {/* Answer */}
                    <div className='d-flex flex-column gap-3'>
                        {
                            options.map((option) => {
                                const isSelected = selectedOption === option.id

                                return (
                                    <button key={option.id} onClick={() => setSelectedOption(option.id)} className={`btn text-start d-flex align-items-center p-3 rounded-3 
                                        ${isSelected ? 'border-primary bg-white shadow-sm' : 'bg-light text-dark'}`}

                                        style={{
                                            borderWidth: '2px',
                                            borderStyle: 'solid',
                                            borderColor: isSelected ? '#111314' : 'transparent',
                                            transition: 'all 0.2s ease-in-out'
                                        }}
                                    >
                                        <div className={`d-flex flex-shrink-0 align-items-center justify-content-center rounded-2 me-3 fw-bold 
                                        ${isSelected ? 'bg-primary text-white' : 'bg-white text-secondary border'}`} style={{ width: '36px', height: '36px' }}> {option.id}
                                        </div>

                                        <span className={`fs-6 ${isSelected ? 'fw-semibold text-dark' : 'text-secondary'}`}>
                                            {option.text}
                                        </span>
                                    </button>
                                )
                            })
                        }
                    </div>

                    <div className='py-5 d-flex flex-wrap justify-content-between align-items-center'>
                        <div>
                            <button className='py-2 px-2 px-lg-5 fw-bold border border-primary border-1 bg-white d-flex align-items-center gap-1' style={{ color: "#453adc" }}> <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24"><path fill="#453adc" d="M10.707 8.707a1 1 0 0 0-1.414-1.414l-4 4a1 1 0 0 0 0 1.414l4 4a1 1 0 0 0 1.414-1.414L8.414 13H18a1 1 0 1 0 0-2H8.414z" /></svg> Previous</button>
                        </div>

                        <div className='d-flex gap-4 align-items-center flex-wrap'>
                            <button className='btn text-secondary fw-bold d-none d-lg-block d-md-block'>Review All <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="#6b6868" d="M22 12.999V20a1 1 0 0 1-1 1h-8v-8.001zm-11 0V21H3a1 1 0 0 1-1-1v-7.001zM11 3v7.999H2V4a1 1 0 0 1 1-1zm10 0a1 1 0 0 1 1 1v6.999h-9V3z"/></svg></button> 

                            <button className='py-2 px-4 fw-bold border border-1 d-flex align-items-center gap-2' style={{ backgroundColor: "#453adc", color: "white" }}> Next <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 16 16"><path fill="#ffffff" fill-rule="evenodd" d="M2 8a.75.75 0 0 1 .75-.75h8.69L8.22 4.03a.75.75 0 0 1 1.06-1.06l4.5 4.5a.75.75 0 0 1 0 1.06l-4.5 4.5a.75.75 0 0 1-1.06-1.06l3.22-3.22H2.75A.75.75 0 0 1 2 8" clip-rule="evenodd" /></svg></button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ActiveQuizView