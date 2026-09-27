
import React, { useEffect, useState } from "react";
import styles from "./TemplateEight.module.css";
import axios from "axios";
import { generatePDF } from "./generatePDF";

const TemplateSix = ({ themeColor }) => {
  const [profileData, setProfileData] = useState(null);
  const [resumeData, setResumeData] = useState(null);

  const studId = JSON.parse(localStorage.getItem("StudId"));

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchProfile = async () => {
      try {
        const res = await axios.get(
          `/StudentProfile/viewProfile/${studId}`
        );

        setProfileData(res.data.result);
        setResumeData(res.data.result);
      } catch (error) {
        console.error(error);
        alert("Failed to load profile");
      }
    };

    fetchProfile();
  }, [studId]);

  // ---------------------------------------------------
  // EDIT SIMPLE FIELD
  // ---------------------------------------------------
  const updateField = (field, value) => {
    setResumeData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // ---------------------------------------------------
  // EDIT PERSONAL DETAILS
  // ---------------------------------------------------
  const updatePersonalDetail = (field, value) => {
    setResumeData((prev) => ({
      ...prev,
      personalDetails: [
        {
          ...(prev.personalDetails?.[0] || {}),
          [field]: value,
        },
      ],
    }));
  };

  // ---------------------------------------------------
  // EDIT QUALIFICATION
  // ---------------------------------------------------
  const updateQualification = (index, field, value) => {
    setResumeData((prev) => {
      const qualifications = Object.values(
        prev.qualificationDetails || {}
      );

      qualifications[index] = {
        ...qualifications[index],
        [field]: value,
      };

      return {
        ...prev,
        qualificationDetails: qualifications,
      };
    });
  };

  // ---------------------------------------------------
  // EDIT SKILLS
  // ---------------------------------------------------
  const updateSkills = (heading, value) => {
    const items = value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    setResumeData((prev) => ({
      ...prev,
      skills: (prev.skills || []).map((group) =>
        group.heading === heading
          ? {
              ...group,
              items,
            }
          : group
      ),
    }));
  };

  // ---------------------------------------------------
  // EDIT INTERESTS
  // ---------------------------------------------------
  const updateInterests = (value) => {
    const interests = value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    setResumeData((prev) => ({
      ...prev,
      interests,
    }));
  };

  // ---------------------------------------------------
  // EDIT EXPERIENCE
  // ---------------------------------------------------
  const updateExperience = (index, field, value) => {
    setResumeData((prev) => {
      const experiences = Object.values(prev.experiences || {});

      experiences[index] = {
        ...experiences[index],
        [field]: value,
      };

      return {
        ...prev,
        experiences,
      };
    });
  };

  // ---------------------------------------------------
  // EDIT LANGUAGES
  // ---------------------------------------------------
  const updateLanguages = (value) => {
    const languages = value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    setResumeData((prev) => ({
      ...prev,
      languages,
    }));
  };

  // ---------------------------------------------------
  // SAVE RESUME
  // ---------------------------------------------------
  const handleSaveResume = async () => {
    try {
      console.log("Resume data:", resumeData);

      /*
        Add your backend API here when ready.

        Example:

        await axios.put(
          `/StudentProfile/updateResume/${studId}`,
          resumeData
        );
      */

      alert("Resume changes saved successfully");
    } catch (error) {
      console.error(error);
      alert("Failed to save resume");
    }
  };

  // ---------------------------------------------------
  // DOWNLOAD PDF
  // ---------------------------------------------------
  const handleDownloadPDF = () => {
    const element = document.getElementById("template-six");

    if (!element) return;

    element.classList.add(styles.forceA4);

    setTimeout(() => {
      generatePDF(
        "template-six",
        `${resumeData?.name || "resume"}_resume.pdf`
      );

      element.classList.remove(styles.forceA4);
    }, 300);
  };

  if (!resumeData) return null;

  const qualifications = Object.values(
    resumeData.qualificationDetails || {}
  );

  const experiences = Object.values(
    resumeData.experiences || {}
  );

  const interests = Object.values(
    resumeData.interests || {}
  );

  const personalDetails = resumeData.personalDetails?.[0] || {};

  return (
    <div className={styles.wrapper}>

      {/* ================= RESUME ================= */}
      <div id="template-six" className={styles.resume}>
        <div className={styles.innerBorder}>

          {/* ================= HEADER ================= */}

          <h1
            className={styles.title}
            style={{ color: themeColor }}
          >
            RESUME
          </h1>

          <div className={styles.header}>

            {/* LEFT SIDE */}
            <div>

              <strong>
                <EditableText
                  value={resumeData.name}
                  style={{
                    color: themeColor,
                    fontSize: "22px",
                    fontWeight: "bold",
                  }}
                  onChange={(value) =>
                    updateField("name", value)
                  }
                />
              </strong>

              <div
                style={{
                  width: "74%",
                  marginBottom: "-27px",
                  marginTop: "-11px",
                }}
              >
                <p style={{ fontSize: "13px" }}>
                  <EditableText
                    value={resumeData.address}
                    onChange={(value) =>
                      updateField("address", value)
                    }
                  />
                </p>
              </div>

            </div>

            {/* RIGHT SIDE */}
            <div
              style={{
                width: "55%",
                marginTop: "7px",
              }}
              className={styles.headerRight}
            >

              <p
                style={{
                  fontSize: "13px",
                  marginBottom: "-10px",
                }}
              >
                <strong>E-mail:</strong>{" "}
                <EditableText
                  value={resumeData.email}
                  onChange={(value) =>
                    updateField("email", value)
                  }
                />
              </p>

              <p style={{ fontSize: "13px" }}>
                <strong>Contact No:</strong>{" "}
                <EditableText
                  value={resumeData.phoneNumber}
                  onChange={(value) =>
                    updateField("phoneNumber", value)
                  }
                />
              </p>

            </div>
          </div>

          {/* ================= OBJECTIVE ================= */}

          <div style={{ marginTop: "-16px" }}>

            <Section
              title="OBJECTIVE"
              themeColor={themeColor}
            >

              <EditableText
                value={
                  resumeData.objective ||
                  "My objective is to succeed in an environment of growth and excellence and earn a job which provides me job satisfaction and self development and helps me achieve personal as well as organisational goals."
                }
                multiline
                style={{
                  color: "black",
                  lineHeight: "1.5",
                }}
                onChange={(value) =>
                  updateField("objective", value)
                }
              />

            </Section>

          </div>

          {/* ================= EDUCATION ================= */}

          <Section
            title="EDUCATIONAL QUALIFACTION"
            themeColor={themeColor}
          >

            <table
              className={styles.table}
              style={{ color: "black" }}
            >

              <thead>
                <tr>
                  <th>Course</th>
                  <th>University / Board</th>
                  <th>Passing Year</th>
                  <th>Percentage</th>
                </tr>
              </thead>

              <tbody>

                {qualifications
                  .sort(
                    (a, b) =>
                      (b.yop || 0) - (a.yop || 0)
                  )
                  .map((q, i) => (

                    <tr key={i}>

                      <td>
                        <EditableText
                          value={q.degree}
                          onChange={(value) =>
                            updateQualification(
                              i,
                              "degree",
                              value
                            )
                          }
                        />
                      </td>

                      <td>
                        <EditableText
                          value={q.collegeName}
                          onChange={(value) =>
                            updateQualification(
                              i,
                              "collegeName",
                              value
                            )
                          }
                        />
                      </td>

                      <td>
                        <EditableText
                          value={q.yop || "-"}
                          onChange={(value) =>
                            updateQualification(
                              i,
                              "yop",
                              value
                            )
                          }
                        />
                      </td>

                      <td>
                        <EditableText
                          value={q.score || "-"}
                          onChange={(value) =>
                            updateQualification(
                              i,
                              "score",
                              value
                            )
                          }
                        />
                      </td>

                    </tr>

                  ))}

              </tbody>

            </table>

          </Section>

          {/* ================= TECHNICAL SKILLS ================= */}
{/* TECHNICAL SKILLS */}
<Section title="TECHNICAL SKILLS" themeColor={themeColor}>
  <p style={{ color: "black" }}>
    <EditableText
      value={resumeData.skills || ""}
      onChange={(value) => updateField("skills", value)}
      multiline={true}
    />
  </p>
</Section>

          {/* ================= HOBBIES ================= */}

          <Section
            title="HOBBIES"
            themeColor={themeColor}
          >

            <ul>

              <li style={{ color: "black" }}>

                <EditableText
                  value={interests
                    .slice(0, 4)
                    .join(", ")}
                  onChange={updateInterests}
                />

              </li>

            </ul>

          </Section>

          {/* ================= EXPERIENCE ================= */}

          <Section
            title="EXPERIENCE"
            themeColor={themeColor}
          >

            <ul
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gridTemplateRows:
                  "repeat(3, auto)",
                gap: "4px 20px",
                paddingLeft: "18px",
              }}
            >

              {experiences
                .slice(0, 6)
                .map((e, i) => (

                  <li
                    style={{ color: "black" }}
                    key={i}
                  >

                    <EditableText
                      value={e.company}
                      onChange={(value) =>
                        updateExperience(
                          i,
                          "company",
                          value
                        )
                      }
                    />

                    {" – "}

                    <EditableText
                      value={e.role}
                      onChange={(value) =>
                        updateExperience(
                          i,
                          "role",
                          value
                        )
                      }
                    />

                  </li>

                ))}

            </ul>

          </Section>

          {/* ================= PERSONAL DETAILS ================= */}

          <Section
            title="PERSONAL DETAILS"
            themeColor={themeColor}
          >

            <div
              className={styles.personalGrid}
              style={{ color: "black" }}
            >

              {/* NAME */}

              <div className={styles.row}>

                <span className={styles.label}>
                  Name
                </span>

                <span className={styles.colon}>
                  :
                </span>

                <EditableText
                  value={resumeData.name}
                  onChange={(value) =>
                    updateField("name", value)
                  }
                />

              </div>

              {/* FATHER NAME */}

              <div className={styles.row}>

                <span className={styles.label}>
                  Father Name
                </span>

                <span className={styles.colon}>
                  :
                </span>

                <EditableText
                  value={
                    personalDetails.fatherName ||
                    "N/A"
                  }
                  onChange={(value) =>
                    updatePersonalDetail(
                      "fatherName",
                      value
                    )
                  }
                />

              </div>

              {/* MOTHER NAME */}

              <div className={styles.row}>

                <span className={styles.label}>
                  Mother Name
                </span>

                <span className={styles.colon}>
                  :
                </span>

                <EditableText
                  value={
                    personalDetails.motherName ||
                    "N/A"
                  }
                  onChange={(value) =>
                    updatePersonalDetail(
                      "motherName",
                      value
                    )
                  }
                />

              </div>

              {/* DOB */}

              <div className={styles.row}>

                <span className={styles.label}>
                  Date of Birth
                </span>

                <span className={styles.colon}>
                  :
                </span>

                <EditableText
                  value={
                    personalDetails.dob
                      ? new Date(
                          personalDetails.dob
                        ).toLocaleDateString(
                          "en-US",
                          {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          }
                        )
                      : "N/A"
                  }
                  onChange={(value) =>
                    updatePersonalDetail(
                      "dob",
                      value
                    )
                  }
                />

              </div>

              {/* GENDER */}

              <div className={styles.row}>

                <span className={styles.label}>
                  Gender
                </span>

                <span className={styles.colon}>
                  :
                </span>

                <EditableText
                  value={
                    personalDetails.gender ||
                    "N/A"
                  }
                  onChange={(value) =>
                    updatePersonalDetail(
                      "gender",
                      value
                    )
                  }
                />

              </div>

              {/* NATIONALITY */}

              <div className={styles.row}>

                <span className={styles.label}>
                  Nationality
                </span>

                <span className={styles.colon}>
                  :
                </span>

                <EditableText
                  value={
                    personalDetails.Nationality ||
                    "N/A"
                  }
                  onChange={(value) =>
                    updatePersonalDetail(
                      "Nationality",
                      value
                    )
                  }
                />

              </div>

              {/* LANGUAGES */}

              <div className={styles.row}>

                <span className={styles.label}>
                  Languages Known
                </span>

                <span className={styles.colon}>
                  :
                </span>

                <EditableText
                  value={
                    resumeData.languages?.join(
                      ", "
                    ) || "N/A"
                  }
                  onChange={updateLanguages}
                />

              </div>

            </div>

          </Section>

          {/* ================= DECLARATION ================= */}

          <Section
            title="DECLARATION"
            themeColor={themeColor}
          >

            <EditableText
              value="I hereby affirm that all the above information in this document is true to the best of my knowledge."
              multiline
              style={{
                color: "black",
              }}
            />

            <div
              style={{
                display: "flex",
                justifyContent:
                  "space-between",
                alignItems: "center",
              }}
            >

              <div>

                <p
                  className={styles.place}
                  style={{
                    color: "black",
                  }}
                >
                  <strong>Place:</strong>
                  {" "}
                  <EditableText
                    value=""
                    onChange={() => {}}
                  />
                </p>

                <p
                  className={styles.date}
                  style={{
                    color: "black",
                  }}
                >
                  <strong>Date:</strong>{" "}
                  __________
                </p>

              </div>

              <div>

                <p
                  className={styles.thankYou}
                  style={{
                    color: "black",
                    marginRight: "11px",
                  }}
                >
                  Thank You.
                </p>

              </div>

            </div>

          </Section>

        </div>
      </div>

      {/* ================= BUTTONS ================= */}

      <div
        style={{
          display: "flex",
          gap: "10px",
          justifyContent: "center",
          marginTop: "20px",
        }}
      >

        <button
          onClick={handleSaveResume}
          className={styles.downloadBtn}
        >
          Save Resume
        </button>

        <button
          onClick={handleDownloadPDF}
          className={styles.downloadBtn}
        >
          Download Template 6 PDF
        </button>

      </div>

    </div>
  );
};


/* =====================================================
   EDITABLE TEXT COMPONENT
===================================================== */

const EditableText = ({
  value,
  onChange,
  className,
  style,
  multiline = false,
}) => {

  return (
    <span
      className={className}
      contentEditable
      suppressContentEditableWarning
      style={{
        ...style,
        cursor: "text",
        outline: "none",
        display: multiline
          ? "block"
          : "inline",
      }}
      onBlur={(e) => {
        const newValue =
          e.currentTarget.innerText;

        if (onChange) {
          onChange(newValue);
        }
      }}
      onKeyDown={(e) => {

        // Prevent Enter from creating unwanted
        // extra elements inside the resume
        if (
          !multiline &&
          e.key === "Enter"
        ) {
          e.preventDefault();
          e.currentTarget.blur();
        }

      }}
    >
      {value || ""}
    </span>
  );
};


/* =====================================================
   SECTION COMPONENT
===================================================== */

const Section = ({
  title,
  children,
  themeColor,
}) => (

  <>
    <div
      className={styles.sectionTitle}
      style={{
        color: themeColor,
      }}
    >
      {title}
    </div>

    <div
      className={styles.sectionContent}
      style={{
        color: themeColor,
      }}
    >
      {children}
    </div>
  </>

);

export default TemplateSix;

