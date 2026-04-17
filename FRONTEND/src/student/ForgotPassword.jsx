import React, { useEffect, useState } from 'react'
import { useFormik } from "formik"
import * as yup from "yup"
import AOS from 'aos'
import 'aos/dist/aos.css'
import { Link } from 'react-router-dom'

const ForgotPassword = () => {
    const [show, setShow] = useState(false)
    const handleClick = () => setShow(!show)

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
        },

        onSubmit: (values, { resetForm }) => {
            console.log(values);
            alert("Recovery Link sent")
            resetForm()
        },

        validationSchema: yup.object({
            email: yup.string().email("Invalid email").required("Email is required"),
        })
    })
    return (
        <>
            <div className='py-5' style={{ backgroundColor: "#f8f9fa" }}>
                <div className='container my-5'>
                    <div className='row g-5'>
                        <div className='col-lg-6 col-md-6 bg-white p-5' data-aos="fade-up">
                            <form class="row g-3" onSubmit={form.handleSubmit}>
                                <h4 className='fw-bold py-0'> Forgot Access</h4>
                                <p className='fw-medium'>Please provide your institutional credentials to initiate the verification process.</p>

                                <div class="col-md-12 mt-4">
                                    <label for="fullname" class="form-label fw-medium" style={{ fontSize: "13px" }}>INSTITUTIONAL EMAIL</label>
                                    <input type="text" className="form form-control border-0 text-black rounded-0 py-3 shadow-none" style={{ backgroundColor: "#e1e3e4" }} value={form.values.email} name='email' onChange={form.handleChange} onBlur={form.handleBlur} id="userEmail" placeholder='a.dot@university.edu' />
                                    {form.touched.email && form.errors.email ? <p className='text-danger'>{form.errors.email}</p> : ""}
                                </div>

                                <div class="col-12">
                                    <button type="submit" class="btn w-100 py-2 text-white fs-6 fw-bold my-3 shadow-sm" style={{ background: "#30329f" }}>Send Recovery Link</button>
                                </div>
                            </form>
                            <div class="col-12">
                                <Link to="/studentSignin">
                                    <button type="submit" class="btn w-100 py-2 text-black fs-6 fw-bold border border-dark border-1">BACK TO LOGIN </button>
                                </Link>
                            </div>
                        </div>

                        <div className='position-relative col-xl-6 col-lg-6 col-md-6 col-sm-12 d-none d-lg-block d-md-block vh-150 p-5' style={{ backgroundColor: "#f3f4f5" }} data-aos="slide-left" data-aos-delay="0">
                            <h4 className='fw-bold 'style={{ color: "#30329f" }}>CBT</h4>
                            <div className=' mt-5 pt-5 pb-5'>
                                <h1 className='fw-bold text-black' style={{ fontSize: "45px" }}>Restore your <span style={{ color: "#30329f" }}>access</span> to excellence.</h1>
                                <p className='fw-medium fs-6'>Secure, institutional recovery for The Academic Curator's global research and examination network.</p>
                            </div>
                            <div className='position-absolute bottom-0'>
                                <p className=' w-75 fw-bold fs-6'>TRUSTED BY 12,000+ STUDENTS</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ForgotPassword