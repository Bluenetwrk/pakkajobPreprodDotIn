import { useState, useEffect, useRef } from "react"
import React from 'react'
import styles from "./login.module.css"
import axios from "axios"
import Footer from "../Footer/Footer"
import { useNavigate, Link, useLocation } from "react-router-dom";
import GoogleImage from "../img/icons8-google-48.png"
import MicosoftImage from "../img/icons8-windows-10-48.png"
import linkedIn from "../img/icons8-linked-in-48.png"
import github from "../img/icons8-github-50.png"
import { useGoogleLogin } from '@react-oauth/google';
import image from "../img/user_3177440.png"
import { TailSpin } from "react-loader-spinner"
import useScreenSize from '../SizeHook';
import { useMsal } from "@azure/msal-react";
import { loginRequest } from "../Config";
// import style from "./styles.module.css"

function CSLogin(props) {
  const { instance } = useMsal();

  const screenSize = useScreenSize();


  const [gmailuser, setGmailuser] = useState("")
  const [topErrorMessage, setTopErrorMessage] = useState("")
  const [PhoneNumber, setPhoneNumber] = useState("")
  const [otp, setotp] = useState("")
  
  const [showotp, setshowotp] = useState(false)
  const [Loader, setLoader] = useState(false)
  
const [ipAddress, setIPAddress] = useState('')

useEffect(() => {
  fetch('https://api.ipify.org?format=json')
    .then(response => response.json())
    .then(data => setIPAddress(data.ip))
    .catch(error => console.log(error))
}, []);

  const [regAlert, setRegAlert] = useState(false);
  const alertRef = useRef(null);
  
  useEffect(() => {
    const handleClickOutside = (event) => {
    if (alertRef.current && !alertRef.current.contains(event.target)) {
      setRegAlert(false);
    }
    };
  
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
    document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []); 

  let location = useLocation()
  const { loginpage } = location.state || {};

  let navigate = useNavigate()

  const login = useGoogleLogin({
    onSuccess: async (response) => {
      try {

        const res = await axios.get("https://www.googleapis.com/oauth2/v3/userinfo",
          {
            headers: {
              Authorization: `Bearer ${response.access_token}`,
            },
          }
        );
        setGmailuser(res.data)
        let gtoken = response.access_token
        let userId = res.data.sub
        let Gpicture = res.data.picture
        let email = res.data.email
        let name = res.data.name
        let isApproved=false
        // let image= res.data.picture
        // console.log("decoded name :", gemail)
        // console.log(" decoded id :", gname)

        await axios.post("/CSRoute/Glogin", {ipAddress, userId, email, name, gtoken, isApproved, Gpicture })
          .then((response) => {
            let result = response.data
            let token = result.token
            let Id = result.id
        // console.log(result)
          if(loginpage==="CSregcheck" && result.action == "login"){
              // alert("Account already exists. Please log in")
              setRegAlert(true)
              }
           else if (result.status == "success") {
              localStorage.setItem("CSCLog", JSON.stringify(btoa(token)))
              localStorage.setItem("CSCId", JSON.stringify(Id)) 
              if(loginpage==="CSregcheck" ){
                navigate("/Update-Profile", {state:{name:result.name, profileAlert: true }})
              }
              else{
              navigate("/alljobs", {state:{name:result.name}})
              }
                
            }
          }).catch((err) => {
            alert("server issue occured")
          })

      } catch (err) {
        alert("some thing went wrong with google gmail", err)
      }
    }
  })

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState(false)
  const [a, setA] = useState("")
  const [CSCloggedin, setCSCloggedin] = useState(false)
  const [topuperror, setTopuperror] = useState("")

  useEffect(() => {
    let studentAuth = localStorage.getItem("StudLog")
    if(studentAuth) {
        navigate("/alljobs")
    }
  })
  useEffect(() => {
    let CSCAuth = localStorage.getItem("CSCLog")
    if (CSCAuth) {
      navigate("/resumes")
    }
  },[])
  useEffect(() => {
    
    let EmployeeAuth = localStorage.getItem("EmpLog")
    if (EmployeeAuth) {
      navigate("/postedjobs")
    }
  }, [])

  useEffect(()=>{
    let adminLogin= localStorage.getItem("AdMLog")
    if(adminLogin){
      navigate("/BIAddmin@Profile")
    }
  },[])

  async function sendOtp() {
    await axios.post("/CSRoute/otpSignUp", { PhoneNumber })
      .then((res) => {
        if (res.data == "otp sent") {
          setshowotp(true)
        }
      })
  }

  async function confirmOtp() {
    let isApproved = false
    setLoader(true)
    setTimeout( async () => {     

    await axios.post("/CSRoute/verifyOtp", { ipAddress, otp , isApproved})
      .then((res) => {
        //  console.log(res.data)
        let result = res.data
            let token = result.token
            let Id = result.id
            if(result=="incorrect Otp"){
            alert("incorrect OTP")}
            if (result.status == "success") {
              localStorage.setItem("CSCLog", JSON.stringify(token))
              navigate("/alljobs", {state:{name:result.name}})
              localStorage.setItem("CSCId", JSON.stringify(Id))
            }     
            setLoader(false)
        
      }).catch((err)=>{
        alert("some thing went wrong")
      })
    }, 1000);

    setLoader(false)
  }

  function microsoftLogin() {
        instance.loginPopup(loginRequest)
            .then(async response => {
                // console.log(response)
                let name = response.account.name
                let email = response.account.username
                let isApproved = false

                await axios.post("/CSRoute/Glogin", { ipAddress, email, name, isApproved, })
                    .then((response) => {
                        let result = response.data
            console.log(result)
                        let token = result.token
                        let Id = result.id
                        if (result.status == "success") {
                            localStorage.setItem("CSCLog", JSON.stringify(btoa(token)))
                            navigate("/resumes", { state: { name: result.name } })
                            localStorage.setItem("CSCId", JSON.stringify(Id))
                        }
                    }).catch((err) => {
                        alert("server issue occured")
                    })
            })
            .catch(error => {
                // console.log("Login error", error);
                // alert("some thing went wrong")
            });
    }
  return (
    <>
  {regAlert==true &&

<div style={{position:"relative"}}>	 
 <div
 style={{
   position: 'absolute',
   top:'2px',
   left:0,
   width: '100vw',
 
   zIndex: 9998,
   display: 'flex',
   alignItems: 'top',
   justifyContent: 'center',
 
 }}
>
 <div
   ref={alertRef}
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
  Account Already Exists!
   <div style={{ marginTop: '15px', display: "flex", justifyContent: "center", gap: "5px" }}>
     <button
      onClick={() => { 
       navigate("/JobSeekerLogin"); 
 setRegAlert(false);
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
      Login as CSC
     </button>
     <button
       onClick={() => { 
 navigate("/"); 
 setRegAlert(false);
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
       Home
     </button>
   </div>
 </div>
</div>

</div>
}
<div className={styles.BothsignUpWrapper}>
  {loginpage==="CSregcheck"?
    <p className={styles.Loginpage} style={{marginLeft:"27px"}}> New Job Seeker Registration page</p>
    :
  <p className={styles.Loginpage}> CS center Loginpage  </p>
  }

{loginpage==="CSregcheck"?
<>
      <div className={styles.signUpWrapper} onClick={login} >
        <div className={styles.both}>
          <img className={styles.google} src={GoogleImage} />
          <span className={styles.signUpwrap} > Create Account with Google</span>
        </div>
       </div>

      <div className={styles.signUpWrapper} onClick={microsoftLogin}  >
        <div className={styles.both}>
          <img className={styles.google} src={MicosoftImage} />
          <span className={styles.signUpwrap} >Create Account with Microsoft</span>
        </div>
      </div>

       <div className={styles.signUpWrapper}  >
        <div className={styles.both}>
          <img className={styles.google} src={linkedIn} />
          <span className={styles.signUpwrap} >Create Account with Linkedin</span>
        </div>
      </div> 
      </>
      :
      <>
      <div className={styles.signUpWrapper} onClick={login} >
        <div className={styles.both}>
          <img className={styles.google} src={GoogleImage} />
          <span className={styles.signUpwrap} >Continue with Google</span>
        </div>
       </div>

      <div className={styles.signUpWrapper} onClick={microsoftLogin}  >
        <div className={styles.both}>
          <img className={styles.google} src={MicosoftImage} />
          <span className={styles.signUpwrap} >Continue with Microsoft</span>
        </div>
      </div>

       <div className={styles.signUpWrapper}  >
        <div className={styles.both}>
          <img className={styles.google} src={linkedIn} />
          <span className={styles.signUpwrap} >Continue with Linkedin</span>
        </div>
      </div> 
      </>

}


      {/* <div className={styles.signUpWrapper}  >
        <div className={styles.both}>
          <img className={styles.google} src={github} />
          <span className={styles.signUpwrap} >Continue with Github</span>
        </div>
      </div> */}


      </div>

      {screenSize.width > 750 ?
  // <div style={{marginTop:"330px", position:"sticky", bottom:0}}>
  //         <Footer/>
  //       </div>
  ""
        :
  <div style={{marginTop: "206px",}}>

        <Footer/>   
        </div>
}

    </>

  )
}

export default CSLogin