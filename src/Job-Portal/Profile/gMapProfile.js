import React from 'react'

function gMapProfile() {
      let empId = JSON.parse(localStorage.getItem("EmpIdG"))
      let empGToken = JSON.parse(localStorage.getItem("EmpLog"))
      console.log("empId", empId, atob(empGToken))
  return (
    <div style={{ margin: '10px' }}>
      gMapProfile
    </div>
  )
}

export default gMapProfile