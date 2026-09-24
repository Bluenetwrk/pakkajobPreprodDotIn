import React, { useRef } from 'react'
import { useEffect, useState } from 'react'
import axios from "axios"
import Companylogo from "../img/logo.png"
import { useNavigate } from 'react-router-dom'
import Footer from '../Footer/Footer'
import JoditEditor from 'jodit-react'
import HTMLReactParser from 'html-react-parser'
import { Editor } from 'react-draft-wysiwyg';
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import Style from "./postJobs.module.css"
import styles from "../Profile/StudentProfile.module.css"
import { Puff } from 'react-loader-spinner'
import socketIO from 'socket.io-client';
import CreatableSelect from "react-select"
import useScreenSize from '../SizeHook';
import {jobTags} from "../Tags"
import CustomTextEditor from '../Editor/CustomTextEditor'

// import CreatableSelect  from 'react-select/creatable';

function PostJobs(props) {
    const screenSize = useScreenSize();

    const editor=useRef(null)
    // useEffect(() => {
    //     const socket = socketIO.connect(props.url, {
    //         auth: {
    //             token: JSON.parse(localStorage.getItem("EmpIdG"))
    //         }
    //     });
    // }, [])

    let empId = JSON.parse(localStorage.getItem("EmpIdG"))
    const [jobtitle, setJobTitle] = useState("")
    const [Source, setSource] = useState("")
    const [SourceLink, setSourceLink] = useState("")
    const [companyHomeLink, setCompanyHomeLink] = useState("")
    const [companyName, setCompanyName] = useState("")
    const [jobDescription, setJobDescription] = useState("")
    const [jobtype, setJobtype] = useState("")
    const [salaryRange, setSalaryRange] = useState("")
    const [joblocation, setJobLocation] = useState("")
    const [qualification, setQualification] = useState("")
    const [experiance, setExperiance] = useState("")
    const [errorMessage, setErrorMessage] = useState("")
    const [successMessage, setSuccessMessage] = useState("")
    const [Logo, setLogo] = useState()
    const [other, setother] = useState(false)
    const [others, setOthers] = useState(false)
    const [otherJobLocation, setotherJobLocation] = useState(false)

  const [Active, setActive] = useState([])

    const [profileData, setProfileData] = useState([])
    const [Tags, setTag] = useState([])

    const [skills, setSkills] = useState("")
    const [concent, setconcent] = useState(false)

  // -----------you tube code----------      
      const [videoFile, setVideoFile] = useState(null);
      const [videoPreview, setVideoPreview] = useState("");
      const [videoUrl, setVideoUrl] = useState(""); // existing URL
      const [ytUploading, setYtUploading] = useState(false);
      const [ytError, setYtError] = useState("");
      const fileInputRef = useRef(null);
      const [uploadConsent, setuploadConsent] = useState(false);
      const [disclaimerConsent, setdisclaimerConsent] = useState(false);
    
      useEffect(() => {
        if (profileData && profileData?.url) {
          setVideoUrl(profileData[0].url ? profileData[0].url : "");
          setVideoPreview(""); // YouTube preview replaces local preview
        }
      }, [profileData]);
    
      const removeLocalVideo = () => {
        setVideoPreview("");
        setVideoFile(null);
        setYtError("");
    
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      };
    
      const deleteYouTubeVideo = async () => {
        try {
          const response = await axios.post("/api/deleteYouTubeVideo", {
            url: videoUrl
          });
    
          setVideoUrl("");
          setVideoPreview("");
          setYtError("")
          alert("Video deleted successfully!");
    
        } catch (error) {
          alert("Failed to delete YouTube video.");
        }
      };
    
      const uploadVideoToYouTube = async (file) => {
        // let studId = JSON.parse(localStorage.getItem("StudId"))
        if (!file) {
          setYtError("No video selected.");
          return;
        }
    
        const formData = new FormData();
        formData.append("video", file);
    
        try {
          setYtUploading(true);
          setYtError("");
          setVideoUrl("");
          const res = await axios.post(`/jobpost/uploadToYouTube`,
            formData,
            {
              headers: { "Content-Type": "multipart/form-data" }
            }
          );
          console.log(res)
          setVideoUrl(res.data.url);
          setVideoPreview("");
          setYtError("Upload successful.");
    
        } catch (err) {
          console.log("video upload response", err)
          setYtError("Upload failed.");
        } finally {
          setYtUploading(false);
        }
      };
    

    function handleSalary(e){
        const sanitizedValue = e.target.value.replace(/[A-Za-z]/g, '');
        // if(e.target.value.includes(/[1-9]/g))
            if (sanitizedValue.length>2){
            return false
        }else{
            setSalaryRange(sanitizedValue)
        }
    }

    function handleExperiance(e){
        const sanitizedValue = e.target.value.replace(/[A-Za-z]/g, '');
        // if(e.target.value.includes(/[1-9]/g))
            if (sanitizedValue.length>2){
            return false
        }else{
        setExperiance(sanitizedValue)
        }
    }

    let navigate = useNavigate()

    async function getProfile() {
        const headers = { authorization: 'BlueItImpulseWalkinIn' };

        await axios.get(`/EmpProfile/getProfile/${empId}`, { headers })
            .then((res) => {
                let result = res.data.result
                console.log(result)
                let companyName = res.data.result.CompanyName
                setProfileData([result])
                setCompanyName(companyName)
            }).catch((err) => {
                alert("some thing went wrong")
            })
    }

    useEffect(() => {
        getProfile()
    }, [])

    async function getLogo() {
        let userid = JSON.parse(localStorage.getItem("EmpIdG"))
        const headers = { authorization: userid + " " + atob(JSON.parse(localStorage.getItem("EmpLog"))) };
        await axios.get(`/EmpProfile/getLogo/${empId}`, { headers })
            .then((res) => {
                let result = res.data
                console.log("logo",result)
                setLogo(result)
            }).catch((err) => {
                alert("some thing went wrong")
            })
    }

    useEffect(() => {
        getLogo()
    }, [])

// useEffect(()=>{
//     console.log("job description:-",jobDescription)
// })

    async function postJob() {
        // console.log("hello here is executed ")
        let userid = JSON.parse(localStorage.getItem("EmpIdG"))
        const headers = { authorization: userid + " " + atob(JSON.parse(localStorage.getItem("EmpLog"))) };
        // console.log("hdh",jobDescription)
        let jobTitle = jobtitle 
        let jobLocation = joblocation.toLowerCase()
        await axios.post("/jobpost/jobpost/", {
            Logo, SourceLink, Source, empId, jobTitle, companyName,companyHomeLink, videoUrl,
            jobDescription, jobtype, salaryRange, jobLocation, qualification, experiance, skills, Tags
        }, { headers })
            .then((res) => {
                let result = (res.data)
                console.log(result)
                if (result == "success") {
                    setJobTitle("")
                    setJobDescription("")
                    setSourceLink("")
                    setCompanyHomeLink("")
                    // setCompanyName("")
                    setJobtype("")
                    setSource("")
                    setJobLocation("")
                    setQualification("")
                    setSalaryRange("")
                    setJobLocation("")
                    setExperiance("")
                    setExperiance("")
                    setSkills("")
                    setTag([])
                    setconcent(false)
                    setSuccessMessage("Successfully Posted")
                       
                      
                }
                
                else if (result == "field are missing") {
                    setSuccessMessage(
                        <span style={{
                          color: "red",
                          fontWeight: "bold",
                          fontStyle: "normal",  // ensures no italic
                          fontFamily: "Arial, sans-serif"
                        }}>
                          Alert!... JobTitle, CompanyName, JobDescription, Experience, JobLocation and Skills must be filled
                        </span>
                      );
                      
                }
                // else if (result ==="server issue")
                else
                    {
                    setSuccessMessage("something went wrong, Could not save your Jobs post")
                }
            }).catch((err) => {
                alert("server issue occured", err)
            })
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }
    
    function handlejobtitle(e){ 
     setJobTitle(e.target.value)                    
    }

    function handleRadioTags(e){
        // setTag([...Tags, e])
        handleTags(e)
        if(e<10){
        handleTags("<10L")
        }
        else if(e<20 && e>10){
        handleTags("10 to 20L")
        }
        else if(e<30 && e>20){
        handleTags("20 to 30L")
        }
       else if(e>=30){
        handleTags("30 and above")
        }
        
    }
    function handleExpButton(e){
        if(e<5){
            handleTags("2 to 5 Yrs")
            }
            else if(e>5 && e<11){
                handleTags("6 to 10 Yrs")
            }
            else if(e>10 && e<16){
                handleTags("11 to 15 Yrs")
            }
            else if(e>15){
                handleTags("16 and above Yrs")
            }
    }

    const [count, setCount]=useState(1)

    async function handleTags(key) {
        // Set job type if key matches known types
        if (key === 'Full Time' || key === 'Contract' || key === 'Internship' || key === 'Part Time') {
          setJobtype(key);
        }
      
        // Check if the tag already exists
        const isIndex = Tags.findIndex((present) => present === key);
      
        if (isIndex < 0) {
          // Tag not found — add it
          const updatedTags = [...Tags, key];
          setTag(updatedTags);
          setSkills((prev) => (prev ? prev + ", " + key : key));
        } else {
          // Tag exists — remove it
          const updatedTags = Tags.filter((present) => present !== key);
          setTag(updatedTags);
      
          // Update the skills string from updated tag list
          const skillsString = updatedTags.join(", ");
          setSkills(skillsString);
        }
      }
      

const [showTooltip, setShowTooltip] = useState(false);

  const toggleTooltip = () => {
    setShowTooltip((prev) => !prev);
  };

  const tooltipRef = useRef(null);

  useEffect(() => {
      const handleClickOutside = (event) => {
        if (
          tooltipRef.current && !tooltipRef.current.contains(event.target)
        ) {
          setShowTooltip(false);
        }
       
      };
  
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

//     useEffect(()=>{
// console.log(qualification)
//     },[qualification])


    return (
        <>
                                        {/* <button className={Style.searchButton} onClick={() => {
                                    navigate("/Search-Candidate")
                                }}>Search Candidate</button> */}

            {
                profileData.map((items, i) => {
                    return (
                        items.isApproved ?

                            <div key={i}>

                                {Logo ? <img className={Style.logo} src={Logo} /> :
                                    // <p style={{ color: "red", marginLeft: "5%",}}>  Your Company logo is missing,Kindly upload it to complete your profile.</p>}
                                    <p style={{
  color: "red",
  marginLeft: "5%",
  fontWeight: "bold",
  fontStyle: "normal", // ensures no italics
  fontFamily: "Arial, sans-serif"
}}>
  Your Company logo is missing. Kindly upload it to complete your profile.
</p>}
                                {/* <h3 style={{ color: "blue", marginLeft: "15%" }}>Welcome to Post job Page, Post a Job and get Connected with Job Seekers</h3> */}

                                <div className={Style.postJobPageWrapper} >
                                    <div className={Style.postJobWrapper}>
                                    <p className={successMessage === "Successfully posted!" ?
                                            Style.successmessage : Style.errormessage}>{successMessage} </p>
                                        {/* <p className={Style.errormessage}>{errorMessage} </p> */}
                                        <h4 className={Style.jobHeadline}  >Job Title**</h4>
                                        <input maxLength="100" className={Style.inputbox} type="text" value={jobtitle} onChange={(e) => { handlejobtitle(e) }} />
                                        {/* <div className={Style.jobHeadline}>
                                        <label><input name="Job-Type" type="radio" value={other}  onClick={(e) => { setother((prev)=>!prev)} } />Select, if Job Source is from other Job Portal Site </label>
</div>
    
                               { other?
                               <>
                                       <h4 className={Style.jobHeadline}  >Source &nbsp;<span className={Style.hint}>(e.g Linkedin, Noukri, indeed etc.)</span></h4>
                                        <input maxLength="20" className={Style.inputbox} type="text" value={Source} onChange={(e) => { setSource(e.target.value) }} />

                                        <h4 className={Style.jobHeadline}  >Source Link</h4>
                                        <input className={Style.inputbox} type="text" value={SourceLink} onChange={(e) => { setSourceLink(e.target.value) }} />
                               </>
                                :""
                                    } */}
                                    
                                        <p className={Style.jobHeadline}>Company Name** &nbsp;<span className={Style.hint}>(The company name is auto-populated from your profile and cannot be changed.)</span></p>
                                        <input maxLength="30" className={Style.inputbox} type="text" value={companyName} disabled />

                                        <h4 className={Style.jobHeadline}  >Company Home Page Link</h4>
                                         <input className={Style.inputbox} type="text" value={companyHomeLink} onChange={(e) => { setCompanyHomeLink(e.target.value) }} />


                                         <h4 className={Style.jobHeadline}  >Source Link</h4>
                                         <input className={Style.inputbox} type="text" value={SourceLink} onChange={(e) => { setSourceLink(e.target.value) }} />
                                         
                                        <h4 className={Style.jobHeadline}>Job Description**</h4>
                                        {/* <input maxLength="100" className={Style.inputbox} type="text" value={jobDescription} onChange={(e) => { setJobDescription(e.target.value) }} /> */}
                                        {/* <Editor
                                            toolbarClassName="toolbarClassName"
                                            wrapperClassName="wrapperClassName"
                                            editorClassName="editorClassName"
                                            wrapperStyle={{ width: "100%", marginLeft: "0px", border: "1px solid black", borderRadius: "4px" }}
                                            className={Style.inputbox}
                                            onChange={(e) => { setJobDescription(e.blocks) }}
                                        /> */}
{/* <JoditEditor  ref={editor} className={Style.inputbox} value={jobDescription.toString()} onChange={(e)=>{setJobDescription(e)}} /> */}
{/* <CustomTextEditor ref={editor} className={Style.inputbox} value={jobDescription.toString()} onChange={(e)=>{setJobDescription(e)}}/> */}
<CustomTextEditor
 ref={editor} className={Style.inputbox} 
        value={jobDescription}
        onChange={setJobDescription}
      />
                                        <p className={Style.jobHeadline}>Job Tags <span className={Style.hint}>(Use multiple tags to identify top-matching candidates)</span></p>

<div className={Style.JobtitleFilterWrapper}>
            {/* <buton className={ Active.length===0? Style.active:Style.JobtitleFilter} onClick={() => { getjobs() }}>All</buton> */}
            {
              jobTags.map((tags, i) => {
                return (
                                   
                  <button disabled={tags.value==="TECHNOLOGIES" || tags.value==="EDUCATION" || tags.value==="COLLEGE TYPE" || tags.value==="NOTICE PERIOD" || tags.value==="SALARY" || 
                    tags.value==="EXPERIENCE" || tags.value==="Job Type" || tags.value==="INDUSTRY" || tags.value==="TOOLS/PROTOCOLS" || tags.value==="ROLE" || tags.value==="COMPANY TYPE" } 
                    className={tags.value==="TECHNOLOGIES" || tags.value==="EDUCATION" || tags.value==="COLLEGE TYPE" || tags.value==="NOTICE PERIOD" || tags.value==="SALARY" || 
                    tags.value==="EXPERIENCE" || tags.value==="Job Type" || tags.value==="INDUSTRY" || tags.value==="TOOLS/PROTOCOLS" || tags.value==="COMPANY TYPE" || tags.value==="ROLE"?
                    Style.TagHeading: 
                    //  Active === tags.value ? 
                    Tags.findIndex(  (present)=>{
                      return(
                        present===tags.value
                      )
                          }) >=0?
                     Style.active : Style.JobtitleFilter} 
                     onClick={ () => {  handleTags(tags.value) }}
                     >{tags.value} </button>
                
                  )
              })
            }
          </div>


                                        <h4 className={Style.jobHeadline}>Job Type</h4>

                                        <label><input name="Job-Type" type="radio" checked={jobtype === "Full Time" || Tags.filter} value="Full Time" onChange={(e) => { setJobtype(e.target.value) }} />Full Time  </label>
                                        <label><input name="Job-Type" type="radio" checked={jobtype === "Part Time"} value="Part Time" onChange={(e) => { setJobtype(e.target.value) }} />Part Time  </label>
                                        <label><input name="Job-Type" type="radio" checked={jobtype === "Internship"} value="Internship" onChange={(e) => { setJobtype(e.target.value)}} />Internship </label>
                                        <label><input name="Job-Type" type="radio" checked={jobtype === "Contract"} value="Contract" onChange={(e) => { setJobtype(e.target.value) }} />Contract   </label>
                                        <div style={{ position: "relative", display:"flex",  alignItems:"center" }}>
  <div><h4 className={Style.jobHeadline}>Job Location**</h4></div>

  <div
    ref={tooltipRef} // ⬅ attach ref to parent of both icon and tooltip
    className={Style.JobAlerti}
    onClick={toggleTooltip}
  >
    i
    {showTooltip && (
      <div
        className={Style.jobIdesc}
      >
        We currently support job posting only in Bangalore.
      </div>
    )}
  </div>
</div>

                                        <div style={{ marginTop: "-10px" }}>
                                            <label><input name="Location" type="radio" checked={joblocation === "Bangalore"} value="Bangalore" onChange={(e) => { setJobLocation(e.target.value); setotherJobLocation(false) }} />Bangalore </label>
                                            {/* <label><input name="Location" type="radio" checked={joblocation === "Hyderabad"} value="Hyderabad" onChange={(e) => { setJobLocation(e.target.value); setotherJobLocation(false) }} disabled />Hyderabad </label>
                                            <label><input name="Location" type="radio" checked={joblocation === "Chennai"} value="Chennai" onChange={(e) => { setJobLocation(e.target.value); setotherJobLocation(false) }} disabled />Chennai </label>
                                            <label><input name="Location" type="radio" checked={joblocation === "Mumbai"} value="Mumbai" onChange={(e) => { setJobLocation(e.target.value); setotherJobLocation(false) }} disabled />Mumbai </label>
                                            <label><input name="Location" type="radio" checked={joblocation === "Delhi"} value="Delhi" onChange={(e) => { setJobLocation(e.target.value); setotherJobLocation(false) }} disabled />Delhi </label>
                                            <label><input name="Location" type="radio" value="others" onClick={(e) => { setotherJobLocation((prev) => !prev); setJobLocation("") }} />others </label> */}
                                        </div>
                                        {
                                            otherJobLocation ?
                                                <input maxLength="10" className={Style.Otherinputbox} type="text" value={joblocation} onChange={(e) => { setJobLocation(e.target.value) }} />
                                                :
                                                ""
                                        }

                                        <h4 className={Style.jobHeadline}>Qualification Needed**</h4>

                                        <div style={{ marginTop: "-10px" }}>
                                            <label><input name="Qualification" type="radio" checked={qualification === "10th Pass"} value="10th Pass" onChange={(e) => { setQualification(e.target.value); setOthers(false); }} />10th Pass </label>
                                            <label><input name="Qualification" type="radio" checked={qualification === "12th Pass"} value="12th Pass" onChange={(e) => { setQualification(e.target.value); setOthers(false); }} />12th Pass </label>
                                            <label><input name="Qualification" type="radio" checked={qualification === "Graduate"} value="Graduate" onChange={(e) => { setQualification(e.target.value); setOthers(false); }} />Graduate </label>
                                            <label><input name="Qualification" type="radio" checked={qualification === "Post Graduate"} value="Post Graduate" onChange={(e) => { setQualification(e.target.value); setOthers(false); }} />Post Graduate </label>
                                            

                                            {/* <label><input name="Qualification" type="radio" value="others" onClick={(e) => { setOthers((prev) => !prev); setQualification("") }} />others </label> */}
                                            {/* <label><input name="Qualification" type="radio" value="others" onChange={(e) => { setQualification(e.target.value); setOthers(true); }} />others </label> */}
                                             {/* {console.log("qualification",qualification)} */}
                                        </div>
                                        {/* {
                                            others ?
                                                <input className={Style.Otherinputbox} type="text" value={qualification} onChange={(e) => { setQualification(e.target.value) }} />

                                                : ""

                                        } */}
                                       <div style={{position:"relative"}} >
                                           <h4 className={Style.jobHeadline}>Salary Per Annum in Lakhs** &nbsp;<span className={Style.hint}>(e.g 5 or 10)</span></h4>
                                           <input maxLength="3" className={Style.inputbox} type="number" value={salaryRange} onChange={(e) => { handleSalary(e) }} />
                                           <span className={Style.suffix}>{salaryRange===""?"":"LPA"}</span>
                                        </div>

                                        <div style={{position:"relative"}} >
                                        <h4 className={Style.jobHeadline}>Experience** &nbsp;<span className={Style.hint}>(e.g 5 or 10)</span></h4>
                                        <input maxLength="3" className={Style.inputbox} type="number" value={experiance} onChange={(e) => { handleExperiance(e) }} />
                                        <span className={Style.suffix}>{experiance===""?"":"YRS"}</span>
                                        </div>
                                        {/* <h4 className={Style.jobHeadline}>Skill Tags**</h4>
                                        <div>
                                            <CreatableSelect
                                                isMulti={true}
                                                options={jobTags}
                                                value={Tags}
                                                onChange={handleChange}
                                            />
                                        </div> */}
                                        <h4 className={Style.jobHeadline}>Skills**</h4>

<input maxLength="100" value={skills} className={Style.inputbox} disabled type="text"
// onChange={(e)=>{setSkills(e.target.value)}} 
/>
<p><input type="checkbox" checked={concent} onChange={()=>{setconcent((prev)=>!prev)}}/>
    I have read the terms and conditions of ITwalkin.com and I agree to all the 
     <span style={{color:"blue", cursor:"pointer"}} onClick={()=>(window.open("/TermsAndCondition"))}> Terms and Conditions</span> before posting the jobs </p>



                                        {Logo ? <p ><span style={{ color: "blue" }}>Note** :</span> Logo will also be posted with the Job</p> : ""}


                                        <div className={styles.infoSection}>
                                                      <h3>YouTube Video Upload</h3>
                                        
                                                      <div>
                                                        <label style={{ cursor: "pointer" }}>
                                                          <input
                                                            type="checkbox"
                                                            checked={uploadConsent}
                                                            onChange={(e) => setuploadConsent(e.target.checked)}
                                                          />
                                                          You agree to upload only interview clip
                                                        </label>
                                        
                                                        <br />
                                        
                                                        <label style={{ cursor: "pointer" }}>
                                                          <input
                                                            type="checkbox"
                                                            checked={disclaimerConsent}
                                                            onChange={(e) => setdisclaimerConsent(e.target.checked)}
                                        
                                                          />
                                                          Itwalkin is not responsible for misuse of this video by the employer
                                                        </label>
                                                        <p><span style={{ fontWeight: "bold" }}>Note:</span>This video will required by ITWalkin Admin. This video will be shared only to fortune 500 employer</p>
                                                      </div>
                                        
                                                      {/* {ytUploading && <p className={styles.loadingText}>Uploading… please wait...</p>} */}
                                                      {ytError && <p className={styles.errorTextRed}>{ytError}</p>}
                                                      {/* UPLOAD CARD */}
                                                      <div
                                                        className={styles.youtubeCard}
                                                        onClick={() => {
                                                          if (!videoPreview && !videoUrl)
                                                            fileInputRef.current.click();
                                                        }}
                                                        onDragOver={(e) => e.preventDefault()}
                                                        onDrop={(e) => {
                                                          e.preventDefault();
                                                          const file = e.dataTransfer.files[0];
                                                          if (file && file.type.startsWith("video/")) {
                                                            setVideoFile(file);
                                                            setVideoPreview(URL.createObjectURL(file));
                                                            setVideoUrl("");
                                                          }
                                                        }}
                                                      >
                                                        {/* Hidden File Input */}
                                                        <input
                                                          type="file"
                                                          accept="video/*"
                                                          ref={fileInputRef}
                                                          style={{ display: "none" }}
                                                          onChange={(e) => {
                                                            const file = e.target.files[0];
                                                            if (file) {
                                                              setVideoFile(file);
                                                              setVideoPreview(URL.createObjectURL(file));
                                                              setVideoUrl("");
                                                              setYtError("");
                                        
                                                              // IMPORTANT — pass file directly to upload function
                                                              uploadVideoToYouTube(file);
                                                            }
                                                          }}
                                                        />
                                        
                                                        {/* CASE 1 — NO VIDEO SELECTED */}
                                                        {!videoPreview && !videoUrl && (
                                                          <>
                                                            <button disabled={!(uploadConsent && disclaimerConsent)}
                                                              style={{ backgroundColor: uploadConsent && disclaimerConsent ? "rgb(40,4,99)" : "grey" }} className={styles.uploadBtnBlue}>
                                                              Upload Video to YouTube</button>
                                                            <p className={styles.dropText}>
                                                              or drop a file,<br /> paste video or URL
                                                            </p>
                                                          </>
                                                        )}
                                        
                                                        {/* CASE 2 — LOCAL VIDEO PREVIEW */}
                                                        {ytUploading ?
                                                          <div style={{ display: "flex", flexDirection: "column" }}>
                                                            <Puff height="80" width="80" color="#4fa94d" ariaLabel="bars-loading" />
                                                            <div><p style={{ color: "red" }}>Uploading.......</p></div>
                                                          </div>
                                                          :
                                                          (videoPreview && (
                                                            <div className={styles.previewWrapper}>
                                                              <video src={videoPreview} controls className={styles.videoPreview} />
                                        
                                                              <button
                                                                className={styles.removeVideoBtn}
                                                                onClick={(e) => {
                                                                  e.stopPropagation();
                                                                  removeLocalVideo();
                                                                }}
                                                              >
                                                                Delete Videos
                                                              </button>
                                                            </div>
                                                          ))
                                                        }
                                        
                                                        {/* CASE 3 — EXISTING YOUTUBE VIDEO PREVIEW */}
                                                        {videoUrl && !videoPreview && (
                                                          <div className={styles.previewWrapper}>
                                                            <iframe
                                                              className={styles.youtubeFrame}
                                                              src={videoUrl.replace("watch?v=", "embed/")}
                                                              allowFullScreen
                                                            ></iframe>
                                        
                                                            <button
                                                              className={styles.removeVideoBtn}
                                                              onClick={(e) => {
                                                                e.stopPropagation();
                                                                deleteYouTubeVideo();
                                                              }}
                                                            >
                                                              Delete YouTube Video
                                                            </button>
                                                          </div>
                                                        )}
                                                      </div>                                                                       
                                        
                                                    </div>
                                        <div style={{display:"flex", justifyContent:"center"}}>
                                        <button style={{width:"132px"}} disabled={!concent} className={concent?Style.button: Style.disableButton} onClick={postJob}>Post Job</button>
                                        </div>
                                    </div >
                                </div >
                            </div>
                            : <p style={{ color: "red", fontStyle: "italic", marginLeft: "20px" }}>Your account is being verified.Once your account gets verified,then you will be able to post a Job</p>

                    )

                })
            }
           {screenSize.width > 750 ?
""
:
            <div style={{marginTop:"250px"}}>
          <Footer/>
        </div>
}
        </>

    )
}

export default PostJobs