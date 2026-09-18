import React, { useState } from "react";
import axios from "axios";

const WhatsAppLogin = () => {

    const [mobile, setMobile] = useState("");
    const [loading, setLoading] = useState(false);

    const sendOTP = async () => {
        console.log(mobile)
        if (!mobile) {
            alert("Enter mobile number");
            return;
        }
        try {
            setLoading(true);
            const response = await axios.post("/StudentProfile/send-whatsapp-otp",{phoneNumber: "91" + mobile });
            console.log(response.data)
            if (response.data.success) {
                alert("OTP sent to WhatsApp");
            }
        } catch (error) {
            console.error(error);
            alert(
                error.response?.data?.message ||
                "Failed to send OTP"
            );
        } finally {
            setLoading(false);
        }
    };


    // const verifyOTP = async () => {

    //     if (!otp) {
    //         alert("Enter OTP");
    //         return;
    //     }

    //     try {

    //         setLoading(true);

    //         const response = await axios.post(
    //             "/StudentProfile/verify-whatsapp-otp",
    //             {
    //                 mobile: "91" + mobile,
    //                 otp
    //             }
    //         );

    //         if (response.data.success) {

    //             // Save JWT
    //             localStorage.setItem(
    //                 "token",
    //                 response.data.token
    //             );

    //             localStorage.setItem(
    //                 "user",
    //                 JSON.stringify(response.data.user)
    //             );

    //             alert("Login successful");

    //             // Navigate
    //             window.location.href = "/";

    //         }

    //     } catch (error) {

    //         console.error(error);

    //         alert(
    //             error.response?.data?.message ||
    //             "Invalid OTP"
    //         );

    //     } finally {

    //         setLoading(false);

    //     }
    // };


    return (
        <>


            <div>

                <h2>Login with WhatsApp</h2>

                <input
                    type="tel"
                    placeholder="Enter mobile number"
                    value={mobile}
                    onChange={(e) =>
                        setMobile(e.target.value)
                    }
                    maxLength={10}
                />

                <button
                    onClick={sendOTP}
                    disabled={loading}
                >
                    {loading
                        ? "Sending..."
                        : "Send OTP"}
                </button>

            </div>
        </>
    )
           
};

export default WhatsAppLogin;