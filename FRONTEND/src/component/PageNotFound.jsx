import React from 'react'
import { useNavigate, Link } from 'react-router-dom'
import SvgComponent from './SvgComponent'

const PageNotFound = () => {
  const navigate = useNavigate()

  return (
    <>
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      
      <button onClick={() => navigate(-1)} style={{background:"#0f172b", color:"white", fontWeight:"bold", borderRadius:"10px", padding:"5px 40px"}}>
        Go Back
      </button>

      <div>
        <SvgComponent/>
      </div>
    </div>
    </>
  )
}

export default PageNotFound