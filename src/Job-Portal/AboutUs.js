import React from 'react'
import Footer from './Footer/Footer'
import useScreenSize from './SizeHook';


function AboutUs() {
  const screenSize = useScreenSize();

  return (
    <>
      <div style={{ marginLeft: "10px" }}>
        <h2 style={{ marginLeft: "2px", fontWeight: "800", marginTop: "5px" }}>About Us</h2>
        <div style={{ width: "93%" }}>
          <p><strong>PakkaJob.com</strong> is a Bangalore-based job portal connecting people with employment opportunities across industries.</p>

          <h3>For Employers</h3>
          <p>Pakka Job helps companies connect with skilled and verified candidates, making it easier to find the right people for the right roles.</p>

          <h3>For Manpower Consultants</h3>
          <p>We streamline candidate discovery and walk-in interview coordination, helping consultants deliver hiring results faster for their clients.</p>

          <h3>For Jobseekers</h3>
          <p>Pakka Job connects jobseekers with employers across industries and helps make their next career move smoother and smarter.</p>
        </div>
      </div>

      {screenSize.width <= 750 && <Footer />}
    </>
  )
}

export default AboutUs
