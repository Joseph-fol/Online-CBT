import React, { useEffect, useState } from 'react'
import { useFormik } from "formik"
import * as yup from "yup"
import AOS from 'aos'
import 'aos/dist/aos.css'
import { Link, useNavigate } from 'react-router-dom'
import axios from "axios"

const AdminSignup = () => {
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
            password: "",
            adminCode: ""
        },

        onSubmit: (values, { resetForm }) => {
            setLoading(true)
            setEmailError("")
            axios.post("http://localhost:2114/user/admin/signUp", values)
            .then((response)=>{
                setLoading(false)
                if (response.data.admin) {
                    localStorage.setItem("adminData", JSON.stringify(response.data.admin))
                }
                alert("Admin Account Successfully Created! Please sign in.")
                resetForm()
                navigate("/admin/signin")
            })
            .catch((err) =>{
                setLoading(false)
                console.log("Error response:", err.response)
                console.log("Full error:", err)
                
                const errorData = err.response?.data
                const errorMessage = errorData?.message || err.message || ""
                const statusCode = err.response?.status
                
                // Check for invalid admin code error
                const isInvalidCode = 
                    statusCode === 403 ||
                    errorMessage.toLowerCase().includes("admin registration code")
                
                // Check for duplicate email error in various formats
                const isDuplicateEmail = 
                    errorMessage.toLowerCase().includes("email") || 
                    errorMessage.toLowerCase().includes("already exists") ||
                    errorMessage.toLowerCase().includes("already registered") ||
                    statusCode === 409 || // Conflict status code
                    errorData?.error?.toLowerCase().includes("email") ||
                    (errorData?.errors && errorData.errors.email)
                
                if(isInvalidCode) {
                    alert("Invalid admin registration code. Please check and try again.")
                } else if(isDuplicateEmail) {
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
            password: yup.string().min(8, 'Password must be at least 8 characters').required("Password is required"),
            adminCode: yup.string().required("Admin code is required").min(6, "Admin code is invalid")
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
                                <h4 className='fw-bold mt-4' onClick={()=> navigate("/")} style={{cursor:"pointer"}}> Online CBT</h4>
                                <div className='mt-5 pt-5'>
                                    <h1 className='fw-bold' style={{ fontSize: "45px" }}>Orchestrate Academic Excellence.</h1>
                                    <p className='fw-medium fs-6'>Manage dynamic question banks, deploy tamper-proof assessments, and generate real-time performance analytics from your centralized command center.</p>
                                </div>
                            </div>
                        </div>

                        <div className='col-lg-6 col-md-6 bg-white p-5' data-aos="fade-up">
                            <form className="row g-3" onSubmit={form.handleSubmit}>
                                <div className='d-flex justify-content-between'>
                                    <h4 className='fw-bold py-0'>Create Admin Account</h4>
                                    <Link>
                                        <button type="button" className='btn' onClick={()=> navigate(-1)}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24"><path fill="#062164" d="M19 11H7.83l4.88-4.88c.39-.39.39-1.03 0-1.42a.996.996 0 0 0-1.41 0l-6.59 6.59a.996.996 0 0 0 0 1.41l6.59 6.59a.996.996 0 1 0 1.41-1.41L7.83 13H19c.55 0 1-.45 1-1s-.45-1-1-1" /></svg>
                                        </button>
                                    </Link>
                                </div>

                                <p className='fw-medium'>Please enter your admin credentials to create your account.</p>

                                <div className="col-md-12">
                                    <label htmlFor="fullname" className="form-label fw-medium" style={{ fontSize: "13px" }}>FULL NAME</label>

                                    <input type="text" name='fullName' className="form form-control border-0 text-black rounded-0 py-3 shadow-none" style={{ backgroundColor: "#e1e3e4" }} value={form.values.fullName} onChange={form.handleChange} onBlur={form.handleBlur} id="adminFullName" placeholder='Enter your fullname' />
                                    {form.touched.fullName ? <p className='text-danger'>{form.errors.fullName}</p> : ""}
                                </div>

                                <div className="col-md-12 mt-4">
                                    <label htmlFor="email" className="form-label fw-medium" style={{ fontSize: "13px" }}>EMAIL</label>
                                    <input type="text" className="form form-control border-0 text-black rounded-0 py-3 shadow-none" style={{ backgroundColor: "#e1e3e4" }} value={form.values.email} name='email' onChange={form.handleChange} onBlur={form.handleBlur} id="adminEmail" placeholder='admin@university.edu' />
                                    {form.touched.email && form.errors.email ? <p className='text-danger'>{form.errors.email}</p> : ""}
                                    {emailError ? <p className='text-danger'>{emailError}</p> : ""}
                                </div>

                                <div className="col-md-12 mt-4">
                                    <label htmlFor="password" className="form-label fw-medium" style={{ fontSize: "13px" }}>PASSWORD</label>
                                    <div className='input-group border border-0 border-dark bg-white shadow-none rounded-2'>
                                        <input type={show ? "text" : "password"} className="form form-control border-0 text-black rounded-0 py-3 shadow-none" style={{ backgroundColor: "#e1e3e4" }} name='password' value={form.values.password} onChange={form.handleChange} onBlur={form.handleBlur} id="adminPassword" placeholder='Enter your password' />

                                        <div className='border-0 fw-medium px-2 pt-3' style={{ backgroundColor: "#e1e3e4", fontSize: "13px", cursor: "pointer" }} onClick={handleClick}>{show ? "Hide" : "Show"} </div>
                                    </div>
                                    {form.touched.password && form.errors.password ? <p className='text-danger'>{form.errors.password}</p> : ""}
                                </div>

                                <div className="col-md-12 mt-4">
                                    <label htmlFor="adminCode" className="form-label fw-medium" style={{ fontSize: "13px" }}>ADMIN CODE</label>
                                    <input type="password" className="form form-control border-0 text-black rounded-0 py-3 shadow-none" style={{ backgroundColor: "#e1e3e4" }} value={form.values.adminCode} name='adminCode' onChange={form.handleChange} onBlur={form.handleBlur} id="adminCode" placeholder='Enter admin registration code' />
                                    {form.touched.adminCode && form.errors.adminCode ? <p className='text-danger'>{form.errors.adminCode}</p> : ""}
                                </div>

                                <div className="col-12">
                                    <button type="submit" className="btn w-100 py-2 text-white fs-6 fw-bold my-3" style={{ background: "#ab3500" }}>{loading ? "Creating account..." : "Create Admin Account"}</button>
                                </div>

                                <p className='text-decoration-none text-center text-black fw-medium'>Already have an account?</p>
                            </form>

                            <div className="col-12">
                                <Link to="/admin/signin">
                                    <button className="btn w-100 py-2 text-black fs-6 fw-bold border border-dark border-1"> SIGN IN TO ADMIN PORTAL </button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default AdminSignup
