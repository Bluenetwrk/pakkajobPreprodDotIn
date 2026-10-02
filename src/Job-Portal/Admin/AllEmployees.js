import React from 'react'
import { useEffect, useState } from 'react'
import styles from "./AllEmployees.module.css"
import Swal from "sweetalert2";
import axios from "axios";
import { Link, useNavigate, BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import useScreenSize from '../SizeHook';
import {jobTags} from '../Tags'
import Styles from "../AppliedUserProfile/AppliedUserProfile.module.css"



function AllEmployeesForadmin() {
  let navigate = useNavigate()
  
  useEffect(()=>{
    let adminLogin= localStorage.getItem("SupAdMLog")
        if(!adminLogin){
            navigate("/")
        }
    },[])
 

  const [AllEmployees, setAllEmployees] = useState([])
  const [Result, setResult] = useState(false)
const screenSize = useScreenSize();
const [currentBox, setcurrentBox] = useState("")


  function handleChange(e, id){
   setmessage(e.target.value)
   setcurrentBox(id)
  }


  
const [message, setmessage] = useState("")
    
async function sendMessage(id){
  let userid = atob(JSON.parse(localStorage.getItem("IdLog")))
  const headers = { authorization: userid +" "+ atob(JSON.parse(localStorage.getItem("AdMLog"))) };
  await axios.put(`/EmpProfile/sendMessage/${id}`, {message}, {headers})
  .then((res)=>{
    if(res.data){
    alert("Message Sent Successfully")
    }
  }).catch((err)=>{
    alert("some thing went wrong")
  })
}


const [totalCount, settotalCount] = useState()
const [nopageFilter, setNoPageFilter] = useState(false)
  const [Active, setActive] = useState([])
  
let recordsperpage = JSON.parse(sessionStorage.getItem("recordsperpageSerachCand"))

const [currentPage, setCurrentPage] = useState(1)
const [recordsPerPage, setrecordsPerPage] = useState(recordsperpage?recordsperpage:10)

const lastIndex = currentPage * recordsPerPage //10
const firstIndex = lastIndex - recordsPerPage //0
// const records = Candidate.slice(firstIndex, lastIndex)//0,5
const npage = Math.ceil(totalCount / recordsPerPage) // last page

// const number = [...Array(npage + 1).keys()].slice(1)



async function gettotalcount() {
  const headers = { authorization: 'BlueItImpulseWalkinIn' };
  await axios.get("/EmpProfile/getTotalCount", { headers })
    .then((res) => {
      // console.log(res.data.result)
      settotalCount(res.data.result)
    }).catch((err) => {
      alert("something went wrong")
    })
  }
  
  async function getEmployees() {
  setNoPageFilter(false)
  setActive([])
  setJobTagsIds([])
  const headers = { authorization: 'BlueItImpulseWalkinIn' };
  await axios.get(`/EmpProfile/getLimitJobs/${recordsPerPage}`, { params: { currentPage }, headers })

    .then((res) => {
      let result = (res.data)
      gettotalcount()
      let sortedate = result.sort(function (a, b) {
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
      setAllEmployees(sortedate)
    })
}

// useEffect(() => {
//   getEmployees()
// }, [])

    useEffect(() => {
      if (jobTagsIds.length < 1) {
        getEmployees()

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
            id._id
          )
        })
        const uniqueList = [...new Set(ids)];
        async function getTagId() {
          settotalCount(uniqueList.length)
          await axios.get(`/EmpProfile/jobTagsIds/${uniqueList}`, {
            params: { currentPage, recordsPerPage }
          })
            .then((res) => {
              // console.log("data from uique id's",res.data)
              let result = res.data
              let sortedate = result.sort((a, b) => {
                return new Date(b.createdAt) - new Date(a.createdAt);
              });
              setAllEmployees(sortedate)
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
        setAllEmployees([])
      }
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
                    getEmployees()
                    return false
      }
      changeTags()
    }}

  
    async function changeTags(key){
  
      setNoPageFilter(true)
      await axios.get(`/EmpProfile/getTagsJobs/${Active}`)
        .then((res) => {
          let result = (res.data)
          // console.log(result)
          let sortedate = result.sort((a, b) => {
            return new Date(b.createdAt) - new Date(a.createdAt);
          });
          setJobTagsIds(sortedate)

        })
    }
  


  // async function getEmployees() {
  //   let userid = atob(JSON.parse(localStorage.getItem("IdLog")))
  //   const headers = { authorization: userid +" "+ atob(JSON.parse(localStorage.getItem("AdMLog"))) };
  //   await axios.get("/EmpProfile/getAllEmployees",{headers})
  //     .then((res) => {
  //       let result = (res.data)
  //       // console.log(result.message)
  //       setmessage(result.message)
        
  //       let sortedate = result.sort(function (a, b) {
  //         return new Date(a.updatedAt) - new Date(b.updatedAt);
  //       });
  //       setAllEmployees(sortedate)
  //     })
  // }

  // useEffect(() => {
  //   getEmployees()
  // }, [])


  function  Hold(Empid , status){
    let userid = atob(JSON.parse(localStorage.getItem("IdLog")))
    const headers = { authorization: userid +" "+ atob(JSON.parse(localStorage.getItem("AdMLog"))) };
    const isOnhold=status
    Swal.fire({
      title: "Are You sure?",
    // position:"top",
    width:"260",

    customClass:{
      popup:"alertIcon"
    },
      icon:"question",
      showCancelButton:true
    }).then( async (res)=>{
      if(res.isConfirmed){
        await axios.put(`/EmpProfile/isOnhold/${Empid}`,{isOnhold}, {headers})
        .then((res)=>{
          getEmployees()


        }).catch((err)=>{
          alert("backend error occured")
        })
      }
    })
  }    

  function  unHold(Empid , status){
    let userid = atob(JSON.parse(localStorage.getItem("IdLog")))
    const headers = { authorization: userid +" "+ atob(JSON.parse(localStorage.getItem("AdMLog"))) };
    const isOnhold=status
    Swal.fire({
      title: "Are You sure?",
      // icon:"question",
    // position:"top",
    width:"260",

    customClass:{
      popup:"alertIcon"
    },
      showCancelButton:true
    }).then( async (res)=>{
      if(res.isConfirmed){
        await axios.put(`/EmpProfile/isOnhold/${Empid}`,{isOnhold},{headers})
        .then((res)=>{

    getEmployees()
        }).catch((err)=>{
          alert("backend error occured")
        })
      }
    })
  }


  
  function Reject(Empid , status){
    let userid = atob(JSON.parse(localStorage.getItem("IdLog")))
    const headers = { authorization: userid +" "+ atob(JSON.parse(localStorage.getItem("AdMLog"))) };
    const isReject=status
    Swal.fire({
      title: "Are You sure?",
    // position:"top",
    width:"260",

    customClass:{
      popup:"alertIcon"
    },
      icon:"question",
      showCancelButton:true
    }).then( async (res)=>{
      if(res.isConfirmed){
        await axios.put(`/EmpProfile/isReject/${Empid}`,{isReject}, {headers})
        .then((res)=>{
          getEmployees()


        }).catch((err)=>{
          alert("backend error occured")
        })
      }
    })
  }    

  function unReject(Empid , status){
    const isReject=status
    let userid = atob(JSON.parse(localStorage.getItem("IdLog")))
    const headers = { authorization: userid +" "+ atob(JSON.parse(localStorage.getItem("AdMLog"))) };
    Swal.fire({
      title: "Are You sure?",
      // icon:"question",
    // position:"top",
    width:"260",

    customClass:{
      popup:"alertIcon"
    },
      showCancelButton:true
    }).then( async (res)=>{
      if(res.isConfirmed){
        await axios.put(`/EmpProfile/isReject/${Empid}`,{isReject}, {headers})
        .then((res)=>{

    getEmployees()
        }).catch((err)=>{
          alert("backend error occured")
        })
      }
    })
  }



   function Approve(Empid , status){
    let userid = atob(JSON.parse(localStorage.getItem("IdLog")))
    const headers = { authorization: userid +" "+ atob(JSON.parse(localStorage.getItem("AdMLog"))) };
    const isApproved=status
    Swal.fire({
      title: "Are You sure ?",
      // position:"top",
      width:"260",

      customClass:{
        popup:"alertIcon"
      },
      // icon:"question",
      showCancelButton:true
    }).then( async (res)=>{
      if(res.isConfirmed){
        await axios.put(`/EmpProfile/setApproval/${Empid}`,{isApproved}, {headers})
        .then((res)=>{
    getEmployees()

        }).catch((err)=>{
          alert("backend error occured")
        })
      }
    })
  }


  function DisApprove(Empid , status){
    const isApproved=status
    let userid = atob(JSON.parse(localStorage.getItem("IdLog")))
    const headers = { authorization: userid +" "+ atob(JSON.parse(localStorage.getItem("AdMLog"))) };
    Swal.fire({
      title: "Are You sure?",
      // position:"top",
      width:"260",

      customClass:{
        popup:"alertIcon"
      },
      // icon:"question",
      showCancelButton:true
    }).then( async (res)=>{
      if(res.isConfirmed){
        await axios.put(`/EmpProfile/setApproval/${Empid}`,{isApproved}, {headers})
        .then((res)=>{
    getEmployees()

        }).catch((err)=>{
          alert("backend error occured")
        })
      }
    })
  }


  async function DeleteJob(id) {
    Swal.fire({
      title: 'Are you sure?',
      width:"260",
      // position:"top",
      // icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'delete!'
    }).then((result) => {
      if (result.isConfirmed) {
        axios.delete(`/EmpProfile/deleteEmployee/${id}`)
          .then((res) => {           
            getEmployees()

          }).catch((err) => {
           alert("server error occured")
          })
      }
    })

  }

  async function AllEmployeesApANdDis() {
    let userid = atob(JSON.parse(localStorage.getItem("IdLog")))
    const headers = { authorization: userid +" "+ atob(JSON.parse(localStorage.getItem("AdMLog"))) };
    await axios.get("/EmpProfile/getAllEmployees", {headers})
      .then((res) => {
        let result = (res.data)
        let sortedate = result.sort(function (a, b) {
          return new Date(a.updatedAt) - new Date(b.updatedAt);
        });
        setAllEmployees(sortedate)
      })
  }


  async function checkAllApproved(e){
    let userid = atob(JSON.parse(localStorage.getItem("IdLog")))
    const headers = { authorization: userid +" "+ atob(JSON.parse(localStorage.getItem("AdMLog"))) };
    if(e.target.checked){
    await axios.get("/EmpProfile/getApprovedEmp", {headers})
    .then((res) => {
      let result = (res.data)
      setAllEmployees(result)  
    })
    .catch((err) => {
      alert("server issue occured")
    })
  }else{
      getEmployees()
    }  
  }
  async function checkAllNotApproved(e){
    let userid = atob(JSON.parse(localStorage.getItem("IdLog")))
    const headers = { authorization: userid +" "+ atob(JSON.parse(localStorage.getItem("AdMLog"))) };
    if(e.target.checked){
    await axios.get("/EmpProfile/getNotApprovedEmp", {headers})
    .then((res) => {
      let result = (res.data)
      setAllEmployees(result)  
    })
    .catch((err) => {
      alert("server issue occured")
    })
  }else{
      getEmployees()
    }  
  }

async function search(e) {
    let key = e.target.value
    if (key) {
      setResult(true)
      let dubmyjobs = [...AllEmployees]

      const filteredItems = dubmyjobs.filter((user) =>
        JSON.stringify(user).toLowerCase().includes(key.toLowerCase())
      )
      setAllEmployees(filteredItems)
    } else {
      getEmployees()
      setResult(false)

    }
  }

  async function RecentLogin(e){
    let userid = atob(JSON.parse(localStorage.getItem("IdLog")))
    const headers = { authorization: userid +" "+ atob(JSON.parse(localStorage.getItem("AdMLog"))) };
    if(e.target.checked){
    await axios.get("/EmpProfile/RecentLogin", {headers})
    .then((res) => {
      let result = (res.data)
      let sortresult = result.sort((a,b)=>{
        return new Date(b.LogedInTime) - new Date(a.LogedInTime);      
      })
      setAllEmployees(sortresult)  
    })
    .catch((err) => {
      alert("server issue occured")
    })
  }else{
      getEmployees()
    }  
      }

      async function checkOnline(e){
        let userid = atob(JSON.parse(localStorage.getItem("IdLog")))
        const headers = { authorization: userid +" "+ atob(JSON.parse(localStorage.getItem("AdMLog"))) };
        if(e.target.checked){
        await axios.get("/EmpProfile/checkOnline", {headers})
        .then((res) => {
          let result = (res.data)
          setAllEmployees(result)  
        })
        .catch((err) => {
          alert("server issue occured")
        })
      }else{
          getEmployees()
        }  
      }

      // .......Last Active Sorting.......
  function LastActDescendingOrder (){
    let newjob = [...AllEmployees]
    const collator = new Intl.Collator(undefined, {
      numeric: true,
      sensitivity: 'base'
    });
    const sorted = newjob.sort((a, b) => {
      return collator.compare(a.updatedAt, b.updatedAt)
    })
    setAllEmployees(sorted)
  }

  function LastActAscendingOrder (){
    let newjob = [...AllEmployees]
    const collator = new Intl.Collator(undefined, {
      numeric: true,
      sensitivity: 'base'
    });
    const sorted = newjob.sort((a, b) => {
      return collator.compare(b.updatedAt, a.updatedAt)
    })
    setAllEmployees(sorted)
  }
      // ......Registration Sort......
  function RegDescendingOrder (){
    let newjob = [...AllEmployees]
    const collator = new Intl.Collator(undefined, {
      numeric: true,
      sensitivity: 'base'
    });
    const sorted = newjob.sort((a, b) => {
      return collator.compare(a.createdAt, b.createdAt)
    })
    setAllEmployees(sorted)
  }

  function RegAscendingOrder (){
    let newjob = [...AllEmployees]
    const collator = new Intl.Collator(undefined, {
      numeric: true,
      sensitivity: 'base'
    });
    const sorted = newjob.sort((a, b) => {
      return collator.compare(b.createdAt, a.createdAt)
    })
    setAllEmployees(sorted)
  }


        const [checkBoxValue, setCheckBoxValue] = useState([])
  

  async function ArchiveCheckBoxArray() {
    let userid = atob(JSON.parse(localStorage.getItem("IdLog")))
    const headers = { authorization: userid + " " + atob(JSON.parse(localStorage.getItem("AdMLog"))) };
    await axios.delete(`/EmpProfile/ArchiveCheckBoxArray/${checkBoxValue}`, { headers })
      .then((res) => {
        console.log(res.data)
        if (res.data === "success") {
          getEmployees()
          alert("Archived succesfully")
          window.location.reload()
        }
      }).catch((err) => {
        alert("some thing went wrong")
      })
  }
  async function deleteCheckedJobs() {
    let userid = atob(JSON.parse(localStorage.getItem("IdLog")))
    const headers = { authorization: userid + " " + atob(JSON.parse(localStorage.getItem("AdMLog"))) };
    await axios.delete(`/StudentProfile/deleteCheckBoxArray/${checkBoxValue}`, { headers })
      .then((res) => {
        if (res.data === "success") {
          getEmployees()
          alert("deleted succesfully")
          window.location.reload()
        }
      }).catch((err) => {
        alert("some thing went wrong")
      })
  }


  function checkBoxforDelete(id) {

    const checkedid = checkBoxValue.findIndex((checkedid) => {
      return (
        checkedid === id
      )
    })
    if (checkedid < 0) {
      setCheckBoxValue([...checkBoxValue, id])
    } else {
      // checkBoxValue.splice(checkedid, 1)
      let removeId = checkBoxValue.filter((foundId) => {
        return (
          foundId !== id
        )
      })
      setCheckBoxValue(removeId)
    }
  }

  return (
    <>     

      <h4 style={{marginLeft:"20px", marginTop:"10px"}}>All Employees for admin</h4>
      <div className={styles.searchBoth}>
              <p className={styles.p}>Search </p>
              <input className={styles.inputboxsearch} type="text" placeholder='Search for a Job / Skills / Location/Experiance' onChange={(e) => { search(e) }} />
            </div> 
            {Result?
            <h4 style={{marginLeft:"14%", marginTop:"10px"}}> {AllEmployees.length} matching Result Found  </h4>
            :""
}

<div style={{marginLeft:"10px"}}>
      <label><input id="checkApproved" name="checkApproved" type="radio" onChange={(e)=>{AllEmployeesApANdDis(e)}} /><span>All Employers</span></label><br></br>
      <label><input id="checkApproved" name="checkApproved" type="radio" onChange={(e)=>{checkAllApproved(e)}} /><span>Approved Employers</span></label><br></br>
      <label><input id="checkApproved" name="checkApproved" type="radio" onChange={(e)=>{checkAllNotApproved(e)}} /><span> Employers who are yet to be approved</span></label><br></br>
      <label><input id="checkApproved" name="checkApproved" type="radio" onChange={(e)=>{RecentLogin(e)}} /><span> Recent Login</span></label><br></br>
      <label><input id="checkApproved" name="checkApproved" type="radio" onChange={(e)=>{checkOnline(e)}} /><span>check Online</span></label><br></br>
      </div>
       <div className={Styles.JobtitleFilterWrapper}>
                         <buton className={Active.length===0?Styles.active:Styles.JobtitleFilter} onClick={() => 
                      { getEmployees() }}>All</buton>
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
                      {uniqueList.length} </span>Jobs with following matching tags:
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
                <div style={{display:"flex", justifyContent:"space-between"}}>
      
                <div style={{marginBottom:"5px", marginTop:"0", marginLeft:"10px"}}>
                  Show  <select onChange={(e) => { handleRecordchange(e) }}>
                    <option selected = {lastIndex === 10} value={10}>10</option>
                    <option selected = {lastIndex === 25} value={25}>25</option>
                    <option selected = {lastIndex === 50} value={50}>50</option>
                    <option selected = {lastIndex === 100} value={100}>100</option>
                  </select>  jobs per page
                  </div>

                  {checkBoxValue.length > 0 ?
        <>
          <button style={{
            backgroundColor: "blue", border: "none", color: "white",
            padding: "5px 10px", fontWeight: "bold", cursor: "pointer"
            }} onClick={() => { ArchiveCheckBoxArray() }}>Archive</button>

          {/* <button style={{
            backgroundColor: "red", border: "none", color: "white", marginLeft: "5px",
            padding: "5px 10px", fontWeight: "bold", cursor: "pointer"
          }} onClick={() => { deleteCheckedJobs() }}>Delete</button> */}
        </>
        : ""
      }
      </div>
      
      {screenSize.width>850?

      

<div className={styles.tableWrapper}>
  <div className={styles.tableContainer}>
    <table className={styles.employeeTable}>

      <thead>
        <tr>

          {/* Employee Name */}
          <th>
            <div className={styles.thContent}>
              <span>Emp. Name</span>
            </div>
          </th>

          {/* Phone */}
          <th>
            <div className={styles.thContent}>
              <span>Emp. Phone Number</span>
            </div>
          </th>

          {/* Company */}
          <th>
            <div className={styles.thContent}>
              <span>Company Name</span>
            </div>
          </th>

          {/* Address */}
          <th>
            <div className={styles.thContent}>
              <span>Company Address</span>
            </div>
          </th>

          {/* Registration Date */}
          <th>
            <div className={styles.thContent}>
              <span>Reg. Date</span>

              <div className={styles.sortButtons}>
                <button
                  type="button"
                  onClick={RegAscendingOrder}
                  className={styles.sortButton}
                  title="Oldest first"
                >
                  ↑
                </button>

                <button
                  type="button"
                  onClick={RegDescendingOrder}
                  className={styles.sortButton}
                  title="Newest first"
                >
                  ↓
                </button>
              </div>
            </div>
          </th>

          {/* Last Login */}
          <th>
            <div className={styles.thContent}>
              <span>Last Log</span>

              <div className={styles.sortButtons}>
                <button
                  type="button"
                  onClick={LastActAscendingOrder}
                  className={styles.sortButton}
                  title="Oldest first"
                >
                  ↑
                </button>

                <button
                  type="button"
                  onClick={LastActDescendingOrder}
                  className={styles.sortButton}
                  title="Newest first"
                >
                  ↓
                </button>
              </div>
            </div>
          </th>

          {/* Website */}
          <th>
            <div className={styles.thContent}>
              <span>Company Website</span>
            </div>
          </th>

          {/* Approval */}
          <th>
            <div className={styles.thContent}>
              <span>Approval</span>
            </div>
          </th>

          {/* Message */}
          <th>
            <div className={styles.thContent}>
              <span>Message</span>
            </div>
          </th>

          {/* Action */}
          <th>
            <div className={styles.thContent}>
              <span>Action</span>
            </div>
          </th>

        </tr>
      </thead>


      <tbody>

        {AllEmployees.length > 0 ? (

          AllEmployees.map((items, i) => (

            <tr key={items._id || i}>

              {/* Employee Name */}
              <td className={styles.nameCell}>

                <button
                  type="button"
                  className={styles.nameButton}
                  title="Click to Check the Full Profile"
                  onClick={() =>
                    navigate(
                      `/BIAddmin@CheckEmpProfile/${items._id}`
                    )
                  }
                >

                  {items.online && (
                    <span className={styles.onlineDot}></span>
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


              {/* Company Name */}
              <td className={styles.companyNameCell}>
                {items.CompanyName || "N/A"}
              </td>


              {/* Company Address */}
              <td className={styles.addressCell}>
                {items.CompanyAddress || "N/A"}
              </td>


              {/* Registration Date */}
              <td className={styles.dateCell}>

                {items.createdAt
                  ? new Date(
                      items.createdAt
                    ).toLocaleString("en-US", {
                      month: "short",
                      day: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                    })
                  : "N/A"}

              </td>


              {/* Last Login */}
              <td className={styles.dateCell}>

                {items.LogedInTime
                  ? new Date(
                      items.LogedInTime
                    ).toLocaleString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                    })
                  : "Only Reg. Yet"}

              </td>


              {/* Company Website */}
              <td className={styles.websiteCell}>

                {items.CompanyWebsite ? (
                  <a
                    href={
                      items.CompanyWebsite.startsWith("http")
                        ? items.CompanyWebsite
                        : `https://${items.CompanyWebsite}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.websiteLink}
                  >
                    {items.CompanyWebsite}
                  </a>
                ) : (
                  <span className={styles.notUpdated}>
                    Not Updated
                  </span>
                )}

              </td>


              {/* Approval */}
              <td className={styles.approvalCell}>

                {items.isApproved ? (

                  <button
                    className={`${styles.statusButton} ${styles.Approved}`}
                    onClick={() =>
                      DisApprove(items._id, false)
                    }
                  >
                    Approved &#10004;
                  </button>

                ) : items.isReject ? (

                  <button
                    className={`${styles.statusButton} ${styles.Rejected}`}
                    onClick={() =>
                      unReject(items._id, false)
                    }
                  >
                    Rejected &#10004;
                  </button>

                ) : items.isOnhold ? (

                  <button
                    className={`${styles.statusButton} ${styles.OnHold}`}
                    onClick={() =>
                      unHold(items._id, false)
                    }
                  >
                    On Hold &#10004;
                  </button>

                ) : (

                  <div className={styles.actionButtons}>

                    <button
                      className={`${styles.actionButton} ${styles.approveAction}`}
                      onClick={() =>
                        Approve(items._id, true)
                      }
                    >
                      Approve
                    </button>

                    <button
                      className={`${styles.actionButton} ${styles.rejectAction}`}
                      onClick={() =>
                        Reject(items._id, true)
                      }
                    >
                      Reject
                    </button>

                    <button
                      className={`${styles.actionButton} ${styles.holdAction}`}
                      onClick={() =>
                        Hold(items._id, true)
                      }
                    >
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
                    No message
                  </span>
                )}

              </td>


              {/* Delete Checkbox */}
              <td className={styles.deleteCell}>

                <label className={styles.checkboxWrapper}>
                  <input
                    type="checkbox"
                    onChange={() =>
                      checkBoxforDelete(items._id)
                    }
                  />

                  <span className={styles.checkmark}></span>
                </label>

              </td>

            </tr>

          ))

        ) : (

          <tr>
            <td
              colSpan="10"
              className={styles.noRecord}
            >
              No Record Found
            </td>
          </tr>

        )}

      </tbody>

    </table>
  </div>
</div>
      :
      <>
       
<div id={styles.JobCardWrapper}>

  {AllEmployees.length > 0 ? (
    AllEmployees.map((job) => (
      <div className={styles.JobCard} key={job._id}>

        {/* ================= HEADER ================= */}
        <div className={styles.cardHeader}>

          <div
            className={styles.profileInfo}
            onClick={() =>
              navigate(
                `/BIAddmin@CheckEmpProfile/${job._id}`
              )
            }
          >

            <div className={styles.avatar}>
              {job.name
                ? job.name.charAt(0).toUpperCase()
                : "?"}
            </div>

            <div className={styles.profileText}>

              <div className={styles.employeeName}>
                {job.name || "Name not updated"}
              </div>

              <div className={styles.registeredDate}>
                Registered{" "}
                {job.createdAt
                  ? new Date(
                      job.createdAt
                    ).toLocaleDateString("en-US", {
                      month: "short",
                      day: "2-digit",
                      year: "numeric",
                    })
                  : "N/A"}
              </div>

            </div>

          </div>


          {/* Account Status */}
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


        {/* ================= EMPLOYEE DETAILS ================= */}

        <div className={styles.detailsSection}>

          {/* Email */}
          <div className={styles.detailRow}>

            <span className={styles.detailLabel}>
              Email
            </span>

            <span className={styles.detailValue}>
              {job.email ? (
                job.email
              ) : (
                <span className={styles.notUpdated}>
                  Not updated
                </span>
              )}
            </span>

          </div>


          {/* Phone */}
          <div className={styles.detailRow}>

            <span className={styles.detailLabel}>
              Phone
            </span>

            <span className={styles.detailValue}>
              {job.phoneNumber ? (
                job.phoneNumber
              ) : (
                <span className={styles.notUpdated}>
                  Not updated
                </span>
              )}
            </span>

          </div>


          {/* Company Name */}
          <div className={styles.detailRow}>

            <span className={styles.detailLabel}>
              Company
            </span>

            <span className={styles.detailValue}>
              {job.CompanyName ? (
                job.CompanyName
              ) : (
                <span className={styles.notUpdated}>
                  Not updated
                </span>
              )}
            </span>

          </div>


          {/* Company Contact */}
          <div className={styles.detailRow}>

            <span className={styles.detailLabel}>
              Company Contact
            </span>

            <span className={styles.detailValue}>
              {job.CompanyContact ? (
                job.CompanyContact
              ) : (
                <span className={styles.notUpdated}>
                  Not updated
                </span>
              )}
            </span>

          </div>


          {/* Company Email */}
          <div className={styles.detailRow}>

            <span className={styles.detailLabel}>
              Company Email
            </span>

            <span className={styles.detailValue}>
              {job.CompanyEmail ? (
                job.CompanyEmail
              ) : (
                <span className={styles.notUpdated}>
                  Not updated
                </span>
              )}
            </span>

          </div>


          {/* Organisation Type */}
          <div className={styles.detailRow}>

            <span className={styles.detailLabel}>
              Organisation
            </span>

            <span className={styles.detailValue}>
              {job.TypeofOrganisation ? (
                job.TypeofOrganisation
              ) : (
                <span className={styles.notUpdated}>
                  Not updated
                </span>
              )}
            </span>

          </div>


          {/* Website */}
          <div className={styles.detailRow}>

            <span className={styles.detailLabel}>
              Website
            </span>

            <span className={styles.detailValue}>

              {job.CompanyWebsite ? (
                <a
                  href={
                    job.CompanyWebsite.startsWith("http")
                      ? job.CompanyWebsite
                      : `https://${job.CompanyWebsite}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.websiteLink}
                >
                  {job.CompanyWebsite}
                </a>
              ) : (
                <span className={styles.notUpdated}>
                  Not updated
                </span>
              )}

            </span>

          </div>

        </div>


        {/* ================= COMPANY ADDRESS ================= */}

        <div className={styles.infoBox}>

          <div className={styles.infoTitle}>
            Company Address
          </div>

          {job.CompanyAddress ? (
            <div className={styles.infoValue}>
              {job.CompanyAddress}
            </div>
          ) : (
            <div className={styles.notUpdated}>
              Not updated
            </div>
          )}

        </div>


        {/* ================= ACCOUNT STATUS ================= */}

        <div className={styles.accountSection}>

          <div className={styles.accountTitle}>
            Account Status
          </div>

          {job.isApproved ? (

            <button
              className={styles.Approved}
              onClick={() =>
                DisApprove(job._id, false)
              }
            >
              ✓ Approved
            </button>

          ) : (

            <button
              className={styles.Approve}
              onClick={() =>
                Approve(job._id, true)
              }
            >
              Approve
            </button>

          )}

        </div>


        {/* ================= MESSAGE ================= */}

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


        {/* ================= VIEW PROFILE ================= */}

        <button
          className={styles.viewProfile}
          onClick={() =>
            navigate(
              `/BIAddmin@CheckEmpProfile/${job._id}`
            )
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
      </>
}
    </>
  )
}


export default AllEmployeesForadmin