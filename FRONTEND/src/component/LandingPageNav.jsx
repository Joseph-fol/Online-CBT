import React, { useEffect, useState } from 'react'
import './LandingPage.css'
import logo from '../assets/Online-cbt.jpg'
import { Link, useNavigate } from 'react-router-dom'

const LandingPageNav = () => {
    const navigate = useNavigate()

    const [isScrolled, setIsScrolled] = useState(false)
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

    return (
        <>
            <nav className="navbar navbar-expand-lg px-lg-5 px-md-4"
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
                    <a className="navbar-brand fw-bold" onClick={()=> navigate("/")} style={{ cursor: "pointer" }} ><img src={logo} alt="Online CBT Logo" width={30} /> Online CBT</a>
                    
                    <button className="navbar-toggler shadow-none border-0" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav me-auto gap-3 mb-2 mb-lg-0">

                            <li className="nav-item">
                                <a className="nav-link fw-medium text-black" onClick={()=> navigate("/")}>Home</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link fw-medium text-black" href="#">About Us</a>
                            </li>

                            <li className="nav-item">
                                <a className="nav-link fw-medium text-black" href='#'>Contact</a>
                            </li>


                            <li className="nav-item">
                                <a className="nav-link fw-medium text-black" href='#'>Support</a>
                            </li>
                        </ul>
                        <Link to="/admin/signin">
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
        </>
    )
}

export default LandingPageNav