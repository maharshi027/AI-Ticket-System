import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'

const Signup = () => {
  const [form , setForm] = useState({email: "", password: ""})
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate();

  const handleChange = (e) =>{
    setForm({...form, [e.target.name]: e.target.value})
  }
  const handleSignup = async(e) =>{
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/auth/signup`, 
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(form)
        }
      )
      const data = await res.json()
      if(res.ok){
        localStorage.setItem("token", data.token)
        localStorage.setItem("user", JSON.stringify(data.user))
        navigate("/")
      } else {
        alert(data.message || "Signup Failed")
      }
    } catch (error) {
      alert("Signup - Something went Wrong")
    }
    finally{
      setLoading(false);
    }
  }
  return (
    <div className='min-h-screen flex items-center justify-center bg-base-200'>
      <div className='card w-full max-w-sm shadow-xl bg-base-100'>
        <form onSubmit={handleSignup} className='card-body'>
          <h2 className='card-title justify-center text-2xl font-bold mb-4'>Create Account</h2>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Email</span>
            </label>
            <input 
              type="email"
              name='email'
              placeholder='email@example.com'
              className='input input-bordered w-full'
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Password</span>
            </label>
            <input 
              type="password"
              name='password'
              placeholder='••••••••'
              className='input input-bordered w-full'
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>
          <div className='form-control mt-6'>
              <button 
                type='submit'
                className='btn btn-primary w-full'
                disabled={loading}
              >
                {loading ? <span className="loading loading-spinner"></span> : "Sign Up"}
              </button>
          </div>
          <div className="text-center mt-4">
            <p className="text-sm">
              Already have an account? <Link to="/login" className="link link-primary">Log in</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Signup
