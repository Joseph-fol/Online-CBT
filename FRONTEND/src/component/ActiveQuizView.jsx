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
                <div className='container col-lg-7 py-5 d-flex justify-content-between'>
                    <div style={{ backgroundColor: "#edeeef", color: "black" }} className='px-4 fw-medium py-2 rounded-3'>
                        Question 14 of 20
                    </div>

                    <div style={{ color: "#392bd1" }}>
                        Mark for Reviews
                    </div>
                </div>

                <div className='container col-lg-7 bg-white p-4 rounded-4'>
                    {/* Question */}
                    <h4 className='mb-4'>{questionText} </h4>

                    {/* Answer */}
                    <div className='d-flex flex-column gap-3'>
                        {
                            options.map((option) => {
                                const isSelected = selectedOption === option.id

                                return (
                                    <button key={option.id} onClick={() => setSelectedOption(option.id)} className={`btn text-start d-flex align-items-center p-3 rounded-3 
                                        ${isSelected ? 'border-primary bg-white shadow-sm' : 'bg-light text-dark' }`}

                                        style={{
                                            borderWidth: '2px',
                                            borderStyle: 'solid',
                                            borderColor: isSelected ? '#0d6efd' : 'transparent',
                                            transition: 'all 0.2s ease-in-out'
                                        }}
                                    >
                                        <div className={`d-flex flex-shrink-0 align-items-center justify-content-center rounded-2 me-3 fw-bold 
                                        ${isSelected ? 'bg-primary text-white' : 'bg-white text-secondary border' }`} style={{ width: '36px', height: '36px' }}> {option.id}
                                        </div>

                                        <span className={`fs-6 ${isSelected ? 'fw-semibold text-dark' : 'text-secondary'}`}>
                                            {option.text}
                                        </span>
                                    </button>

                                )
                            })

                            // option.text
                            // <button className='text-start'>
                            // </button> 


                        }
                    </div>

                    {/* <button className='w-100 my-3 border border-0 text-start px-4 py-3 fw-medium fs-5' style={{transition: 'all 0.2s ease-in-out'}}> */}


                    {/* <button className='me-3 px-3 bg-primary border border-none text-white rounded-2 fw-bold  py-1'>A</button>  Variable-ratio reinforcement scheduling */}
                    {/* </button> */}

                    {/* <input type="radio" name="optionA" id="" /> A  */}


                </div>

            </div>
        </>
    )
}

export default ActiveQuizView