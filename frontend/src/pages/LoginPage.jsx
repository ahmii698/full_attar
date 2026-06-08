import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { FaEnvelope, FaLock, FaUser, FaEye, FaEyeSlash } from 'react-icons/fa'

function LoginPage() {
  const navigate = useNavigate()
  const { login, signup } = useAuth()
  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  })
  
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    setError('')
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    try {
      if (isLogin) {
        await login(formData.email, formData.password)
        navigate('/')
      } else {
        await signup(formData.email, formData.password, formData.name)
        navigate('/')
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <h1>{isLogin ? 'Welcome Back' : 'Create Account'}</h1>
            <p>{isLogin ? 'Login to your account' : 'Sign up to get started'}</p>
          </div>
          
          {error && <div className="auth-error">{error}</div>}
          
          <form onSubmit={handleSubmit} className="auth-form">
            {!isLogin && (
              <div className="input-group">
                <FaUser className="input-icon" />
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
            )}
            
            <div className="input-group">
              <FaEnvelope className="input-icon" />
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="input-group">
              <FaLock className="input-icon" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            
            {isLogin && (
              <div className="forgot-password">
                <Link to="/forgot-password">Forgot Password?</Link>
              </div>
            )}
            
            <button type="submit" className="auth-btn" disabled={loading}>
              {loading ? 'Please wait...' : (isLogin ? 'Login' : 'Sign Up')}
            </button>
          </form>
          
          <div className="auth-footer">
            <p>
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button 
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin)
                  setError('')
                  setFormData({ name: '', email: '', password: '' })
                }} 
                className="switch-auth"
              >
                {isLogin ? 'Sign Up' : 'Login'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage