import React, { useEffect, useState } from 'react'
import { useFormik } from "formik"
import * as yup from "yup"
import AOS from 'aos'
import 'aos/dist/aos.css'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { showSuccess, showError } from '../utils/toastUtils'
import { setToken } from '../utils/auth'
import API_BASE_URL from '../utils/api.config'

const AdminSignin = () => {
    const [show, setShow] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
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
            setLoading(true)
            setError("")

            axios.post(`${API_BASE_URL}/user/admin/signin`, {
                email: values.email,
                password: values.password
            })

                .then((response) => {
                    const data = response.data

                    // Check if user has admin role
                    if (data.admin && data.admin.role === "admin") {
                        console.log("Admin signin successful", data.admin)

                        // Store token in localStorage
                        if (data.token) {
                            setToken(data.token)
                            console.log("Token stored in localStorage")
                        }

                        // Store admin info in localStorage
                        localStorage.setItem("adminData", JSON.stringify(data.admin))

                        setLoading(false)
                        resetForm()
                        showSuccess(`Welcome back, ${data.admin.fullName}!`)
                        setTimeout(() => navigate("/admin"), 1500)
                    } else {
                        setError("You do not have admin privileges")
                        setLoading(false)
                    }
                })
                .catch((err) => {
                    console.error("Error during signin:", err)
                    console.error("Error response:", err.response?.data)
                    console.error("Error status:", err.response?.status)
                    setLoading(false)

                    const errorData = err.response?.data
                    const errorMessage = errorData?.message || "An error occurred. Please try again."
                    const errorDetails = errorData?.error || errorData?.details

                    console.log("Final error message:", errorMessage)
                    console.log("Error details:", errorDetails)

                    // Provide specific error messages
                    if (errorMessage.toLowerCase().includes("admin not found")) {
                        setError("No admin account found with this email. Please check your credentials or create an admin account.")
                    } else if (errorMessage.toLowerCase().includes("invalid password")) {
                        setError("Invalid password. Please try again.")
                    } else if (err.response?.status === 500) {
                        setError(`Server error: ${errorMessage}. ${errorDetails ? '(' + errorDetails + ')' : 'Please contact support.'}`)
                    } else {
                        setError(errorMessage)
                    }
                })
        },

        validationSchema: yup.object({
            email: yup.string().email("Invalid email").required("Email is required"),
            password: yup.string().min(8, 'Password must be at least 8 characters').required("Password is required")
        })
    })
    return (
        <>
            <div className='py-2' style={{ backgroundColor: "#f7f8f8" }}>
                <div className='container my-5'>
                    <div className='row g-5'>
                        <div className='position-relative col-xl-6 col-lg-6 col-md-6 col-sm-12 d-none d-lg-block d-md-block vh-150 p-5 text-white' style={{
                            background: "#0f172bc4",
                            backgroundImage: "url('https://i.pinimg.com/236x/b3/1b/79/b31b795a1109c73f147236ea2e73e1a8.jpg')",
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
                                <h4 className='fw-bold mt-4' onClick={() => navigate("/")} style={{ cursor: "pointer" }}>Online CBT</h4>
                                <div className=' mt-5 pt-5'>
                                    <h1 className='fw-bold' style={{ fontSize: "45px" }}>Orchestrate Academic Excellence.</h1>
                                    <p className='fw-medium fs-6'>Manage dynamic question banks, deploy tamper-proof assessments, and generate real-time performance analytics from your centralized command center.</p>
                                </div>
                                <div className='bottom-0 mt-5'>
                                    <p className=' w-75 fw-bold fs-6'>TRUSTED BY 12,000+ STUDENTS</p>
                                </div>
                            </div>
                        </div>

                        <div className='col-lg-6 col-md-6 bg-white p-5' data-aos="fade-up">
                            {error && (
                                <div className="alert alert-danger alert-dismissible fade show" role="alert">
                                    {error}
                                    <button type="button" className="btn-close" onClick={() => setError("")}></button>
                                </div>
                            )}
                            <form class="row g-3" onSubmit={form.handleSubmit}>
                                <div className='d-flex justify-content-between'>
                                    <h4 className='fw-bold py-0'> Admin Sign in</h4>
                                    <button type="button" className='btn' onClick={() => navigate("/")}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24"><path fill="#0f172b" d="M19 11H7.83l4.88-4.88c.39-.39.39-1.03 0-1.42a.996.996 0 0 0-1.41 0l-6.59 6.59a.996.996 0 0 0 0 1.41l6.59 6.59a.996.996 0 1 0 1.41-1.41L7.83 13H19c.55 0 1-.45 1-1s-.45-1-1-1" /></svg>
                                    </button>
                                </div>

                                <p className='fw-medium'>Please enter your admin credentials.</p>
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
                                </div>

                                <div class="col-12">
                                    <button type="submit" disabled={loading} class="btn w-100 py-2 text-white fs-6 fw-bold my-3" style={{ backgroundColor: "#ab3500" }}>
                                        {loading ? "Signing in..." : "Signin"}
                                    </button>
                                </div>

                                <div>
                                    <p className='fw-medium text-center'>Don't have an admin account?</p>
                                    <Link to="/admin/signUp">
                                        <button type="submit" class="btn w-100 py-2 text-black fs-6 fw-bold border border-dark border-1" >CREATE ADMIN ACCOUNT </button>
                                    </Link>
                                </div>

                                <div>
                                    <p className='fw-medium lh-0'>Just want to look around? Test the platform instantly without signing up.</p>
                                    <div className='fw-medium text-left'>Use 
                                        <p className='d-flex align-items-center gap-2 mb-1'>
                                            Email: <span className='fw-bold'>admin@demo.com</span>
                                            <button type="button" className="btn btn-sm btn-light p-1 d-flex align-items-center" onClick={() => {
                                                navigator.clipboard.writeText('admin@demo.com');
                                                showSuccess('Email copied!');
                                            }} title="Copy Email">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="1.2em" height="1.2em" viewBox="0 0 24 24"><path fill="currentColor" d="M19 21H8V7h11m0-2H8a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2m-3-4H4a2 2 0 0 0-2 2v14h2V3h12z"/></svg>
                                            </button>
                                        </p>
                                        <p className='d-flex align-items-center gap-2 mb-1'>
                                            Password: <span className='fw-bold'>admin1234</span>
                                            <button type="button" className="btn btn-sm btn-light p-1 d-flex align-items-center" onClick={() => {
                                                navigator.clipboard.writeText('admin1234');
                                                showSuccess('Password copied!');
                                            }} title="Copy Password">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="1.2em" height="1.2em" viewBox="0 0 24 24"><path fill="currentColor" d="M19 21H8V7h11m0-2H8a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2m-3-4H4a2 2 0 0 0-2 2v14h2V3h12z"/></svg>
                                            </button>
                                        </p>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default AdminSignin