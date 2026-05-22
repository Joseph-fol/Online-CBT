import React, { useState, useEffect } from 'react'
import AOS from 'aos'
import 'aos/dist/aos.css'
import './LandingPage.css'
import logo from '../assets/Online-cbt.jpg'
import { Link } from 'react-router-dom'
import LandingPageNav from './LandingPageNav'
import LandingPageFooter from './LandingPageFooter'

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
            <LandingPageNav />

            {/* Watermark Logo */}
            <div className='watermark-logo'>
                <img src="src/assets/Online-cbt.jpg" alt="watermark"
                    style={{
                        width: '300px',
                        height: 'auto',
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

                        <Link to="/how-it-works">
                            <button className='btn fw-medium' data-aos="slide-right" data-aos-delay="600">See how it works </button>
                        </Link>
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
                                    <img src="https://i.pinimg.com/1200x/8e/1c/0f/8e1c0fd51f831e6cd499fdfb24585688.jpg" title="Admin Configuration" alt="" className='object-fit-cover w-100 h-75 rounded-4' />
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
                                    <img src="https://i.pinimg.com/1200x/ff/4e/63/ff4e634f1fc5dfe0c573fc6e131957d3.jpg" title='Student Deployment' alt="" className='object-fit-cover w-100 h-100' />
                                </div>
                                <div className='mt-3'>
                                    <h4>Student Deployment</h4>
                                    <p>Massive concurrent testing on any device with zero-lag synchronization.</p>
                                </div>
                            </div>
                        </div>

                        <div className='col-12 col-md-4 h-100' data-aos="slide-up" data-aos-delay="400">
                            <div className='p-4 rounded-4 h-100' style={{ backgroundColor: "#fff7ed" }}>
                                <img src="https://i.pinimg.com/736x/a2/2b/46/a22b46dde9b92371769bba261ee39c81.jpg" title="Advanced Analytics" alt="" className='object-fit-cover w-100 h-75 rounded-4' />
                                <div className='mt-3'>
                                    <h4>Advanced Analytics</h4>
                                    <p>Generate insights from individual scores to institutional performance trends.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            
            <LandingPageFooter/>
        </>
    )
}

export default LandingPage