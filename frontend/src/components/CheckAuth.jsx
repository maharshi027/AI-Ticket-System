import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

function CheckAuth({children, protected: isProtected}) {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
      const token = localStorage.getItem("token")
      
      if(isProtected){
        if(!token){
          navigate("/login")
        } else {
          setLoading(false)
        } 
      } else {
        if(token){
          navigate("/")
        } else {
          setLoading(false)
        }
      }
  }, [navigate, isProtected])

  if(loading){
    return <div className="min-h-screen flex justify-center items-center"><span className="loading loading-spinner text-primary"></span></div>
  }
  return children;
}

export default CheckAuth
