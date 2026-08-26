import axios from "axios";
import React from "react";
import { useGoogleLogin } from "@react-oauth/google";

function GMapProfile() {
  const empId = JSON.parse(localStorage.getItem("EmpIdG"));
  const empGToken = JSON.parse(localStorage.getItem("EmpLog"));
  const gToken = atob(empGToken);
  console.log(gToken);

  const login = useGoogleLogin({
    // scope: "https://www.googleapis.com/auth/business.manage",

    onSuccess: async (response) => {
      try {
        const gtoken = response.access_token;
        console.log(response);

        console.log("OAuth response:", response);

        // Get Google user information
        const user = await axios.get(
          "https://www.googleapis.com/oauth2/v3/userinfo",
          {
            headers: {
              Authorization: `Bearer ${gtoken}`,
            },
          }
        );

		  let userId = user.data.sub
		  let email = user.data.email
		  let name = user.data.name
		  let isApproved = false
		  // let image= user.data.picture
		  let Gpicture = user.data.picture

        // Get Google Business Profile accounts
      const accounts = await axios.get(
  "https://mybusinessaccountmanagement.googleapis.com/v1/accounts",
  {
    headers: {
      Authorization: `Bearer ${gtoken}`,
    },
  }
);

console.log("BUSINESS ACCOUNTS:", accounts.data);

const accountName = accounts.data.accounts?.[0]?.name;

if (!accountName) {
  alert("No business account found");
  throw new Error("No business account found");
}

console.log("ACCOUNT NAME:", accountName);

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

console.log("LOCATIONS:", locationsResponse.data);

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
        Connect Google Business
      </button>
    </div>
  );
}

export default GMapProfile;
