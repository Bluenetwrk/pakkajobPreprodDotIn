import React from "react";
import axios from "axios";
import { useEffect, useState } from "react";
import styles from "./StudentProfile.module.css";
import Companylogo from "../img/logo.png";
import { Puff } from "react-loader-spinner";
import { useNavigate } from "react-router-dom";

function EmployeeProfile() {
  const [profileData, setProfileData] = useState([]);
  const [pageLoader, setPageLoader] = useState(false);
  const [activeTab, setActiveTab] = useState("Personal Info");

  const navigate = useNavigate();

  let empId = JSON.parse(localStorage.getItem("EmpIdG"));

  async function getProfile() {
    const headers = {
      authorization: "BlueItImpulseWalkinIn",
    };

    setPageLoader(true);

    try {
      const res = await axios.get(
        `/EmpProfile/getProfile/${empId}`,
        { headers }
      );
      const result = res.data.result;
      setProfileData([result]);
    } catch (err) {
      alert("Something went wrong");
    } finally {
      setPageLoader(false);
    }
  }

  useEffect(() => {
    getProfile();
  }, []);

  if (pageLoader) {
    return (
      <div
        className={styles.centerText}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginTop: "80px",
        }}
      >
        <Puff
          height="80"
          width="80"
          color="#4fa94d"
          ariaLabel="bars-loading"
        />
        <p style={{ color: "red" }}>Loading...</p>
      </div>
    );
  }

  if (!profileData.length) {
    return null;
  }

  const profile = profileData[0];

  const tabs = [
    "Personal Info",
    "Company Info",
    "Account Status",
  ];

  return (
    <div className={styles.container}>

      {/* ================= HEADER ================= */}
      <div className={styles.header}>

        {/* LEFT SIDE */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          {/* <div className={styles.avatar}>
            <img
              src={profile.image ? profile.image : Companylogo}
              alt="Company Logo"
            />
          </div> */}
          {
            profileData.map((item, i) => {
              return (
                <div key={i} style={{}} className={styles.avatar}>
                  <img style={{}} src={item.Gpicture ? item.Gpicture : Companylogo} />

                </div>
              )

            })
          }

          <div className={styles.details}>
            <h2 className={styles.name}>
              {profile.name || "Company Profile"}
            </h2>

            <p className={styles.email}>
              {profile.email || ""}
            </p>

            <p className={styles.city}>
              {profile.City || ""}
            </p>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className={styles.actions}>

          <button
            className={styles.editBtn}
            onClick={() => navigate("/UpdateProfile")}
          >
            Edit Profile
          </button>

          {/* <button
            className={styles.downloadBtn}
            onClick={() => navigate(-1)}
          >
            Back
          </button> */}
 <div>
    {profile.isApproved ? (
      <span
        style={{
          display: "inline-block",
          padding: "6px 12px",
          borderRadius: "20px",
          backgroundColor: "#d4edda",
          color: "#155724",
          fontWeight: "600",
          fontSize: "14px",
        }}
      >
        ✓ Approved
      </span>
    ) : (
      <div>
        <span
          style={{
            display: "inline-block",
            padding: "6px 12px",
            borderRadius: "20px",
            backgroundColor: "#f8d7da",
            color: "#721c24",
            fontWeight: "600",
            fontSize: "14px",
          }}
        >
          ⚠ Under Verification
        </span>

        <div
          style={{
            marginTop: "8px",
            fontSize: "14px",
            color: "#555",
          }}
        >
          Your account is under verification process.{" "}
          <p
            onClick={() => navigate("/gMapProfile")}
            style={{
              color: "#007bff",
              cursor: "pointer",
              textDecoration: "underline",
              fontWeight: "600",
            }}
          >
            Verify your business account
          </p>
        </div>
      </div>
    )}
  </div>
        </div>
      </div>

      {/* ================= TABS ================= */}
      <div className={styles.tabs}>
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`${styles.tabBtn} ${activeTab === tab ? styles.activeTab : ""
              }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* ================= CONTENT ================= */}
      <div className={styles.content}>

        {/* =========================================
             PERSONAL INFO
        ========================================= */}
        {activeTab === "Personal Info" && (
          <div className={styles.infoSection}>

            <h3>Personal Information</h3>

            <div className={styles.profileGrid}>

              <div className={styles.profileField}>
                <strong>Name</strong>
                <span>
                  {profile.name || (
                    <span className={styles.notUpdated}>
                      you have not updated your Name yet
                    </span>
                  )}
                </span>
              </div>

              <div className={styles.profileField}>
                <strong>Email Id</strong>
                <span>
                  {profile.email || (
                    <span className={styles.notUpdated}>
                      you have not updated your Email yet
                    </span>
                  )}
                </span>
              </div>

              <div className={styles.profileField}>
                <strong>Phone Number</strong>
                <span>
                  {profile.phoneNumber || (
                    <span className={styles.notUpdated}>
                      you have not updated your Phone Number yet
                    </span>
                  )}
                </span>
              </div>

              <div className={styles.profileField}>
                <strong>Aadhar Id</strong>
                <span>
                  {profile.Aadhar || (
                    <span className={styles.notUpdated}>
                      you have not updated your Aadhar Id yet
                    </span>
                  )}
                </span>
              </div>

              <div className={styles.profileField}>
                <strong>Pan Card ID</strong>
                <span>
                  {profile.panCard || (
                    <span className={styles.notUpdated}>
                      you have not updated your PAN Id yet
                    </span>
                  )}
                </span>
              </div>

            </div>

          </div>
        )}

        {/* =========================================
             COMPANY INFO
        ========================================= */}
        {activeTab === "Company Info" && (
          <div className={styles.infoSection}>

            <h3>Company Information</h3>

            <div className={styles.profileGrid}>

              <div className={styles.profileField}>
                <strong>Company Name</strong>
                <span>
                  {profile.CompanyName || (
                    <span className={styles.notUpdated}>
                      you have not updated Company Name yet
                    </span>
                  )}
                </span>
              </div>

              <div className={styles.profileField}>
                <strong>Company Contact No</strong>
                <span>
                  {profile.CompanyContact || (
                    <span className={styles.notUpdated}>
                      you have not updated Company Number yet
                    </span>
                  )}
                </span>
              </div>

              <div className={styles.profileField}>
                <strong>Company Email Id</strong>
                <span>
                  {profile.CompanyEmail || (
                    <span className={styles.notUpdated}>
                      you have not updated Company Email yet
                    </span>
                  )}
                </span>
              </div>

              <div className={styles.profileField}>
                <strong>Company GSTIN</strong>
                <span>
                  {profile.CompanyGSTIN || (
                    <span className={styles.notUpdated}>
                      you have not updated Company GSTIN yet
                    </span>
                  )}
                </span>
              </div>

              <div className={styles.profileField}>
                <strong>Company Website</strong>
                <span>
                  {profile.CompanyWebsite ? (
                    <a
                      href={
                        profile.CompanyWebsite.startsWith("http")
                          ? profile.CompanyWebsite
                          : `https://${profile.CompanyWebsite}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {profile.CompanyWebsite}
                    </a>
                  ) : (
                    <span className={styles.notUpdated}>
                      you have not updated Company Website yet
                    </span>
                  )}
                </span>
              </div>

              <div className={styles.profileField}>
                <strong>Type of Organisation</strong>
                <span>
                  {profile.TypeofOrganisation || (
                    <span className={styles.notUpdated}>
                      you have not updated Organisation Type yet
                    </span>
                  )}
                </span>
              </div>

              <div className={styles.profileField}>
                <strong>Company Address 1</strong>
                <span>
                  {profile.CompanyAddress1 || (
                    <span className={styles.notUpdated}>
                      you have not updated Company Address1 yet
                    </span>
                  )}
                </span>
              </div>

              <div className={styles.profileField}>
                <strong>Company Address 2</strong>
                <span>
                  {profile.CompanyAddress2 || (
                    <span className={styles.notUpdated}>
                      you have not updated Company Address2 yet
                    </span>
                  )}
                </span>
              </div>

              <div className={styles.profileField}>
                <strong>City</strong>
                <span>
                  {profile.City || (
                    <span className={styles.notUpdated}>
                      you have not updated City yet
                    </span>
                  )}
                </span>
              </div>

              <div className={styles.profileField}>
                <strong>Pin Code</strong>
                <span>
                  {profile.postalCode || (
                    <span className={styles.notUpdated}>
                      you have not updated Pin code yet
                    </span>
                  )}
                </span>
              </div>

              <div className={styles.profileField}>
                <strong>Google Map</strong>
                <span>
                  {profile.googlemapsUrl ? (
                    <a
                      href={profile.googlemapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {profile.googlemapsUrl}
                    </a>
                  ) : (
                    <span className={styles.notUpdated}>
                      Not updated
                    </span>
                  )}
                </span>
              </div>

            </div>

          </div>
        )}

        {/* =========================================
             ACCOUNT STATUS
        ========================================= */}
        {activeTab === "Account Status" && (
          <div className={styles.infoSection}>

            <h3>Account Status</h3>

            <div className={styles.accountStatusBox}>

              {profile.isApproved ? (
                <>
                  <h4 className={styles.approvedText}>
                    Account Approved
                  </h4>

                  <p>
                    Congratulations! Your account has been approved.
                    You can start posting Jobs.
                  </p>
                </>
              ) : (
                <>
                  <h4 className={styles.pendingText}>
                    Account Under Verification
                  </h4>

                  <p>
                    Your account is under verification process.
                  </p>
                </>
              )}

            </div>

            {profile.message && (
              <div className={styles.messageBox}>
                <strong>Message:</strong>
                <span>{profile.message}</span>
              </div>
            )}

          </div>
        )}

      </div>

    </div >
  );
}

export default EmployeeProfile;