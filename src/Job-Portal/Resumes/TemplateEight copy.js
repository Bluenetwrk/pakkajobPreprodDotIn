import React, { useEffect, useState } from "react";
import styles from "./TemplateEight.module.css";
import axios from "axios";
import { generatePDF } from "./generatePDF";

const TemplateEight = ({themeColor}) => {
  const [profileData, setProfileData] = useState(null);
  const studId = JSON.parse(localStorage.getItem("StudId"));

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchProfile = async () => {
      try {
        const res = await axios.get(`/StudentProfile/viewProfile/${studId}`);
        setProfileData(res.data.result);
      } catch {
        alert("Failed to load profile");
      }
    };

    fetchProfile();
  }, [studId]);

  const handleDownloadPDF = () => {
    const element = document.getElementById("template-six");
    element.classList.add(styles.forceA4);

    setTimeout(() => {
      generatePDF("template-six", `${profileData?.name}_resume.pdf`);
      element.classList.remove(styles.forceA4);
    }, 300);
  };

  if (!profileData) return null;

  return (
    <div className={styles.wrapper}>
      <div id="template-six" className={styles.resume}>
        <div className={styles.innerBorder}>

        {/* HEADER */}
        <h1 className={styles.title} style={{color:themeColor}}>RESUME</h1>

        <div className={styles.header}>
          <div>
            <strong style={{color:themeColor, fontSize:"22px"}}>{profileData.name}</strong>
            <div style={{ width: "74%" , marginBottom:"-27px", marginTop:"-11px"}}>
              <p style={{fontSize:"13px"}}>{profileData.address}</p>
            </div>
          </div>

          <div  style={{width:"55%", marginTop:"7px"}} className={styles.headerRight}>
            <p style={{fontSize:"13px",marginBottom:"-10px"}}><strong>E-mail:</strong> {profileData.email}</p>
            <p style={{fontSize:"13px"}}><strong>Contact No:</strong> {profileData.phoneNumber}</p>
          </div>
        </div>

        {/* OBJECTIVE */}
        <div style={{marginTop:"-16px"}}>
        <Section title="OBJECTIVE" themeColor={themeColor} >
          <p style={{color:"black"}}>
            {profileData.objective
              ? profileData.objective
              : "My objective is to succeed in an environment of growth and excellence and earn a job which provides me job satisfaction and self development and helps me achieve personal as well as organisational goals."}

          </p>
        </Section>
</div>
        {/* EDUCATION */}
        <Section title="EDUCATIONAL QUALIFACTION" themeColor={themeColor}>
  <table className={styles.table} style={{ color: "black" }}>
    <thead>
      <tr>
        <th>Course</th>
        <th>University / Board</th>
        <th>Passing Year</th>
        <th>Percentage</th>
      </tr>
    </thead>
    <tbody>
      {Object.values(profileData.qualificationDetails || {})
        .sort((a, b) => (b.yop || 0) - (a.yop || 0))
        .map((q, i) => (
          <tr key={i}>
            <td>{q.degree}</td>
            <td>{q.collegeName}</td>
            <td>{q.yop || "-"}</td>
            <td>{q.score || "-"}</td>
          </tr>
        ))}
    </tbody>
  </table>
</Section>

        {/* TECHNICAL SKILLS */}
        <Section title="TECHNICAL SKILLS" themeColor={themeColor}>
          {["Computer", "Typing"].map((heading) => {
            const group = profileData.skills?.find(
              (g) => g.heading === heading
            );

            return group && group.items?.length > 0 ? (
              <p style={{color:"black"}} key={heading}>
                <strong>{heading}:</strong> {group.items.join(", ")}
              </p>
            ) : null;
          })}
        </Section>

        {/* HOBBIES */}
        <Section title="HOBBIES" themeColor={themeColor}>
  <ul>
    <li style={{ color: "black" }}>
      {Object.values(profileData.interests || {})
        .slice(0, 4)
        .join(", ")}
    </li>
  </ul>
</Section>

        {/* EXPERIENCE */}
        <Section title="EXPERIENCE" themeColor={themeColor}>
  <ul
style={{
  display: "grid",
  gridTemplateColumns: "1fr 1fr",   // two columns (left + right)
  gridTemplateRows: "repeat(3, auto)", // 3 rows
  gap: "4px 20px",
  paddingLeft: "18px"
}}
  >
    {Object.values(profileData.experiences || {})
      .slice(0, 8)
      .map((e, i) => (
        <li style={{ color: "black" }} key={i}>
          {e.company} – {e.role}
        </li>
      ))}
  </ul>
</Section>

        {/* PERSONAL DETAILS */}
        <Section title="PERSONAL DETAILS" themeColor={themeColor}>
          <div className={styles.personalGrid} style={{color:"black"}}>

            <div className={styles.row}>
              <span className={styles.label}>Name</span>
              <span className={styles.colon}>:</span>
              <span>{profileData.name}</span>
            </div>

            <div className={styles.row}>
              <span className={styles.label}>Father Name</span>
              <span className={styles.colon}>:</span>
              <span>{profileData.personalDetails?.[0]?.fatherName || "N/A"}</span>
            </div>

            <div className={styles.row} style={{color:"black"}}>
              <span className={styles.label}>Mother Name</span>
              <span className={styles.colon}>:</span>
              <span>{profileData.personalDetails?.[0]?.motherName || "N/A"}</span>
            </div>

            <div className={styles.row} style={{color:"black"}}>
              <span className={styles.label}>Date of Birth</span>
              <span className={styles.colon}>:</span>
              <span>
                {profileData?.personalDetails?.[0]?.dob
                  ? new Date(profileData.personalDetails[0].dob).toLocaleDateString(
                      "en-US",
                      { day: "2-digit", month: "short", year: "numeric" }
                    )
                  : "N/A"}
              </span>
            </div>

            <div className={styles.row} style={{color:"black"}}>
              <span className={styles.label}>Gender</span>
              <span className={styles.colon}>:</span>
              <span>{profileData.personalDetails?.[0]?.gender || "N/A"}</span>
            </div>

            <div className={styles.row} style={{color:"black"}}>
              <span className={styles.label}>Nationality</span>
              <span className={styles.colon}>:</span>
              <span>{profileData.personalDetails?.[0]?.Nationality || "N/A"}</span>
            </div>

            <div className={styles.row} style={{color:"black"}}>
              <span className={styles.label}>Languages Known</span>
              <span className={styles.colon}>:</span>
              <span>{profileData.languages?.join(", ") || "N/A"}</span>
            </div>

          </div>
        </Section>

        {/* DECLARATION */}
        <Section title="DECLARATION" themeColor={themeColor}>
          <p style={{color:"black"}}>
            I hereby affirm that all the above information in this document is
            true to the best of my knowledge.
          </p>
          <div style={{display:"flex", justifyContent:"space-between", alignItems:"center"}}>
            <div >
                <p className={styles.place} style={{color:"black"}}><strong>Place:</strong></p>
                <p className={styles.date} style={{color:"black"}}><strong>Date:</strong> __________</p>
            </div>
            <div>
                <p className={styles.thankYou} style={{color:"black",marginRight:"11px"}}>Thank You.</p>
            </div>
          </div>
        </Section>

        </div>
      </div>

      <button onClick={handleDownloadPDF} className={styles.downloadBtn}>
        Download Template 8 PDF
      </button>
    </div>
  );
};

const Section = ({ title, children, themeColor }) => (
  <>
    <div className={styles.sectionTitle} style={{color:themeColor}}>{title}</div>
    <div className={styles.sectionContent} style={{color:themeColor}} >{children}</div>
  </>
);

export default TemplateEight;
