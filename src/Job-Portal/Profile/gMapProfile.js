import axios from "axios";
import React, { useEffect } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import { useState } from "react";
import Modal from "./Model";
import Animation from "./Animated";
import { useNavigate } from 'react-router-dom'


function GMapProfile() {
  let navigate = useNavigate()

  let empId = JSON.parse(localStorage.getItem("EmpIdG"))
  let EmpV = JSON.parse(localStorage.getItem("EmpV"))

  useEffect(()=>{
    if(EmpV){
      navigate("/Search-Candidate")
    }

  },[])

  const [showModal, setShowModal] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleOk = () => {
    login()
    // setShowModal(false);
  };

  const handleCancel = () => {
    // setShowModal(false);
    navigate("/MyProfile")
  };

  const login = useGoogleLogin({
    // scope: "https://www.googleapis.com/auth/business.manage",
    onSuccess: async (response) => {
      try {
        const gtoken = response.access_token;
        // Get Google user information
        const user = await axios.get(
          "https://www.googleapis.com/oauth2/v3/userinfo",
          {
            headers: {
              Authorization: `Bearer ${gtoken}`,
            },
          }
        );
        // Get Google Business Profile accounts
        const accounts = await axios.get(
          "https://mybusinessaccountmanagement.googleapis.com/v1/accounts",
          {
            headers: {
              Authorization: `Bearer ${gtoken}`,
            },
          }
        );
        const accountName = accounts.data.accounts?.[0]?.name;
        // if (!accountName) {
        //   alert("No business account found");
        //   // throw new Error("No business account found");
        //   console.log("no account")
        //   return
        // }

        // Get locations
        const locationsResponse = await axios.get(
          `https://mybusinessbusinessinformation.googleapis.com/v1/${accountName}/locations`,
          {
            headers: {
              Authorization: `Bearer ${gtoken}`,
            },
            params: {
              readMask:
                "name,title,storefrontAddress,serviceArea,phoneNumbers,websiteUri,metadata",
            },
          }
        );
        if (locationsResponse.data && Object.keys(locationsResponse.data).length === 0) {
          alert("No locations found for this business account, kindly use your buisness acoount");
                navigate("/MyProfile")

          return
        }
        let googlemapsUrl = locationsResponse.data.locations[0].metadata.mapsUri
        // console.log(" newReviewUri:", locationsResponse.data.locations[0].metadata.newReviewUri);
        let placeId = locationsResponse.data.locations[0].metadata.placeId
        // console.log(" storefrontAddress:", locationsResponse.data.locations[0].storefrontAddress);
        let CompanyAddress1 = locationsResponse.data.locations[0].storefrontAddress.addressLines[0]
        let CompanyAddress2 = locationsResponse.data.locations[0].storefrontAddress.addressLines[1]
        let City = locationsResponse.data.locations[0].storefrontAddress.locality
        let postalCode = locationsResponse.data.locations[0].storefrontAddress.postalCode
        let CompanyName = locationsResponse.data.locations[0].title
        let CompanyWebsite = locationsResponse.data.locations[0].websiteUri
        let hasBuisnessAccount=true
        
        let userid = JSON.parse(localStorage.getItem("EmpIdG"))
        const headers = {authorization: userid + " " + atob(JSON.parse(localStorage.getItem("EmpLog")))};
        await axios.put(`/EmpProfile/updatProfile/${empId}`, {
          placeId, CompanyName, CompanyWebsite, hasBuisnessAccount,
          CompanyAddress1, CompanyAddress2, City, postalCode, googlemapsUrl
        }, { headers })
          .then(async (res) => {
            let result = res.data
            if (result == "success") {
              setShowSuccess(true);
              setTimeout(() => {
                setShowSuccess(false);
                navigate("/MyProfile")
				localStorage.setItem("EmpV", JSON.stringify(true))

              }, 4000);
            }
            window.scrollTo({
              top: 0,
              behavior: "smooth"
            });

          }).catch((err) => {
          })
      } catch (error) {
        console.log("STATUS:", error);
        console.log("ERROR:", error);
      }
    },

    onError: (error) => {
      console.log("Google login error:", error);
    },
  });

  return (
    <>
      {/* <button onClick={() => setShowModal(true)}>
        Open Modal
      </button> */}

      <Modal
        isOpen={showModal}
        onOk={handleOk}
        onCancel={handleCancel}
      />
      {showSuccess ?
        <Animation /> : ""
      }
    </>
  );
}

export default GMapProfile;
