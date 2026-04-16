import React, { useState } from 'react'
import { useFormik } from "formik"
import * as yup from "yup"

const SigninPage = () => {
    const [show, setShow] = useState(false)
    const handleClick = () => setShow(!show)

    const form = useFormik({
        initialValues: {
            email: "",
            password: ""
        },

        onSubmit: (values, { resetForm }) => {
            console.log(values);
            alert("Form Successfully Submitted")
            resetForm()
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
                        <div className='position-relative col-xl-6 col-lg-6 col-md-6 col-sm-12 d-none d-lg-block d-md-block vh-150 p-5 text-white' style={{ background: "#30329f" }}>
                            <h4 className='fw-bold mt-5'>THE ACADEMIC CURATOR</h4>
                            <div className=' mt-5 pt-5'>
                                <h1 className='fw-bold' style={{fontSize:"45px"}}>Standard Excellence for Every Scholar.</h1>
                                <p className='fw-medium fs-6'>Join our elite computer-based testing environment designed for high-density curriculum focus.</p>
                            </div>
                            <div className='position-absolute bottom-0'>
                                <p className=' w-75 fw-bold fs-6'>TRUSTED BY 12,000+ STUDENTS</p>
                            </div>
                        </div>

                        <div className='col-lg-6 col-md-6 bg-white p-5'>
                            <form class="row g-3" onSubmit={form.handleSubmit}>
                                <h4 className='fw-bold py-0'> Student Sign in</h4>
                                <p className='fw-medium'>Please enter your institutional credentials to begin.</p>

                                <div class="col-md-12 mt-4">
                                    <label for="fullname" class="form-label fw-medium" style={{ fontSize: "13px" }}>EMAIL</label>
                                    <input type="text" className="form form-control border-0 text-black rounded-0 py-3 shadow-none" style={{ backgroundColor: "#e1e3e4" }} value={form.values.email} name='email' onChange={form.handleChange} onBlur={form.handleBlur} id="userEmail" placeholder='a.dot@university.edu' />
                                    {form.touched.email && form.errors.email ? <p className='text-danger'>{form.errors.email}</p> : ""}
                                </div>

                                <div class="col-md-12 mt-4">
                                    <label for="fullname" class="form-label fw-medium" style={{ fontSize: "13px" }}>PASSWORD</label>
                                    <div className='input-group border border-0 border-dark shadow-none rounded-2'style={{ backgroundColor: "#e1e3e4", cursor: "pointer" }}>
                                        <input type={show ? "text": "password"} className="form form-control border-0 text-black rounded-0 py-3 shadow-none" style={{ backgroundColor: "#e1e3e4" }} name='password' value={form.values.password} onChange={form.handleChange} onBlur={form.handleBlur} id="userPassword" placeholder='Enter your password' />
                                        
                                        <p className='border-0 pt-3 outline-none fw-medium px-2' style={{ backgroundColor: "#e1e3e4", fontSize: "13px" }} onClick={handleClick}>{show ? "Hide" : "Show"} </p>
                                    </div>
                                        {form.touched.password && form.errors.password ? <p className='text-danger'>{form.errors.password}</p> : ""}
                                </div>

                                <div class="col-12">
                                    <button type="submit" class="btn w-100 py-2 text-white fs-6 fw-bold my-3" style={{ background: "#30329f" }}>Signin</button>
                                </div>
                                <a href="" className='text-decoration-none text-center text-black fw-medium'><p>Don't have an account ? </p></a>
                            </form>
                            <div class="col-12">
                                <button type="submit" class="btn w-100 py-2 text-black fs-6 fw-bold border border-dark border-1" >CREATE ACCOUNT </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default SigninPage