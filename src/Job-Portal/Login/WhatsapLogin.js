import React, { useState } from "react";
import axios from "axios";
import styles from "./WhatsAppLogin.module.css";
import { useNavigate, Link, useLocation } from "react-router-dom";


const WhatsAppLogin = ({ onClose }) => {

    const [mobile, setMobile] = useState("");
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(false);
    const [failed, setFailed] = useState(false);
    const [otp, setOtp] = useState();
    let navigate = useNavigate()

    const sendOTP = async () => {

        if (!mobile) {
            alert("Enter mobile number");
            return;
        }

        if (mobile.length !== 10) {
            alert("Enter valid 10 digit mobile number");
            return;
        }

        try {

            setLoading(true);

            const response = await axios.post("/StudentProfile/send-whatsapp-otp",
                {
                    phoneNumber: "91" + mobile
                }
            );

            if (response.data.success) {
                alert("OTP sent to WhatsApp");
                setFailed(true)
            }

        } catch (error) {
            setFailed(true)

        } finally {
            setLoading(false);
        }
    };
    const loginWithOtp = async () => {
        try {
            setLoading(true);
        const response = await axios.post("/StudentProfile/login-with-whatsapp-otp", {phoneNumber: "91" + mobile, name: name} );
            let result = response.data
            let token = result.token
            let Id = result.id
            if (result.status == "success") {
              localStorage.setItem("StudLog", JSON.stringify(btoa(token)))
              localStorage.setItem("StudId", JSON.stringify(Id))
             navigate("/alljobs", { state: { name: result.name } })
            }
        } catch (error) {
            setFailed(true)

        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className={styles.popupOverlay}
            onClick={onClose}
        >
            <div
                className={styles.whatsappCard}
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    className={styles.closeButton}
                    onClick={onClose}
                >
                    ×
                </button>

                <div className={styles.logoCircle}>

                    <img
                        src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
                        alt="WhatsApp"
                    />

                </div>

                <h3 className={styles.title}>
                    Login with WhatsApp
                </h3>

                <p className={styles.subtitle}>
                    Enter your mobile number to receive a
                    <br />
                    secure OTP on WhatsApp
                </p>

                {!failed ?
                    <>
                        <div className={styles.inputGroup}>

                            <div className={styles.countryCode}>
                                +91
                            </div>
                            <input
                                type="tel"
                                placeholder="Enter mobile number"
                                value={mobile}
                                onChange={(e) =>
                                    setMobile(
                                        e.target.value.replace(/\D/g, "")
                                    )
                                }
                                maxLength={10}
                            />
                        </div>

                        <div className={styles.inputGroup} style={{ marginTop: "10px" }}>

                            <input
                                type="text"
                                placeholder="Enter You Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                maxLength={25}
                            />
                        </div>
                    </>
                    :
                    <>
                        <div className={styles.inputGroup}>

                            <input
                                type="tel"
                                placeholder="Enter 12345 as otp"
                                value={otp}
                                onChange={(e) =>
                                    setOtp(
                                        e.target.value.replace(/\D/g, "")
                                    )
                                }
                                maxLength={5}
                            />
                        </div>

                    </>
                }

                {!failed ?

                    <button
                        className={styles.sendOtpButton}
                        onClick={sendOTP}
                        disabled={loading}
                    >

                        {loading ? (
                            <>
                                <span className={styles.spinner}></span>
                                Sending OTP...
                            </>
                        ) : (
                            "Send OTP"
                        )}

                    </button>
                    :
                    <button
                        className={styles.sendOtpButton}
                        onClick={loginWithOtp}
                        disabled={loading}
                    >

                        {loading ? (
                            <>
                                <span className={styles.spinner}></span>
                                Logging in...
                            </>
                        ) : (
                            "Login"
                        )}

                    </button>
                }

                <div className={styles.secureText}>

                    <span className={styles.checkIcon}>
                        ✓
                    </span>

                    <span>
                        Your OTP will be sent securely through WhatsApp
                    </span>

                </div>

            </div>

        </div>
    );
};

export default WhatsAppLogin;