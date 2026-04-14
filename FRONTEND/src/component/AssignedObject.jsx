import React from 'react'

const AssignedObject = () => {
    const subjectsAssigned = {
        backgroundColor: "#f8f9fa",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        margin: "0px auto",
        padding: "20px 0 2px 0px"
    }


    const recentPerformance = {
        backgroundColor: "#f3f4f5",
        padding: "30px 25px",
        marginTop: "30px",
        borderRadius: "17px"
    }

    // const navLinks = {
    //     d
    // }

    const year = new Date
    const thisYear = year.getFullYear()
    // console.log(thisYear);

    return (
        <div style={{ backgroundColor: "#f8f9fa" }}>
            <div className='container'>


                <div style={subjectsAssigned}>
                    <div>
                        <h3 style={{ color: "#221888", fontWeight: "bold" }}>Assigned Subjects</h3>
                        <p className='fw-medium'style={{fontSize:" 14px"}}>Select a curated curriculum to begin your assessment.</p>
                    </div>

                    <div className='fw-bold' style={{ color: "#392bd1" }}>
                        <span style={{fontSize:" 14px"}}>View all curriculum </span> <svg xmlns="http://www.w3.org/2000/svg" width="1.2em" height="1.2em" viewBox="0 0 24 24"><g fill="none"><path d="M24 0v24H0V0zM12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.019-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z" /><path fill="#221888" d="m15.06 5.283l5.657 5.657a1.5 1.5 0 0 1 0 2.12l-5.656 5.658a1.5 1.5 0 0 1-2.122-2.122l3.096-3.096H4.5a1.5 1.5 0 0 1 0-3h11.535L12.94 7.404a1.5 1.5 0 0 1 2.122-2.121Z" /></g></svg>
                    </div>
                </div>
            </div>

            {/* First Div */}
            <div className='container'>
                <div className='row g-4'>
                    <div className='col-12 col-md-4'>
                        <div className='bg-white p-4 rounded-3 h-100'>
                            <div style={{
                                backgroundColor: "#f8f9fa", padding:
                                    "10px", width: "50px", borderRadius: "10px", marginBottom: "17px"
                            }}>

                                <svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 16 16"><path fill="#221888" fill-rule="evenodd" d="M8 0a1 1 0 0 1 1 1v1.17c1.1.389 1.91 1.4 1.99 2.61l2.95 5.48a.5.5 0 0 1 .06.237v5a.5.5 0 0 1-.943.232l-4.13-7.88a3 3 0 0 1-1.86 0l-4.13 7.88a.5.5 0 0 1-.942-.232v-5a.5.5 0 0 1 .06-.237l2.95-5.48v.01a3.01 3.01 0 0 1 1.82-2.56l.167-.063V.997a1 1 0 0 1 1-1zM3 10.6v2.84l3.18-6.08a3 3 0 0 1-.871-1.06l-2.31 4.3zm7.69-4.3a3.06 3.06 0 0 1-.871 1.06l3.19 6.08V10.6l-2.31-4.3zM8 2.97a2 2 0 1 0-.001 4.001A2 2 0 0 0 8 2.97" clip-rule="evenodd" /></svg>
                            </div>

                            <h5 className='fw-bold fs-5'>Structural Engineering</h5>
                            <p style={{fontSize:" 14px"}}>Static analysis, material resilience, and modern architectural load-bearing.</p>

                            <div className='d-flex justify-content-between py-3'>
                                <div className='fw-medium'>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="1.2em" height="1.2em" viewBox="0 0 24 24"><path fill="#221888" d="M12 21q-3.775 0-6.387-1.162T3 17V7q0-1.65 2.638-2.825T12 3t6.363 1.175T21 7v10q0 1.675-2.613 2.838T12 21m0-11.975q2.225 0 4.475-.638T19 7.025q-.275-.725-2.512-1.375T12 5q-2.275 0-4.462.638T5 7.025q.35.75 2.538 1.375T12 9.025M12 14q1.05 0 2.025-.1t1.863-.288t1.675-.462T19 12.525v-3q-.65.35-1.437.625t-1.675.463t-1.863.287T12 11t-2.05-.1t-1.888-.288T6.4 10.15T5 9.525v3q.625.35 1.4.625t1.663.463t1.887.287T12 14m0 5q1.15 0 2.338-.175t2.187-.462t1.675-.65t.8-.738v-2.45q-.65.35-1.437.625t-1.675.463t-1.863.287T12 16t-2.05-.1t-1.888-.288T6.4 15.15T5 14.525V17q.125.375.788.725t1.662.638t2.2.462T12 19" /></svg> <span style={{fontSize:" 14px"}}>45 QUESTIONS</span>
                                </div>

                                <div className='fw-medium fs-6'>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="1.0em" height="1.0em" viewBox="0 0 20 20"><path fill="#221888" d="M10 0c5.523 0 10 4.477 10 10s-4.477 10-10 10S0 15.523 0 10S4.477 0 10 0m0 1.395a8.605 8.605 0 1 0 0 17.21a8.605 8.605 0 0 0 0-17.21m-.93 4.186c.385 0 .697.313.697.698v4.884h5.884a.698.698 0 0 1 0 1.395H9.07a.7.7 0 0 1-.698-.698V6.28c0-.386.312-.699.698-.699" /></svg><span style={{fontSize:" 14px"}}> 60 MINS</span>
                                </div>
                            </div>

                            <button className='w-100 text-white my-3 py-2 fw-medium border border-none' style={{ backgroundColor: "#392bd1" }}>Start Quiz</button>
                        </div>
                    </div>

                    <div className='col-12 col-md-4'>
                        <div className='bg-white p-4 rounded-3 h-100'>
                            <div style={{
                                backgroundColor: "#f8f9fa", padding:
                                    "10px", width: "50px", borderRadius: "10px", marginBottom: "17px"
                            }}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 24 24"><path fill="#221888" d="M18 6H8.83l6 6l-6 6H18v2H6v-2l6-6l-6-6V4h12z" /></svg>
                            </div>

                            <h5 className='fw-bold fs-5'>Applied Calculus IV</h5>
                            <p style={{fontSize:" 14px"}}>Multivariable integration, vector fields, and thermodynamic modeling.</p>
                            <div className='d-flex justify-content-between py-3'>
                                <div className='fw-medium fs-6'>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="1.2em" height="1.2em" viewBox="0 0 24 24"><path fill="#221888" d="M12 21q-3.775 0-6.387-1.162T3 17V7q0-1.65 2.638-2.825T12 3t6.363 1.175T21 7v10q0 1.675-2.613 2.838T12 21m0-11.975q2.225 0 4.475-.638T19 7.025q-.275-.725-2.512-1.375T12 5q-2.275 0-4.462.638T5 7.025q.35.75 2.538 1.375T12 9.025M12 14q1.05 0 2.025-.1t1.863-.288t1.675-.462T19 12.525v-3q-.65.35-1.437.625t-1.675.463t-1.863.287T12 11t-2.05-.1t-1.888-.288T6.4 10.15T5 9.525v3q.625.35 1.4.625t1.663.463t1.887.287T12 14m0 5q1.15 0 2.338-.175t2.187-.462t1.675-.65t.8-.738v-2.45q-.65.35-1.437.625t-1.675.463t-1.863.287T12 16t-2.05-.1t-1.888-.288T6.4 15.15T5 14.525V17q.125.375.788.725t1.662.638t2.2.462T12 19" /></svg> 30 QUESTIONS
                                </div>

                                <div className='fw-medium fs-6'>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="1.0em" height="1.0em" viewBox="0 0 20 20"><path fill="#221888" d="M10 0c5.523 0 10 4.477 10 10s-4.477 10-10 10S0 15.523 0 10S4.477 0 10 0m0 1.395a8.605 8.605 0 1 0 0 17.21a8.605 8.605 0 0 0 0-17.21m-.93 4.186c.385 0 .697.313.697.698v4.884h5.884a.698.698 0 0 1 0 1.395H9.07a.7.7 0 0 1-.698-.698V6.28c0-.386.312-.699.698-.699" /></svg> 45 MINS
                                </div>
                            </div>

                            <button className='w-100 text-white my-3 py-2 fw-medium border border-none' style={{ backgroundColor: "#392bd1" }}>Start Quiz</button>
                        </div>
                    </div>

                    <div className='col-12 col-md-4'>
                        <div className='bg-white p-4 rounded-3 h-100'>
                            <div style={{
                                backgroundColor: "#f8f9fa", padding:
                                    "10px", width: "50px", borderRadius: "10px", marginBottom: "17px"
                            }}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 24 24"><path fill="#221888" d="m13.196 2.268l3.25 5.63a1 1 0 0 1-.366 1.365l-1.3.75l1.001 1.732l-1.732 1l-1-1.733l-1.299.751a1 1 0 0 1-1.366-.366L8.546 8.215a5 5 0 0 0-3.222 6.56A4.97 4.97 0 0 1 8 14c1.684 0 3.174.833 4.08 2.109l7.688-4.439l1 1.733l-7.878 4.548a5 5 0 0 1 .01 2.05L21 20v2l-17 .001A4.98 4.98 0 0 1 3 19c0-1.007.298-1.945.81-2.73a7.003 7.003 0 0 1 3.717-9.82l-.393-.682a2 2 0 0 1 .732-2.732l2.598-1.5a2 2 0 0 1 2.732.732M8 16a3 3 0 0 0-2.83 4h5.66A3 3 0 0 0 8 16m3.464-12.732l-2.598 1.5l2.75 4.763l2.598-1.5z" /></svg>
                            </div>

                            <h5 className='fw-bold'>Molecular Biology</h5>
                            <p>Advanced genetics, protein synthesis, and cellular replication mechanisms.</p>
                            <div className='d-flex justify-content-between py-3'>
                                <div className='fw-medium fs-6'>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="1.2em" height="1.2em" viewBox="0 0 24 24"><path fill="#221888" d="M12 21q-3.775 0-6.387-1.162T3 17V7q0-1.65 2.638-2.825T12 3t6.363 1.175T21 7v10q0 1.675-2.613 2.838T12 21m0-11.975q2.225 0 4.475-.638T19 7.025q-.275-.725-2.512-1.375T12 5q-2.275 0-4.462.638T5 7.025q.35.75 2.538 1.375T12 9.025M12 14q1.05 0 2.025-.1t1.863-.288t1.675-.462T19 12.525v-3q-.65.35-1.437.625t-1.675.463t-1.863.287T12 11t-2.05-.1t-1.888-.288T6.4 10.15T5 9.525v3q.625.35 1.4.625t1.663.463t1.887.287T12 14m0 5q1.15 0 2.338-.175t2.187-.462t1.675-.65t.8-.738v-2.45q-.65.35-1.437.625t-1.675.463t-1.863.287T12 16t-2.05-.1t-1.888-.288T6.4 15.15T5 14.525V17q.125.375.788.725t1.662.638t2.2.462T12 19" /></svg> 25 QUESTIONS
                                </div>

                                <div className='fw-medium fs-6'>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="1.0em" height="1.0em" viewBox="0 0 20 20"><path fill="#221888" d="M10 0c5.523 0 10 4.477 10 10s-4.477 10-10 10S0 15.523 0 10S4.477 0 10 0m0 1.395a8.605 8.605 0 1 0 0 17.21a8.605 8.605 0 0 0 0-17.21m-.93 4.186c.385 0 .697.313.697.698v4.884h4.884a.698.698 0 0 1 0 1.395H9.07a.7.7 0 0 1-.698-.698V6.28c0-.386.312-.699.698-.699" /></svg> 40 MINS
                                </div>
                            </div>
                            <button className='w-100 text-white my-3 py-2 fw-medium border border-none' style={{ backgroundColor: "#392bd1" }}>Start Quiz</button>
                        </div>
                    </div>

                    <div className='col-12 col-md-4'>
                        <div className='bg-white p-4 rounded-3 h-100'>

                            <div style={{
                                backgroundColor: "#f8f9fa", padding:
                                    "10px", width: "50px", borderRadius: "10px", marginBottom: "17px"
                            }}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 24 24"><g fill="none" stroke="#221888" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"><path d="M4.222 21.995v-3.55c0-1.271-.333-1.932-.987-3.037A8.888 8.888 0 0 1 10.889 2a8.89 8.89 0 0 1 8.889 8.887c0 .58 0 .87.024 1.032c.058.388.24.722.417 1.068L22 16.441l-1.4.7c-.405.202-.608.303-.749.49s-.181.399-.26.82l-.008.042c-.183.968-.384 2.036-.95 2.71c-.2.237-.448.43-.727.567c-.461.225-1.028.225-2.162.225c-.525 0-1.051.012-1.576 0c-1.243-.031-2.168-1.077-2.168-2.29" /><path d="M14.388 10.532c-.426 0-.815-.162-1.11-.427m1.11.426c0 1.146-.664 2.235-1.942 2.235S10.504 13.854 10.504 15m3.884-4.469c2.15 0 2.15-3.35 0-3.35q-.294.001-.557.095c.105-2.498-3.496-3.176-4.312-.836m.985 1.857c0-.774-.39-1.456-.985-1.857m0 0c-1.852-1.25-4.32.993-3.146 2.993c-1.97.295-1.76 3.333.247 3.333a1.66 1.66 0 0 0 1.362-.712" /></g></svg>
                            </div>

                            <h5 className='fw-bold'>Cognitive Science</h5>
                            <p>Neural networks, linguistic acquisition, and behavioral psychology foundations.</p>

                            <div className='d-flex justify-content-between py-3'>
                                <div className='fw-medium fs-6'>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="1.2em" height="1.2em" viewBox="0 0 24 24"><path fill="#221888" d="M12 21q-3.775 0-6.387-1.162T3 17V7q0-1.65 2.638-2.825T12 3t6.363 1.175T21 7v10q0 1.675-2.613 2.838T12 21m0-11.975q2.225 0 4.475-.638T19 7.025q-.275-.725-2.512-1.375T12 5q-2.275 0-4.462.638T5 7.025q.35.75 2.538 1.375T12 9.025M12 14q1.05 0 2.025-.1t1.863-.288t1.675-.462T19 12.525v-3q-.65.35-1.437.625t-1.675.463t-1.863.287T12 11t-2.05-.1t-1.888-.288T6.4 10.15T5 9.525v3q.625.35 1.4.625t1.663.463t1.887.287T12 14m0 5q1.15 0 2.338-.175t2.187-.462t1.675-.65t.8-.738v-2.45q-.65.35-1.437.625t-1.675.463t-1.863.287T12 16t-2.05-.1t-1.888-.288T6.4 15.15T5 14.525V17q.125.375.788.725t1.662.638t2.2.462T12 19" /></svg> 50 QUESTIONS
                                </div>

                                <div className='fw-medium fs-6'>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="1.0em" height="1.0em" viewBox="0 0 20 20"><path fill="#221888" d="M10 0c5.523 0 10 4.477 10 10s-4.477 10-10 10S0 15.523 0 10S4.477 0 10 0m0 1.395a8.605 8.605 0 1 0 0 17.21a8.605 8.605 0 0 0 0-17.21m-.93 4.186c.385 0 .697.313.697.698v4.884h5.884a.698.698 0 0 1 0 1.395H9.07a.7.7 0 0 1-.698-.698V6.28c0-.386.312-.699.698-.699" /></svg> 90 MINS
                                </div>
                            </div>

                            <button className='w-100 text-white my-3 py-2 fw-medium border border-none' style={{ backgroundColor: "#392bd1" }}>Start Quiz</button>
                        </div>
                    </div>

                    <div className='col-12 col-md-4'>
                        <div className='bg-white p-4 rounded-3 h-100'>
                            <div style={{
                                backgroundColor: "#f8f9fa", padding:
                                    "10px", width: "50px", borderRadius: "10px", marginBottom: "17px"
                            }}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 24 24"><path fill="#221888" fill-rule="evenodd" d="M12 2.25a.75.75 0 0 1 .75.75v.756a49 49 0 0 1 9.152 1a.75.75 0 0 1-.152 1.485h-1.918l2.474 10.124a.75.75 0 0 1-.375.84A6.7 6.7 0 0 1 18.75 18a6.7 6.7 0 0 1-3.181-.795a.75.75 0 0 1-.375-.84l2.474-10.124H12.75v13.28c1.293.076 2.534.343 3.697.776a.75.75 0 0 1-.262 1.453h-8.37a.75.75 0 0 1-.262-1.453c1.162-.433 2.404-.7 3.697-.775V6.24H6.332l2.474 10.124a.75.75 0 0 1-.375.84A6.7 6.7 0 0 1 5.25 18a6.7 6.7 0 0 1-3.181-.795a.75.75 0 0 1-.375-.84L4.168 6.241H2.25a.75.75 0 0 1-.152-1.485a49 49 0 0 1 9.152-1V3a.75.75 0 0 1 .75-.75m4.878 13.543l1.872-7.662l1.872 7.662zm-9.756 0L5.25 8.131l-1.872 7.662z" clip-rule="evenodd" /></svg>
                            </div>

                            <h5 className='fw-bold'>Ethics in AI</h5>
                            <p>Moral philosophy applied to algorithmic decision-making and data governance.</p>

                            <div className='d-flex justify-content-between py-3'>
                                <div className='fw-medium fs-6'>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="1.2em" height="1.2em" viewBox="0 0 24 24"><path fill="#221888" d="M12 21q-3.775 0-6.387-1.162T3 17V7q0-1.65 2.638-2.825T12 3t6.363 1.175T21 7v10q0 1.675-2.613 2.838T12 21m0-11.975q2.225 0 4.475-.638T19 7.025q-.275-.725-2.512-1.375T12 5q-2.275 0-4.462.638T5 7.025q.35.75 2.538 1.375T12 9.025M12 14q1.05 0 2.025-.1t1.863-.288t1.675-.462T19 12.525v-3q-.65.35-1.437.625t-1.675.463t-1.863.287T12 11t-2.05-.1t-1.888-.288T6.4 10.15T5 9.525v3q.625.35 1.4.625t1.663.463t1.887.287T12 14m0 5q1.15 0 2.338-.175t2.187-.462t1.675-.65t.8-.738v-2.45q-.65.35-1.437.625t-1.675.463t-1.863.287T12 16t-2.05-.1t-1.888-.288T6.4 15.15T5 14.525V17q.125.375.788.725t1.662.638t2.2.462T12 19" /></svg> 20 QUESTIONS
                                </div>

                                <div className='fw-medium fs-6'>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="1.0em" height="1.0em" viewBox="0 0 20 20"><path fill="#221888" d="M10 0c5.523 0 10 4.477 10 10s-4.477 10-10 10S0 15.523 0 10S4.477 0 10 0m0 1.395a8.605 8.605 0 1 0 0 17.21a8.605 8.605 0 0 0 0-17.21m-.93 4.186c.385 0 .697.313.697.698v4.884h5.884a.698.698 0 0 1 0 1.395H9.07a.7.7 0 0 1-.698-.698V6.28c0-.386.312-.699.698-.699" /></svg> 30 MINS
                                </div>
                            </div>

                            <button className='w-100 text-white my-3 py-2 fw-medium border border-none' style={{ backgroundColor: "#392bd1" }}>Start Quiz</button>
                        </div>
                    </div>

                    <div className='col-12 col-md-4'>
                        <div className='bg-white p-4 rounded-3 h-100'>
                            <div style={{
                                backgroundColor: "#f8f9fa", padding:
                                    "10px", width: "50px", borderRadius: "10px", marginBottom: "17px"
                            }}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 32 32"><path fill="#221888" d="m20.17 19l-2.59 2.59L19 23l4-4l-4-4l-1.42 1.41zm-8.34 0l2.59-2.59L13 15l-4 4l4 4l1.42-1.41z" /><circle cx="9" cy="8" r="1" fill="#221888" /><circle cx="6" cy="8" r="1" fill="#221888" /><path fill="#221888" d="M28 4H4c-1.103 0-2 .898-2 2v20c0 1.103.897 2 2 2h24c1.103 0 2-.897 2-2V6c0-1.102-.897-2-2-2m0 2v4H4V6zM4 26V12h24v14z" /></svg>
                            </div>

                            <h5 className='fw-bold'>System Programming</h5>
                            <p>Memory management, kernel architecture, and low-level optimization in C/Rust.</p>
                            <div className='d-flex justify-content-between py-3'>
                                <div className='fw-medium fs-6'>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="1.2em" height="1.2em" viewBox="0 0 24 24"><path fill="#221888" d="M12 21q-3.775 0-6.387-1.162T3 17V7q0-1.65 2.638-2.825T12 3t6.363 1.175T21 7v10q0 1.675-2.613 2.838T12 21m0-11.975q2.225 0 4.475-.638T19 7.025q-.275-.725-2.512-1.375T12 5q-2.275 0-4.462.638T5 7.025q.35.75 2.538 1.375T12 9.025M12 14q1.05 0 2.025-.1t1.863-.288t1.675-.462T19 12.525v-3q-.65.35-1.437.625t-1.675.463t-1.863.287T12 11t-2.05-.1t-1.888-.288T6.4 10.15T5 9.525v3q.625.35 1.4.625t1.663.463t1.887.287T12 14m0 5q1.15 0 2.338-.175t2.187-.462t1.675-.65t.8-.738v-2.45q-.65.35-1.437.625t-1.675.463t-1.863.287T12 16t-2.05-.1t-1.888-.288T6.4 15.15T5 14.525V17q.125.375.788.725t1.662.638t2.2.462T12 19" /></svg> 40 QUESTIONS
                                </div>

                                <div className='fw-medium fs-6'>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="1.0em" height="1.0em" viewBox="0 0 20 20"><path fill="#221888" d="M10 0c5.523 0 10 4.477 10 10s-4.477 10-10 10S0 15.523 0 10S4.477 0 10 0m0 1.395a8.605 8.605 0 1 0 0 17.21a8.605 8.605 0 0 0 0-17.21m-.93 4.186c.385 0 .697.313.697.698v4.884h4.884a.698.698 0 0 1 0 1.395H9.07a.7.7 0 0 1-.698-.698V6.28c0-.386.312-.699.698-.699" /></svg> 75 MINS
                                </div>
                            </div>
                            <button className='w-100 text-white my-3 py-2 fw-medium border border-none' style={{ backgroundColor: "#392bd1" }}>Start Quiz</button>
                        </div>
                    </div>

                </div>
            </div>


            <div style={recentPerformance} className='container my-5'>

                <div className='d-flex justify-content-between align-items-center mb-4'>
                    <div>
                        <h3 style={{ color: "#221888", fontWeight: "bold" }}>Recent Performance</h3>
                    </div>

                    <div className='fw-bold' style={{ color: "#392bd1", fontSize: "16px" }}>
                        FULL HISTORY
                    </div>
                </div>

                <div className='row g-3 my-3'>
                    <div className='col-lg-6 col-12'>
                        <div className='bg-white p-4 rounded-3'>
                            <h2 className='fw-bold fs-1' style={{ color: "#221888" }}>88%</h2>
                            <div>
                                <h5 className='fw-bold'>Micro-Economics Final</h5>
                                <p>Completed 2 days ago • Rank: 4th of 120</p>
                            </div>
                        </div>
                    </div>

                    <div className='col-lg-6 col-12'>
                        <div className='bg-white p-4 rounded-3'>
                            <h2 className='fw-bold fs-1' style={{ color: "#221888" }}>94%</h2>
                            <div>
                                <h5 className='fw-bold'>Linear Algebra Quiz</h5>
                                <p>Completed yesterday • Rank: 1st of 85</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <footer className='container py-3'>
                <div className='d-flex justify-content-between' style={{fontSize: "12px"}}>
                    <p> © {thisYear} Academic Curator CBT. Advanced Examination Systems.</p>

                    <div className=''>
                        <ul className='d-flex gap-3'>
                            <li style={{listStyle:"none"}}><a href="#" style={{textDecoration: "none", color:"black", fontWeight:"medium", fontSize: "12px"}}>Honor Code</a></li>
                            <li style={{listStyle:"none"}}><a href="#" style={{textDecoration: "none", color:"black", fontWeight:"medium", fontSize: "12px"}}>Support</a></li>
                            <li style={{listStyle:"none"}}><a href="#" style={{textDecoration: "none", color:"black", fontWeight:"medium", fontSize: "12px"}}>Privacy</a></li>
                        </ul>
                    </div>
                </div>
            </footer>
        </div>
    )
}

export default AssignedObject