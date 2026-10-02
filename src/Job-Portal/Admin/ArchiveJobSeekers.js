

import React from 'react'
import { useEffect, useState } from 'react'
import styles from "./AllJobSeekers.module.css"
import Styles from "../AppliedUserProfile/AppliedUserProfile.module.css"
import Swal from "sweetalert2";
import axios from "axios";
import { Link, useNavigate, BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import useScreenSize from '../SizeHook';
import {jobTags} from '../Tags'


// const [PageLoader, setPageLoader] = useState(false)
// import { Puff } from 'react-loader-spinner'


function ArchivedUser() {
  let navigate = useNavigate()

  useEffect(()=>{
    let adminLogin= localStorage.getItem("SupAdMLog")
        if(!adminLogin){
            navigate("/")
        }
    },[])

  const [jobSeekers , setjobSeekers] = useState([])
  // console.log(jobSeekers)
  const [Result , setResult] = useState(false)
const screenSize = useScreenSize();

const [message, setmessage] = useState("")

const [currentBox, setcurrentBox] = useState("")

const [Candidate, setCandidate] = useState([])
  const [nopageFilter, setNoPageFilter] = useState(false)
  const [Filtereredjobs, setFiltereredjobs] = useState([])

  const [NotFound, setNotFound] = useState("")
  const [Active, setActive] = useState([])
  
  const Location = ['Bangalore']
  const [totalCount, settotalCount] = useState()

  let recordsperpage = JSON.parse(sessionStorage.getItem("recordsperpageSerachCand"))

  const [currentPage, setCurrentPage] = useState(1)
  const [recordsPerPage, setrecordsPerPage] = useState(recordsperpage?recordsperpage:10)

  const lastIndex = currentPage * recordsPerPage //10
  const firstIndex = lastIndex - recordsPerPage //0
  // const records = jobSeekers.slice(firstIndex, lastIndex)//0,5
  const npage = Math.ceil(totalCount / recordsPerPage) // last page

  // const number = [...Array(npage + 1).keys()].slice(1)

  async function gettotalcount() {
    const headers = { authorization: 'BlueItImpulseWalkinIn' };
    await axios.get("/StudentProfile/getTotalCountArchiveJobseeker", { headers })
      .then((res) => {
        // console.log(res.data.result)
        settotalCount(res.data.result)
      }).catch((err) => {
        alert("something went wrong")
      })
  }

  async function getAllJobSeekers() {
    // setjobSeekers([])
    setNoPageFilter(false)
    setActive([])
    setJobTagsIds([])

    // let userid = JSON.parse(localStorage.getItem("EmpIdG"))
    // const headers = { authorization: userid +" "+ atob(JSON.parse(localStorage.getItem("EmpLog"))) };
    const headers = { authorization: 'BlueItImpulseWalkinIn' };

    await axios.get(`/StudentProfile/getLimitArchiveJobseeker/${recordsPerPage}`, { params: { currentPage }, headers })

      .then((res) => {
        let result = (res.data)
        // console.log("all jobs",result)
        gettotalcount()
        let sortedate = result.sort(function (a, b) {
          return new Date(b.createdAt) - new Date(a.createdAt);
        });
        let elements=  sortedate.flatMap( subArray =>  subArray.Archived).forEach(  element => {
           setjobSeekers(oldArray => [...oldArray,element] )
          //  setjobSeekers([element])
          //  setjobSeekers(oldArray => [...oldArray, ...sortedate.flatMap(subArray => subArray.Archived)]);

        })
        
      })
  }

      useEffect(() => {
        if (jobTagsIds.length < 1) {
      getAllJobSeekers()
  
        } else {
          getTagId();
        }
      }, [currentPage, recordsPerPage])

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

  function handleRecordchange(e){  
    sessionStorage.setItem("recordsperpageSerachCand", JSON.stringify(e.target.value));
    let recordsperpage = JSON.parse(sessionStorage.getItem("recordsperpageSerachCand"))
    setrecordsPerPage(recordsperpage) 
    setCurrentPage(1)
  }
    const [count, setCount]=useState(1)
  
      const [jobTagsIds, setJobTagsIds] = useState([])

      useEffect(() => {
        if (jobTagsIds.length > 0) {
          getTagId();
        }
      }, [jobTagsIds])
      let ids = jobTagsIds.map((id) => {
        return (
          id.Archived._id
        )
      })
      // console.log(ids)

      const uniqueList = [...new Set(ids)];

      async function getTagId() {
        settotalCount(jobTagsIds.length)
        await axios.get(`/StudentProfile/ArchiveJobseekerTagsIds/${uniqueList}`, {
          params: { currentPage, recordsPerPage }
        })
          .then((res) => {
            let result = res.data
            let sortedate = result.sort((a, b) => {
              return new Date(b.createdAt) - new Date(a.createdAt);
            });
            // setjobSeekers(sortedate)
            let elements=  sortedate.flatMap( subArray =>  subArray.Archived).forEach(  element => {
              setjobSeekers(oldArray => [...oldArray,element] )
           })
            if (count == 2) {
              setCurrentPage(1)
            }
    
          })
      }
    
      useEffect(()=>{
        if(Active.length>0){
          changeTags()
        }
      },[Active])
    
  

  async function filterByJobTitle(key) {
    if(count==1){
    }
    setjobSeekers([])
    setCount(prev=>prev+1)
    const isIndex=Active.findIndex((present)=>{
return(
  present===key
)
    })
    if(isIndex<0){
    var updatedActive = [...Active, key]; // Add the new key to the array
    setActive(updatedActive);
    }else{
      const IndexId=Active.findIndex((present)=>{
        return(
          present==key
        )
            })
            Active.splice(IndexId,1)
                if(Active.length===0){
                  getAllJobSeekers()
                  return false
    }
    changeTags()
  }}

  async function changeTags(key){
    setNoPageFilter(true)
    setFiltereredjobs(key)
    await axios.get(`/StudentProfile/getTagsArchiveJobseekers/${Active}`)
      .then((res) => {
        let result = (res.data)
        // console.log('hkjkjk',result)
        let sortedate = result.sort((a, b) => {
          return new Date(b.createdAt) - new Date(a.createdAt);
        });
        setJobTagsIds(sortedate)
    //     let elements=  sortedate.flatMap(element => {
    //       setCandidate(oldArray => [...oldArray,element] )
    //  });
        // setCandidate(sortedate)
      })
  }

     // .......Last Active Sorting.......
     function LastActDescendingOrder (){
      let newjob = [...jobSeekers]
      const collator = new Intl.Collator(undefined, {
        numeric: true,
        sensitivity: 'base'
      });
      const sorted = newjob.sort((a, b) => {
        return collator.compare(a.updatedAt, b.updatedAt)
      })
      setjobSeekers(sorted)
    }
  
    function LastActAscendingOrder (){
      let newjob = [...jobSeekers]
      const collator = new Intl.Collator(undefined, {
        numeric: true,
        sensitivity: 'base'
      });
      const sorted = newjob.sort((a, b) => {
        return collator.compare(b.updatedAt, a.updatedAt)
      })
      setjobSeekers(sorted)
    }
        // ......Registration Sort......
    function RegDescendingOrder (){
      let newjob = [...jobSeekers]
      const collator = new Intl.Collator(undefined, {
        numeric: true,
        sensitivity: 'base'
      });
      const sorted = newjob.sort((a, b) => {
        return collator.compare(a.createdAt, b.createdAt)
      })
      setjobSeekers(sorted)
    }
  
    function RegAscendingOrder (){
      let newjob = [...jobSeekers]
      const collator = new Intl.Collator(undefined, {
        numeric: true,
        sensitivity: 'base'
      });
      const sorted = newjob.sort((a, b) => {
        return collator.compare(b.createdAt, a.createdAt)
      })
      setjobSeekers(sorted)
    }

      

  return (
    <>


                <div className={Styles.JobtitleFilterWrapper}>
                       <buton className={Active.length===0?Styles.active:Styles.JobtitleFilter} onClick={() => 
                    { getAllJobSeekers() }}>All</buton>
                  {
                    jobTags.map((tags, i) => {
                      return (
                        <button disabled={tags.value==="TECHNOLOGIES" || tags.value==="EDUCATION" || tags.value==="COLLEGE TYPE" || tags.value==="NOTICE PERIOD" || tags.value==="SALARY" || 
                          tags.value==="EXPERIENCE" || tags.value==="Job Type" || tags.value==="INDUSTRY" || tags.value==="TOOLS/PROTOCOLS" || tags.value==="ROLE" || tags.value==="COMPANY TYPE" } 
                          className={tags.value==="TECHNOLOGIES" || tags.value==="EDUCATION" || tags.value==="COLLEGE TYPE" || tags.value==="NOTICE PERIOD" || tags.value==="SALARY" || 
                          tags.value==="EXPERIENCE" || tags.value==="Job Type" || tags.value==="INDUSTRY" || tags.value==="TOOLS/PROTOCOLS" || tags.value==="COMPANY TYPE" || tags.value==="ROLE"?
                          Styles.TagHeading: 
                          //  Active === tags.value ? 
                          Active.findIndex(  (present)=>{
                            return(
                              present===tags.value
                            )
                                }) >=0?
                          Styles.active : Styles.JobtitleFilter} onClick={() => 
                            { filterByJobTitle(tags.value) }}>{tags.value} </button>
                      
                      )
                    })
                  }
                  </div>
                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                              {/* {nopageFilter ?
                                <p style={{ fontWeight: 400, marginLeft: "10px" }}>Displaying Candidates with with following matching tags
                                 <span style={{ color: "blue" }}>{Filtereredjobs}</span></p>
                                :
                                <p style={{ fontWeight: 400, marginLeft: "10px" }}>showing {firstIndex + 1} to {lastIndex} latest Candidates</p>
                              } */}
                                
                  {nopageFilter ?
                                <p style={{ fontWeight: 400, marginLeft: "10px" }}>Displaying <span style={{ color: "blue" }}>
                                  {jobTagsIds.length} </span>Jobs with following matching tags:
                                  <span style={{ color: "blue" }}>{Active.toString()}</span></p>
                                :
                                <p style={{ fontWeight: 400, marginLeft: "10px" }}>showing {firstIndex + 1} to {lastIndex} latest jobs</p>
                              }
                              <div className={styles.navigationWrapper}>
                                <button disabled={currentPage === 1} style={{ display: "inline", margin: "5px" }} className={styles.navigation} onClick={firstPage}>
                                  <i class='fas fa-step-backward' ></i>
                                </button>
                                <button disabled={currentPage === 1} style={{ display: "inline", margin: "5px" }} className={styles.navigation} onClick={previous}>
                                  <i class='fas fa-caret-square-left'></i>
                                </button>
                                <span>{currentPage}</span>
                                <button disabled={currentPage === npage} style={{ display: "inline", margin: "5px" }} className={styles.navigation} onClick={next}>
                                  <i class='fas fa-caret-square-right'></i>
                                </button>
                                <button disabled={currentPage === npage} style={{ display: "inline", margin: "5px" }} className={styles.navigation} onClick={last}>
                                  <i class='fas fa-step-forward'></i>
                                </button>
                              </div>
                            </div>
                  
                            <div style={{marginBottom:"5px", marginTop:"0", marginLeft:"10px"}}>
                              Show  <select onChange={(e) => { handleRecordchange(e) }}>
                                <option selected = {lastIndex === 10} value={1}>1</option>
                                <option selected = {lastIndex === 10} value={10}>10</option>
                                <option selected = {lastIndex === 25} value={25}>25</option>
                                <option selected = {lastIndex === 50} value={50}>50</option>
                                <option selected = {lastIndex === 100} value={100}>100</option>
                              </select>  jobs per page
                              </div>
                                  {screenSize.width>850?
<>

<div className={styles.tableWrapper}>
  <table className={styles.studentTable}>
    <thead>
      <tr>
        <th>Name</th>
        <th>Phone Number</th>
        <th>Age</th>
        <th>Aadhar</th>

        <th>
          <div className={styles.thContent}>
            <span>Reg. Date</span>
            <div className={styles.sortButtons}>
              <button
                type="button"
                onClick={RegAscendingOrder}
                className={styles.sortButton}
              >
                ↑
              </button>
              <button
                type="button"
                onClick={RegDescendingOrder}
                className={styles.sortButton}
              >
                ↓
              </button>
            </div>
          </div>
        </th>

        <th>
          <div className={styles.thContent}>
            <span>Last Log</span>
            <div className={styles.sortButtons}>
              <button
                type="button"
                onClick={LastActAscendingOrder}
                className={styles.sortButton}
              >
                ↑
              </button>
              <button
                type="button"
                onClick={LastActDescendingOrder}
                className={styles.sortButton}
              >
                ↓
              </button>
            </div>
          </div>
        </th>

        <th>Qualif.</th>
        <th>Skills</th>
        <th>Approval</th>
        <th>Message</th>
      </tr>
    </thead>

    <tbody>
      {jobSeekers.length > 0 ? (
        jobSeekers.map((items) => (
          <tr key={items._id}>
            {/* Name */}
            <td
              className={styles.nameCell}
              onClick={() =>
                navigate(
                  `/BIAddmin@CheckStudentArchived/${items._id}`
                )
              }
            >
              <span className={styles.profileLink}>
                {items.name ? items.name : "nnn"}
              </span>
            </td>

            {/* Phone */}
            <td>
              {items.phoneNumber ? (
                items.phoneNumber
              ) : (
                <span className={styles.notAvailable}>
                  Not available
                </span>
              )}
            </td>

            {/* Age */}
            <td>
              {items.age ? (
                items.age
              ) : (
                <span className={styles.notAvailable}>
                  Not available
                </span>
              )}
            </td>

            {/* Aadhar */}
            <td>
              {items.Aadhar ? (
                items.Aadhar
              ) : (
                <span className={styles.notAvailable}>
                  No Aadhar available
                </span>
              )}
            </td>

            {/* Registration Date */}
            <td>
              {items.createdAt
                ? new Date(items.createdAt).toLocaleString("en-US", {
                    month: "short",
                    day: "2-digit",
                    year: "numeric",
                  })
                : "N/A"}
            </td>

            {/* Last Login */}
            <td>
              {items.LogedInTime ? (
                new Date(items.LogedInTime).toLocaleString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                })
              ) : (
                <span className={styles.notAvailable}>
                  Only Reg. Yet
                </span>
              )}
            </td>

            {/* Qualification */}
            <td>
              {items.Qualification ? (
                items.Qualification
              ) : (
                <span className={styles.notAvailable}>
                  No qualification
                </span>
              )}
            </td>

            {/* Skills */}
            <td className={styles.skillsCell}>
              {items.Skills ? (
                items.Skills
              ) : (
                <span className={styles.notAvailable}>
                  No skills available
                </span>
              )}
            </td>

            {/* Approval */}
            <td className={styles.approvalCell}>
              {items.isApproved ? (
                <button className={styles.Approved}>
                  Approved
                </button>
              ) : items.isReject ? (
                <button className={styles.Rejected}>
                  Rejected &#10004;
                </button>
              ) : items.isOnhold ? (
                <button className={styles.OnHold}>
                  OnHold &#10004;
                </button>
              ) : (
                <div className={styles.actionButtons}>
                  <button className={styles.RejectButton}>
                    Reject
                  </button>

                  <button className={styles.ApproveButton}>
                    Approve
                  </button>

                  <button className={styles.HoldButton}>
                    Hold
                  </button>
                </div>
              )}
            </td>

            {/* Message */}
            <td className={styles.messageCell}>
              {items.message ? (
                items.message
              ) : (
                <span className={styles.noMessage}>
                  No message was sent
                </span>
              )}
            </td>
          </tr>
        ))
      ) : (
        <tr>
          <td colSpan="10" className={styles.noRecord}>
            No Record Found
          </td>
        </tr>
      )}
    </tbody>
  </table>
</div>
              </>
            :
            
<div id={styles.JobCardWrapper}>
  {jobSeekers.length > 0 ? (
    jobSeekers.map((job) => (
      <div className={styles.JobCard} key={job._id}>

        {/* Card Header */}
        <div className={styles.cardHeader}>
          <div
            className={styles.profileInfo}
            onClick={() =>
              navigate(`/BIAddmin@CheckStudentProfile/${job._id}`)
            }
          >
            <div className={styles.avatar}>
              {job.name ? job.name.charAt(0).toUpperCase() : "?"}
            </div>

            <div className={styles.profileText}>
              <div className={styles.studentName}>
                {job.name || "Name not updated"}
              </div>

              <div className={styles.registeredDate}>
                Registered{" "}
                {job.createdAt
                  ? new Date(job.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "2-digit",
                      year: "numeric",
                    })
                  : "N/A"}
              </div>
            </div>
          </div>

          {/* Status */}
          {job.isApproved ? (
            <span className={styles.statusApproved}>
              ✓ Approved
            </span>
          ) : (
            <span className={styles.statusPending}>
              Pending
            </span>
          )}
        </div>

        {/* Personal / Professional Details */}
        <div className={styles.detailsSection}>

          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>Age</span>
            <span className={styles.detailValue}>
              {job.age ? (
                job.age
              ) : (
                <span className={styles.notUpdated}>Not updated</span>
              )}
            </span>
          </div>

          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>Email</span>
            <span className={styles.detailValue}>
              {job.email ? (
                job.email
              ) : (
                <span className={styles.notUpdated}>Not updated</span>
              )}
            </span>
          </div>

          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>Phone</span>
            <span className={styles.detailValue}>
              {job.phoneNumber ? (
                job.phoneNumber
              ) : (
                <span className={styles.notUpdated}>Not updated</span>
              )}
            </span>
          </div>

          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>Notice Period</span>
            <span className={styles.detailValue}>
              {job.NoticePeriod ? (
                job.NoticePeriod
              ) : (
                <span className={styles.notUpdated}>Not updated</span>
              )}
            </span>
          </div>

          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>Qualification</span>
            <span className={styles.detailValue}>
              {job.Qualification ? (
                job.Qualification
              ) : (
                <span className={styles.notUpdated}>Not updated</span>
              )}
            </span>
          </div>

          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>Experience</span>
            <span className={styles.detailValue}>
              {job.Experiance ? (
                job.Experiance
              ) : (
                <span className={styles.notUpdated}>Not updated</span>
              )}
            </span>
          </div>

          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>Current CTC</span>
            <span className={styles.detailValue}>
              {job.currentCTC ? (
                job.currentCTC
              ) : (
                <span className={styles.notUpdated}>Not updated</span>
              )}
            </span>
          </div>

          <div className={styles.detailRow}>
            <span className={styles.detailLabel}>Expected CTC</span>
            <span className={styles.detailValue}>
              {job.ExpectedSalary ? (
                job.ExpectedSalary
              ) : (
                <span className={styles.notUpdated}>Not updated</span>
              )}
            </span>
          </div>

        </div>

        {/* Skills */}
        <div className={styles.infoBox}>
          <div className={styles.infoTitle}>
            Skills
          </div>

          {job.Skills ? (
            <div className={styles.infoValue}>
              {job.Skills}
            </div>
          ) : (
            <div className={styles.notUpdated}>
              Not updated
            </div>
          )}
        </div>

        {/* Account Status */}
        <div className={styles.accountSection}>
          <div className={styles.accountTitle}>
            Account Status
          </div>

          {job.isApproved ? (
            <button className={styles.MoApproved}>
              ✓ Approved
            </button>
          ) : (
            <button className={styles.MoApprove}>
              Approve
            </button>
          )}
        </div>

        {/* Message */}
        <div className={styles.infoBox}>
          <div className={styles.infoTitle}>
            Message
          </div>

          {job.message ? (
            <div className={styles.messageValue}>
              {job.message}
            </div>
          ) : (
            <div className={styles.noMessage}>
              No message sent yet
            </div>
          )}
        </div>

        {/* View Profile */}
        <button
          className={styles.viewProfile}
          onClick={() =>
            navigate(`/BIAddmin@CheckStudentProfile/${job._id}`)
          }
        >
          View Full Profile
          <span>→</span>
        </button>

      </div>
    ))
  ) : (
    <div className={styles.noRecord}>
      No Record Found
    </div>
  )}
</div>
            
}
    </>
  )
}


export default ArchivedUser