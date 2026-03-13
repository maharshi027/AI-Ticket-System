import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const [form , setForm] = useState({email: "", password: ""})
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate();

  const handleChange = (e) =>{
    setForm({...form, [e.target.name]: e.target.value})
  }

  const handleLogin = async(e) =>{
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/auth/login`, 
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
        alert(data.error || "Login Failed")
      }
    } catch (error) {
      alert("Login - Something went Wrong")
    }
    finally{
      setLoading(false);
    }
  }

  return (
    <div className='auth-bg'>
      {/* Decorative Blobs */}
      <div className="w-full max-w-lg relative">
        <div className="auth-blob-1"></div>
        <div className="auth-blob-2"></div>
        <div className="auth-blob-3"></div>

        <div className='card w-full glass-card p-2 sm:p-5 m-4 sm:m-0'>
          <form onSubmit={handleLogin} className='card-body z-10'>
            <div className='text-center mb-6'>
              <h2 className='text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent mb-2'>Welcome Back</h2>
              <p className='text-base-content/70 font-medium'>Sign in to continue to AI Ticket</p>
            </div>
            
            <div className="space-y-4">
              <div className="form-control w-full">
                <label className="label hidden">
                  <span className="label-text font-semibold">Email</span>
                </label>
                <div className="relative flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-4 text-base-content/50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" /></svg>
                  <input 
                    type="email"
                    name='email'
                    placeholder='Email Address'
                    className='input bg-base-100/50 backdrop-blur-sm border-white/20 focus:bg-base-100/80 focus:border-primary w-full pl-12 rounded-xl transition-all duration-300'
                    value={form.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-control w-full">
                <label className="label hidden">
                  <span className="label-text font-semibold">Password</span>
                </label>
                <div className="relative flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-4 text-base-content/50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                  <input 
                    type="password"
                    name='password'
                    placeholder='Password'
                    className='input bg-base-100/50 backdrop-blur-sm border-white/20 focus:bg-base-100/80 focus:border-primary w-full pl-12 rounded-xl transition-all duration-300'
                    value={form.password}
                    onChange={handleChange}
                    required
                  />
                </div>
                <label className="label justify-end mt-1 p-0">
                  <a href="#" className="label-text-alt text-primary font-medium hover:underline">Forgot password?</a>
                </label>
              </div>
            </div>

            <div className='form-control mt-8'>
                <button 
                  type='submit'
                  className='btn btn-primary w-full rounded-xl shadow-lg hover:shadow-primary/50 transition-all duration-300 transform hover:-translate-y-1 border-none'
                  disabled={loading}
                >
                  {loading ? (
                    <span className="loading loading-spinner loading-md"></span>
                  ) : (
                    <span className="text-lg">Sign In</span>
                  )}
                </button>
            </div>
            
            <div className="text-center mt-6">
              <p className="text-sm font-medium text-base-content/70">
                Don't have an account? <Link to="/signup" className="text-primary hover:text-primary-focus hover:underline font-bold transition-colors">Sign up now</Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login
