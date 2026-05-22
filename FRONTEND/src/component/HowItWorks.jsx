import React from 'react'
import LandingPageNav from './LandingPageNav'
import LandingPageFooter from './LandingPageFooter'
import './HowItWorks.css'

const HowItWorks = () => {
    return (
        <>
            <div className="how-it-works-wrapper">
            <LandingPageNav />

            <div className='py-5 text-center how-it-works-header'>
                <div className='container w-50 mx-auto'>
                    <h1 className='fw-bold'>How Online CBT works</h1>
                    <p className='fs-5'>Online CBT provides a powerful, intuitive environment for computer-based testing, bridging the gap between complex administration and seamless student evaluation.</p>
                </div>
            </div>
            </div>
            <LandingPageFooter/>
        </>
    )
}

export default HowItWorks