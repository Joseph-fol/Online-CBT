import React, { useEffect, useState } from 'react'
import { useFormik } from "formik"
import * as yup from "yup"
import AOS from 'aos'
import 'aos/dist/aos.css'
import { Link, useNavigate } from 'react-router-dom'
import axios from "axios"
import { setToken } from '../utils/auth'

const SignupPage = () => {
    const [show, setShow] = useState(false)
    const handleClick = () => setShow(!show)
    const [loading, setLoading] = useState(false)
    const [emailError, setEmailError] = useState("")
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
            fullName: "",
            email: "",
            password: ""
        },

        onSubmit: (values, { resetForm }) => {
            setLoading(true)
            setEmailError("")
            axios.post("https://online-cbt.onrender.com/user/signUp", values)
            .then((response)=>{
                setLoading(false)
                // Store token if provided
                if (response.data.token) {
                    setToken(response.data.token)
                }
                alert("Form Successfully Submitted")
                resetForm()
                navigate("/studentSignin")
            })
            .catch((err) =>{
                setLoading(false)
                console.log("Error response:", err.response)
                console.log("Full error:", err)
                
                const errorData = err.response?.data
                const errorMessage = errorData?.message || err.message || ""
                const statusCode = err.response?.status
                
                // Check for duplicate email error in various formats
                const isDuplicateEmail = 
                    errorMessage.toLowerCase().includes("email") || 
                    errorMessage.toLowerCase().includes("already exists") ||
                    errorMessage.toLowerCase().includes("already registered") ||
                    statusCode === 409 || // Conflict status code
                    errorData?.error?.toLowerCase().includes("email") ||
                    (errorData?.errors && errorData.errors.email)
                
                if(isDuplicateEmail) {
                    setEmailError("This email already exists. Please use a different email.")
                    alert("This email already exists. Please use a different email.")
                } else {
                    alert("Signup failed, please try again")
                }
            })
        },

        validationSchema: yup.object({
            fullName: yup.string().required("Fullname is required"),
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
                            background: "#101275",
                            backgroundImage: "url('https://i.pinimg.com/736x/a5/23/1c/a5231cf966f71cd13cbd68bb6859bdfe.jpg')",
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
                                background: '#0f172bda',
                                zIndex: 0
                            }}></div>

                            <div style={{ position: 'relative', zIndex: 1 }}>
                                <h4 className='fw-bold mt-5'>Online CBT</h4>
                                <div className=' mt-5 pt-5'>
                                    <h1 className='fw-bold' style={{ fontSize: "45px" }}>Standard Excellence for Every Scholar.</h1>
                                    <p className='fw-medium fs-5'>Join our elite computer-based testing environment designed for high-density curriculum focus.</p>
                                </div>
                                <div className='position-relative bottom-0 mt-5 pt-5'>
                                    <p className='  fw-bold'>TRUSTED BY 12,000+ STUDENTS</p>
                                </div>
                            </div>
                        </div>

                        <div className='col-lg-6 col-md-6 bg-white p-5' data-aos="fade-up">
                            
                            <form class="row g-3" onSubmit={form.handleSubmit}>
                                <div className='d-flex justify-content-between'>
                                    <h4 className='fw-bold py-0'>Create Student Account</h4>
                                    <Link>
                                        <button className='btn' onClick={()=> navigate(-1)}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24"><path fill="#062164" d="M19 11H7.83l4.88-4.88c.39-.39.39-1.03 0-1.42a.996.996 0 0 0-1.41 0l-6.59 6.59a.996.996 0 0 0 0 1.41l6.59 6.59a.996.996 0 1 0 1.41-1.41L7.83 13H19c.55 0 1-.45 1-1s-.45-1-1-1" /></svg>
                                        </button>
                                    </Link>
                                </div>

                                <p className='fw-medium'>Please enter your institutional credentials to begin.</p>

                                <div class="col-md-12">
                                    <label for="fullname" class="form-label fw-medium" style={{ fontSize: "13px" }}>FULL NAME</label>

                                    <input type="text" name='fullName' className="form form-control border-0 text-black rounded-0 py-3 shadow-none" style={{ backgroundColor: "#e1e3e4" }} value={form.values.fullName} onChange={form.handleChange} onBlur={form.handleBlur} id="userFullName" placeholder='Enter your fullname' />
                                    {form.touched.fullName ? <p className='text-danger'>{form.errors.fullName}</p> : ""}
                                </div>

                                <div class="col-md-12 mt-4">
                                    <label for="fullname" class="form-label fw-medium" style={{ fontSize: "13px" }}>INSTITUTIONAL EMAIL</label>
                                    <input type="text" className="form form-control border-0 text-black rounded-0 py-3 shadow-none" style={{ backgroundColor: "#e1e3e4" }} value={form.values.email} name='email' onChange={form.handleChange} onBlur={form.handleBlur} id="userEmail" placeholder='a.dot@university.edu' />
                                    {form.touched.email && form.errors.email ? <p className='text-danger'>{form.errors.email}</p> : ""}
                                    {emailError ? <p className='text-danger'>{emailError}</p> : ""}
                                </div>

                                <div class="col-md-12 mt-4">
                                    <label for="fullname" class="form-label fw-medium" style={{ fontSize: "13px" }}>PASSWORD</label>
                                    <div className='input-group border border-0 border-dark bg-white shadow-none rounded-2'>
                                        <input type={show ? "text" : "password"} className="form form-control border-0 text-black rounded-0 py-3 shadow-none" style={{ backgroundColor: "#e1e3e4" }} name='password' value={form.values.password} onChange={form.handleChange} onBlur={form.handleBlur} id="userPassword" placeholder='Enter your password' />

                                        <div className='border-0 fw-medium px-2 pt-3' style={{ backgroundColor: "#e1e3e4", fontSize: "13px", cursor: "pointer" }} onClick={handleClick}>{show ? "Hide" : "Show"} </div>
                                    </div>
                                    {form.touched.password && form.errors.password ? <p className='text-danger'>{form.errors.password}</p> : ""}
                                </div>

                                <div class="col-12">
                                    <button type="submit" class="btn w-100 py-2 text-white fs-6 fw-bold my-3" style={{ background: "#ab3500" }}>{loading ? "Signing up...." : "Signup"}</button>
                                </div>

                                <span className='text-decoration-none text-center text-black fw-medium d-block'><p>Already have an account ? </p></span>
                            </form>
                            <div class="col-12">
                                <Link to="/studentSignin">
                                    <button class="btn w-100 py-2 text-black fs-6 fw-bold border border-dark border-1" >SIGN IN TO PORTAL </button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default SignupPage