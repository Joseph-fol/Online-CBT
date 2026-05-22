import React from 'react'
import { Link } from 'react-router-dom'

const LandingPageFooter = () => {
    return (
        <>
            {/* Footer Section */}
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
                            <Link to="/terms-and-policy" style={{ textDecoration: "none", color: "inherit" }}>
                                <li style={{ listStyle: "none", paddingTop: "15px", cursor: "pointer" }}>Privacy Policy </li>
                            </Link>

                            <li style={{ listStyle: "none", paddingTop: "15px", cursor: "pointer" }}>Terms of Services</li>

                        </div>
                    </div>
                </div>
            </footer>
        </>
    )
}

export default LandingPageFooter