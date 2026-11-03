
import React, { useEffect, useState } from "react";
import styles from "./TemplateSeven.module.css";
import axios from "axios";
import { generatePDF } from "./generatePDF";

/* =========================================================
   EDITABLE TEXT
========================================================= */

const EditableText = ({
  value,
  placeholder = "",
  onChange,
  className = "",
  multiline = false,

}) => {
  return (
    <span
      className={`${styles.editableText} ${className}`}
      contentEditable
      suppressContentEditableWarning
      role="textbox"
      tabIndex={0}
      data-placeholder={placeholder}
      onBlur={(e) => {
        const newValue = e.currentTarget.innerText.trim();

        if (onChange) {
          onChange(newValue);
        }
      }}
      onKeyDown={(e) => {
        if (!multiline && e.key === "Enter") {
          e.preventDefault();
          e.currentTarget.blur();
        }
      }}
    >
      {value || ""}
    </span>
  );
};


/* =========================================================
   MAIN COMPONENT
========================================================= */
const TemplateSeven = ({ themeColor, limit, totalResumeLimit, SetTotalResumeLimit }) => {
  const [profileData, setProfileData] = useState(null);

  const studId = JSON.parse(localStorage.getItem("StudId"));
  const CSCId = JSON.parse(localStorage.getItem("CSCId"));


  /* =======================================================
     FETCH PROFILE
  ======================================================= */

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchProfile = async () => {
      try {
        const res = await axios.get(
          `/StudentProfile/viewProfile/${studId}`
        );

        setProfileData(res.data.result);
        // console.log(res.data.result)
      } catch (error) {
        console.error("Profile loading error:", error);
        alert("Failed to load profile");
      }
    };

    if (studId) {
      fetchProfile();
    }
  }, [studId]);


  /* =======================================================
     UPDATE ROOT PROFILE FIELD
  ======================================================= */

  const updateProfileField = (field, value) => {
    setProfileData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };


  /* =======================================================
     UPDATE PERSONAL DETAILS
  ======================================================= */

  const updatePersonalField = (field, value) => {
    setProfileData((prev) => {
      const personalDetails = [
        ...(prev.personalDetails || []),
      ];

      personalDetails[0] = {
        ...(personalDetails[0] || {}),
        [field]: value,
      };

      return {
        ...prev,
        personalDetails,
      };
    });
  };


  /* =======================================================
     UPDATE QUALIFICATION
  ======================================================= */

  const updateQualificationField = (
    index,
    field,
    value
  ) => {
    setProfileData((prev) => {
      const qualificationDetails = {
        ...(prev.qualificationDetails || {}),
      };

      const keys = Object.keys(qualificationDetails);

      const key = keys[index];

      if (!key) {
        return prev;
      }

      qualificationDetails[key] = {
        ...qualificationDetails[key],
        [field]: value,
      };

      return {
        ...prev,
        qualificationDetails,
      };
    });
  };


  /* =======================================================
     UPDATE EXPERIENCE
  ======================================================= */

  const updateExperienceField = (
    originalKey,
    field,
    value
  ) => {
    setProfileData((prev) => {
      const experiencesObject = {
        ...(prev.experiences || {}),
      };

      if (!Object.prototype.hasOwnProperty.call(experiencesObject, originalKey)) {
        return prev;
      }

      experiencesObject[originalKey] = {
        ...experiencesObject[originalKey],
        [field]: value,
      };

      return {
        ...prev,
        experiences: experiencesObject,
      };
    });
  };


  /* =======================================================
     FORMAT DATE
  ======================================================= */

  const formatDate = (date) => {
    if (!date) return "N/A";

    const parsed = new Date(date);

    if (isNaN(parsed.getTime())) {
      return date;
    }

    return parsed.toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };


  /* =======================================================
     FORMAT EXPERIENCE DATE
  ======================================================= */

  const formatExperienceDate = (date) => {
    if (!date) return "Present";

    const parsed = new Date(date);

    if (isNaN(parsed.getTime())) {
      return date;
    }

    return parsed.toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };


  /* =======================================================
     DOWNLOAD PDF
  ======================================================= */

  const handleDownloadPDF = () => {
    const element = document.getElementById("template-seven");

    if (!element) {
      console.error("template-seven element not found");
      return;
    }
    element.classList.add(styles.forceA4);
    setTimeout(async () => {
      try {
        generatePDF(
          "template-seven",
          `${profileData?.name || "resume"}_resume.pdf`
        );

        // API call
        if (CSCId) {

          await axios.post("/CSRoute/pdfDownloadedCount", { CSCId: CSCId })
            .then((res) => {
              SetTotalResumeLimit((prev) => prev + 1)
              console.log(res.data.count)
            }).catch((err) => {
              console.log("some thing went wrong", err)
            })
        }
      } catch (error) {
        console.error("Error saving PDF download:", error);
      } finally {
        element.classList.remove(styles.forceA4);
      }
    }, 300);
  };
  /* =======================================================
     LOADING
  ======================================================= */

  if (!profileData) {
    return (
      <div className={styles.loading}>
        Loading Resume...
      </div>
    );
  }


  /* =======================================================
     PERSONAL DATA
  ======================================================= */

  const personal =
    profileData.personalDetails?.[0] || {};


  /* =======================================================
     QUALIFICATIONS
  ======================================================= */

  const qualifications = Object.values(
    profileData.qualificationDetails || {}
  ).sort(
    (a, b) =>
      Number(a.yop || 0) -
      Number(b.yop || 0)
  );


  /* =======================================================
     EXPERIENCES
  ======================================================= */

  const experiences = Object.entries(
    profileData.experiences || {}
  )
    .filter(([key, experience]) => {
      if (!experience || typeof experience !== "object") {
        return false;
      }

      return (
        String(experience.company || "").trim() ||
        String(experience.role || "").trim() ||
        String(experience.startDate || "").trim() ||
        String(experience.endDate || "").trim()
      );
    })
    .slice(0, 6)
    .map(([originalKey, experience]) => ({
      ...experience,
      originalKey,
    }));


  /* =======================================================
     INTERESTS
  ======================================================= */

  const interests = Object.values(
    profileData.interests || {}
  ).slice(0, 4);


  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <>
      <div className={styles.wrapper}>

        <div
          id="template-seven"
          className={styles.resume}
        >

          {/* =================================================
              TITLE
          ================================================= */}

          <p className={styles.title}
            style={{ color: themeColor }}
          >
            RESUME
          </p>

          {/* =================================================
              HEADER
          ================================================= */}

          <div className={styles.header}>

            <div className={styles.name}
              style={{ color: themeColor }}
            >

              <EditableText

                value={profileData.name}
                placeholder="Your Name"
                onChange={(value) =>
                  updateProfileField(
                    "name",
                    value
                  )
                }
              />

            </div>

            <div className={styles.contactLine}>

              <strong>
                Mobile No. -
              </strong>{" "}

              <EditableText
                value={
                  profileData.phoneNumber
                }
                placeholder="Mobile Number"
                onChange={(value) =>
                  updateProfileField(
                    "phoneNumber",
                    value
                  )
                }
              />

            </div>
            <div className={styles.contactLine}>

              <strong>
                Email Id -
              </strong>{" "}

              <EditableText
                value={
                  profileData.email
                }
                placeholder="Email Address"
                onChange={(value) =>
                  updateProfileField(
                    "email",
                    value
                  )
                }
              />

            </div>

            <div className={styles.contactLine}>
              <strong>
                City -
              </strong>{" "}
              <EditableText
                value={
                  profileData.city
                }
                placeholder="Address"
                onChange={(value) =>
                  updateProfileField(
                    "city",
                    value
                  )
                }
              />

            </div>

          </div>


          {/* =================================================
              OBJECTIVE
          ================================================= */}
          {/* <hr></hr> */}
          <hr style={{ margin: " 13px 0 15px 0" }}></hr>


          <Section title="OBJECTIVE"
            themeColor={themeColor}
          >

            <EditableText
              value={
                profileData.objective ||
                "My objective is to succeed in an environment of growth and excellence and earn a job which provides me job satisfaction and self development and helps me achieve personal as well as organisational goals."
              }
              placeholder="Enter your objective..."
              multiline={true}
              onChange={(value) =>
                updateProfileField(
                  "objective",
                  value
                )
              }
            />

          </Section>


          {/* =================================================
              PERSONAL INFORMATION
          ================================================= */}
          {/* <hr></hr> */}
          <hr style={{ margin: " 13px 0 15px 0" }}></hr>


          <Section title="PERSONAL INFORMATION"
            themeColor={themeColor}

          >

            <div
              className={
                styles.personalInformation
              }
            >

              <PersonalRow
                label="Name"
                value={
                  <EditableText
                    value={
                      profileData.name
                    }
                    placeholder="Name"
                    onChange={(value) =>
                      updateProfileField(
                        "name",
                        value
                      )
                    }
                  />
                }
              />


              <PersonalRow
                label="Father Name"
                value={
                  <EditableText
                    value={
                      personal.fatherName
                    }
                    placeholder="Father Name"
                    onChange={(value) =>
                      updatePersonalField(
                        "fatherName",
                        value
                      )
                    }
                  />
                }
              />


              <PersonalRow
                label="Mother Name"
                value={
                  <EditableText
                    value={
                      personal.motherName
                    }
                    placeholder="Mother Name"
                    onChange={(value) =>
                      updatePersonalField(
                        "motherName",
                        value
                      )
                    }
                  />
                }
              />


              <PersonalRow
                label="Date of Birth"
                value={
                  <EditableText
                    value={
                      formatDate(
                        personal.dob
                      )
                    }
                    placeholder="Date of Birth"
                    onChange={(value) =>
                      updatePersonalField(
                        "dob",
                        value
                      )
                    }
                  />
                }
              />


              <PersonalRow
                label="Gender"
                value={
                  <EditableText
                    value={
                      personal.gender
                    }
                    placeholder="Gender"
                    onChange={(value) =>
                      updatePersonalField(
                        "gender",
                        value
                      )
                    }
                  />
                }
              />


              <PersonalRow
                label="Nationality"
                value={
                  <EditableText
                    value={
                      personal.Nationality
                    }
                    placeholder="Nationality"
                    onChange={(value) =>
                      updatePersonalField(
                        "Nationality",
                        value
                      )
                    }
                  />
                }
              />


              <PersonalRow
                label="Languages Known"
                value={
                  <EditableText
                    value={
                      profileData.languages?.join(
                        ", "
                      )
                    }
                    placeholder="Languages"
                    onChange={(value) =>
                      updateProfileField(
                        "languages",
                        value
                          .split(",")
                          .map(
                            (item) =>
                              item.trim()
                          )
                          .filter(Boolean)
                      )
                    }
                  />
                }
              />

            </div>

          </Section>


          {/* =================================================
              EDUCATIONAL QUALIFICATION
          ================================================= */}
          {/* <hr></hr> */}
          <hr style={{ margin: " 13px 0 15px 0" }}></hr>


          <Section title="EDUCATIONAL QUALIFICATION"
            themeColor={themeColor}
          >

            <table className={styles.table}>

              <thead>

                <tr>

                  <th>
                    Examination
                  </th>

                  <th>
                    Board/University
                  </th>

                  <th>
                    Year
                  </th>

                  <th>
                    Percentage
                  </th>

                </tr>

              </thead>


              <tbody>

                {qualifications.length >
                  0 ? (

                  qualifications.map(
                    (q, index) => (

                      <tr
                        key={index}
                      >

                        <td>

                          <EditableText
                            value={
                              q.degree
                            }
                            placeholder="Examination"
                            onChange={(
                              value
                            ) =>
                              updateQualificationField(
                                index,
                                "degree",
                                value
                              )
                            }
                          />

                        </td>


                        <td>

                          <EditableText
                            value={
                              q.collegeName
                            }
                            placeholder="Board / University"
                            onChange={(
                              value
                            ) =>
                              updateQualificationField(
                                index,
                                "collegeName",
                                value
                              )
                            }
                          />

                        </td>


                        <td>

                          <EditableText
                            value={
                              q.yop
                            }
                            placeholder="Year"
                            onChange={(
                              value
                            ) =>
                              updateQualificationField(
                                index,
                                "yop",
                                value
                              )
                            }
                          />

                        </td>


                        <td>

                          <EditableText
                            value={
                              q.score
                            }
                            placeholder="Percentage"
                            onChange={(
                              value
                            ) =>
                              updateQualificationField(
                                index,
                                "score",
                                value
                              )
                            }
                          />

                        </td>

                      </tr>

                    )
                  )

                ) : (

                  <tr>

                    <td>
                      -
                    </td>

                    <td>
                      -
                    </td>

                    <td>
                      -
                    </td>

                    <td>
                      -
                    </td>

                  </tr>

                )}

              </tbody>

            </table>

          </Section>


          {/* =================================================
              TECHNICAL SKILLS
          ================================================= */}
          {/* <hr></hr> */}
          <hr style={{ margin: " 13px 0 15px 0" }}></hr>


          <Section title="TECHNICAL SKILLS"
            themeColor={themeColor}
          >

            <EditableText
              value={
                Array.isArray(
                  profileData.skills
                )
                  ? profileData.skills.join(
                    ", "
                  )
                  : profileData.skills
              }
              placeholder="Enter your technical skills..."
              multiline={true}
              onChange={(value) =>
                updateProfileField(
                  "skills",
                  value
                )
              }
            />

          </Section>


          {/* =================================================
              EXPERIENCE
          ================================================= */}
          {/* <hr></hr> */}

          <hr style={{ margin: " 13px 0 15px 0" }}></hr>


          <Section title="EXPERIENCE"
            themeColor={themeColor}
          >
            {
              experiences.length > 0 ?
                (

                  <div
                    className={
                      styles.experienceList
                    }
                  >

                    {experiences.map(
                      (
                        experience,
                        index
                      ) => (

                        <div
                          className={
                            styles.experienceItem
                          }
                          key={experience.originalKey}
                        >

                          <strong>
                            Company{" "}
                            {index + 1}
                          </strong>


                          <div>

                            <EditableText
                              value={
                                experience.company
                              }
                              placeholder="Company Name"
                              onChange={(
                                value
                              ) =>
                                updateExperienceField(
                                  experience.originalKey,
                                  "company",
                                  value
                                )
                              }
                            />


                            {" - "}


                            <EditableText
                              value={
                                experience.role
                              }
                              placeholder="Role"
                              onChange={(
                                value
                              ) =>
                                updateExperienceField(
                                  experience.originalKey,
                                  "role",
                                  value
                                )
                              }
                            />


                            {" - ("}


                            <EditableText
                              value={
                                formatExperienceDate(
                                  experience.startDate
                                )
                              }
                              placeholder="Start Date"
                              onChange={(
                                value
                              ) =>
                                updateExperienceField(
                                  experience.originalKey,
                                  "startDate",
                                  value
                                )
                              }
                            />


                            {" - "}


                            <EditableText
                              value={
                                formatExperienceDate(
                                  experience.endDate
                                )
                              }
                              placeholder="End Date"
                              onChange={(
                                value
                              ) =>
                                updateExperienceField(
                                  experience.originalKey,
                                  "endDate",
                                  value
                                )
                              }
                            />


                            {")"}

                          </div>

                        </div>

                      )
                    )}

                  </div>

                ) 

                :
                (
                  <EditableText
                    value="FRESHER"
                    placeholder="FRESHER"
                  />

                )
            }

          </Section>


          {/* =================================================
              BEHAVIOURAL CHARACTERISTICS
          ================================================= */}
          {/* <hr></hr> */}
          <hr style={{ margin: " 13px 0 15px 0" }}></hr>


          <Section title="BEHAVIOURAL CHARACTERISTICS"
            themeColor={themeColor}
          >

            <ul
              className={
                styles.behaviourList
              }
            >

              <li>

                <EditableText
                  value="Commitment to quality results."
                  multiline={true}
                />

              </li>


              <li>

                <EditableText
                  value="Ability to take challenges, work under pressure & achieve targets."
                  multiline={true}
                />

              </li>


              <li>

                <EditableText
                  value="Self-motivated, confident, and responsible."
                  multiline={true}
                />

              </li>
            </ul>

          </Section>


          {/* =================================================
              DECLARATION
          ================================================= */}
          <hr style={{ margin: " 13px 0 15px 0" }}></hr>

          <Section title="DECLARATION"
            themeColor={themeColor}
          >

            <EditableText
              value="I here by confirm that the information given in this document is correct to the best of my knowledge."
              multiline={true}
            />

              <div
                className={
                  styles.signature
                }
              >

                (

                <EditableText
                  value={
                    profileData.name ||
                    "name"
                  }
                  placeholder="Signature Name"
                  onChange={(value) =>
                    updateProfileField(
                      "name",
                      value
                    )
                  }
                />

                )

              </div>

          </Section>

        </div>


        {/* =================================================
            DOWNLOAD BUTTON
        ================================================= */}
        <hr></hr>

        {/* <button
          onClick={handleDownloadPDF}
          className={styles.downloadBtn}>
          Download Resume PDF
        </button> */}

        <div className={styles.tooltipWrapper}>
          <button
            disabled={totalResumeLimit >= limit}
            onClick={handleDownloadPDF}
            className={styles.downloadBtn}
          >
            Download Resume
          </button>

          {totalResumeLimit >= limit && (
            <>
              <span className={styles.tooltip}>
                You have reached your download limit
                <p>get help from admin , call on 8152047809</p>
              </span>
            </>
          )}
        </div>

      </div>
    </>
  );
};
<hr></hr>



/* =========================================================
   SECTION COMPONENT
========================================================= */

const Section = ({
  title,
  children,
  themeColor,

}) => {

  return (
    <section
      className={styles.section}
    >

      <h2
        className={
          styles.sectionTitle

        }
        style={{
          color: themeColor,
        }}
      >
        {title}
      </h2>


      <div
        className={
          styles.sectionContent
        }
      >
        {children}
      </div>

    </section>
  );
};

<hr></hr>


/* =========================================================
   PERSONAL ROW COMPONENT
========================================================= */

const PersonalRow = ({
  label,
  value,
}) => {

  return (
    <div
      className={
        styles.personalRow
      }
    >

      <span
        className={
          styles.personalLabel
        }
      >
        {label}
      </span>


      <span
        className={
          styles.personalColon
        }
      >
        :
      </span>


      <span
        className={
          styles.personalValue
        }
      >
        {value || "N/A"}
      </span>

    </div>
  );
};


export default TemplateSeven;
