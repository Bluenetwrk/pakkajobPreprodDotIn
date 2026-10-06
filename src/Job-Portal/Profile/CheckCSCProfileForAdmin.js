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


function CheckCSCProfileForAdmin() {
  let navigate = useNavigate()

  useEffect(() => {
    let adminLogin = localStorage.getItem("AdMLog")
    if (!adminLogin) {
      navigate("/")
    }
  }, [])

  const [profileData, setProfileData] = useState([])
  const [PageLoader, setPageLoader] = useState(false)
  const screenSize = useScreenSize();

  const [message, setmessage] = useState("")
  const [limit, setLimit] = useState()
  
    let handleSetLimit = async (id)=>{
      if(!limit)return
      const response = await axios.put("/CSRoute/setDowloadResumeLimit", {
         limit, id
       })
       .then((res)=>{
         if(res.data=="updated succesfull"){
          getProfile()
         }
  
       })
  
    }

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
    await axios.get(`/CSRoute/viewProfile/${params.CP}`, { headers })
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
      <h1 style={{margin:'auto', textAlign: "center"}}>CSC Profile</h1>

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
          <th>Total Resume Printed</th>
          <td>{item.pdfDownloadCount}</td>
        </tr>

        <tr>
          <th>Limit</th>
          <td>{item.Limit}</td>
        </tr>

        <tr>
          <th>Set Limit</th>
          <td>
            <input
                  type="number"
                  className={styles.limitInput}
                  placeholder="Enter limit"
                  onChange={(e) => setLimit(e.target.value)}
                />
            
                <button
                  className={styles.limitButton}
                  onClick={() => handleSetLimit(item._id)}
                >
                  Set Limit
                </button>

          </td>

        </tr>

        <tr>
          <th>Status</th>
          <td>Status</td>

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

      </tbody>
    </table>
  ))}
</div>
        

    </>
  )
}

export default CheckCSCProfileForAdmin