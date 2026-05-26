import React, { useEffect, useState } from 'react'
import { useFormik } from "formik"
import * as yup from "yup"
import AOS from 'aos'
import 'aos/dist/aos.css'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import axios from "axios"
import { showSuccess, showError, showErrorModal } from '../utils/toastUtils'
import API_BASE_URL from '../utils/api.config'

const AdminSignup = () => {
    const [show, setShow] = useState(false)
    const handleClick = () => setShow(!show)
    const [loading, setLoading] = useState(false)
    const [emailError, setEmailError] = useState("")
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const invitationToken = searchParams.get('token')

    useEffect(() => {
        AOS.init({
            duration: 2000,
            once: false,
            offset: 100,
            easing: 'ease-in-out',
            delay: 0
        })

        // Validate invitation token if provided
        if (invitationToken) {
            axios.get(`${API_BASE_URL}/user/admin/validate-invitation?token=${invitationToken}`)
                .then((response) => {
                    console.log("Invitation valid:", response.data)
                })

                .catch((err) => {
                    console.error("Invalid invitation:", err.response?.data?.message)
                    showErrorModal("Invalid Invitation", "This invitation link is invalid or has expired. Please get a new invitation from an admin.")
                    setTimeout(() => navigate("/"), 2000)
                })
        } else {
            showErrorModal("No Invitation", "Please use an invitation link to sign up as admin.")
            setTimeout(() => navigate("/"), 2000)
        }
    }, [invitationToken, navigate])

    const form = useFormik({
        initialValues: {
            fullName: "",
            email: "",
            password: "",
            invitationToken: invitationToken || ""
        },

        onSubmit: (values, { resetForm }) => {
            if (!invitationToken) {
                showError("Invalid invitation. Please use the invitation link.")
                return
            }

            setLoading(true)
            setEmailError("")

            axios.post(`${API_BASE_URL}/user/admin/signUp`, {
                fullName: values.fullName,
                email: values.email,
                password: values.password,
                invitationToken: invitationToken
            })

                .then((response) => {
                    setLoading(false)
                    if (response.data.admin) {
                        localStorage.setItem("adminData", JSON.stringify(response.data.admin))
                    }

                    showSuccess("Admin account created successfully! Redirecting to sign in...")
                    resetForm()
                    setTimeout(() => navigate("/admin/signin"), 2000)
                })

                .catch((err) => {
                    setLoading(false)
                    console.log("Error response:", err.response)
                    console.log("Full error:", err)

                    const errorData = err.response?.data
                    const errorMessage = errorData?.message || err.message || ""
                    const statusCode = err.response?.status

                    // Check for invalid/expired invitation error
                    const isInvalidInvitation =
                        statusCode === 403 ||
                        errorMessage.toLowerCase().includes("invitation")

                    // Check for duplicate email error in various formats
                    const isDuplicateEmail =
                        errorMessage.toLowerCase().includes("email") ||
                        errorMessage.toLowerCase().includes("already exists") ||
                        errorMessage.toLowerCase().includes("already registered") ||
                        statusCode === 409 || // Conflict status code
                        errorData?.error?.toLowerCase().includes("email") ||
                        (errorData?.errors && errorData.errors.email)

                    if (isInvalidInvitation) {
                        showError("Invalid or expired invitation. Please get a new invitation link from an admin.")
                    } else if (isDuplicateEmail) {
                        setEmailError("This email already exists. Please use a different email.")
                        showError("This email already exists. Please use a different email.")
                    } else {
                        showError("Signup failed. Please try again.")
                    }
                })
        },

        validationSchema: yup.object({
            fullName: yup.string().required("Fullname is required"),
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
                                <h4 className='fw-bold mt-4' onClick={() => navigate("/")} style={{ cursor: "pointer" }}> Online CBT</h4>
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
                                    <button type="button" className='btn' onClick={() => navigate(-1)}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24"><path fill="#062164" d="M19 11H7.83l4.88-4.88c.39-.39.39-1.03 0-1.42a.996.996 0 0 0-1.41 0l-6.59 6.59a.996.996 0 0 0 0 1.41l6.59 6.59a.996.996 0 1 0 1.41-1.41L7.83 13H19c.55 0 1-.45 1-1s-.45-1-1-1" /></svg>
                                    </button>
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

                                        <div className='border-0 fw-medium px-2 pt-3' style={{ backgroundColor: "#e1e3e4", fontSize: "13px", cursor: "pointer" }} onClick={handleClick}>
                                            {show ? "Hide" : "Show"}
                                        </div>
                                    </div>
                                    {form.touched.password && form.errors.password ? <p className='text-danger'>{form.errors.password}</p> : ""}
                                </div>

                                <div className="col-12">
                                    <button type="submit" className="btn w-100 py-2 text-white fs-6 fw-bold my-3" style={{ background: "#ab3500" }}>{loading ? "Creating account..." : "Create Admin Account"}</button>
                                </div>

                                <p className='text-decoration-none text-center text-black fw-medium'>Already have an admin account?</p>
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
