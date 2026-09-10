import React from 'react'
import { useNavigate, Outlet, Navigate } from 'react-router-dom'

function Private() {
  const studentAuth = localStorage.getItem("StudLog") || 
    JSON.parse(localStorage.getItem("CSCLog"));

  return (
    studentAuth ? <Outlet/> : <Navigate to = "/" />
  )
}

export default Private