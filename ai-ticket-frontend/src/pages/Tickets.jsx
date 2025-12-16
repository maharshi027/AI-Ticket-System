import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
function Tickets() {
  const [form, setForm] = useState({title: "", description: ""});
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(false)

  const token = localStorage.getItem("token")
  const fetchTickets = async() => {
    try {
      const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/tickets`, {
        headers: {Authorization: `Bearer ${token}`},
        method: "GET",

      })
      const data = await res.json();
      setTickets(data.tickets || []);
    } catch (error) {
      console.error("Failed to Fetch Tickets: ", error);
      
    }
  };

  useEffect(()=>{
    fetchTickets();

  }, [])

  const handleChange = (e) => {
    setForm({...form, [e.target.name]: e.target.value})
  }

  const handleSubmit = async()=>{
    e.preventDefault();
    setLoading(true)
    try {
        const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/tickets`, {
          method: "POST",
          headers:{
           "Content-Type": "application/json"
          }
        })

    } catch (error) {
      
    }
  }
  return (
    <div>
      All Tickets page
    </div>
  )
}

export default Tickets
