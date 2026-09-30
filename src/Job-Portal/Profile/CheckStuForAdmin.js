import React from 'react'
import axios from 'axios'
import { useEffect, useState } from 'react'
// import styles from "./StudentProfile.module.css"
import styles from "./checkStuProfileAdmin.module.css"

import { Link, useNavigate, useLocation, useParams } from "react-router-dom";
import profileDp from "../img/user_3177440.png";
import Swal from "sweetalert2";
import { Puff } from 'react-loader-spinner'
import useScreenSize from '../SizeHook';
import Arrowimage from '../img/icons8-arrow-left-48.png'


function CheckStudentProfileForAdmin() {
  let navigate = useNavigate()

  useEffect(() => {
    let adminLogin = localStorage.getItem("AdMLog")
    if (!adminLogin) {
      navigate("/")
    }
  }, [])

  const [profileData, setProfileData] = useState([])
  console.log(profileData)
  const [PageLoader, setPageLoader] = useState(false)
  const screenSize = useScreenSize();

  const [message, setmessage] = useState("")

  function Reject(Empid, status) {
    const isReject = status
    Swal.fire({
      title: "Are You sure?",
      // icon:"question",
      width: "245",
      position: "top",
      customClass: {
        popup: "alertIcon"
      },
      showCancelButton: true
    }).then(async (res) => {
      if (res.isConfirmed) {
        await axios.put(`/StudentProfile/isReject/${Empid}`, { isReject })
          .then((res) => {
            getProfile()

          }).catch((err) => {
            alert("backend error occured")
          })
      }
    })
  }

  function unReject(Empid, status) {
    const isReject = status

    Swal.fire({
      title: "Are You sure ?",
      // icon:"question",
      width: "245",
      position: "top",
      customClass: {
        popup: "alertIcon"
      },
      showCancelButton: true
    }).then(async (res) => {
      if (res.isConfirmed) {
        await axios.put(`/StudentProfile/isReject/${Empid}`, { isReject })
          .then((res) => {
            getProfile()

          }).catch((err) => {
            alert("backend error occured")
          })
      }
    })
  }




  async function sendMessage(id) {
    await axios.put(`/StudentProfile/sendMessage/${id}`, { message })
      .then((res) => {
        if (res.data) {
          alert("Message Sent Successfully")
        }
      }).catch((err) => {
        alert("some thing went wrong")
      })
  }

  let studId = JSON.parse(localStorage.getItem("StudId"))
  let params = useParams()

  async function getProfile() {
    setPageLoader(true)
    let userid = atob(JSON.parse(localStorage.getItem("IdLog")))
    const headers = { authorization: userid + " " + atob(JSON.parse(localStorage.getItem("AdMLog"))) };
    await axios.get(`/StudentProfile/viewProfile/${params.CP}`, { headers })
      .then((res) => {
        let result = res.data.result
        setProfileData([result])
        setPageLoader(false)

      }).catch((err) => {

        alert("some thing went wrong")
      })
  }

  useEffect(() => {
    getProfile()
  }, [])

  function Approve(Empid, status) {
    const isApproved = status
    Swal.fire({
      title: "Are You sure?",
      // icon:"question",
      width: "245",
      position: "top",
      customClass: {
        popup: "alertIcon"
      },
      showCancelButton: true
    }).then(async (res) => {
      if (res.isConfirmed) {
        await axios.put(`/StudentProfile/setApproval/${Empid}`, { isApproved })
          .then((res) => {
            getProfile()

          }).catch((err) => {
            alert("backend error occured")
          })
      }
    })

  }

  function DisApprove(Empid, status) {
    const isApproved = status
    Swal.fire({
      title: "Are You sure?",
      // icon:"question",
      width: "245",
      position: "top",
      customClass: {
        popup: "alertIcon"
      },
      showCancelButton: true
    }).then(async (res) => {
      if (res.isConfirmed) {
        await axios.put(`/StudentProfile/setApproval/${Empid}`, { isApproved })
          .then((res) => {
            getProfile()

          }).catch((err) => {
            alert("backend error occured")
          })
      }
    })
  }

  async function DeleteProfile(id) {

    Swal.fire({
      title: 'Are you sure?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        axios.delete(`/StudentProfile/deleteProfile/${id}`)
          .then((res) => {

            navigate("/BIAddmin@AllJobSeekers")
          }).catch((err) => {

            alert("server error occured")
          })
      }
    })
  }



  return (
    <>

      <img style={{
        height: "25px", color: "grey", marginTop: "20px", marginLeft: "8%", cursor: "pointer",
        width: "28px"
      }} onClick={() => { navigate(-1) }} src={Arrowimage} />

      {

        profileData.map((item, i) => {
          return (
            <div key={i}>
              <img className={styles.imageV} src={item.Gpicture ? item.Gpicture : profileDp} />

            </div>
          )

        })
      }
      {PageLoader ?
        <Puff height="90" width="90" color="#4fa94d" ariaLabel="bars-loading" wrapperStyle={{ marginLeft: "45%", marginTop: "60px" }} />
        : ""
      }

      {screenSize.width > 850 ?

        <div className={styles.uiwrapper}>
  {profileData.map((item, i) => (
    <table className={styles.profileTable} key={i}>
      <tbody>

        <tr>
          <th>Name</th>
          <td>{item.name || <span className={styles.Nli}>Not Updated</span>}</td>
        </tr>

        <tr>
          <th>Email Address</th>
          <td>{item.email || <span className={styles.Nli}>Not Updated</span>}</td>
        </tr>

        <tr>
          <th>Phone Number</th>
          <td>{item.phoneNumber || <span className={styles.Nli}>Not Updated</span>}</td>
        </tr>

        <tr>
          <th>Aadhar</th>
          <td>{item.Aadhar || <span className={styles.Nli}>Not Updated</span>}</td>
        </tr>

        <tr>
          <th>Pan Card</th>
          <td>{item.panCard || <span className={styles.Nli}>Not Updated</span>}</td>
        </tr>

        <tr>
          <th>Age</th>
          <td>{item.age || <span className={styles.Nli}>Not Updated</span>}</td>
        </tr>

        <tr>
          <th>Notice Period</th>
          <td>{item.NoticePeriod || <span className={styles.Nli}>Not Updated</span>}</td>
        </tr>

        <tr>
          <th>Expected Salary</th>
          <td>{item.ExpectedSalary || <span className={styles.Nli}>Not Updated</span>}</td>
        </tr>

        <tr>
          <th>Current CTC</th>
          <td>{item.currentCTC || <span className={styles.Nli}>Not Updated</span>}</td>
        </tr>

        <tr>
          <th>Qualification</th>
          <td>{item.Qualification || <span className={styles.Nli}>Not Updated</span>}</td>
        </tr>

        <tr>
          <th>Skills</th>
          <td>{item.Skills || <span className={styles.Nli}>Not Updated</span>}</td>
        </tr>

        <tr>
          <th>Experience</th>
          <td>{item.Experiance || <span className={styles.Nli}>Not Updated</span>}</td>
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
<div id={styles.JobCardWrapper}>
  {profileData.map((job, i) => (
    <div className={styles.JobCard} key={job._id || i}>

      {/* ================= HEADER ================= */}
      <div className={styles.CardHeader}>
        <div className={styles.ProfileInfo}>
          {/* <div className={styles.ProfileAvatar}>
            {job.name ? job.name.charAt(0).toUpperCase() : "U"}
          </div> */}

          <div>
            <h3>{job.name || "Unknown User"}</h3>
            <p>Candidate Profile</p>
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


      {/* ================= PERSONAL DETAILS ================= */}
      <div className={styles.Section}>

        <div className={styles.SectionTitle}>
          <span>👤</span>
          Personal Information
        </div>

        <div className={styles.DetailsGrid}>

          <div className={styles.DetailItem}>
            <span className={styles.Label}>Name</span>
            <span className={styles.Value}>
              {job.name || "Not updated"}
            </span>
          </div>

          <div className={styles.DetailItem}>
            <span className={styles.Label}>Age</span>
            <span className={job.age ? styles.Value : styles.NotUpdated}>
              {job.age || "Not updated"}
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


      {/* ================= PROFESSIONAL DETAILS ================= */}
      <div className={styles.Section}>

        <div className={styles.SectionTitle}>
          <span>💼</span>
          Professional Information
        </div>

        <div className={styles.DetailsGrid}>

          <div className={styles.DetailItem}>
            <span className={styles.Label}>Notice Period</span>
            <span className={job.NoticePeriod ? styles.Value : styles.NotUpdated}>
              {job.NoticePeriod || "Not updated"}
            </span>
          </div>

          <div className={styles.DetailItem}>
            <span className={styles.Label}>Qualification</span>
            <span className={job.Qualification ? styles.Value : styles.NotUpdated}>
              {job.Qualification || "Not updated"}
            </span>
          </div>

          <div className={styles.DetailItem}>
            <span className={styles.Label}>Experience</span>
            <span className={job.Experiance ? styles.Value : styles.NotUpdated}>
              {job.Experiance || "Not updated"}
            </span>
          </div>

          <div className={styles.DetailItem}>
            <span className={styles.Label}>Current CTC</span>
            <span className={job.currentCTC ? styles.Value : styles.NotUpdated}>
              {job.currentCTC || "Not updated"}
            </span>
          </div>

          <div className={styles.DetailItem}>
            <span className={styles.Label}>Expected CTC</span>
            <span className={job.ExpectedSalary ? styles.Value : styles.NotUpdated}>
              {job.ExpectedSalary || "Not updated"}
            </span>
          </div>

        </div>


        {/* Skills */}
        <div className={styles.SkillsBox}>
          <span className={styles.Label}>Skills</span>

          {job.Skills ? (
            <div className={styles.SkillList}>
              {String(job.Skills)
                .split(",")
                .map((skill, index) => (
                  <span className={styles.SkillTag} key={index}>
                    {skill.trim()}
                  </span>
                ))}
            </div>
          ) : (
            <span className={styles.NotUpdated}>
              Not updated
            </span>
          )}
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
          className={styles.inputBox}
            type="text"
            placeholder="Enter message for candidate..."
            value={message}
            onChange={(e) => setmessage(e.target.value)}
          />

          <button onClick={() => sendMessage(job._id)}>
            Send
          </button>
        </div> 

       </div> */}

    </div>
  ))}
</div>
        </>

      }

    </>
  )
}

export default CheckStudentProfileForAdmin