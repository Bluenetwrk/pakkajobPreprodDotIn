import axios from "axios";
import React from "react";
import { useGoogleLogin } from "@react-oauth/google";

function GMapProfile() {
  const empId = JSON.parse(localStorage.getItem("EmpIdG"));
  const empGToken = JSON.parse(localStorage.getItem("EmpLog"));

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

        if (!accountName) {
          alert("No business account found");
          throw new Error("No business account found");
        }

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
console.log("Locations Response:", locationsResponse.data.locations[0]);
        if (locationsResponse.data && Object.keys(locationsResponse.data).length === 0) {
          alert("No locations found for this business account");
        }

      } catch (error) {
        console.log("STATUS:", error.response?.status);
        console.log("ERROR:", error.response?.data);
      }
    },

    onError: (error) => {
      console.log("Google login error:", error);
    },
  });

  return (
    <div style={{ margin: "10px" }}>
      <button onClick={() => login()}>
        Verify your buisness profile with Google
      </button>
      <p>Note: To keep PakkaJob free from fake employeers, please verify your business once using Google business profile.</p>
    </div>
  );
}

export default GMapProfile;
