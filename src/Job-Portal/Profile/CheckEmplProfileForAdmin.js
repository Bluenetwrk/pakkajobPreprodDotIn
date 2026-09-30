import React from 'react'
import axios from 'axios'
import { useEffect, useState } from 'react'
// import styles from "./StudentProfile.module.css"
import styles from "./checkStuProfileAdmin.module.css"

import { Link, useNavigate, useLocation, useParams } from "react-router-dom";
import profileDp from "../img/user_3177440.png"
import Swal from "sweetalert2";
import { Puff } from  'react-loader-spinner'
import useScreenSize from '../SizeHook';
import Arrowimage from '../img/icons8-arrow-left-48.png'


function CheckEmpProfileForAdmin() {
    useEffect(()=>{
        let adminLogin= localStorage.getItem("AdMLog")
            if(!adminLogin){
                navigate("/")
            }
        },[])
    
    let navigate= useNavigate()
    const [profileData, setProfileData] = useState([])
const [PageLoader, setPageLoader] = useState(false)
const screenSize = useScreenSize();
const [message, setmessage] = useState("")
    
    async function sendMessage(id){
      await axios.put(`/EmpProfile/sendMessage/${id}`, {message})
      .then((res)=>{
        if(res.data){
        alert("Message Sent Successfully")
        }
      }).catch((err)=>{
        alert("some thing went wrong")
      })
    }

    let studId = JSON.parse(localStorage.getItem("StudId"))
    let params =useParams()

    async function getProfile() {
  setPageLoader(true)
  const headers = { authorization: 'BlueItImpulseWalkinIn'};
        await axios.get(`/EmpProfile/getProfile/${params.CP}`,{headers})
            .then((res) => {
                let result = res.data.result
                // console.log(result)
                setProfileData([result])
  setPageLoader(false)

            }).catch((err) => {
            alert("some thing went wrong")
            })
    }

    useEffect(() => {
        getProfile()
    }, [])

    
    function Reject(Empid , status){
      const isReject=status
      Swal.fire({
        title: "Are You sure?",
        width:"245",
      position:"top",
      customClass:{
        popup:"alertIcon"
      },
        icon:"question",
        showCancelButton:true
      }).then( async (res)=>{
        if(res.isConfirmed){
          await axios.put(`/EmpProfile/isReject/${Empid}`,{isReject})
          .then((res)=>{
              getProfile()
  
          }).catch((err)=>{
            alert("backend error occured")
          })
        }
      })
    }    
  
    function unReject(Empid , status){
      const isReject=status
  
      Swal.fire({
        title: "Are You sure?",
        // icon:"question",
        width:"245",
      position:"top",
      customClass:{
        popup:"alertIcon"
      },
        showCancelButton:true
      }).then( async (res)=>{
        if(res.isConfirmed){
          await axios.put(`/EmpProfile/isReject/${Empid}`,{isReject})
          .then((res)=>{
              getProfile()
  
          }).catch((err)=>{
            alert("backend error occured")
          })
        }
      })
    }

    function Approve(Empid , status){
        const isApproved=status
        Swal.fire({
          title: "Are You sure ?",
          // icon:"question",
          width:"245",
      position:"top",
      customClass:{
        popup:"alertIcon"
      },
          showCancelButton:true
        }).then( async (res)=>{
          if(res.isConfirmed){
            await axios.put(`/EmpProfile/setApproval/${Empid}`,{isApproved})
            .then((res)=>{
                getProfile()
    
            }).catch((err)=>{
              alert("backend error occured")
            })
          }
        })
      }    
    
      function DisApprove(Empid , status){
        const isApproved=status
    
        Swal.fire({
          title: "Are You sure?",
          width:"245",
      position:"top",
      customClass:{
        popup:"alertIcon"
      },
          // icon:"question",
          showCancelButton:true
        }).then( async (res)=>{
          if(res.isConfirmed){
            await axios.put(`/EmpProfile/setApproval/${Empid}`,{isApproved})
            .then((res)=>{
                getProfile()
    
            }).catch((err)=>{
              alert("backend error occured")
            })
          }
        })
      }
    
      async function DeleteEmpProfile(id) {
        Swal.fire({
          title: 'Are you sure to Delete this Account?',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
          if (result.isConfirmed) {
            axios.delete(`/EmpProfile/deleteEmployee/${id}`)
              .then((res) => {
                
                navigate("/BIAddmin@AllEmployees")
              }).catch((err) => {
            
    
                alert("server error occured")
              })
          }
        })
    
      }


    return (
        <>
                                <img style={{ height:"25px", color:"grey", marginTop:"20px", marginLeft:"8%", cursor:"pointer",
             width:"28px"}} onClick={()=>{navigate(-1)}}  src={Arrowimage} />

{

profileData.map((item, i) => {
    return (
        <div key={i}>
        <img className={styles.imageV} src={item.image?item.image : profileDp}/>
        
        </div>
    )

})
    }

            
                                         {PageLoader?
 <Puff  height="90"  width="90"  color="#4fa94d"  ariaLabel="bars-loading"  wrapperStyle={{marginLeft:"45%", marginTop:"60px"}}/> 
     :""
  }
{screenSize.width>850?

           
<div className={styles.uiwrapper}>

  {profileData.map((item, i) => (
    <table className={styles.profileTable} key={i}>
      <tbody>

        <tr>
          <th>Name</th>
          <td>
            {item.name || <span className={styles.Nli}>Not Updated</span>}
          </td>
        </tr>

        <tr>
          <th>Email Address</th>
          <td>
            {item.email || <span className={styles.Nli}>Not Updated</span>}
          </td>
        </tr>

        <tr>
          <th>Phone Number</th>
          <td>
            {item.phoneNumber || <span className={styles.Nli}>Not Updated</span>}
          </td>
        </tr>

        <tr>
          <th>Aadhar</th>
          <td>
            {item.Aadhar || <span className={styles.Nli}>Not Updated</span>}
          </td>
        </tr>

        <tr>
          <th>Pan Card</th>
          <td>
            {item.panCard || <span className={styles.Nli}>Not Updated</span>}
          </td>
        </tr>

        <tr>
          <th>Company Name</th>
          <td>
            {item.CompanyName || <span className={styles.Nli}>Not Updated</span>}
          </td>
        </tr>

        <tr>
          <th>Company Address</th>
          <td>
            {item.CompanyAddress || <span className={styles.Nli}>Not Updated</span>}
          </td>
        </tr>

        <tr>
          <th>Company Contact</th>
          <td>
            {item.CompanyContact || <span className={styles.Nli}>Not Updated</span>}
          </td>
        </tr>

        <tr>
          <th>Company Email</th>
          <td>
            {item.CompanyEmail || <span className={styles.Nli}>Not Updated</span>}
          </td>
        </tr>

        <tr>
          <th>Company Website</th>
          <td>
            {item.CompanyWebsite || <span className={styles.Nli}>Not Updated</span>}
          </td>
        </tr>

        <tr>
          <th>Company GSTIN</th>
          <td>
            {item.CompanyGSTIN || <span className={styles.Nli}>Not Updated</span>}
          </td>
        </tr>

        <tr>
          <th>Type of Organisation</th>
          <td>
            {item.TypeofOrganisation || (
              <span className={styles.Nli}>Not Updated</span>
            )}
          </td>
        </tr>

        <tr>
          <th>Ip Address</th>
          <td>
            {item.ipAddress || (
              <span className={styles.Nli}>
                could not fetch the Ip Address
              </span>
            )}
          </td>
        </tr>

        <tr>
          <th>Status</th>
          <td className={styles.Approval}>

            {item.isApproved ? (
              <button
                className={styles.Approved}
                onClick={() => DisApprove(item._id, false)}
              >
                Approved &#10004;
              </button>
            ) : item.isReject ? (
              <button
                className={styles.Rejected}
                onClick={() => unReject(item._id, false)}
              >
                Rejected &#10004;
              </button>
            ) : (
              <>
                <button
                  className={styles.Approve}
                  onClick={() => Approve(item._id, true)}
                >
                  Approve
                </button>

                <button
                  className={styles.Approve}
                  onClick={() => Reject(item._id, true)}
                >
                  Reject
                </button>
              </>
            )}

          </td>
        </tr>

        <tr>
          <th>Message</th>
          <td>
            <input
              className={styles.messageInput}
              value={message}
              onChange={(e) => setmessage(e.target.value)}
            />

            <button
              className={styles.sendButton}
              onClick={() => sendMessage(item._id)}
            >
              Send
            </button>
          </td>
        </tr>

      </tbody>
    </table>
  ))}

</div>
            :
            <>
            <div id={styles.JobCardWrapper} >

{profileData.map((job, i) => {
    return (
        <>
<div className={styles.JobCard} key={job._id || i}>

  {/* ================= HEADER ================= */}
  <div className={styles.CardHeader}>

    <div className={styles.ProfileInfo}>

      {/* <div className={styles.ProfileAvatar}>
        {job.name ? job.name.charAt(0).toUpperCase() : "C"}
      </div> */}

      <div>
        <h3>{job.name || "Unknown User"}</h3>
        <p>Company / Employer Profile</p>
      </div>

    </div>

    <div className={styles.StatusContainer}>

      {job.isApproved ? (
        <span className={`${styles.StatusBadge} ${styles.StatusApproved}`}>
          ● Approved
        </span>
      ) : job.isReject ? (
        <span className={`${styles.StatusBadge} ${styles.StatusRejected}`}>
          ● Rejected
        </span>
      ) : (
        <span className={`${styles.StatusBadge} ${styles.StatusPending}`}>
          ● Pending
        </span>
      )}

    </div>

  </div>


  {/* ================= PERSONAL INFORMATION ================= */}
  <div className={styles.Section}>

    <div className={styles.SectionTitle}>
      <span>👤</span>
      Personal Information
    </div>

    <div className={styles.DetailsGrid}>

      <div className={styles.DetailItem}>
        <span className={styles.Label}>Name</span>
        <span className={job.name ? styles.Value : styles.NotUpdated}>
          {job.name || "Not updated"}
        </span>
      </div>


      <div className={styles.DetailItem}>
        <span className={styles.Label}>Email ID</span>
        <span className={job.email ? styles.Value : styles.NotUpdated}>
          {job.email || "Not updated"}
        </span>
      </div>


      <div className={styles.DetailItem}>
        <span className={styles.Label}>Phone Number</span>
        <span className={job.phoneNumber ? styles.Value : styles.NotUpdated}>
          {job.phoneNumber || "Not updated"}
        </span>
      </div>


      <div className={styles.DetailItem}>
        <span className={styles.Label}>Aadhar ID</span>
        <span className={job.Aadhar ? styles.Value : styles.NotUpdated}>
          {job.Aadhar || "Not updated"}
        </span>
      </div>


      <div className={styles.DetailItem}>
        <span className={styles.Label}>PAN Card</span>
        <span className={job.panCard ? styles.Value : styles.NotUpdated}>
          {job.panCard || "Not updated"}
        </span>
      </div>


      <div className={styles.DetailItem}>
        <span className={styles.Label}>IP Address</span>
        <span className={job.ipAddress ? styles.Value : styles.NotUpdated}>
          {job.ipAddress || "Could not fetch IP Address"}
        </span>
      </div>

    </div>

  </div>


  {/* ================= COMPANY INFORMATION ================= */}
  <div className={styles.Section}>

    <div className={styles.SectionTitle}>
      <span>🏢</span>
      Company Information
    </div>


    <div className={styles.DetailsGrid}>

      <div className={styles.DetailItem}>
        <span className={styles.Label}>Company Name</span>
        <span className={job.CompanyName ? styles.Value : styles.NotUpdated}>
          {job.CompanyName || "Not updated"}
        </span>
      </div>


      <div className={styles.DetailItem}>
        <span className={styles.Label}>Company Contact</span>
        <span className={job.CompanyContact ? styles.Value : styles.NotUpdated}>
          {job.CompanyContact || "Not updated"}
        </span>
      </div>


      <div className={styles.DetailItem}>
        <span className={styles.Label}>Company Email</span>
        <span className={job.CompanyEmail ? styles.Value : styles.NotUpdated}>
          {job.CompanyEmail || "Not updated"}
        </span>
      </div>


      <div className={styles.DetailItem}>
        <span className={styles.Label}>Company GSTIN</span>
        <span className={job.CompanyGSTIN ? styles.Value : styles.NotUpdated}>
          {job.CompanyGSTIN || "Not updated"}
        </span>
      </div>


      <div className={styles.DetailItem}>
        <span className={styles.Label}>Organisation Type</span>
        <span
          className={
            job.TypeofOrganisation
              ? styles.Value
              : styles.NotUpdated
          }
        >
          {job.TypeofOrganisation || "Not updated"}
        </span>
      </div>


      <div className={styles.DetailItem}>
        <span className={styles.Label}>Company Website</span>

        {job.CompanyWebsite ? (
          <a
            href={
              job.CompanyWebsite.startsWith("http")
                ? job.CompanyWebsite
                : `https://${job.CompanyWebsite}`
            }
            target="_blank"
            rel="noopener noreferrer"
            className={styles.WebsiteLink}
          >
            {job.CompanyWebsite}
          </a>
        ) : (
          <span className={styles.NotUpdated}>
            Not updated
          </span>
        )}

      </div>

    </div>


    {/* ================= COMPANY ADDRESS ================= */}

    <div className={styles.SkillsBox}>

      <span className={styles.Label}>
        Company Address
      </span>

      <div className={styles.AddressValue}>
        {job.CompanyAddress ? (
          <span className={styles.Value}>
            {job.CompanyAddress}
          </span>
        ) : (
          <span className={styles.NotUpdated}>
            Not updated
          </span>
        )}
      </div>

    </div>

  </div>


  {/* ================= ACCOUNT ACTIONS ================= */}
  <div className={styles.ActionSection}>

    <div className={styles.SectionTitle}>
      <span>⚙️</span>
      Account Actions
    </div>


    <div className={styles.ActionButtons}>

      {job.isApproved ? (

        <button
          className={styles.Approved}
          onClick={() => DisApprove(job._id, false)}
        >
          ✓ Approved
        </button>

      ) : (

        <button
          className={styles.Approve}
          onClick={() => Approve(job._id, true)}
        >
          ✓ Approve
        </button>

      )}


      {job.isReject ? (

        <button
          className={styles.Rejected}
          onClick={() => unReject(job._id, false)}
        >
          ✕ Rejected
        </button>

      ) : (

        <button
          className={styles.Reject}
          onClick={() => Reject(job._id, true)}
        >
          ✕ Reject
        </button>

      )}

    </div>

  </div>


  {/* ================= MESSAGE ================= */}
  {/* <div className={styles.MessageSection}>

    <div className={styles.MessageTitle}>
      Send Message
    </div>

    <div className={styles.MessageBox}>

      <input
        type="text"
        placeholder="Enter message for company..."
        value={message}
        onChange={(e) => setmessage(e.target.value)}
      />

      <button
        onClick={() => sendMessage(job._id)}
      >
        Send
      </button>

    </div>

  </div> */}

</div>
        </>
    )
})}

</div>
   
            </>

          }

        </>
    )
}

export default CheckEmpProfileForAdmin