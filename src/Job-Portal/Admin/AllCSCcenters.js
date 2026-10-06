import React from 'react'
import { useEffect, useState } from 'react'
import styles from "./AllJobSeekers.module.css"
import Swal from "sweetalert2";
import axios from "axios";
import { Link, useNavigate, BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import useScreenSize from '../SizeHook';

// const [PageLoader, setPageLoader] = useState(false)
// import { Puff } from 'react-loader-spinner'


function AllCSCAdmin() {
  let navigate = useNavigate()

  useEffect(() => {
    let adminLogin = localStorage.getItem("SupAdMLog")
    if (!adminLogin) {
      navigate("/")
    }
  }, [])


  const [jobSeekers, setjobSeekers] = useState([])
  const [Result, setResult] = useState(false)
  const screenSize = useScreenSize();

  const [message, setmessage] = useState("")
  const [currentBox, setcurrentBox] = useState("")
  const [limit, setLimit] = useState()

  let handleSetLimit = async (id)=>{
    if(!limit)return
    const response = await axios.put("/CSRoute/setDowloadResumeLimit", {
       limit, id
     })
     .then((res)=>{
       if(res.data=="updated succesfull"){
        getAllJobSeekers()
       }

     })

  }

  // =========================
  // PAGINATION
  // =========================

  const [totalCount, settotalCount] = useState(0)

  const [nopageFilter, setNoPageFilter] = useState(false)

  let recordsperpage = JSON.parse(
    sessionStorage.getItem("recordsperpageSerachCand")
  )

  const [currentPage, setCurrentPage] = useState(1)

  const [recordsPerPage, setrecordsPerPage] = useState(
    recordsperpage ? recordsperpage : 10
  )

  const lastIndex = currentPage * recordsPerPage
  const firstIndex = lastIndex - recordsPerPage

  const npage = Math.ceil(totalCount / recordsPerPage)




  // =========================
  // GET TOTAL JOB SEEKERS
  // =========================

  async function gettotalcount() {

    const headers = {
      authorization: 'BlueItImpulseWalkinIn'
    }

    await axios.get("/CSRoute/getTotalCount", { headers })
      .then((res) => {
        settotalCount(res.data.result)
      })
      .catch((err) => {
        alert("something went wrong")
      })
  }



  // =========================
  // GET ALL JOB SEEKERS
  // PAGINATION ADDED
  // =========================

  async function getAllJobSeekers() {

    setNoPageFilter(false)

    const headers = {
      authorization: 'BlueItImpulseWalkinIn'
    };
  await axios.get(`/CSRoute/getLimitJobs/${recordsPerPage}`, { params: { currentPage }, headers })
      .then((res) => {

        let result = res.data

        gettotalcount()

        let sortedate = result.sort(function (a, b) {
          return new Date(a.updatedAt) - new Date(b.updatedAt);
        });

        setjobSeekers(sortedate)

      })
      .catch((err) => {
        console.log(err)
        alert("server issue occured")
      })
  }


  // =========================
  // GET DATA WHEN PAGE
  // OR RECORD COUNT CHANGES
  // =========================

  useEffect(() => {
    getAllJobSeekers()
  }, [currentPage, recordsPerPage])



  // =========================
  // PAGINATION FUNCTIONS
  // =========================

  function firstPage() {
    setCurrentPage(1)
  }


  function previous() {
    if (currentPage !== 1) {
      setCurrentPage(currentPage - 1)
    }
  }


  function changeCurrent(id) {
    setCurrentPage(id)
  }


  function next() {
    if (currentPage !== npage) {
      setCurrentPage(currentPage + 1)
    }
  }


  function last() {
    setCurrentPage(npage)
  }


  function handleRecordchange(e) {

    sessionStorage.setItem(
      "recordsperpageSerachCand",
      JSON.stringify(e.target.value)
    )

    let recordsperpage = JSON.parse(
      sessionStorage.getItem("recordsperpageSerachCand")
    )

    setrecordsPerPage(recordsperpage)

    setCurrentPage(1)
  }



  function Hold(Empid, status) {

    let userid = atob(JSON.parse(localStorage.getItem("IdLog")))

    const headers = {
      authorization:
        userid + " " + atob(JSON.parse(localStorage.getItem("AdMLog")))
    };

    const isOnhold = status

    Swal.fire({
      title: "Are You sure?",
      width: "260",

      customClass: {
        popup: "alertIcon"
      },

      icon: "question",
      showCancelButton: true

    }).then(async (res) => {

      if (res.isConfirmed) {

        await axios.put(
          `/StudentProfile/isOnhold/${Empid}`,
          { isOnhold },
          { headers }
        )

          .then((res) => {

            getAllJobSeekers()

          })
          .catch((err) => {

            alert("backend error occured")

          })
      }
    })
  }



  function unHold(Empid, status) {

    const isOnhold = status

    let userid = atob(JSON.parse(localStorage.getItem("IdLog")))

    const headers = {
      authorization:
        userid + " " + atob(JSON.parse(localStorage.getItem("AdMLog")))
    };

    Swal.fire({
      title: "Are You sure?",
      width: "260",

      customClass: {
        popup: "alertIcon"
      },

      showCancelButton: true

    }).then(async (res) => {

      if (res.isConfirmed) {

        await axios.put(
          `/StudentProfile/isOnhold/${Empid}`,
          { isOnhold },
          { headers }
        )

          .then((res) => {

            getAllJobSeekers()

          })
          .catch((err) => {

            alert("backend error occured")

          })
      }
    })
  }



  function Reject(Empid, status) {

    let userid = atob(JSON.parse(localStorage.getItem("IdLog")))

    const headers = {
      authorization:
        userid + " " + atob(JSON.parse(localStorage.getItem("AdMLog")))
    };

    const isReject = status

    Swal.fire({
      title: "Are You sure?",
      width: "260",

      customClass: {
        popup: "alertIcon"
      },

      icon: "question",
      showCancelButton: true

    }).then(async (res) => {

      if (res.isConfirmed) {

        await axios.put(
          `/StudentProfile/isReject/${Empid}`,
          { isReject },
          { headers }
        )

          .then((res) => {

            getAllJobSeekers()

          })
          .catch((err) => {

            alert("backend error occured")

          })
      }
    })
  }



  function unReject(Empid, status) {

    const isReject = status

    let userid = atob(JSON.parse(localStorage.getItem("IdLog")))

    const headers = {
      authorization:
        userid + " " + atob(JSON.parse(localStorage.getItem("AdMLog")))
    };

    Swal.fire({
      title: "Are You sure?",
      width: "260",

      customClass: {
        popup: "alertIcon"
      },

      showCancelButton: true

    }).then(async (res) => {

      if (res.isConfirmed) {

        await axios.put(
          `/StudentProfile/isReject/${Empid}`,
          { isReject },
          { headers }
        )

          .then((res) => {

            getAllJobSeekers()

          })
          .catch((err) => {

            alert("backend error occured")

          })
      }
    })
  }



  function Approve(Empid, status) {

    let userid = atob(JSON.parse(localStorage.getItem("IdLog")))

    const headers = {
      authorization:
        userid + " " + atob(JSON.parse(localStorage.getItem("AdMLog")))
    };

    const isApproved = status

    Swal.fire({
      title: "Are You sure?",
      width: "260",

      customClass: {
        popup: "alertIcon"
      },

      showCancelButton: true

    }).then(async (res) => {

      if (res.isConfirmed) {

        await axios.put(
          `/StudentProfile/setApproval/${Empid}`,
          { isApproved },
          { headers }
        )

          .then((res) => {

            getAllJobSeekers()

          })
          .catch((err) => {

            alert("backend error occured")

          })
      }
    })

  }



  function DisApprove(Empid, status) {

    let userid = atob(JSON.parse(localStorage.getItem("IdLog")))

    const headers = {
      authorization:
        userid + " " + atob(JSON.parse(localStorage.getItem("AdMLog")))
    };

    const isApproved = status

    Swal.fire({
      title: "Are You sure?",
      width: "260",

      customClass: {
        popup: "alertIcon"
      },

      showCancelButton: true

    }).then(async (res) => {

      if (res.isConfirmed) {

        await axios.put(
          `/StudentProfile/setApproval/${Empid}`,
          { isApproved },
          { headers }
        )

          .then((res) => {

            getAllJobSeekers()

          })
          .catch((err) => {

            alert("backend error occured")

          })
      }
    })
  }



  async function DeleteJob(id) {

    console.log(id)

    Swal.fire({
      title: 'Are you sure?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    })

      .then((result) => {

        if (result.isConfirmed) {

          axios.delete(`/StudentProfile/deleteProfile/${id}`)

            .then((res) => {

              getAllJobSeekers()

            })
            .catch((err) => {

              alert("server error occured")

            })

        }
      })
  }



  // =========================
  // APPROVED JOB SEEKERS
  // FILTER
  // =========================

  async function Approvedjobseekers() {

    setNoPageFilter(true)

    let userid = atob(JSON.parse(localStorage.getItem("IdLog")))

    const headers = {
      authorization:
        userid + " " + atob(JSON.parse(localStorage.getItem("AdMLog")))
    };

    await axios.get(
      "/StudentProfile/getApprovedStu",
      { headers }
    )

      .then((res) => {

        let result = res.data

        setjobSeekers(result)

      })

      .catch((err) => {

        alert("server issue occured")

      })
  }



  // =========================
  // NOT APPROVED JOB SEEKERS
  // FILTER
  // =========================

  async function NotApprovedjobseekers() {

    setNoPageFilter(true)

    let userid = atob(JSON.parse(localStorage.getItem("IdLog")))

    const headers = {
      authorization:
        userid + " " + atob(JSON.parse(localStorage.getItem("AdMLog")))
    };

    await axios.get(
      "/StudentProfile/getNotApprovedStu",
      { headers }
    )

      .then((res) => {

        let result = res.data

        setjobSeekers(result)

      })

      .catch((err) => {

        alert("server issue occured")

      })
  }



  // =========================
  // SEARCH
  // =========================

  async function search(e) {

    let key = e.target.value

    if (key) {

      setResult(true)

      let dubmyjobs = [...jobSeekers]

      const filteredItems = dubmyjobs.filter((user) =>
        JSON.stringify(user)
          .toLowerCase()
          .includes(key.toLowerCase())
      )

      setjobSeekers(filteredItems)

    } else {

      getAllJobSeekers()

      setResult(false)

    }
  }



  // =========================
  // RECENT LOGIN
  // FILTER
  // =========================

  async function RecentLogin(e) {

    setNoPageFilter(true)

    let userid = atob(JSON.parse(localStorage.getItem("IdLog")))

    const headers = {
      authorization:
        userid + " " + atob(JSON.parse(localStorage.getItem("AdMLog")))
    };

    if (e.target.checked) {

      await axios.get(
        "/StudentProfile/RecentLogin",
        { headers }
      )

        .then((res) => {

          let result = res.data

          let sortresult = result.sort((a, b) => {

            return new Date(b.LogedInTime) -
              new Date(a.LogedInTime);

          })

          setjobSeekers(sortresult)

        })

        .catch((err) => {

          alert("server issue occured")

        })

    } else {

      getAllJobSeekers()

    }
  }



  // =========================
  // ONLINE FILTER
  // =========================

  async function checkOnline() {

    setNoPageFilter(true)

    let userid = atob(JSON.parse(localStorage.getItem("IdLog")))

    const headers = {
      authorization:
        userid + " " + atob(JSON.parse(localStorage.getItem("AdMLog")))
    };

    await axios.get(
      "/StudentProfile/checkOnline",
      { headers }
    )

      .then((res) => {

        let result = res.data

        console.log(result)

        setjobSeekers(result)

      })

      .catch((err) => {

        alert("server issue occured")

      })
  }



  return (
    <>

      <h3
        style={{
          marginLeft: "20px",
          marginTop: "10px"
        }}
      >
        All JobSeekers for admin
      </h3>


      <div className={styles.searchBoth}>

        <p className={styles.p}>
          Search
        </p>

        <input
          className={styles.inputboxsearch}
          type="text"
          placeholder='Search for a Job / Skills / Location/Experiance'
          onChange={(e) => {
            search(e)
          }}
        />

      </div>


      {Result ?
        <h4
          style={{
            marginLeft: "14%",
            marginTop: "10px"
          }}
        >
          {jobSeekers.length} matching Result Found
        </h4>
        :
        ""
      }


      <div style={{ marginLeft: "10px" }}>

        <label>
          <input
            id="checkApproved"
            name="checkApproved"
            type="radio"
            onChange={(e) => {
              getAllJobSeekers(e)
            }}
          />

          <span>
            All Joseeker
          </span>
        </label>

        <br></br>


        <label>

          <input
            id="checkApproved"
            name="checkApproved"
            type="radio"
            onChange={(e) => {
              Approvedjobseekers(e)
            }}
          />

          <span>
            Approved Joseeker
          </span>

        </label>

        <br></br>


        <label>

          <input
            id="checkApproved"
            name="checkApproved"
            type="radio"
            onChange={(e) => {
              NotApprovedjobseekers(e)
            }}
          />

          <span>
            Joseeker who are yet to be approved
          </span>

        </label>

        <br></br>


        <label>

          <input
            id="checkApproved"
            name="checkApproved"
            type="radio"
            onChange={RecentLogin}
          />

          <span>
            Recent Login
          </span>

        </label>

        <br></br>


        <label>

          <input
            id="checkApproved"
            name="checkApproved"
            type="radio"
            onChange={checkOnline}
          />

          <span>
            check Online
          </span>

        </label>

        <br></br>

      </div>



      {/* =========================
          PAGINATION UI
      ========================= */}

      {!nopageFilter && (

        <>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap"
            }}
          >

            <p
              style={{
                fontWeight: 400,
                marginLeft: "10px"
              }}
            >

              showing{" "}

              {totalCount > 0
                ? firstIndex + 1
                : 0
              }

              {" "}to{" "}

              {Math.min(lastIndex, totalCount)}

              {" "}latest Job Seekers

            </p>


            <div className={styles.navigationWrapper}>

              <button
                disabled={currentPage === 1}
                style={{
                  display: "inline",
                  margin: "5px"
                }}
                className={styles.navigation}
                onClick={firstPage}
              >
                <i className="fas fa-step-backward"></i>
              </button>


              <button
                disabled={currentPage === 1}
                style={{
                  display: "inline",
                  margin: "5px"
                }}
                className={styles.navigation}
                onClick={previous}
              >
                <i className="fas fa-caret-square-left"></i>
              </button>


              <span>
                {currentPage}
              </span>


              <button
                disabled={
                  currentPage === npage ||
                  npage === 0
                }
                style={{
                  display: "inline",
                  margin: "5px"
                }}
                className={styles.navigation}
                onClick={next}
              >
                <i className="fas fa-caret-square-right"></i>
              </button>


              <button
                disabled={
                  currentPage === npage ||
                  npage === 0
                }
                style={{
                  display: "inline",
                  margin: "5px"
                }}
                className={styles.navigation}
                onClick={last}
              >
                <i className="fas fa-step-forward"></i>
              </button>

            </div>

          </div>


          <div
            style={{
              display: "flex",
              justifyContent: "space-between"
            }}
          >

            <div
              style={{
                marginBottom: "5px",
                marginTop: "0",
                marginLeft: "10px"
              }}
            >

              Show{" "}

              <select
                value={recordsPerPage}
                onChange={(e) => {
                  handleRecordchange(e)
                }}
              >

                <option value={10}>
                  10
                </option>

                <option value={25}>
                  25
                </option>

                <option value={50}>
                  50
                </option>

                <option value={100}>
                  100
                </option>

              </select>

              {" "}Job Seekers per page

            </div>

          </div>

        </>

      )}



      {/* {screenSize.width > 850 ? */}

        <div className={styles.tableWrapper}>

          <div className={styles.tableContainer}>

            <table className={styles.studentTable}>

              <thead>

                <tr>

                  <th>Name</th>
                  <th>Phone Number</th>
                  <th>Total Resume Printed</th>
                  <th>Limit</th>
                  <th>Set Limit</th>
                  <th>Status</th>
                  <th>Last Log</th>
                </tr>

              </thead>


              <tbody>

                {jobSeekers.length > 0 ? (

                  jobSeekers.map((items, i) => (

                    <tr key={items._id || i}>

                      <td className={styles.nameCell}>

                        <button
                          type="button"
                          className={styles.nameButton}
                          onClick={() =>
                            navigate(
                              `/BIAddmin@CheckCSCProfileForAdmin/${items._id}`
                            )
                          }
                        >

                          {items.online && (
                            <span
                              className={styles.onlineDot}
                            ></span>
                          )}

                          <span>
                            {items.name || "N/A"}
                          </span>

                        </button>

                      </td>


                      {/* Phone */}

                      <td>
                        {items.phoneNumber || "N/A"}
                      </td>

                      <td>
                      {items.pdfDownloadCount|| 0}
                      </td>

                      <td>
                         {items.Limit || 0}
                      </td>

<td className={styles.dateCell}>
  <div className={styles.limitWrapper}>
    <input
      type="number"
      className={styles.limitInput}
      placeholder="Enter limit"
      onChange={(e) => setLimit(e.target.value)}
    />

    <button
      className={styles.limitButton}
      onClick={() => handleSetLimit(items._id)}
    >
      Set Limit
    </button>
  </div>
</td>


                      <td className={styles.dateCell}>
                        Status
                      </td>

                      <td className={styles.dateCell}>

                        {items.LogedInTime

                          ? new Date(
                            items.LogedInTime
                          ).toLocaleString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "short",
                              day: "2-digit",
                              hour: "2-digit",
                              minute: "2-digit",
                              second: "2-digit",
                            }
                          )

                          : "Only Reg. Yet"}

                      </td>
                    </tr>

                  ))

                ) : (

                  <tr>

                    <td
                      colSpan="10"
                      className={
                        styles.noRecord
                      }
                    >
                      No Record Found
                    </td>

                  </tr>

                )}

              </tbody>

            </table>

          </div>

        </div>

       
    </>
  )
}


export default AllCSCAdmin