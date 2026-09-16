import React, { useState, useEffect, useRef } from 'react';

import Footer from '../Footer/Footer';
import styles from "./MyCreatedResume.module.css"
import style from "./ResumePreview.module.css"
import axios from "axios";
import { Link, useNavigate, BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { TailSpin, Puff } from "react-loader-spinner"
import location from "../img/icons8-location-20.png"
import graduation from "../img/icons8-graduation-cap-40.png"
import { jobTags } from '../Tags.js'
import HTMLReactParser from 'html-react-parser'


import useScreenSize from '../SizeHook';
import socketIO from 'socket.io-client';

import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import CompanyLogo from '../img/company-logo.png'

const options = [
  { value: "bangalore", label: "Bangalore, India", img: location },
  { value: "san Francisco", label: "San Francisco, USA", img: location },
  { value: "new york", label: "New York, USA", img: location },
  { value: "sydney", label: "Sydney, Australia", img: location },
  { value: "london", label: "London, UK", img: location },
  { value: "berlin", label: "Berlin, Germany", img: location },
];
const responsive = {

  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 14
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 2
  },
  mobile: {
    breakpoint: { max: 864, min: 0 },
    items: 1
  }
};

// import { Bars } from  'react-loader-spinner'
function MyCreatedResume({ searchKey, setsearchKey, Filtereredjobs, setFiltereredjobs
  , Result, setResult, PageLoader, setPageLoader, totalCount, settotalCount, search, searchIcon, url
  , searchClick, setSearchClick, ShowSideNave, setShowSideNave, showMobileSearchIcon, setShowMobileSearchIcon
}) {

  // useEffect(() => {
  //   const socket = socketIO.connect(url, {
  //     auth: {
  //       token: JSON.parse(localStorage.getItem("StudId"))
  //     }
  //   });
  // }, [])


  let JobLocationTags = ["Bangalore"]

  const [jobs, setJobs] = useState()
  const [Filterjobs, setFilterjobs] = useState([])
  const [selectedOption, setSelectedOption] = useState(options[0]);
  const [isOpen, setIsOpen] = useState(false);
  const [nopageFilter, setNoPageFilter] = useState(false)
  // const [Filtereredjobs, setFiltereredjobs] = useState([])

  const [isReadMore, setIsReadMore] = useState(true)
  const [jobapplied, setjobapplied] = useState(false)
  const [userProfile, setuserProfile] = useState([])
  const [showJobs, setshowJobs] = useState(false)
  const [showExperiance, setshowExperiance] = useState(false)
  const [showPackage, setshowPackage] = useState(false)
  // const [PageLoader, setPageLoader] = useState(false)
  // const [Result, setResult] = useState(false)
  const [nojob, setnojob] = useState("")
  const screenSize = useScreenSize();
  const [Active, setActive] = useState([])

  const [Loader, setLoader] = useState(false)

  const [clickedJobId, setclickedJobId] = useState() //for single job loader
  let jobSeekerId = JSON.parse(localStorage.getItem("CSCId"))

  // const [totalCount, settotalCount] = useState()

  // let recordsperpage = JSON.parse(sessionStorage.getItem("recordsperpage"))

  const [currentPage, setCurrentPage] = useState(1)
  const [recordsPerPage, setrecordsPerPage] = useState(10)
  const [jobsPerPageValue, setJobsPerPageValue] = useState(10);

  const lastIndex = currentPage * recordsPerPage //10
  const firstIndex = lastIndex - recordsPerPage //5
  const records = jobs?.slice(firstIndex, lastIndex)//0,5
  // const npage = Math.ceil(jobs?.length / recordsPerPage) // last page
  const npage = Math.ceil(totalCount / recordsPerPage) // last page
  const csCenter = localStorage.getItem("CSCLog")

  const navigate = useNavigate()
  const Location = useLocation()

  useEffect(() => {
    getjobs()
  }, [])

  const [mailsent, setMailsent] = useState()
  const [isEditEnable, setIsEditEnable] = useState(false)
  const [id, setId] = useState()

  const [jobseekerForm, setJobseekerForm] = useState({
    email: "",
    phone: ""
  });

  const intervalRef = useRef(null);
  const { state } = useLocation();

  const [resumeAlert, setResumeAlert] = useState({
    show: false,
    selected: null
  });
  function navig() {
    if (resumeAlert.selected === "one") {
      navigate("/resume-form", {
        state: { formstate: "experience", selectedTemplate: resumeAlert.selected }
      });
    }
    else if (resumeAlert.selected === "two") {
      navigate("/resume-form", {
        state: { formstate: "entrylevelambition", selectedTemplate: resumeAlert.selected }
      });
    }
    else if (resumeAlert.selected === "three") {
      navigate("/resume-form", {
        state: { formstate: "entrylevelpro", selectedTemplate: resumeAlert.selected }
      });
    }
    else if (resumeAlert.selected === "five") {
      navigate("/resume-form", {
        state: { formstate: "testing", selectedTemplate: resumeAlert.selected }
      });
    }
    else if (resumeAlert.selected === "six") {
      navigate("/resume-form", {
        state: { formstate: "nontech", selectedTemplate: resumeAlert.selected }
      });
    }
    else if (resumeAlert.selected === "seven") {
      navigate("/resume-form", {
        state: { formstate: "nontech", selectedTemplate: resumeAlert.selected }
      });
    }
    else if (resumeAlert.selected === "eight") {
      navigate("/resume-form", {
        state: { formstate: "nontech", selectedTemplate: resumeAlert.selected }
      });
    }
    else if (resumeAlert.selected === "four") {
      navigate("/resume-form", {
        state: { formstate: "fullstack", selectedTemplate: resumeAlert.selected }
      });
    }
    else {
      navigate("/resume-form", {
        state: { formstate: "freshers", selectedTemplate: resumeAlert.selected }
      });
    }
    setResumeAlert({ show: false, selected: null });

  }


  useEffect(() => {
    if (!id) return;

    let interval;
    const checkEditEnable = async () => {
      try {
        const res = await axios.get(`/StudentProfile/checkEditEnableInTimeInterval/${id}`
        );
        if (res.data.message == 'edit time is over') {
          setMailsent("can not edit this profile again after 30 mins.")
        }
        if (res.data.isEditEnable === true) {
          clearInterval(interval);
          // localStorage.setItem("StudId", JSON.stringify(id));
          navig()
        }
      } catch (error) {
        console.error(error);
        // alert("something went wrong")
      }
    };
    checkEditEnable();
    // Then every 5 seconds
    intervalRef.current = setInterval(checkEditEnable, 5000);

    return () => {
      clearInterval(intervalRef.current);
    }
  }, [id]);

  async function handleOnNavigate() {
    if (!jobseekerForm.email) {
      return
    }
    await axios.post("/StudentProfile/regFromResume", { jobseekerForm })
      .then((res) => {
        let id = res.data.id
        // console.log(res.data)
        if (res.data == "backend error") {
          alert("something went wrong, please try again")
        } else if (res.data.message == "mail not sent") {
          alert("mail was not sent , please try again")
        } else if (res.data.message == "mail was sent successfully") {
          setMailsent("mail has been sent to Job seeker email id, ask Job seeker to verify the mail")
          setId(id)
          localStorage.setItem("StudId", JSON.stringify(id));
          localStorage.setItem("JobSLog", JSON.stringify(res.data.token));
          setJobseekerForm(prev => ({
            email: ""
          }))
        } else if (res.data == "invalid email") {
          setMailsent("invalid email address")
        } else if (res.data.message == "isEditEnable is aleady true") {
          localStorage.setItem("StudId", JSON.stringify(id));
          localStorage.setItem("JobSLog", JSON.stringify(res.data.token));
          setMailsent("already verified, click on edit button and start editing")
          setIsEditEnable(true)
        }

      }).catch((err) => {
        alert("some thing went wrong",)
      })
  }

  function handleCancele() {
    clearInterval(intervalRef.current);
    setResumeAlert({ show: false, selected: null });
    setMailsent("")
    setIsEditEnable(false)
    setJobseekerForm(prev => ({
      email: ""
    }))
  }

  async function gettotalcount() {
    const headers = { authorization: 'BlueItImpulseWalkinIn' };
    await axios.get("/CSRoute/getTotalCount", { headers })
      .then((res) => {
        console.log(res.data.result)
        settotalCount(res.data.result)
      }).catch((err) => {
        alert("something went wrong")
      })
  }

  async function getjobs() {
    setCount(1)
    setActive([])
    setJobTagsIds([])
    setPageLoader(true)
    setNoPageFilter(false)

    let userid = JSON.parse(localStorage.getItem("CSCId"))
    const headers = { authorization: userid + " " + atob(JSON.parse(localStorage.getItem("CSCLog"))) };
    await axios.get(`/StudentProfile/getMyCreatedResume/${userid}`, { headers })

      .then((res) => {
        let result = (res.data)
        let sortedate = result.sort((a, b) => {
          return new Date(b.createdAt) - new Date(a.createdAt);
        });
        setJobs(sortedate)
        setFilterjobs(sortedate)
        setPageLoader(false)
      }).catch((err) => {
        alert("server issue occured")
      })
  }

  // useEffect(() => {
  //   if (jobTagsIds?.length < 1) {
  //     getjobs()
  //   } else {
  //     getTagId();
  //   }
  // }, [currentPage, recordsPerPage])

  // ---------------------------fake alert-----------
  const [activeAlertId, setActiveAlertId] = useState(null);
  const [external, setExternal] = useState(false);

  const handleApplyClick = (id) => {
    setActiveAlertId(id);
  };

  const handleOkClick1 = (Link, id) => {
    setExternal(true)
    setActiveAlertId(null); // close alert
    applyforJob(id);
    applyforOtherJob(Link)
  };

  const handleOkClick2 = (id) => {
    setActiveAlertId(null); // close alert
    applyforJob(id);
  };

  const handlecancelClick = () => {
    setActiveAlertId(null);
  };
  const alertRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (event) => {
      // If clicked outside alert box and it's open
      if (alertRef.current && !alertRef.current.contains(event.target)) {
        setActiveAlertId(null); // close the alert
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);



  async function applyforOtherJob(Link) {
    // navigate("/JobSeekerLogin", { state: { Jid: id } })
    // alert(" ITWALKIN.com never charges fees for job applications. If you encounter misuse or payment requests, report it through our website." )
    window.open(`${Link}`)
  }

  async function applyforJob(jobId) {
    // alert(" ITWALKIN.com never charges fees for job applications. If you encounter misuse or payment requests, report it through our website." )
    let date = new Date()
    let userid = JSON.parse(localStorage.getItem("CSCId"))
    const headers = { authorization: userid + " " + atob(JSON.parse(localStorage.getItem("CSCLog"))) };
    setclickedJobId(jobId)
    setLoader(true)
    // setTimeout(async () => {

    await axios.put(`/jobdddddddpost/updatforJobApply/${jobId}`, { jobSeekerId, date, external }, { headers })
      .then((res) => {
        if (res.data) {
          setLoader(false)
          getjobs()
          setExternal(false)
        }
      }).catch((err) => {
        alert("server issue occured", err)
      })
    // }, 5000)
  }



  // const [searchKey, setsearchKey] = useState()
  // const [jobs, setJobs] = useState([])  
  async function searchIcon(key) {
    setNoPageFilter(true)
    setFiltereredjobs(key)
    setsearchKey(key)
    if (key) {
      setResult(true)
      let dubmyjobs = [...Filterjobs]
      const filteredItems = dubmyjobs.filter((user) => {
        if (JSON.stringify(user).includes(key.toLowerCase())) {
          return user
        }
      })
      setJobs(filteredItems)
    } else {
      getjobs()
      setResult(false)
    }
  }

  async function search(e) {
    setNoPageFilter(true)
    let key = e.target.value
    setsearchKey(key)

    setFiltereredjobs(key)
    if (key) {
      setResult(true)
      let dubmyjobs = [...Filterjobs]
      const filteredItems = dubmyjobs.filter((user) =>
        JSON.stringify(user).toLowerCase().includes(key.toLowerCase())
      )
      setJobs(filteredItems)
    } else {
      getjobs()
      setResult(false)
    }
  }

  function sortbyOldjobs() {
    let newjob = [...jobs]
    let oldjobSort = newjob.sort(function (a, b) {
      return new Date(a.createdAt) - new Date(b.createdAt);
    })
    setJobs(oldjobSort)

  }
  function sortbyNewjobs() {
    let newjob = [...jobs]
    let newjobSort = newjob.sort(function (a, b) {
      return new Date(b.createdAt) - new Date(a.createdAt);
    })
    setJobs(newjobSort)

  }

  function SdescendingOrder() {
    let newJobs = [...jobs]

    const collator = new Intl.Collator(undefined, {
      numeric: true,
      sensitivity: 'base'
    });
    const sorted = newJobs.sort((a, b) => {
      return collator.compare(b.salaryRange, a.salaryRange)
    })
    setJobs(sorted)
  }

  function SascendingOrder() {
    let newJObs = [...jobs]

    const collator = new Intl.Collator(undefined, {
      numeric: true,
      sensitivity: 'base'
    });
    const sorted = newJObs.sort((a, b) => {
      return collator.compare(a.salaryRange, b.salaryRange)
    })
    setJobs(sorted)
  }

  function EdescendingOrder() {
    let newjob = [...jobs]

    const collator = new Intl.Collator(undefined, {
      numeric: true,
      sensitivity: 'base'
    });
    const sorted = newjob.sort((a, b) => {
      return collator.compare(b.experiance, a.experiance)
    })
    setJobs(sorted)

  }

  function EascendingOrder() {
    let newjob = [...jobs]

    const collator = new Intl.Collator(undefined, {
      numeric: true,
      sensitivity: 'base'
    });
    const sorted = newjob.sort((a, b) => {
      return collator.compare(a.experiance, b.experiance)
    })
    setJobs(sorted)
  }

  // const [jobTitle, setjobTitle] = useState("")
  const [jobLocation, setjobLocation] = useState("AllL")
  const [jobTitle, setjobTitle] = useState("")
  // const [getJobTitle, setgetJobTitle] = useState(true)

  async function getjobTitleAll(all) {
    await axios.get("/jobpost/getjobs")
      .then((res) => {
        let result = (res.data)
        let sortedate = result.sort((a, b) => {
          return new Date(b.createdAt) - new Date(a.createdAt);
        });
        setJobs(sortedate)

      })
  }
  async function getjobsAllLoc(all) {
    await axios.get("/jobpost/getjobs")
      .then((res) => {
        let result = (res.data)
        let sortedate = result.sort((a, b) => {
          return new Date(b.createdAt) - new Date(a.createdAt);
        });
        setJobs(sortedate)

      })
  }

  async function JobtitleFilter(jobTitle) {
    await axios.get(`/jobpost/getjobTitle/${jobTitle}`)
      .then((res) => {
        let result = (res.data)
        let sortedate = result.sort(function (a, b) {
          return new Date(b.createdAt) - new Date(a.createdAt);
        });
        setJobs(sortedate)
        // setPageLoader(false)
      }).catch((err) => {
        alert("some thing went wrong")
      })
  }

  async function getBothFiltered(jobTitle) {

    await axios.post(`/jobpost/getBothjobFilter/${jobLocation}`, { jobTitle })
      .then((res) => {
        let result = (res.data)
        // console.log(result)
        let sortedate = result.sort(function (a, b) {
          return new Date(b.createdAt) - new Date(a.createdAt);
        });
        setJobs(sortedate)
        // setPageLoader(false)
      }).catch((err) => {
        alert("some thing went wrong")
      })
  }


  function firstPage(id) {
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
    // sessionStorage.setItem("recordsperpage", JSON.stringify(e.target.value));
    // let recordsperpage = JSON.parse(sessionStorage.getItem("recordsperpage"))
    setJobsPerPageValue(Number(e.target.value));
    setrecordsPerPage(Number(e.target.value))
    setCurrentPage(1)
  }

  async function getLocation(jobLocation) {
    setCount(1)
    setActive([])

    setFiltereredjobs(jobLocation)
    setNoPageFilter(true)
    await axios.get(`/jobpost/getjobLocation/${jobLocation}`)
      .then((res) => {
        let result = (res.data)
        let sortedate = result.sort(function (a, b) {
          return new Date(b.createdAt) - new Date(a.createdAt);
        });
        setJobs(sortedate)
        // setPageLoader(false)
      }).catch((err) => {
        alert("some thing went wrong")
      })
  }

  const [count, setCount] = useState(1)
  const [jobTagIds, setjobTagIds] = useState([])

  const [jobTagsIds, setJobTagsIds] = useState([])
  // console.log("all dublicate ids", jobTagsIds)
  //  useEffect(()=>{
  //   setJobTagsIds([])
  //   setJobs([])
  //   getjobs()
  //  },[])

  // useEffect(() => {
  //   // console.log("jobTgaids---->",jobTagsIds)
  //   // setJobTagsIds([])
  //   if (jobTagsIds?.length > 0) {
  //     // setJobs([])
  //     // getjobs()
  //     getTagId();
  //   }
  // }, [jobTagsIds])

  // ----------------------exp----------------------  


  // ----------------------exp-----------------

  // const [pathChanged, setPathChanged] = useState(false);

  let ids = jobTagsIds.map((id) => {
    return (
      id._id
    )
  })

  const uniqueList = [...new Set(ids)];

  async function getTagId() {
    settotalCount(uniqueList?.length)
    await axios.get(`/jobbbbbpost/jobTagsIds/${uniqueList}`, {
      params: { currentPage, recordsPerPage }
    })
      .then((res) => {
        // console.log("data from uique id's",res.data)
        let result = res.data
        let sortedate = result.sort((a, b) => {
          return new Date(b.createdAt) - new Date(a.createdAt);
        });
        setJobs(sortedate)
        if (count == 2) {
          setCurrentPage(1)
        }

      })
    // console.log("sd",jobs)
  }

  // useEffect(() => {
  //   if (Active?.length > 0) {
  //     changeTags()
  //   }
  // }, [Active])

  async function filterByJobTitle(key) {
    // console.log("clicked")
    if (count == 1) {
      setJobs([])
    }
    setCount(prev => prev + 1)
    const isIndex = Active.findIndex((present) => {
      return (
        present === key
      )
    })
    if (isIndex < 0) {
      // setActive([...Active, key])

      var updatedActive = [...Active, key]; // Add the new key to the array
      setActive(updatedActive);

    } else {
      const IndexId = Active.findIndex((present) => {
        return (
          present == key
        )
      })
      Active.splice(IndexId, 1)
      if (Active?.length === 0) {
        getjobs()
        return false
      }

      changeTags()
      // console.log("in change",Active)
    }
  }
  async function changeTags(key) {
    // console.log("in APi",Active)

    setNoPageFilter(true)
    setFiltereredjobs(key)
    await axios.get(`/jobpostbbbbb/getTagsJobs/${Active}`)
      .then((res) => {
        let result = (res.data)
        // console.log("the total id's are", result)
        let sortedate = result.sort((a, b) => {
          return new Date(b.createdAt) - new Date(a.createdAt);
        });
        // setJobTagsIds(oldjobTagsIds => [...oldjobTagsIds, ...sortedate])
        setJobTagsIds(sortedate)
        // getTagId(sortedate)

        let elements = sortedate.flatMap(element => {

        });
      })
  }
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSelect = (option) => {
    setSelectedOption(option);
    setIsOpen(false);
  };
  // useEffect(()=>{
  //   setrecordsPerPage(1)
  // },[])
  // const[searchClick,setSearchClick]=useState(false);
  // console.log("jobs",jobs,"rcp",recordsPerPage)
  const selectedTag = useRef("")
  const updateTag = (tag) => {
    selectedTag.current = tag
  }

  return (
    <>

    
          {resumeAlert.show && (
            <div className={style.overlay}>
              <div
                ref={alertRef}
                className={style.alertBox}
                onClick={(e) => e.stopPropagation()}
              >
                {csCenter ?
                  <>
                    <p style={{ color: "green", fontStyle: "italic" }}>{mailsent}</p>
                    <h3>Enter Jobseeker Details</h3>
                    <input

                      disabled={mailsent}
                      type="email"
                      placeholder="Enter Email ID"
                      className={style.input}
                      value={jobseekerForm.email}
                      onChange={(e) =>
                        setJobseekerForm({
                          ...jobseekerForm,
                          email: e.target.value
                        })
                      }
                    />
                    <div className={style.btnGroup}>
                      {!isEditEnable ?
                        <button
                          className={style.successBtn}
                          onClick={() => { handleOnNavigate() }}
                        >
                          Verify Email
                        </button> : ""
                      }

                      <button
                        className={style.dangerBtn}
                        onClick={() => { handleCancele() }}
                      >
                        Cancel
                      </button>
                      {isEditEnable ?
                        <button className={style.successBtn} onClick={() => { navig() }}>
                          Edit
                        </button> : ""
                      }
                    </div>
                  </>
                  : ""
                }

              </div>
            </div>
          )}
      <h2 style={{ marginLeft: "10px", fontWeight: "800", marginTop: "6px", marginBottom: "-15px" }}> My Created Resume  </h2>
      {screenSize.width > 850 ?
        <>
          <div className={styles.NavConetenetWrapper}>


            {/* <div className={styles.LocationFilterWrapper}>
<div ref={dropdownRef} style={{ position: "relative" }}>
      <div style={{ display: "flex", marginLeft: "-40px", marginTop: "-5px" }}>
        <button
          onClick={() => setIsOpen((prev) => !prev)}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            fontSize: "24px",
            color: "#007bff",
          }}
        >
          <img className={styles.jobLocationImage} src={location} alt="Location" />
        </button>
        <p style={{ marginTop: "17px", fontWeight: "bold", color: "white" }}>
          {selectedOption?.label}
        </p>
      </div>

      {isOpen && (
        <div
          style={{
            position: "absolute",
            top: "45px",
            left: "-43px",
            background: "white",
            color: "black",
            borderRadius: "20px",
            width: "160px",
            padding: "15px",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
            animation: "fadeIn 0.2s ease-in-out",
          }}
        >

          <div
            style={{
              position: "absolute",
              top: "-9px",
              left: "25px",
              width: "0",
              height: "0",
              borderLeft: "10px solid transparent",
              borderRight: "10px solid transparent",
              borderBottom: "10px solid white",
            }}
          ></div>

          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {options.map((option) => (
              <li
                key={option.value}
                onClick={() => handleSelect(option)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "10px",
                  cursor: "pointer",
                  borderRadius: "10px",
                }}
              >
                <img
                  src={option.img}
                  alt={option.label}
                  style={{ width: "22px", height: "22px", marginRight: "12px" }}
                />
                <span>{option.label}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div> */}

            {/* {
    JobLocationTags.map((location, i) => {
      return (
        <>
        <label className={styles.JobLocationFilter}>
        <input type="radio" checked disabled={location == "Chennai" ||
        location == "Hyderabad" || location == "Mumbai" || location == "Delhi"} name="filter" onClick={() => 
            { getjobs()}} />{location}</label><br></br>
            </>
      )
    })
  } */}
            {/* </div>       */}

            {/* <div className={styles.searchBothForNavWrapper}>
  <input className={styles.inputboxsearchNav} type="text" placeholder='Search for a Job / Skills / Location / Experiance' onChange={(e) => { search(e) }} />

  <i style={{ color: "rgb(40, 4, 99)", fontSize: "18px", cursor: "pointer" , marginLeft:"2%"}} onClick={() => { searchIcon(searchKey) }}
    class="fa fa-search" ></i>
</div> */}
          </div>
          {/* {Result ?
            <h4 style={{ marginLeft: "40%", marginTop: "20px" }}> {jobs?.length} matching Result Found  </h4>
            : ""
          } */}
        </>
        : ""
      }

      {screenSize.width > 850 ?
        <>

          <div className={styles.JobtitleFilterWrapper} style={{ marginTop: "65px" }} >
            <buton className={Active?.length === 0 ? styles.active : styles.JobtitleFilter} onClick={() => { getjobs() }}>All</buton>
            {
              jobTags.map((tags, i) => {
                return (
                  // <buton className={Active === tags.value ? styles.active : styles.JobtitleFilter} onClick={() => { filterByJobTitle(tags.value) }}>{tags.value} </buton>
                  <button disabled={tags.value === "NON TECH RESUME" || tags.value === "TECHNOLOGIES" || tags.value === "EDUCATION" || tags.value === "COLLEGE TYPE" || tags.value === "NOTICE PERIOD" || tags.value === "SALARY" ||
                    tags.value === "EXPERIENCE" || tags.value === "Job Type" || tags.value === "INDUSTRY" || tags.value === "TOOLS/PROTOCOLS"
                    || tags.value === "ROLE" || tags.value === "COMPANY TYPE"
                  }
                    className={tags.value === "NON TECH RESUME" || tags.value === "TECHNOLOGIES" || tags.value === "EDUCATION" || tags.value === "COLLEGE TYPE" || tags.value === "NOTICE PERIOD" || tags.value === "SALARY" ||
                      tags.value === "EXPERIENCE" || tags.value === "Job Type" || tags.value === "INDUSTRY" || tags.value === "TOOLS/PROTOCOLS"
                      || tags.value === "COMPANY TYPE" || tags.value === "ROLE" ?
                      styles.TagHeading :
                      // Active === tags.value ? 
                      Active?.findIndex((present) => {
                        return (
                          present === tags.value
                        )
                      }) >= 0 ?
                        styles.active : styles.JobtitleFilter} onClick={() => { filterByJobTitle(tags.value); updateTag(tags.value) }}>{tags.value} </button>

                )
              })
            }
          </div>

          <div style={{ display: "flex", justifyContent: "space-between" }}>
            {nopageFilter ?
              // <p style={{ fontWeight: 400, marginLeft: "10px" }}>Displaying <span style={{ color: "blue" }}>
              //   {uniqueList?.length} </span>Jobs with following matching tags:
              //   <span style={{ color: "blue" }}>{Active.toString()}</span></p>
              <p style={{ fontWeight: 400, marginLeft: "10px" }}>Displaying <span style={{ color: "blue" }}>
                {jobs?.length} </span>Jobs with following matching tags:
                <span style={{ color: "blue" }}>{Active.toString()}</span></p>

              :
              <p style={{ fontWeight: 400, marginLeft: "10px" }}>Showing {firstIndex + 1} to {lastIndex} latest jobs</p>
            }
            <div className={styles.navigationWrapper}>
              <button disabled={currentPage === 1} style={{ display: "inline", margin: "5px" }} className={styles.navigation} onClick={firstPage}>
                <i class='fas fa-step-backward'></i>
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
          <div style={{ marginBottom: "5px", marginTop: "0", marginLeft: "10px" }}>
            Show  <select onChange={(e) => { handleRecordchange(e) }}>
              {/* <option selected={lastIndex === 10} value={10}>10</option>
              <option selected={lastIndex === 25} value={25}>25</option>
              <option selected={lastIndex === 50} value={50}>50</option>
              <option selected={lastIndex === 100} value={100}>100</option> */}
              <option selected={jobsPerPageValue == 10} value={10}>10</option>
              <option selected={jobsPerPageValue == 25} value={25}>25</option>
              <option selected={jobsPerPageValue == 50} value={50}>50</option>
              <option selected={jobsPerPageValue == 100} value={100}>100</option>
            </select>  jobs per page
          </div>

          <div className={styles.Uiwarpper}>

            <ul className={styles.ul} style={{ color: 'white', fontWeight: "bold" }}>

              <li style={{ backgroundColor: " rgb(40, 4, 99)" }} className={`${styles.li} ${styles.Jtitle}`}>Name</li>
              <li style={{ backgroundColor: " rgb(40, 4, 99)" }} className={`${styles.li} ${styles.Source}`}>Email Id</li>
              {/* <li style={{ backgroundColor: " rgb(40, 4, 99)" }} className={`${styles.li} ${styles.CompanyName}`}>Company Name</li>
              <li style={{ backgroundColor: " rgb(40, 4, 99)" }} className={`${styles.li} ${styles.JobType}`}>JobType</li> */}
              <li style={{ backgroundColor: " rgb(40, 4, 99)" }} className={`${styles.li} ${styles.date}`}>Created Date
                <p className={styles.arrowWrapper} >
                  <i onClick={sortbyNewjobs} className={`${styles.arrow} ${styles.up}`}> </i>
                  <i onClick={sortbyOldjobs} className={`${styles.arrow} ${styles.down}`}></i>
                </p >
              </li>

              <li style={{ backgroundColor: " rgb(40, 4, 99)" }} className={`${styles.li} ${styles.Skills}`}>Resume Type</li>
              <li style={{ backgroundColor: " rgb(40, 4, 99)" }} className={`${styles.li} ${styles.Location}`}>Edit</li>
              <li style={{ backgroundColor: " rgb(40, 4, 99)" }} className={`${styles.li} ${styles.Status}`}>Action(View/ Download)</li>

            </ul>
            {PageLoader ?
              <div>
                <Puff height="80" width="80" color="#4fa94d" ariaLabel="bars-loading" wrapperStyle={{ marginLeft: "49%", marginTop: "50px" }} />
                <p style={{ marginLeft: "50%", color: "red" }}>Loading...</p>
              </div>
              :
              (
                jobs?.length > 0 ?
                  jobs.map((items, i) => {
                    return (

                      <ul className={styles.ul} key={i}>

                        <li className={`${styles.li} ${styles.Jtitle}`}
                          style={{ cursor: "pointer", textDecoration: "underline", color: "blue" }}>{items?.name?.toUpperCase()}
                        </li>
                        <li className={`${styles.li} ${styles.Source}`}
                          style={{ cursor: "pointer", textDecoration: "underline", color: "blue" }}>{items?.email}
                        </li>
                        <li className={`${styles.li} ${styles.date}`}
                          style={{ cursor: "pointer", textDecoration: "underline", color: "blue" }}>
                          {new Date(items.ResumeCreatedDate).toLocaleString(
                            "en-US",
                            {
                              month: "short",
                              day: "2-digit",
                              year: "numeric",
                            }
                          )}
                        </li>


                        <li className={`${styles.li} ${styles.Skills}`}
                          style={{ cursor: "pointer", textDecoration: "underline", color: "blue" }}>{items?.selectedTemplate}
                        </li>
                        <li style={{ cursor: "pointer", textDecoration: "underline" }}

                          onClick={() =>
                            setResumeAlert({ show: true, selected: items?.selectedTemplate })}
                          className={`${styles.li} ${styles.Location}`}>Edit
                        </li>

                        <li style={{ cursor: "pointer", textDecoration: "underline" }}
                          onClick={() => { navigate("/resumes", { state: { selectedTemplate: items?.selectedTemplate } }) }}
                          className={`${styles.li} ${styles.Location}`}>View
                        </li>

                      </ul>

                    )
                  })
                  : <p style={{ marginLeft: "47%", color: "red" }}>No Data Found......</p>
              )
            }
          </div>


          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div style={{ marginTop: "14px", marginLeft: "10px" }} >
              Show  <select onChange={(e) => { handleRecordchange(e) }}>
                {/* <option selected={lastIndex === 10} value={10}>10</option>
                <option selected={lastIndex === 25} value={25}>25</option>
                <option selected={lastIndex === 50} value={50}>50</option>
                <option selected={lastIndex === 100} value={100}>100</option> */}
                <option selected={jobsPerPageValue == 10} value={10}>10</option>
                <option selected={jobsPerPageValue == 25} value={25}>25</option>
                <option selected={jobsPerPageValue == 50} value={50}>50</option>
                <option selected={jobsPerPageValue == 100} value={100}>100</option>
              </select>  jobs per page
            </div>

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

        </>
        :
        // Mobile View
        <>

          <>
            <div className={styles.JobtitleFilterWrapper}>
              <buton className={Active?.length === 0 ? styles.active : styles.JobtitleFilter} onClick={() => { getjobs() }}>All</buton>
              {
                jobTags.map((tags, i) => {
                  return (
                    // <buton className={Active === tags.value ? styles.active : styles.JobtitleFilter} onClick={() => { filterByJobTitle(tags.value) }}>{tags.value} </buton>
                    <button disabled={tags.value === "NON TECH RESUME" || tags.value === "TECHNOLOGIES" || tags.value === "EDUCATION" || tags.value === "COLLEGE TYPE" || tags.value === "NOTICE PERIOD" || tags.value === "SALARY" ||
                      tags.value === "EXPERIENCE" || tags.value === "Job Type" || tags.value === "INDUSTRY" || tags.value === "TOOLS/PROTOCOLS"
                      || tags.value === "ROLE" || tags.value === "COMPANY TYPE"
                    }
                      className={tags.value === "NON TECH RESUME" || tags.value === "TECHNOLOGIES" || tags.value === "EDUCATION" || tags.value === "COLLEGE TYPE" || tags.value === "NOTICE PERIOD" || tags.value === "SALARY" ||
                        tags.value === "EXPERIENCE" || tags.value === "Job Type" || tags.value === "INDUSTRY" || tags.value === "TOOLS/PROTOCOLS"
                        || tags.value === "COMPANY TYPE" || tags.value === "ROLE" ?
                        styles.TagHeading :
                        // Active === tags.value ? 
                        Active.findIndex((present) => {
                          return (
                            present === tags.value
                          )
                        }) >= 0 ?
                          styles.active : styles.JobtitleFilter} onClick={() => { filterByJobTitle(tags.value); updateTag(tags.value) }}>{tags.value} </button>

                  )
                })
              }
            </div>
            <p style={{ fontWeight: 400, marginLeft: "10px" }}>Displaying <span style={{ color: "blue" }}>
              {jobs?.length} </span>Jobs with following matching tags:
              <span style={{ color: "blue" }}>{Active.toString()}</span></p>
            <p style={{ fontWeight: 400, marginLeft: "10px" }}>Showing {firstIndex + 1} to {lastIndex} latest jobs</p>
            <div style={{ marginBottom: "5px", marginTop: "10px", marginLeft: "10px" }}>
              Show  <select onChange={(e) => { handleRecordchange(e) }}>
                {/* <option selected={lastIndex === 10} value={10}>10</option>
              <option selected={lastIndex === 25} value={25}>25</option>
              <option selected={lastIndex === 50} value={50}>50</option>
              <option selected={lastIndex === 100} value={100}>100</option> */}
                <option selected={jobsPerPageValue == 10} value={10}>10</option>
                <option selected={jobsPerPageValue == 25} value={25}>25</option>
                <option selected={jobsPerPageValue == 50} value={50}>50</option>
                <option selected={jobsPerPageValue == 100} value={100}>100</option>
              </select>  jobs per pages
            </div>
            <div className={styles.navigationWrapper} style={{ textAlign: "left" }}>
              <button disabled={currentPage === 1} style={{ display: "inline", margin: "5px" }} className={styles.navigation} onClick={firstPage}>
                <i class='fas fa-step-backward'></i>
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

            {PageLoader ?
              <div>
                <Puff height="80" width="80" color="#4fa94d" ariaLabel="bars-loading" wrapperStyle={{ marginLeft: "40%", marginTop: "50px" }} />
                <p style={{ marginLeft: "44%", color: "red" }}>Loading...</p>
              </div>
              :
              <div id={styles.JobCardWrapper} >
                {
                  jobs?.length > 0 ? (
                    jobs.map((items, i) => {
                      return (
                        <div className={styles.JobCard} key={i}>

                          {/* Name + Date */}
                          <div
                            className={styles.JobTitleDateWrapper}
                            style={{
                              marginTop: "-16px",
                              display: "flex",
                              flexDirection: "row",
                              alignItems: "center"
                            }}
                          >
                            <p
                              className={styles.jobTitle}
                              style={{
                                width: "100%",
                                whiteSpace: "normal",
                                cursor: "pointer",
                                textDecoration: "underline",
                                color: "blue"
                              }}
                            >
                              {items?.name?.toUpperCase()}
                            </p>

                            <p
                              className={styles.Date}
                              style={{
                                marginTop: "-5px",
                                whiteSpace: "nowrap"
                              }}
                            >
                              {new Date(items.ResumeCreatedDate).toLocaleString(
                                "en-US",
                                {
                                  month: "short",
                                  day: "2-digit",
                                  year: "numeric",
                                }
                              )}
                            </p>
                          </div>


                          {/* Template */}
                          <div style={{ marginTop: "25px" }}>
                            <span
                              style={{
                                fontWeight: "bold",
                                fontSize: "18px"
                              }}
                            >
                              Template:
                            </span>

                            <span
                              style={{
                                fontSize: "18px",
                                marginLeft: "5px"
                              }}
                            >
                              {items?.selectedTemplate}
                            </span>
                          </div>


                          {/* Email */}
                          <div style={{ marginTop: "18px" }}>
                            <span
                              style={{
                                fontWeight: "bold",
                                fontSize: "18px"
                              }}
                            >
                              Email:
                            </span>

                            <span
                              style={{
                                fontSize: "18px",
                                marginLeft: "5px",
                                color: "blue",
                                textDecoration: "underline"
                              }}
                            >
                              {items?.email}
                            </span>
                          </div>


                          {/* Edit + View Box */}
                          <div
                            className={styles.ApplyPackageJobseeker}
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              width: "100%",
                              marginTop: "20px",
                              padding: "12px 10px",
                              boxSizing: "border-box"
                            }}
                          >

                            {/* LEFT - Edit */}
                            <button
                              className={styles.ApplyMobileJobseeker}
                              style={{
                                margin: 0
                              }}
                              onClick={() => {
                                // Edit function
                              }}
                            >
                              Edit
                            </button>


                            {/* RIGHT - View */}
                            <button
                              className={styles.ApplyMobileJobseeker}
                              style={{
                                margin: 0
                              }}
                              onClick={() => {
                                navigate("/resumes", {
                                  state: {
                                    selectedTemplate: items?.selectedTemplate
                                  }
                                });
                              }}
                            >
                              View
                            </button>

                          </div>

                        </div>
                      );
                    })
                  ) : (
                    <p style={{ marginLeft: "47%", color: "red" }}>
                      No Data Found......
                    </p>
                  )
                }

              </div>
            }

            <div style={{ marginBottom: "5px", marginTop: "10px", marginLeft: "10px" }}>
              Show  <select onChange={(e) => { handleRecordchange(e) }}>
                {/* <option selected={lastIndex === 10} value={10}>10</option>
              <option selected={lastIndex === 25} value={25}>25</option>
              <option selected={lastIndex === 50} value={50}>50</option>
              <option selected={lastIndex === 100} value={100}>100</option> */}
                <option selected={jobsPerPageValue == 10} value={10}>10</option>
                <option selected={jobsPerPageValue == 25} value={25}>25</option>
                <option selected={jobsPerPageValue == 50} value={50}>50</option>
                <option selected={jobsPerPageValue == 100} value={100}>100</option>
              </select>  jobs per page
            </div>
            <div className={styles.navigationWrapper} style={{ textAlign: "left" }}>
              <button disabled={currentPage === 1} style={{ display: "inline", margin: "5px" }} className={styles.navigation} onClick={firstPage}>
                <i class='fas fa-step-backward'></i>
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

            <div style={{ marginTop: "20px", }}>
              <Footer />
            </div>
          </>
        </>
      }

    </>

  )
}

export default MyCreatedResume


