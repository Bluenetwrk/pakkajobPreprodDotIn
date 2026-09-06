// Model.js
import { useState, useEffect } from "react"
import React from 'react'
import styles from "./login.module.css"
import { useRef } from 'react';
import { LinkedInApi, NodeServer } from '../Config';
import axios from "axios"
import { useNavigate, Link, useLocation } from "react-router-dom";
import GoogleImage from "../img/icons8-google-48.png"
import MicosoftImage from "../img/icons8-windows-10-48.png"
import { useGoogleLogin } from '@react-oauth/google';
import image from "../img/user_3177440.png"
import { TailSpin } from "react-loader-spinner"
import linkedIn from "../img/icons8-linked-in-48.png"
import github from "../img/icons8-github-50.png"
import { auth, provider } from "../firebase"
import { signInWithPopup, OAuthProvider, getAuth } from "firebase/auth";

import { useMsal } from "@azure/msal-react";
import { loginRequest } from "../Config";

const Model = ({ isregCheck, isCSCOpen, onClose, children, msalInstance }) => {
	const { instance } = useMsal();
	const [gmailuser, setGmailuser] = useState("")
	const [topErrorMessage, setTopErrorMessage] = useState("")
	const [PhoneNumber, setPhoneNumber] = useState("")
	const [otp, setotp] = useState("")

	const [showotp, setshowotp] = useState(false)
	const [Loader, setLoader] = useState(false)

	const [ipAddress, setIPAddress] = useState('')
	// ......Modal....
	const [open, setOpen] = React.useState(false);

	const handleClose = () => {
		setOpen(false);
	};

	const handleOpen = () => {
		setOpen(true);
	};

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

	const login = useGoogleLogin(
		{
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
					let email = res.data.email
					let name = res.data.name
					let isApproved = false
					let Gpicture = res.data.picture
					await axios.post("/CSRoute/Glogin", { ipAddress, userId, email, name, gtoken, isApproved, Gpicture })
						.then((response) => {
							let result = response.data
							let token = result.token
							let Id = result.id
							if (isregCheck == true && result.action == "login") {
								setRegAlert(true)
							}

							if (result.status == "success") {
								console.log(result)
								localStorage.setItem("CSCLog", JSON.stringify(btoa(token)))
								localStorage.setItem("CSCId", JSON.stringify(Id))
								navigate("/resumes", { state: { name: result.name, loginprofile:"cs_center" } })
								onClose()
							}
						}).catch((err) => {
							console.log("Gmail login error:", err)
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
		if (studentAuth) {
			navigate("/alljobs")
		}
	},[])

	useEffect(() => {
		let CSCAuth = localStorage.getItem("CSCLog")
		if (CSCAuth) {
			navigate("/resumes")
		}
	},[])
	useEffect(() => {
		// let studentAuth = localStorage.getItem("StudLog")
		let EmployeeAuth = localStorage.getItem("EmpLog")
		if (EmployeeAuth) {
			navigate("/postedjobs")
		}
	}, [])

	useEffect(() => {
		let adminLogin = localStorage.getItem("AdMLog")
		if (adminLogin) {
			navigate("/BIAddmin@Profile")
		}
	}, [])

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
		setTimeout(async () => {

			await axios.post("/CSRoute/verifyOtp", { ipAddress, otp, isApproved })
				.then((res) => {
					//  console.log(res.data)
					let result = res.data
					let token = result.token
					let Id = result.id
					if (result == "incorrect Otp") {
						alert("incorrect OTP")
					}
					if (result.status == "success") {
						localStorage.setItem("CSCLog", JSON.stringify(token))
						navigate("/resumes", { state: { name: result.name } })
						localStorage.setItem("CSCId", JSON.stringify(Id))
					}
					setLoader(false)

				}).catch((err) => {
					alert("some thing went wrong")
				})
		}, 1000);

		// setLoader(false)
	}
	if (!isCSCOpen) return null;

	function giHubSign() {
		signInWithPopup(auth, provider)
			.then(async (res) => {
				let name = res.user.providerData[0].displayName
				let email = res.user.providerData[0].email
				let Gpicture = res.user.providerData[0].photoURL
				let isApproved = false
				await axios.post("/CSRoute/Glogin", { ipAddress, email, name, isApproved, Gpicture })
					.then((response) => {
						let result = response.data
						let token = result.token
						let Id = result.id
						if (result.status == "success") {
							localStorage.setItem("CSCLog", JSON.stringify(btoa(token)))
							navigate("/resumes", { state: { name: result.name } })
							localStorage.setItem("CSCId", JSON.stringify(Id))
							onClose()
						}
					}).catch((err) => {
						alert("server issue occured")
					})

			}).catch((err) => {
				alert("something went wrong with github login ")
			})
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
						let token = result.token
						let Id = result.id
						if (result.status == "success") {
							localStorage.setItem("CSCLog", JSON.stringify(btoa(token)))
							navigate("/resumes", { state: { name: result.name } })
							localStorage.setItem("CSCId", JSON.stringify(Id))
							onClose()
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
			{regAlert == true ?

				<div style={{ position: "relative" }}>
					<div
						style={{
							position: 'absolute',
							top: '2px',
							left: 0,
							width: '100vw',
							//   height: '100vh',
							//   backgroundColor: 'rgba(0, 0, 0, 0.4)',
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
										navigate("/CSLogin");
										setRegAlert(false);
										onClose();
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
										onClose();
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
				:
				<div style={{ height: "150px" }} className={styles.ModelWrapper} >


					<p onClick={onClose} style={
						{ position: "absolute", marginLeft: "85%", marginTop: "0px", cursor: "pointer", display: "inline" }}>

						<i className="fas fa-times" style={{ fontSize: "large" }}></i>
					</p>
					<>

						<div className={styles.BothsignUpWrapperModel}>
							{isregCheck == true ?
								<p className={styles.Loginpage}>New CSC Registration</p> :
								<p className={styles.Loginpage}>CSC Login</p>}
							{isregCheck == true ?
								<>
									<div className={styles.signUpWrapper} onClick={login} >
										<div className={styles.both}>
											<img className={styles.google} src={GoogleImage} />
											<span className={styles.signUpwrap} >Create Account with Google</span>
										</div>
									</div>

									<div className={styles.signUpWrapper} onClick={microsoftLogin} >
										<div className={styles.both}>
											<img className={styles.google} src={MicosoftImage} />
											<span className={styles.signUpwrap} >Create Account with Microsoft</span>
										</div>
									</div>
									<div className={styles.signUpWrapper}>
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

									<div className={styles.signUpWrapper} onClick={microsoftLogin} >
										<div className={styles.both}>
											<img className={styles.google} src={MicosoftImage} />
											<span className={styles.signUpwrap} >Continue with Microsoft</span>
										</div>
									</div>
									<div className={styles.signUpWrapper}>
										<div className={styles.both}>
											<img className={styles.google} src={linkedIn} />
											<span className={styles.signUpwrap} >Continue with Linkedin</span>
										</div>
									</div>
								</>
							}
						</div>
					</>

				</div>
			}
		</>
	);
};

export default Model;
