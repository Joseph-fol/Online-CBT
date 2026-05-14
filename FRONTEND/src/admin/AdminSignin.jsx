import React, { useEffect, useState } from 'react'
import { useFormik } from "formik"
import * as yup from "yup"
import AOS from 'aos'
import 'aos/dist/aos.css'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'

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
            
            axios.post("http://localhost:2114/user/admin/signin", {
                email: values.email,
                password: values.password
            })

            .then((response) => {
                const data = response.data

                // Check if user has admin role
                if (data.admin && data.admin.role === "admin") {
                    console.log("Admin signin successful", data.admin)

                    // Store admin info in localStorage
                    localStorage.setItem("adminData", JSON.stringify(data.admin))
                    
                    setLoading(false)
                    resetForm()
                    alert(`Welcome back, ${data.admin.fullName}!`)
                    navigate("/admin")
                } else {
                    setError("You do not have admin privileges")
                    setLoading(false)
                }
            })
            .catch((err) => {
                console.error("Error during signin:", err)
                setLoading(false)
                
                const errorMessage = err.response?.data?.message || "An error occurred. Please try again."
                
                // Provide specific error messages
                if (errorMessage.toLowerCase().includes("admin not found")) {
                    setError("No admin account found with this email. Please check your credentials or create an admin account.")
                } else if (errorMessage.toLowerCase().includes("invalid password")) {
                    setError("Invalid password. Please try again.")
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
                                <h4 className='fw-bold mt-4' onClick={()=> navigate("/")} style={{cursor:"pointer"}}>Online CBT</h4>
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
                                    <Link to="/">
                                    <button type="button" className='btn'>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24"><path fill="#0f172b" d="M19 11H7.83l4.88-4.88c.39-.39.39-1.03 0-1.42a.996.996 0 0 0-1.41 0l-6.59 6.59a.996.996 0 0 0 0 1.41l6.59 6.59a.996.996 0 1 0 1.41-1.41L7.83 13H19c.55 0 1-.45 1-1s-.45-1-1-1" /></svg>
                                    </button>
                                    </Link>
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
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default AdminSignin