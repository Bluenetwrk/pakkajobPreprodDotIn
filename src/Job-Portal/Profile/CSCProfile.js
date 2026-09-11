import React, { useRef } from 'react'
import axios from 'axios'
import { useEffect, useState } from 'react'
import styles from "./StudentProfile.module.css"
import profileDp from "../img/user_3177440.png"
import { Puff } from 'react-loader-spinner'
import { useNavigate } from 'react-router-dom'
import useScreenSize from '../SizeHook';
import Arrowimage from '../img/icons8-arrow-left-48.png'
import socketIO from 'socket.io-client';
import Footer from '../Footer/Footer'

function StudentProfile() {
  const [activeTab, setActiveTab] = useState("Personal Info");
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const tabs = ["Personal Info"];
  const [PageLoader, setPageLoader] = useState(false)
  // const fileInputRef = useRef(null);

  // const [videoFile, setVideoFile] = useState(null);
  // const [videoPreview, setVideoPreview] = useState("");
  // const [videoUrl, setVideoUrl] = useState("");
  // const [ytUploading, setYtUploading] = useState(false);
  // const [ytError, setYtError] = useState("");



  // const uploadVideoToYouTube = async () => {
  //   if (!videoFile) {
  //     setYtError("Please select a video first.");
  //     return;
  //   }

  //   const formData = new FormData();
  //   formData.append("video", videoFile);

  //   try {
  //     setYtUploading(true);
  //     setYtError("");
  //     setVideoUrl("");

  //     const res = await axios.post(
  //       "http://localhost:3000/api/uploadToYouTube", //-----------------dummy api used to test frontend
  //       formData,
  //       {
  //         headers: { "Content-Type": "multipart/form-data" }
  //       }
  //     );

  //     setVideoUrl(res.data.url);
  //   } catch (err) {
  //     setYtError("Upload failed. Try again.");
  //   } finally {
  //     setYtUploading(false);
  //   }
  // };

  let navigate = useNavigate()

  let CSCId = JSON.parse(localStorage.getItem("CSCId"))
  async function getProfile() {
    let userid = JSON.parse(localStorage.getItem("CSCId"))
    const headers = { authorization: userid + " " + atob(JSON.parse(localStorage.getItem("CSCLog"))) };
    setPageLoader(true)
    await axios.get(`/CSRoute/viewProfile/${CSCId}`)
      .then((res) => {
        let result = res.data.result
        setProfileData([result])
        // console.log(result)
        setLoading(false);

      }).catch((err) => {
        alert("some thing went wrong")
        setLoading(false);
      })
  }

  useEffect(() => {
    getProfile()
  }, [])

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
      alert("Video deleted successfully!");

    } catch (error) {
      alert("Failed to delete YouTube video.");
    }
  };

  const uploadVideoToYouTube = async (file) => {
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

      const res = await axios.post(
        "/StudentProfile/uploadToYouTube",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" }
        }
      );
      console.log("video upload response", res)
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

  const [showApprovedStatus, setShowApprovedStatus] = useState(false)

  function updateprofile() {
    navigate("/Update-Profile")
  }
  function resumedownload() {
    navigate("/resumes")
  }

  if (loading) return
  <div className={styles.centerText} style={{ display: "flex", flexDirection: "column" }}>
    <Puff height="80" width="80" color="#4fa94d" ariaLabel="bars-loading" wrapperStyle={{ marginLeft: "22%", marginTop: "60px" }} />
    <p style={{ color: "red" }}>Loading</p>
  </div>;
  if (error) return <p className={styles.errorText}>{error}</p>;
  if (!profileData) return null;



  return (
    <div className={styles.container}>
      {/* Header Section */}
      <div className={styles.header}>
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center" }}>
          <div className={styles.avatar}>
            <img src={profileData[0].Gpicture ? profileData[0].Gpicture : profileDp} />
          </div>

          <div className={styles.details}>
            <h2 className={styles.name}>{profileData[0].name ? profileData[0].name : ""}</h2>
            <p className={styles.email}>{profileData[0].email ? profileData[0].email : ""}</p>
            <p className={styles.city}>{profileData[0].city ? profileData[0].city : ""}</p>
          </div>
        </div>
        {/* <div className={styles.actions}>
          <button style={{ width: "147px" }} className={styles.editBtn} onClick={updateprofile}>Edit Profile</button>
          <button className={styles.downloadBtn} onClick={resumedownload}>Download Resumes</button>
          <div className={profileData[0].isApproved ?
            styles.statusBadge : styles.statusBadgeReject}
            style={{ display: "flex" }}><strong>Account Status: </strong>{profileData[0].isApproved ?
              "Approved" : "Under verification"}
          </div>
        </div> */}


      </div>


      {/* Tabs Section */}
      <div className={styles.tabs}>
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`${styles.tabBtn} ${activeTab === tab ? styles.activeTab : ""
              }`}
            onClick={() => { setActiveTab(tab); setShowApprovedStatus(false) }}

          >
            {tab}
          </button>
        ))}
      </div>

      {/* Dynamic Tab Content */}
      <div className={styles.content}>
        {activeTab === "Personal Info" && (
          <div className={styles.infoSection}>
            <h3>Personal Information</h3>
            <div>
              <strong>Name</strong><br></br> {profileData[0].name ? profileData[0].name : ""}
            </div>
            <div>
              <strong>Email</strong><br></br> {profileData[0].email ? profileData[0].email : ""}
            </div>
            <div>
              <strong>Phone</strong><br></br> {profileData[0].phoneNumber ? profileData[0].phoneNumber : ""}
            </div>
            <div>
              <strong>City</strong><br></br> {profileData[0].city ? profileData[0].city : ""}
            </div>
          </div>
        )}



      </div>
    </div>
  );
}

export default StudentProfile;

