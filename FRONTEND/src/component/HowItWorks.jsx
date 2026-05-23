import React, { useEffect } from 'react'
import LandingPageNav from './LandingPageNav'
import LandingPageFooter from './LandingPageFooter'
import AOS from 'aos'
import 'aos/dist/aos.css'
import './HowItWorks.css'

const HowItWorks = () => {
    useEffect(() => {
        AOS.init({
            duration: 1500,
            once: false,
            offset: 100,
            easing: 'ease-in-out',
        })
    }, [])

    return (
        <>
            <div className="how-it-works-wrapper">
                <LandingPageNav />

                <div className='py-5 text-center how-it-works-header'>
                    <div className='container p-4 w-lg-25 w-md-50 mx-auto' data-aos="fade-up">
                        <h1 className='fw-bold'>How Online CBT works</h1>
                        <p className='fs-6'>Online CBT provides a powerful, intuitive environment for computer-based testing, bridging the gap between <br /> complex administration and seamless student evaluation.</p>
                    </div>
                </div>

                <div className='px-4 pb-5'>
                    <div className="d-flex flex-column flex-md-row align-items-center gap-4 position-relative">
                        <div className="flex-fill w-100 p-md-4" data-aos="fade-right">
                            <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuCtFH1xuar4QlogLYOBAQYkOe4Im6F6Mk9iHKfz3q1hIqNS5lfofcLgErNqtaQQePo0AWhKqipbYtYVORQzY-D_2I1k7jpcsu7UwHFmEaIhtmFx8MGmlU2nXblOCywL0w8kG1i0jP6-OKRjS-_zzgM5bTP2c2tfOLPkciBNkebuBOYOIMKFTox_6nWYMQpLxjr-Mn1nJOo6Ouug9nagkgA-I2DoSTNoEM0kblwbk90-idcjPeODnCdyHLzZO5lgrmWYzIKshH57L7xx" className="w-100 rounded-4" alt="..." />
                        </div>
                        <div className="flex-fill w-100 p-4 ps-md-0" data-aos="fade-left" data-aos-delay="200">
                            <h3 className="mt-0 text-justify">Seamlessly Manage Exams</h3>
                            <p>Administrators can easily create subjects, upload question banks and monitor student progress in real-time through our high-density dashboard. Every metric is at your fingertips for informed academic oversight.</p>
                        </div>
                    </div>
                    
                    <div className="d-flex flex-column flex-md-row align-items-center gap-4 position-relative mt-4">
                        <div className="flex-fill w-100 p-4 ps-md-0" data-aos="fade-right" data-aos-delay="200">
                            <h3 className="mt-0">Focused Testing Environment</h3>
                            <p>Students enjoy a distraction-free examination experience with a clear interface, countdown timers, and instant performance history tracking. Our 3D-optimized SaaS architecture ensures zero-lag responses during critical exam windows..</p>
                        </div>
                        <div className="flex-fill w-100 p-md-4" data-aos="fade-left">
                            <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuBUQ6LjRBelSM5m7fltnCEW1bIekyjWKylOLGysvZo3-zmjQ0aNUpDBuUKKPehcSQ49Yofy4HRkq6m65aeZ_0WELINp-mjt9VcK3FyrRw6YsZUS7VQZAfhLUwnXUJ1pMpqV9iCSVZBPAVHoF9HS-XjEpCMS9h7p28i2xAnuucN_XJYmJQgwh9j3gVEEy0pOp90WSj6NgNjUIiJ-6C8-dJbupn4jfou_5SK2b3dkjBvu_ll29m3bITWc1JR31Q25IClUHHIEQgCCidrj" className="w-100 rounded-4" alt="..." />
                        </div>
                    </div>
                </div>
            </div>

            <LandingPageFooter />
        </>
    )
}

export default HowItWorks