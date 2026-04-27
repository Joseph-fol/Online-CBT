import React, { useEffect, useState } from 'react'
import { useFormik } from "formik"
import * as yup from "yup"
import AOS from 'aos'
import 'aos/dist/aos.css'
import { Link, useNavigate } from 'react-router-dom'

const SigninPage = () => {
    const [show, setShow] = useState(false)
    const handleClick = () => setShow(!show)
    const navigate = useNavigate()

    useEffect(() => {
        AOS.init({
            duration: 2000,
            once: false,
            offset: 100,
            easing: 'ease-in-out',
            delay: 0
        })
    }, [])

    const form = useFormik({
        initialValues: {
            email: "",
            password: ""
        },

        onSubmit: (values, { resetForm }) => {
            console.log(values);
            alert("Signin Successful!")
            resetForm()
            navigate("/studentDashboard")
        },

        validationSchema: yup.object({
            email: yup.string().email("Invalid email").required("Email is required"),
            password: yup.string().min(8, 'Email must be at least 8 characters').required("Password is required")
        })
    })
    return (
        <>
            <div className='py-2' style={{ backgroundColor: "#f7f8f8" }}>
                <div className='container my-5'>
                    <div className='row g-5'>
                        <div className='position-relative col-xl-6 col-lg-6 col-md-6 col-sm-12 d-none d-lg-block d-md-block vh-150 p-5 text-white' style={{
                            background: "",
                            backgroundImage: "url('https://i.pinimg.com/736x/ac/43/ee/ac43ee0959ac1b13e3c4057e1cb0d54e.jpg')",
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            position: 'relative',
                            overflow: 'hidden'
                        }} data-aos="fade-right">
                            <div style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                background: '#0f172bc4',
                                zIndex: 0
                            }}></div>

                            <div style={{ position: 'relative', zIndex: 1 }}>
                                <h4 className='fw-bold mt-4' onClick={()=> navigate("/")} style={{cursor:"pointer"}} >Online CBT</h4>
                                <div className=' mt-5 pt-5'>
                                    <h1 className='fw-bold' style={{ fontSize: "45px" }}>Continue Your Path to Excellence.</h1>
                                    <p className='fw-medium fs-6'>Access your secure testing environment, review your performance analytics, and prepare for your next assessment.</p>
                                </div>
                                {/* <div className='position-absolute bottom-0'>
                                    <p className=' w-75 fw-bold fs-6'>TRUSTED BY 12,000+ STUDENTS</p>
                                </div> */}
                            </div>
                        </div>

                        <div className='col-lg-6 col-md-6 bg-white p-5' data-aos="fade-up">
                            <form class="row g-3" onSubmit={form.handleSubmit}>
                                <div className='d-flex justify-content-between'>
                                    <h4 className='fw-bold py-0'> Student Sign in</h4>
                                    <button onClick={() => navigate(-1)} className='btn'>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24"><path fill="#062164" d="M19 11H7.83l4.88-4.88c.39-.39.39-1.03 0-1.42a.996.996 0 0 0-1.41 0l-6.59 6.59a.996.996 0 0 0 0 1.41l6.59 6.59a.996.996 0 1 0 1.41-1.41L7.83 13H19c.55 0 1-.45 1-1s-.45-1-1-1" /></svg>
                                    </button>
                                </div>

                                <p className='fw-medium'>Please enter your institutional credentials to begin.</p>

                                <div class="col-md-12 mt-4">
                                    <label for="fullname" class="form-label fw-medium" style={{ fontSize: "13px" }}>EMAIL</label>
                                    <input type="text" className="form form-control border-0 text-black rounded-0 py-3 shadow-none" style={{ backgroundColor: "#e1e3e4" }} value={form.values.email} name='email' onChange={form.handleChange} onBlur={form.handleBlur} id="userEmail" placeholder='a.dot@university.edu' />
                                    {form.touched.email && form.errors.email ? <p className='text-danger'>{form.errors.email}</p> : ""}
                                </div>

                                <div class="col-md-12 mt-4">
                                    <label for="fullname" class="form-label fw-medium" style={{ fontSize: "13px" }}>PASSWORD</label>
                                    <div className='input-group border border-0 border-dark shadow-none rounded-2' style={{ backgroundColor: "#e1e3e4", cursor: "pointer" }}>
                                        <input type={show ? "text" : "password"} className="form form-control border-0 text-black rounded-0 py-3 shadow-none" style={{ backgroundColor: "#e1e3e4" }} name='password' value={form.values.password} onChange={form.handleChange} onBlur={form.handleBlur} id="userPassword" placeholder='Enter your password' />

                                        <p className='border-0 pt-3 outline-none fw-medium px-2' style={{ backgroundColor: "#e1e3e4", fontSize: "13px" }} onClick={handleClick}>{show ? "Hide" : "Show"} </p>
                                    </div>
                                    {form.touched.password && form.errors.password ? <p className='text-danger'>{form.errors.password}</p> : ""}
                                    <Link to="/forgotPassword">
                                        <a href="#" className='pt-2 fw-medium'>Forgot Password?</a>
                                    </Link>
                                </div>

                                <div class="col-12">
                                    <button type="submit" class="btn w-100 py-2 text-white fs-6 fw-bold my-3" style={{ background: "#ab3500" }}>Signin</button>
                                </div>
                                <a href="" className='text-decoration-none text-center text-black fw-medium'><p>Don't have an account ? </p></a>
                            </form>
                            <div class="col-12">
                                <Link to="/createStudentAccount">
                                    <button type="submit" class="btn w-100 py-2 text-black fs-6 fw-bold border border-dark border-1" >CREATE ACCOUNT </button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default SigninPage