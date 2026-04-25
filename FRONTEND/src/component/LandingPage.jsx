import React, { useState, useEffect } from 'react'
import AOS from 'aos'
import 'aos/dist/aos.css'
import './LandingPage.css'
import logo from '../assets/Online-cbt.jpg'
import { Link } from 'react-router-dom'

const LandingPage = () => {
    // const [hoveredCard, setHoveredCard] = useState(null)
    const [hoveredCard, setHoveredCard] = useState(null)
    const [isScrolled, setIsScrolled] = useState(false)
    const [arrow, setArrow] = useState(null)

    useEffect(() => {
        AOS.init({
            duration: 2000,
            once: false,
            offset: 100,
            easing: 'ease-in-out',
            delay: 0
        })
    }, [])

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                setIsScrolled(true)
            } else {
                setIsScrolled(false)
            }
        }

        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])
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
            <nav
                className="navbar navbar-expand-lg px-lg-5 px-md-4"
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    zIndex: 1000,
                    backdropFilter: isScrolled ? 'blur(10px)' : 'blur(0px)',
                    backgroundColor: isScrolled ? 'rgba(255, 255, 255, 0.8)' : 'transparent',
                    transition: 'all 0.3s ease',
                    boxShadow: isScrolled ? '0 2px 10px rgba(0, 0, 0, 0.1)' : 'none'
                }}
            >
                <div className="container-fluid">
                    <a className="navbar-brand fw-bold" href="#"><img src={logo} alt="" width={30}/> Online CBT</a>
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
                        <Link to="/AdminSignin">
                            <button className=' btn mx-3 text-decoration-none text-dark fw-bold'> Admin Signin </button>
                        </Link>

                        <div className="d-flex justify-content-center align-items-center gap-3" >
                            <Link to="/studentSignin">
                                <button className="btn w-100 text-white fw-medium" style={{ background: "#ab3500" }} type="submit">Student Login</button>
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Watermark Logo */}
            <div className='watermark-logo'>
                <img src="src/assets/Online-cbt.jpg" alt="watermark"
                    style={{
                        width: '300px',
                        height: 'auto',
                        // filter: 'grayscale(100%)'
                    }}
                />
            </div>

            {/* Header Section */}
            <section className='bg-body-tertiary w-100 d-flex justify-content-center align-items-center position-relative' style={{ height: "100vh", overflow: "hidden", background: "linear-gradient(135deg, #fff7ed 0%, #f8fafc 100%)", marginTop: "0" }}>

                {/* Top curved shape */}
                <svg className='position-absolute' style={{ width: "100%", height: "100%", top: 0, left: 0 }} viewBox="0 0 1200 800" preserveAspectRatio="none">
                    <path d="M 0,0 Q 300,100 600,80 T 1200,0 L 1200,200 Q 900,150 600,180 T 0,200 Z" fill="#eedacf" opacity="0.5" />
                    <path d="M 1200,600 Q 1000,650 800,700 Q 600,750 400,700 Q 200,650 0,600 L 0,800 L 1200,800 Z" fill="#fae7dd" opacity="0.4" />
                    {/* <path d="M 900,150 Q 1000,200 1100,250 Q 1150,300 1200,400 L 1200,0 Q 1100,50 1000,100 Q 950,120 900,150 Z" fill="#0f172b" opacity="0.08" /> */}
                </svg>

                <div className='w-md-50 mx-auto text-center' data-aos="fade-up" style={{ width: "60%", position: "relative", zIndex: 1 }}>
                    <h1 className='text-center display-4' data-aos="zoom-in" data-aos-delay="200" style={{ fontWeight: "bolder", color: "#0f172b" }}>Secure, Seamless, and <span style={{ color: "#ab3500" }}> Smart Online CBT </span></h1>
                    <p data-aos="fade-up" data-aos-delay="400">The definitive platform for high-stakes examinations. Empowering educators with tamper-proof security and students with a cognitive-calm testing environment.</p>
                    <div className='d-flex gap-3 align-items-center justify-content-center flex-wrap'>
                        <Link to="/createStudentAccount">
                            <button className="btn text-white fw-medium py-2 px-4" data-aos="slide-left" data-aos-delay="600" style={{ background: "#0f172b" }} type="submit">Start a free assessment</button>
                        </Link>
                        <button className='btn fw-medium' data-aos="slide-right" data-aos-delay="600">See how it works </button>
                    </div>
                </div>
            </section>

            <section className='container-fluid ' style={{ background: "#ab3500" }}>
                <div className='px-5 py-4 d-flex flex-wrap justify-content-evenly gap-3 align-items-center'>
                    <div data-aos="flip-left" style={{ borderLeft: "4px solid #fff7ed", paddingLeft: "10px" }}>
                        <h1 className='text-white fw-bold' style={{ color: "#0f172b" }}>10,000+</h1>
                        <p className='fw-medium text-white'>QUESTION DELIVERED</p>
                    </div>
                    <div data-aos="flip-left" data-aos-delay="200" style={{ borderLeft: "4px solid #fff7ed", paddingLeft: "10px" }}>
                        <h1 className='text-white fw-bold '>0ms</h1>
                        <p className='fw-medium text-white'>LATENCY DELAY</p>
                    </div>
                    <div data-aos="flip-left" data-aos-delay="400" style={{ borderLeft: "4px solid #fff7ed", paddingLeft: "10px" }}>
                        <h1 className='text-white fw-bold'>100%</h1>
                        <p className='fw-medium text-white'>SECURITY GUARANTEE</p>
                    </div>
                </div>
            </section>

            <section className="py-5" style={{ backgroundColor: "#f8fafc" }} >
                <div className='container mx-auto text-center'>
                    <h2 style={{ color: "#0f172b" }} className="text-center fw-bolder" data-aos="fade-up">Precision Engineering for Excellence</h2>
                    <p className='fw-medium' data-aos="fade-up" data-aos-delay="200">Rejecting standard dashboard noise for high-authority laboratory tools designed for cognitive focus.</p>
                </div>

                <div className='container pt-5'>
                    <div className='row g-4'>
                        {divContent.map((content, index) => (
                            <div className='col-12 col-md-4' key={content.title} data-aos="zoom-in" data-aos-delay={index * 200}>
                                <div className='p-4 rounded-4 h-100'
                                    onMouseEnter={() => setHoveredCard(index)}
                                    onMouseLeave={() => setHoveredCard(null)}
                                    style={{
                                        background: hoveredCard === index ? "#fff7ed" : "#ffffff",
                                        transition: "background-color 0.25s ease"
                                    }}
                                >
                                    <div style={{
                                        backgroundColor: "#f8f9fa", padding:
                                            "10px", width: "50px", borderRadius: "10px", marginBottom: "17px"
                                    }}>

                                        <svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 16 16"><path fill="#ab3500" fillRule="evenodd" d="M8 0a1 1 0 0 1 1 1v1.17c1.1.389 1.91 1.4 1.99 2.61l2.95 5.48a.5.5 0 0 1 .06.237v5a.5.5 0 0 1-.943.232l-4.13-7.88a3 3 0 0 1-1.86 0l-4.13 7.88a.5.5 0 0 1-.942-.232v-5a.5.5 0 0 1 .06-.237l2.95-5.48v.01a3.01 3.01 0 0 1 1.82-2.56l.167-.063V.997a1 1 0 0 1 1-1zM3 10.6v2.84l3.18-6.08a3 3 0 0 1-.871-1.06l-2.31 4.3zm7.69-4.3a3.06 3.06 0 0 1-.871 1.06l3.19 6.08V10.6l-2.31-4.3zM8 2.97a2 2 0 1 0-.001 4.001A2 2 0 0 0 8 2.97" clipRule="evenodd" /></svg>
                                    </div>
                                    <h4>{content.title}</h4>
                                    <p>{content.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-5" style={{ backgroundColor: "#ffffff" }} >
                <div className='container mx-auto text-center'>
                    <h2 style={{ color: "#0f172b" }} className="text-center fw-bolder" data-aos="fade-up">The Digital Lifecycle</h2>
                    <p className='fw-medium' data-aos="fade-up" data-aos-delay="200">Streamlining the transition from content creation to knowledge validation.</p>
                </div>

                <div className='container pt-5'>
                    <div className='row g-4'>
                        <div className='col-12 col-md-4 h-100' data-aos="slide-up" data-aos-delay="0">
                            <div className='p-4 rounded-4 h-100' style={{ backgroundColor: "#fff7ed" }}>
                                <div>
                                    <img src="https://i.pinimg.com/1200x/8e/1c/0f/8e1c0fd51f831e6cd499fdfb24585688.jpg" alt="" className='object-fit-cover w-100 h-75 rounded-4' />
                                </div>
                                <div className='mt-3'>
                                    <h4>Admin Configuration</h4>
                                    <p>Upload curriculum data and set proctoring parameters in seconds.</p>
                                </div>
                            </div>
                        </div>


                        <div className='col-12 col-md-4 h-100' data-aos="slide-up" data-aos-delay="200">
                            <div className='p-4 rounded-4 h-100' style={{ backgroundColor: "#fff7ed" }}>
                                <div style={{ height: "300px", overflow: "hidden", borderRadius: "16px", marginBottom: "12px" }}>
                                    <img src="https://i.pinimg.com/1200x/ff/4e/63/ff4e634f1fc5dfe0c573fc6e131957d3.jpg" alt="" className='object-fit-cover w-100 h-100' />
                                </div>
                                <div className='mt-3'>
                                    <h4>Student Deployment</h4>
                                    <p>Massive concurrent testing on any device with zero-lag synchronization.</p>
                                </div>
                            </div>
                        </div>

                        <div className='col-12 col-md-4 h-100' data-aos="slide-up" data-aos-delay="400">
                            <div className='p-4 rounded-4 h-100' style={{ backgroundColor: "#fff7ed" }}>
                                <img src="https://i.pinimg.com/736x/a2/2b/46/a22b46dde9b92371769bba261ee39c81.jpg" alt="" className='object-fit-cover w-100 h-75 rounded-4' />
                                <div className='mt-3'>
                                    <h4>Advanced Analytics</h4>
                                    <p>Generate insights from individual scores to institutional performance trends.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <footer className='py-5 text-white' style={{ background: "#ab3500" }}>
                <div className='container'>
                    <div className='row g-1'>
                        <div className='col-lg-3 col-md-4'>
                            <h5>CBT</h5>
                            <p>Curating high-stakes digital examinations with unmatched precision and military-grade security.</p>
                        </div>

                        <div className='col-lg-3 col-md-4 p-4'>
                            <span className='fw-bold' style={{ color: "white" }}>PLATFORM</span>
                            <li style={{ listStyle: "none", paddingTop: "15px", cursor: "pointer" }}>Documentation</li>
                            <li style={{ listStyle: "none", paddingTop: "15px", cursor: "pointer" }}>API Reference</li>
                            <li style={{ listStyle: "none", paddingTop: "15px", cursor: "pointer" }}>System Status</li>
                        </div>
                        <div className='col-lg-3 col-md-4 p-4'>
                            <span className='fw-bold' style={{ color: "white" }}>COMPANY</span>
                            <li style={{ listStyle: "none", paddingTop: "15px", cursor: "pointer" }}>About Us</li>
                            <li style={{ listStyle: "none", paddingTop: "15px", cursor: "pointer" }}>Contact</li>
                            <li style={{ listStyle: "none", paddingTop: "15px", cursor: "pointer" }}>Support</li>
                            <li style={{ listStyle: "none", paddingTop: "15px", cursor: "pointer" }}>Partnerships</li>
                        </div>
                        <div className='col-lg-3 col-md-4 p-4'>
                            <span className='fw-bold' style={{ color: "white" }}>LEGAL</span>
                            <li style={{ listStyle: "none", paddingTop: "15px", cursor: "pointer" }}>Privacy Policy </li>
                            <li style={{ listStyle: "none", paddingTop: "15px", cursor: "pointer" }}>Terms of Services</li>
                        </div>
                    </div>
                </div>
            </footer>
        </>
    )
}

export default LandingPage