import axios from "axios";
import React from "react";
import { useGoogleLogin } from "@react-oauth/google";

function GMapProfile() {
  const empId = JSON.parse(localStorage.getItem("EmpIdG"));
  const empGToken = JSON.parse(localStorage.getItem("EmpLog"));
  const gToken = atob(empGToken);

  const login = useGoogleLogin({
    scope: "https://www.googleapis.com/auth/business.manage",

    onSuccess: async (response) => {
      try {
        const gtoken = response.access_token;

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

        console.log("USER:", user.data);

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
