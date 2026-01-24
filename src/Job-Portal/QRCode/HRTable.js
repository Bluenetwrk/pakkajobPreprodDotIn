import React, { useEffect, useState } from "react";
import {
  getAllProfiles,
  getCurrentInCabin,
} from "./mockdatabase"; // adjust path if needed
import styles from "./HRTable.module.css"; // replace with your CSS module path

export default function HRTable() {
  const [profiles, setProfiles] = useState([]);
 let inCabin = getCurrentInCabin();
//   useEffect(() => {
//     const interval = setInterval(() => {
//       const allProfiles = getAllProfiles();
//      inCabin = getCurrentInCabin();
//       console.log(inCabin)

//       const updated = allProfiles.map((profile) => {
//         if (inCabin && profile.id === inCabin.id) {
//           return { ...profile, status: "In Cabin" };
//         }
//         return { ...profile, status: profile.status || "Checked-In" };
//       });

//       setProfiles(updated);
//     }, 3000);

//     return () => clearInterval(interval);
//   }, [inCabin]);

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Registrations</h2>
      <table className={styles.hrTable}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Resume</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {profiles.map((p) => (
            <tr key={p.id}>
              <td>{p.name}</td>
              <td>{p.email}</td>
              <td>
                <a href={p.resumeUrl} target="_blank" rel="noreferrer">
                  View
                </a>
              </td>
              <td>{p.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
