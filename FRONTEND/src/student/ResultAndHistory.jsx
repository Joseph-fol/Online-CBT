import React from 'react'
import Navbar from '../component/Navbar'

const ResultAndHistory = () => {
    return (
        <>
            <Navbar />
            <div className='mx-auto' style={{ backgroundColor: "#f8f9fa" }}>
                <div className='col-lg-8 col-md-10 mx-auto pt-5 container' >
                    <div className='bg-white' style={{ borderTop: "4px solid #463bdc", borderRadius:"5px" }}>
                        <div className='mx-auto mt-5 alert alert-success' style={{
                            padding: "10px", width: "59px", borderRadius: "10px",
                        }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="2.5em" height="2.5em" viewBox="0 0 48 48"><g fill="none" stroke="#0b581d" stroke-linecap="round" stroke-linejoin="round" stroke-width="4"><path d="m24 4l5.253 3.832l6.503-.012l1.997 6.188l5.268 3.812L41 24l2.021 6.18l-5.268 3.812l-1.997 6.188l-6.503-.012L24 44l-5.253-3.832l-6.503.012l-1.997-6.188l-5.268-3.812L7 24l-2.021-6.18l5.268-3.812l1.997-6.188l6.503.012z" /><path d="m17 24l5 5l10-10" /></g></svg>
                        </div>

                        <div className='px-5 py-4 text-center'>
                            <h3 className='fw-semibold '>Test Successfully Submitted</h3>
                            <p>Your performance has been evaluated and recorded</p>
                            <p className='text-center fw-bold'>FINAL SCORE</p>
                            <h1 className='fw-bold text-success' style={{ fontSize: "70px" }}>85%</h1>
                            
                            <div className='row g-1 my-3'>
                                <div className='col-6'>
                                    <button className='btn w-100 py-2 text-white fw-bold' style={{backgroundColor: "#473bdd"}}>Download Report</button> 
                                </div>
                                <div className='col-6'>
                                    <button className='w-100 bg-white btn fw-bold' style={{color: "#473bdd"}}>Review Answer</button> 
                                </div>
                                
                            </div>
                        </div>
                    </div>
                </div>

                <div className='container col-lg-8 col-md-10 py-4'>
                    <div className='d-flex justify-content-between'>
                        <h5 className='fs-5'>Recent Activity History </h5>
                        <p className='fs-6'>LAST 30 DAYS</p>
                    </div>

                    <table class="table table-hover table-light">
                        <thead>
                            <tr>
                                <th scope="col">DATE TAKEN</th>
                                <th scope="col">SUBJECT</th>
                                <th scope="col">SCORE</th>
                                <th scope="col">STATUS</th>
                            </tr>
                        </thead>

                        <tbody>
                            <tr>
                                <th scope="row" className='fw-medium'>Oct 24, 2026</th>
                                <td>
                                    <span className='fw-bold'>Advanced Macroeconomics</span><br />
                                    <span className='fs-6'>Module 4: Global Markets</span>
                                </td>
                                <td className='fw-medium'>85%</td>
                                <td className='text-success'>Pass</td>
                            </tr>
                            <tr>
                                <th scope="row" className='fw-medium'>Oct 24, 2026</th>
                                <td>
                                    <span className='fw-bold'>Advanced Macroeconomics</span><br />
                                    <span className='fs-6'>Module 4: Global Markets</span>
                                </td>
                                <td className='fw-medium'>85%</td>
                                <td className='text-success'>Pass</td>
                            </tr>
                            <tr>
                                <th scope="row" className='fw-medium'>Oct 24, 2026</th>
                                <td>
                                    <span className='fw-bold'>Advanced Macroeconomics</span><br />
                                    <span className='fs-6'>Module 4: Global Markets</span>
                                </td>
                                <td className='fw-medium'>85%</td>
                                <td className='text-success'>Pass</td>
                            </tr>
                            <tr>
                                <th scope="row" className='fw-medium'>Oct 24, 2026</th>
                                <td>
                                    <span className='fw-bold'>Advanced Macroeconomics</span><br />
                                    <span className='fs-6'>Module 4: Global Markets</span>
                                </td>
                                <td className='fw-medium'>85%</td>
                                <td className='text-success'>Pass</td>
                            </tr>
                            
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    )
}

export default ResultAndHistory