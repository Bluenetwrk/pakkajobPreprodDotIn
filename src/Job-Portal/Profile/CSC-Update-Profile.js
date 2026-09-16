import React, { useEffect, useRef, useState } from 'react';
import styles from "./SudentUpdateProfile.module.css"
import Style from "../Jobs/Allobs.module.css"
import imageCompression from 'browser-image-compression';
import axios from 'axios';
import logo from "../img/Blue.jpg"
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import profileDp from "../img/user_3177440.png"
import delet from "../img/icons8-delete-48.png"
import { TailSpin } from "react-loader-spinner"
import useScreenSize from '../SizeHook';
import socketIO from 'socket.io-client';
import CreatableSelect from "react-select/creatable"
import Arrowimage from '../img/icons8-arrow-left-48.png'
import Footer from '../Footer/Footer';

import { jobTags } from '../Tags'

function StudentUpdateProfile(props) {
  useEffect(() => {
    const socket = socketIO.connect(props.url, {
      auth: {
        token: JSON.parse(localStorage.getItem("CSCId"))
        
      }
    });
  }, [])

  const [file, setFile] = useState()
  const [uploaded, setUploaded] = useState()
  const screenSize = useScreenSize();
  const [image, setimage] = useState()
  const [immage, setimmage] = useState()
  const [name, setname] = useState("")
  const [email, setemail] = useState("")
  const [phoneNumber, setphoneNumber] = useState("")
  const [Aadhar, setAadhar] = useState("")
  const [panCard, setpanCard] = useState("")
  const [NoticePeriod, setNoticePeriod] = useState("")
  const [ExpectedSalary, setExpectedSalary] = useState("")
  const [currentCTC, setcurrentCTC] = useState("")
  const [age, setage] = useState("")
  const [Qualification, setQualification] = useState("")
  const [Experiance, setExperiance] = useState("")
  const [loader, setLoader] = useState(false)
  const [Tags, setTag] = useState([])
  const [college, setcollege] = useState("")
  const collegeInputRef = useRef(null);
  const tenthInputRef = useRef(null);
  const twelfthInputRef = useRef(null);
  const DegreeInputRef = useRef(null);
  const inputRefs = useRef([]);
  const [tenth, setTenth] = useState("");
  const [twelfth, setTwelfth] = useState("");
  const [degree, setDegree] = useState("");
  const [Skills, setSkills] = useState([])
  const [city, setcity] = useState("")
  const [address, setAddress] = useState("")
  const [state, setState] = useState("")



  const [currentEmp, setCurrentEmp] = useState("");
  const currentEmpInputRef = useRef(null);
  //--------------- Current emp----------
  useEffect(() => {
    if (currentEmpInputRef.current && !currentEmpInputRef.current.autocomplete) {
      const autocomplete = new window.google.maps.places.Autocomplete(currentEmpInputRef.current, {
        fields: ["formatted_address", "geometry", "address_components", "place_id", "name"],
      });

      autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        if (place && place.formatted_address) {
          const displayValue =
            place.name && place.name !== place.formatted_address
              ? `${place.name}, ${place.formatted_address}`
              : place.formatted_address;

          setCurrentEmp(displayValue);
        }
      });

      currentEmpInputRef.current.autocomplete = autocomplete; // attach instance
    }
  }, []);
  //  console.log(Skills)
  function handleTags(key) {
    // setTag(tag)   
    const isIndex = Tags.findIndex((present) => {
      return (
        present === key
      )
    })
    if (isIndex < 0) {
      setTag([...Tags, key])
      setSkills((prev) => prev ? prev + ", " + key : key)

    } else {
      const IndexId = Tags.filter((present) => {
        return (
          present !== key
        )
      })
      setTag(IndexId)

      let str = IndexId.toString().split(",").join(", ")
      // setSkills(str)
    }
  }
  function handleCollege(tag) {
    setcollege(tag)
  }


  const CTags = [{ value: 'Bangalore' }]

  function handleChangeCityTag(tag) {
    setcity(tag)
  }

  let navigate = useNavigate()

  let CSCId = JSON.parse(localStorage.getItem("CSCId"))

  const [topMessage, settopMessage] = useState("")
  const [stuId, setstuId] = useState()

  const [employers, setEmployers] = useState([]);
  // console.log(employers)
  const addEmployer = () => {
    if (employers.length < 3) {
      setEmployers([...employers, { name: "" }]);
    }
  };

  const removeEmployer = (index) => {
    const updatedEmployers = [...employers];
    updatedEmployers.splice(index, 1);
    setEmployers(updatedEmployers);
    inputRefs.current.splice(index, 1); // also remove ref
  };

  const handleEmployerChange = (index, field, value) => {
    const updated = [...employers];
    updated[index][field] = value;
    setEmployers(updated);
  };

  // Hook up Google Places Autocomplete
  useEffect(() => {
    employers.forEach((_, index) => {
      if (inputRefs.current[index] && !inputRefs.current[index].autocomplete) {
        const autocomplete = new window.google.maps.places.Autocomplete(
          inputRefs.current[index],
          {
            fields: ["formatted_address", "geometry", "address_components", "place_id", "name"],
          }
        );

        autocomplete.addListener("place_changed", () => {
          const place = autocomplete.getPlace();
          // console.log("Selected Place:", place);

          if (place && place.formatted_address) {
            const displayValue = place.name && place.name !== place.formatted_address
              ? `${place.name}, ${place.formatted_address}`
              : place.formatted_address;

            if (employers[index]?.name !== displayValue) {
              handleEmployerChange(index, "name", displayValue);
            }
          }
        });

        inputRefs.current[index].autocomplete = autocomplete;
      }
    });

    // console.log()
  }, [employers]);

  async function getUser() {
    let userid = JSON.parse(localStorage.getItem("CSCId"))
    const headers = { authorization: userid + " " + atob(JSON.parse(localStorage.getItem("CSCLog"))) };
    await axios.get(`/CSRoute/viewProfile/${CSCId}`)
      .then((res) => {
        let result = res.data.result
        if (result) {
          setname(result.name)
          setemail(result.email)
          setimage(result.Gpicture)
          setimmage(result.image)
          setphoneNumber(result.phoneNumber)
          setAadhar(result.Aadhar)
          setpanCard(result.panCard)
          setcity(result.city)
          setState(result.state) 
          setAddress(result.address)
        }
      }).catch((err) => {
        alert("server issue occured", err)
      })
  }
  useEffect(() => {
    getUser()
  }, [])

  // ...............upload Image.....................
  async function uploadImage() {
    const formdata = new FormData()
    formdata.append('image', image)

    // console.log(formdata)
    await axios.put(`/StudentProfile/uploadImage/${CSCId}`, formdata)
      .then((res) => {
        window.location.reload()
      }).catch((err) => {
      })
  }
  async function saveUpdate(e) {
    let userid = JSON.parse(localStorage.getItem("CSCId"))

    const headers = { authorization: userid + " " + atob(JSON.parse(localStorage.getItem("CSCLog"))) };
    // e.preventDefault()
    await axios.put(`/CSRoute/updatProfile/${CSCId}`, {
      name, email, phoneNumber, Aadhar, panCard,city,address,state
    }, { headers })
      .then(async (res) => {
        let result = res.data
        if (result == "success") {

          settopMessage(
            <span style={{
              color: "green",
              fontWeight: "800",
              fontStyle: "normal",
              fontFamily: "Courier New, Courier, monospace"
            }}>
              Profile updated successfully
            </span>
          );

        } else if (result == "feilds are missing") {
          settopMessage("Alert!..name, emailAddress, NoticePeriod, phoneNumber, Qualification, Skills and Experiance should not be empty")
        }

        window.scrollTo({
          top: 0,
          behavior: "smooth"
        });

      }).catch((err) => {
        alert("some thing went wrong")
      })
  }
  async function prevewImage(e) {
    setimmage("")
    setLoader(true)
    setFile(URL.createObjectURL(e.target.files[0]))
    // setimage(e.target.files[0])
    const imageFile = e.target.files[0];
    const options = {
      maxSizeMB: 0.1,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
    }
    try {
      const compressedFile = await imageCompression(imageFile, options);
      setimage(compressedFile)
      setLoader(false)

    } catch (error) {
    }
  }
    let userid = JSON.parse(localStorage.getItem("CSCId"))

  async function deletePic() {
    await axios.put(`/StudentProfile/deleteImage/${CSCId}`, { image })
      .then((res) => {
        window.location.reload()
      }).catch((err) => {
        alert("server issue occured")
      })
  }

  const [delAlert, setDelAlert] = useState(false);
  const delRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (delRef.current && !delRef.current.contains(event.target)) {
        setDelAlert(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const [delcompletionAlert, setDelcompletionAlert] = useState(false);

  const [showdelete, setShowdelete] = useState(false)

  async function DeleteProfile() {
    //   let confirm = window.confirm("are you sure to delete your Account? your account will be deleted permanently, click on 'Ok', if you wish delete your Account permanently ")
    // if(confirm){
    await axios.delete(`/CSRoute/deleteJobSeeker/${stuId}`)
      .then((res) => {
        if (res.data === "success") {
          // alert("Account deleted successfully ")
          // navigate("/")
          setDelcompletionAlert(true)
          localStorage.clear()
        } else {
          alert("some thing went wrong try again")

        }
      }).catch((err) => {
        alert("some thing went wrong try again ")
      })
    // }
  }

  function handleAge(e) {
    if (e.target.value.length > 2) {
      return false
    } else {
      setage(e.target.value)
    }
  }

  // function handlePhoneNumber(e){
  //   if (e.target.value.length>10){
  //     return false
  // }else{
  // setphoneNumber(e.target.value)
  // }
  // }
  function handlePhoneNumber(e) {
    const value = e.target.value;

    // Prevent removing "+91"
    if (!value.startsWith('+91')) return;

    // Only allow digits after +91
    const digits = value?.slice(3).replace(/\D/g, '');
    setphoneNumber('+91' + digits);
  }
  const AadharhandleChange = (event) => {
    if (event.target.value.length > 14) {
      return false
    } else {

      const value = event.target.value;
      const sanitizedValue = value?.replace(/[^\w\s]/gi, ''); // Regex to remove special characters
      setAadhar(sanitizedValue);
    }
  };

  const PanCardhandleChange = (event) => {
    const value = event.target.value;
    const sanitizedValue = value?.replace(/[^\w\s]/gi, ''); // Regex to remove special characters
    setpanCard(sanitizedValue);
  };
  function handleNoticePeriod(e) {
    const value = e.target.value;
    const sanitizedValue = value?.replace(/[^\w\s]/gi, ''); // Regex to remove special characters
    setNoticePeriod(sanitizedValue);
  }
  function handleexpectedSalary(e) {
    const value = e.target.value;
    const sanitizedValue = value?.replace(/[^\w\s]/gi, ''); // Regex to remove special characters
    setExpectedSalary(sanitizedValue);
  }

  function handleCurrentCTC(e) {
    const value = e.target.value;
    const sanitizedValue = value?.replace(/[^\w\s]/gi, ''); // Regex to remove special characters
    setcurrentCTC(sanitizedValue);
  }
  function handleQualification(e) {
    const value = e.target.value;
    const sanitizedValue = value?.replace(/[^\w\s.]/gi, ''); // Regex to remove special characters
    setQualification(sanitizedValue);
  }
  function handleExperiance(e) {
    const value = e.target.value;
    const sanitizedValue = value?.replace(/[^\w\s]/gi, ''); // Regex to remove special characters
    setExperiance(sanitizedValue);
  }



  // -------------college-----------------
  useEffect(() => {
    if (collegeInputRef.current && !collegeInputRef.current.autocomplete) {
      const autocomplete = new window.google.maps.places.Autocomplete(collegeInputRef.current, {
        fields: ["formatted_address", "geometry", "address_components", "place_id", "name"],
      });

      autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        if (place && place.formatted_address) {
          const displayValue =
            place.name && place.name !== place.formatted_address
              ? `${place.name}, ${place.formatted_address}`
              : place.formatted_address;

          setcollege(displayValue);
        }
      });

      collegeInputRef.current.autocomplete = autocomplete; // attach instance
    }
  }, []);

  // ----------------degree/diploma---------
  useEffect(() => {
    if (DegreeInputRef.current && !DegreeInputRef.current.autocomplete) {
      const autocomplete = new window.google.maps.places.Autocomplete(DegreeInputRef.current, {
        fields: ["formatted_address", "geometry", "address_components", "place_id", "name"],
      });

      autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        if (place && place.formatted_address) {
          const displayValue =
            place.name && place.name !== place.formatted_address
              ? `${place.name}, ${place.formatted_address}`
              : place.formatted_address;

          setDegree(displayValue);

        }
      });

      DegreeInputRef.current.autocomplete = autocomplete; // attach instance
    }
  }, []);

  // ----------------12th-----------

  useEffect(() => {
    if (twelfthInputRef.current && !twelfthInputRef.current.autocomplete) {
      const autocomplete = new window.google.maps.places.Autocomplete(twelfthInputRef.current, {
        fields: ["formatted_address", "geometry", "address_components", "place_id", "name"],
      });

      autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        if (place && place.formatted_address) {
          const displayValue =
            place.name && place.name !== place.formatted_address
              ? `${place.name}, ${place.formatted_address}`
              : place.formatted_address;

          setTwelfth(displayValue);
        }
      });

      twelfthInputRef.current.autocomplete = autocomplete; // attach instance
    }
  }, []);

  // ----------------10th-----------
  useEffect(() => {
    if (tenthInputRef.current && !tenthInputRef.current.autocomplete) {
      const autocomplete = new window.google.maps.places.Autocomplete(tenthInputRef.current, {
        fields: ["formatted_address", "geometry", "address_components", "place_id", "name"],
      });

      autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        if (place && place.formatted_address) {
          const displayValue =
            place.name && place.name !== place.formatted_address
              ? `${place.name}, ${place.formatted_address}`
              : place.formatted_address;

          setTenth(displayValue);
        }
      });

      tenthInputRef.current.autocomplete = autocomplete; // attach instance
    }
  }, []);

  const [menuOpen, setMenuOpen] = useState(false);
  const [openIndex, setOpenIndex] = useState(null);
  const [selected, setSelected] = useState("");
  const containerRef = useRef(null);

  const toggleMain = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const handleSelect = (value) => {
    // setSelected(value);
    setQualification(value)
    setMenuOpen(false);
    setOpenIndex(null);
  };

  // Handle outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setMenuOpen(false);
        setOpenIndex(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  let location = useLocation()
  const { profileAlert } = location.state || {};
  const [profileCompletionAlert, setprofileCompletionAlert] = useState(false)

  const alertRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (event) => {
      // If clicked outside alert box and it's open
      if (alertRef.current && !alertRef.current.contains(event.target)) {
        setprofileCompletionAlert(false); // close the alert
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    setprofileCompletionAlert(profileAlert);
  }, [profileAlert])
  return (
    <>

      <div className={styles.EntireFullWrapper}>

        <div ref={alertRef} style={{ position: "relative" }}>
          {profileCompletionAlert &&
            <>
              <div className={styles.profileCompletionAlert}>

                Welcome to ITWalkin!<br></br>Your account has been created. Please complete your profile for a better experience!
                <div style={{ marginTop: '15px', display: "flex", justifyContent: "center", gap: "5px" }}>
                  <button
                    onClick={() => { setprofileCompletionAlert(false) }}
                    style={{
                      padding: '8px 16px',
                      backgroundColor: '#4CAF50',
                      color: 'white',
                      border: 'none',
                      borderRadius: '5px',
                      fontSize: '12px',
                      cursor: 'pointer',
                    }}
                  >
                    Ok
                  </button>
                </div>
              </div>
            </>

          }
        </div>
        {/* -------- popup delete------- */}
        {delAlert &&
          <div style={{ position: "fixed", zIndex: "99" }}>
            <div
              style={{
                position: 'absolute',
                top: '2px',
                left: 0,
                width: '100vw',
                zIndex: 9998,
                display: 'flex',
                alignItems: 'top',
                justifyContent: 'center',

              }}
            >
              <div
                //  ref={delRef}
                onClick={(e) => e.stopPropagation()}
                style={{
                  width: '300px',
                  padding: '20px',
                  backgroundColor: 'rgb(40,4,99)',
                  color: 'white',
                  fontSize: '12px',
                  borderRadius: '5px',
                  zIndex: 9999,
                  boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                  textAlign: 'center',

                }}
              >
                Are you sure to delete your Account?
                <div style={{ marginTop: '15px', display: "flex", justifyContent: "center", gap: "5px" }}>
                  <button
                    onClick={() => {
                      DeleteProfile();
                      setDelAlert(false)
                    }
                    }

                    style={{
                      padding: '8px 16px',
                      backgroundColor: '#4CAF50',
                      color: 'white',
                      border: 'none',
                      borderRadius: '5px',
                      fontSize: '12px',
                      cursor: 'pointer',

                    }}
                  >
                    Ok
                  </button>
                  <button
                    onClick={() => {
                      setDelAlert(false);
                    }}
                    style={{
                      padding: '8px 16px',
                      backgroundColor: '#f44336',
                      color: 'white',
                      border: 'none',
                      borderRadius: '5px',
                      fontSize: '12px',
                      cursor: 'pointer',


                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>

          </div>
        }


        {/* -----------delete completion popup---- */}
        {delcompletionAlert &&
          <div style={{ position: "fixed", zIndex: "99" }}>
            <div
              style={{
                position: 'absolute',
                top: '2px',
                left: 0,
                width: '100vw',
                zIndex: 9998,
                display: 'flex',
                alignItems: 'top',
                justifyContent: 'center',

              }}
            >
              <div
                //  ref={delRef}
                onClick={(e) => e.stopPropagation()}
                style={{
                  width: '300px',
                  padding: '20px',
                  backgroundColor: 'rgb(40,4,99)',
                  color: 'white',
                  fontSize: '12px',
                  borderRadius: '5px',
                  zIndex: 9999,
                  boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                  textAlign: 'center',

                }}
              >
                Account deleted successfully!
                <div style={{ marginTop: '15px', display: "flex", justifyContent: "center", gap: "5px" }}>
                  <button
                    onClick={() => {
                      navigate("/");
                      setDelAlert(false)
                    }
                    }

                    style={{
                      padding: '8px 16px',
                      backgroundColor: '#4CAF50',
                      color: 'white',
                      border: 'none',
                      borderRadius: '5px',
                      fontSize: '12px',
                      cursor: 'pointer',

                    }}
                  >
                    Ok
                  </button>
                </div>
              </div>
            </div>

          </div>
        }

        <div className={styles.EntireWrapper}>
          {/* <h3 style={{ color: "rgb(40, 4, 99)", marginLeft: "2%" }}>Update your Profile</h3> */}
          <div style={{ display: "flex", justifyContent: "center" }}>
            <h2>Update Profile</h2>
          </div>

          {/* <img style={{ height:"25px", color:"grey", marginTop:"20px", marginLeft:"8%", cursor:"pointer",
             width:"28px"}} onClick={()=>{navigate(-1)}}  src={Arrowimage} /> */}
          <button style={{ marginTop: "-7px" }} className={styles.readPageBackBtn}
            onClick={() => {
              if (window.history.length > 1) {
                navigate(-1);
              } else {
                navigate('/My-Profile');
              }
            }}>
            Back
          </button>
          <div className={styles.imageViewWrapper}>


            <img className={styles.imageView} src={image ? image : profileDp} />
            {/* <img className={styles.fileView} src={file} /> */}
            <div style={{ position: "absolute", marginLeft: "50%", marginTop: "40px" }}>
              <input type='checkbox' onClick={() => { setShowdelete(prev => !prev) }} />
              <span>Delete Profile</span><br></br>
              {showdelete ?
                <button className={{}} style={{
                  backgroundColor: "red", color: "white",
                  border: "none", padding: "4px 8px"
                }} onClick={() => { setDelAlert(true) }}>Delete</button>
                : ""
              }

            </div>

          </div>


          <p style={{ fontStyle: "italic", color: "green" }}>{topMessage}</p>
          {screenSize.width > 850 ?
            <>
              <div className={styles.inputWrapper}>

                <label className={styles.inputName}>
                  <h4>Name:</h4>
                  <input maxLength="22" className={styles.input} value={name} disabled onChange={(e) => { setname(e.target.value) }} type="text" />
                </label>

                <label className={styles.inputName}>
                  <h4>Email Address:**</h4>
                  <input maxLength="25" className={styles.input} value={email} disabled onChange={(e) => { setemail(e.target.value) }} type="text" />
                  <br></br> ( only Gmail or Microsoft Outlook accepted for account creation)
                </label>
                <label className={styles.inputName}>
                  <h4>Address:
                    {/* <span style={{color:"blue"}}>{city}</span> */}
                  </h4>
                  <input className={styles.input} value={address} onChange={(e) => { setAddress(e.target.value) }} ></input>
                </label>
                <label className={styles.inputName}>
                  <h4>City:
                  </h4>
                  <input className={styles.input}  value={city} onChange={(e) => { setcity(e.target.value) }}></input>
                </label>
                <label className={styles.inputName}>
                  <h4>State:</h4>
                  <input className={styles.input}  value={state} onChange={(e) => { setState(e.target.value) }} ></input>
                </label>

                <label className={styles.inputName}>
                  <h4>Phone number:</h4>
                  <input
                    maxLength="13"
                    className={styles.input}
                    type="text"
                    value={phoneNumber}
                    onChange={handlePhoneNumber}
                    onFocus={(e) => {
                      if (!e.target.value.startsWith('+91')) {
                        setphoneNumber('+91');
                      }
                    }}
                  />
                  {/* <input maxLength="15" className={styles.input} value={phoneNumber} onChange={(e) => { handlePhoneNumber(e) }} type="number" /> */}
                </label>

                <label className={styles.inputName}>
                  <h4>Aadhaar number:</h4>
                  <input maxLength="14" className={styles.input} value={Aadhar?.replace(/(\d{4})(?=\d)/g, "$1 ").trim()} onChange={(e) => { AadharhandleChange(e) }} type="text" />
                </label>

                <label className={styles.inputName}>
                  <h4>Pan Card Number:</h4>
                  <input maxLength="10" className={styles.input} value={panCard} onChange={(e) => { PanCardhandleChange(e) }} type="text" />
                </label>

                <div style={{ display: "flex", marginLeft: "80%" }}>
                  <button className={styles.Save} onClick={(e) => { saveUpdate(e) }}>Save</button>
                  <button className={styles.cancel} onClick={() => { navigate(-1) }} >Cancel</button>
                </div>
              </div>

            </>
            :
            <>

              <label className={styles.MobileinputName}>
                <h4 className={styles.MobileName}>Name:</h4>
                <input maxLength="20" className={styles.Mobileinput} disabled value={name} onChange={(e) => { setname(e.target.value) }} type="text" />
              </label>

              <label className={styles.MobileinputName}>
                <h4 className={styles.MobileName}>Email Address:</h4>
                <input maxLength="25" className={styles.Mobileinput} disabled value={email} onChange={(e) => { setemail(e.target.value) }} type="text" />
                <br></br>
                <div style={{ marginBottom: "11px", marginLeft: "6px" }}>
                  ( only Gmail or Microsoft Outlook accepted for account creation)
                </div>
              </label>

              <label className={styles.MobileinputName}>
                <h4>Address: </h4>
                <input className={styles.Mobileinput} value={address} onChange={(e) => { setAddress(e.target.value) }} ></input>

              </label>
              <label className={styles.MobileinputName}>
                <h4>City: </h4>
                <input className={styles.Mobileinput} value={city} onChange={(e) => { setcity(e.target.value) }} ></input>

              </label>
              <label className={styles.MobileinputName}>
                <h4>State: </h4>
                <input className={styles.Mobileinput} value={state} onChange={(e) => { setState(e.target.value) }} ></input>

              </label>

              <label className={styles.MobileinputName}>
                <h4 className={styles.MobileName}>Phone number:</h4>
                <input maxLength="15" className={styles.Mobileinput} value={phoneNumber} onChange={(e) => { handlePhoneNumber(e) }} type="text" />
              </label>

              <label className={styles.MobileinputName}>
                <h4 className={styles.MobileName}>Aadhaar number:</h4>
                <input maxLength="14" className={styles.Mobileinput} value={Aadhar?.replace(/(\d{4})(?=\d)/g, "$1 ").trim()} onChange={(e) => { AadharhandleChange(e) }} type="text" />
              </label>

              <label className={styles.MobileinputName}>
                <h4 className={styles.MobileName}>Pan Card Number:</h4>
                <input maxLength="16" className={styles.Mobileinput} value={panCard} onChange={(e) => { PanCardhandleChange(e) }} type="text" />
              </label>

              <div style={{ marginTop: "10px" }}>
                <button className={styles.MobileSave} onClick={(e) => { saveUpdate(e) }}>Save</button>
                <button className={styles.Mobilecancel} onClick={() => { navigate(-1) }} >Cancel</button>
              </div>
              <div style={{ marginTop: "60px" }}>
                <Footer />
              </div>
            </>

          }
        </div>

      </div>

    </>
  )
}
export default StudentUpdateProfile

