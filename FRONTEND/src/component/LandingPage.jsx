import React, { useState } from 'react'

const LandingPage = () => {
    // const [hoveredCard, setHoveredCard] = useState(null)
    const [hoveredCard, setHoveredCard] = useState(null)
    const divContent = [
        {
            title: "Instant Grading",
            description: "AI-powered evaluation engines provide immediate feedback and detailed performance analytics without human intervention."
        },
        {
            title: "Tamper-Proof Security",
            description: "Multi-layer proctoring including biometric verification, browser lock-down, and real-time activity monitoring."
        },
        {
            title: "Centralized Management",
            description: "Unified curriculum control, question bank rotation, and massive-scale student deployment in a single interface."
        }
    ]
    return (
        <>
            <nav className="navbar navbar-expand-lg px-lg-5 px-md-4  ">
                <div className="container-fluid">
                    <a className="navbar-brand fw-bold" href="#">CBT</a>
                    <button className="navbar-toggler shadow-none border-0" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav me-auto gap-3 mb-2 mb-lg-0">
                            <li className="nav-item">
                                <a className="nav-link fw-medium text-black" style={{ borderBottom: "2px solid green", paddingBottom: "3px" }} href="#">Platform</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link fw-medium text-black" href="#">Security</a>
                            </li>

                            <li className="nav-item">
                                <a className="nav-link fw-medium text-black" href='#'>Curriculum</a>
                            </li>

                            <li className="nav-item">
                                <a className="nav-link fw-medium text-black" href='#'>Pricing</a>
                            </li>
                        </ul>
                        <a href="" className='mx-3 text-decoration-none text-dark fw-bold'>Student Login</a>
                        <div className="d-flex justify-content-center align-items-center gap-3" >
                            <button className="btn w-100 text-white fw-medium" style={{ background: "#070235" }} type="submit">Admin Portal</button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Header Section */}
            <section className='bg-body-tertiary w-100 d-flex justify-content-center align-items-center' style={{ height: "100vh" }}>
                <div className='w-md-50 mx-auto text-center' style={{ width: "60%" }}>
                    <h1 className='text-center display-4' style={{ fontWeight: "bolder", color: "#070235" }}>Secure, Seamless, and <span style={{ color: "#0f6e50" }}>Smart Online Testing </span></h1>
                    <p>The definitive platform for high-stakes examinations. Empowering educators with tamper-proof security and students with a cognitive-calm testing environment.</p>
                    <div className='d-flex gap-3 align-items-center justify-content-center flex-wrap'>
                        <button className="btn text-white fw-medium py-2 px-4" style={{ background: "#070235" }} type="submit">Start a free assessment</button>
                        <button className='btn fw-medium'>See how it works </button>
                    </div>
                </div>
            </section>

            <section className='container-fluid ' style={{ background: "#070235" }}>
                <div className='px-5 py-4 d-flex flex-wrap justify-content-evenly gap-3 align-items-center'>
                    <div style={{ borderLeft: "4px solid #0f6e50", paddingLeft: "10px" }}>
                        <h1 className='text-white fw-bold'>10,000+</h1>
                        <p className='fw-medium text-secondary'>QUESTION DELIVERED</p>
                    </div>
                    <div style={{ borderLeft: "4px solid #0f6e50", paddingLeft: "10px" }}>
                        <h1 className='text-white fw-bold '>0ms</h1>
                        <p className='fw-medium text-secondary'>LATENCY DELAY</p>
                    </div>
                    <div style={{ borderLeft: "4px solid #0f6e50", paddingLeft: "10px" }}>
                        <h1 className='text-white fw-bold'>100%</h1>
                        <p className='fw-medium text-secondary'>SECURITY GUARANTEE</p>
                    </div>
                </div>
            </section>

            <section className="py-5" style={{ backgroundColor: "#eff4ff" }} >
                <div className='container mx-auto text-center'>
                    <h2 style={{ color: "#070235" }} className="text-center fw-bolder">Precision Engineering for Excellence</h2>
                    <p className='fw-medium'>Rejecting standard dashboard noise for high-authority laboratory tools designed for cognitive focus.</p>
                </div>

                <div className='container pt-5'>
                    <div className='row g-4'>
                        {divContent.map((content, index) => (
                            <div className='col-12 col-md-4' key={content.title}>
                                <div className='p-4 rounded-4 h-100'
                                    onMouseEnter={()=> setHoveredCard(index)}
                                    onMouseLeave={() => setHoveredCard(null)}
                                    style={{
                                        background: hoveredCard === index ? "#d9f2e5" : "#ffffff",
                                        transition: "background-color 0.25s ease"
                                    }}
                                >
                                    <div style={{
                                        backgroundColor: "#f8f9fa", padding:
                                            "10px", width: "50px", borderRadius: "10px", marginBottom: "17px"
                                    }}>

                                        <svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 16 16"><path fill="#221888" fillRule="evenodd" d="M8 0a1 1 0 0 1 1 1v1.17c1.1.389 1.91 1.4 1.99 2.61l2.95 5.48a.5.5 0 0 1 .06.237v5a.5.5 0 0 1-.943.232l-4.13-7.88a3 3 0 0 1-1.86 0l-4.13 7.88a.5.5 0 0 1-.942-.232v-5a.5.5 0 0 1 .06-.237l2.95-5.48v.01a3.01 3.01 0 0 1 1.82-2.56l.167-.063V.997a1 1 0 0 1 1-1zM3 10.6v2.84l3.18-6.08a3 3 0 0 1-.871-1.06l-2.31 4.3zm7.69-4.3a3.06 3.06 0 0 1-.871 1.06l3.19 6.08V10.6l-2.31-4.3zM8 2.97a2 2 0 1 0-.001 4.001A2 2 0 0 0 8 2.97" clipRule="evenodd" /></svg>
                                    </div>
                                    <h4>{content.title}</h4>
                                    <p>{content.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </>
    )
}

export default LandingPage