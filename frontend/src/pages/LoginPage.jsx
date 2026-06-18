import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { FaEnvelope, FaLock, FaUser, FaEye, FaEyeSlash, FaArrowLeft, FaSpinner, FaGem, FaArrowRight } from 'react-icons/fa'
import './LoginPage.css'

function LoginPage({ redirectTo }) {
  const navigate = useNavigate()
  const location = useLocation()
  const { login, signup } = useAuth()
  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [signupSuccess, setSignupSuccess] = useState(false)
  
  const from = redirectTo || location.state?.from?.pathname || '/'
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  })

  // Forgot Password States
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [otpStep, setOtpStep] = useState(1)
  const [otpEmail, setOtpEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [otpLoading, setOtpLoading] = useState(false)
  const [otpMessage, setOtpMessage] = useState('')
  const [otpError, setOtpError] = useState('')
  const [resendTimer, setResendTimer] = useState(0)

  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api'

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    setError('')
    setSignupSuccess(false)
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSignupSuccess(false)
    
    try {
      if (isLogin) {
        await login(formData.email, formData.password)
        navigate(from, { replace: true })
      } else {
        // ✅ Sign up - pehle account create karo
        await signup(formData.name, formData.email, formData.password)
        
        // ✅ Sign up success message
        setSignupSuccess(true)
        setError('')
        
        // ✅ Form clear karo
        setFormData({
          name: '',
          email: '',
          password: ''
        })
        
        // ✅ 2 second baad login mode mein switch karo
        setTimeout(() => {
          setIsLogin(true)
          setSignupSuccess(false)
          // ✅ Login page par hi raho, redirect mat karo
        }, 2000)
      }
    } catch (err) {
      setError(err.message)
      setSignupSuccess(false)
    } finally {
      setLoading(false)
    }
  }

  const handleSendOtp = async (e) => {
    e.preventDefault()
    if (!otpEmail) {
      setOtpError('Please enter your email address')
      return
    }

    setOtpLoading(true)
    setOtpError('')
    setOtpMessage('')

    try {
      const response = await fetch(`${API_BASE_URL}/user/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: otpEmail })
      })

      const data = await response.json()

      if (response.ok) {
        setOtpMessage('OTP sent to your email! Please check your inbox.')
        setOtpStep(2)
        setResendTimer(60)
        const timer = setInterval(() => {
          setResendTimer(prev => {
            if (prev <= 1) {
              clearInterval(timer)
              return 0
            }
            return prev - 1
          })
        }, 1000)
      } else {
        setOtpError(data.error || 'Failed to send OTP. Please try again.')
      }
    } catch (error) {
      console.error('Error sending OTP:', error)
      setOtpError('Network error. Please try again.')
    } finally {
      setOtpLoading(false)
    }
  }

  const handleVerifyOtp = async (e) => {
    e.preventDefault()
    if (!otp || otp.length !== 6) {
      setOtpError('Please enter valid 6-digit OTP')
      return
    }

    setOtpLoading(true)
    setOtpError('')
    setOtpMessage('')

    try {
      const response = await fetch(`${API_BASE_URL}/user/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: otpEmail, otp: otp })
      })

      const data = await response.json()

      if (response.ok) {
        setOtpMessage('OTP verified! Set your new password.')
        setOtpStep(3)
      } else {
        setOtpError(data.error || 'Invalid OTP. Please try again.')
      }
    } catch (error) {
      console.error('Error verifying OTP:', error)
      setOtpError('Network error. Please try again.')
    } finally {
      setOtpLoading(false)
    }
  }

  const handleResetPassword = async (e) => {
    e.preventDefault()
    if (!newPassword || newPassword.length < 6) {
      setOtpError('Password must be at least 6 characters')
      return
    }
    if (newPassword !== confirmPassword) {
      setOtpError('Passwords do not match')
      return
    }

    setOtpLoading(true)
    setOtpError('')
    setOtpMessage('')

    try {
      const response = await fetch(`${API_BASE_URL}/user/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: otpEmail,
          otp: otp,
          password: newPassword
        })
      })

      const data = await response.json()

      if (response.ok) {
        setOtpMessage('Password reset successfully! You can now login with your new password.')
        setTimeout(() => {
          setShowForgotPassword(false)
          setOtpStep(1)
          setOtpEmail('')
          setOtp('')
          setNewPassword('')
          setConfirmPassword('')
          setOtpMessage('')
          setOtpError('')
        }, 2000)
      } else {
        setOtpError(data.error || 'Failed to reset password')
      }
    } catch (error) {
      console.error('Error resetting password:', error)
      setOtpError('Network error. Please try again.')
    } finally {
      setOtpLoading(false)
    }
  }
  
  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          {/* Logo */}
         

          <div className="auth-header">
            <h1>
              {!showForgotPassword 
                ? (isLogin ? 'Welcome Back!' : 'Create Account') 
                : 'Reset Password'
              }
            </h1>
            <p>
              {!showForgotPassword 
                ? (isLogin ? 'Login to your account' : 'Sign up to get started') 
                : 'Enter your email to reset password'
              }
            </p>
          </div>

          {/* ✅ Sign Up Success Message */}
          {signupSuccess && (
            <div className="auth-success">
              ✅ Account created successfully! Please login with your credentials.
            </div>
          )}

          {!showForgotPassword ? (
            <>
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
                    <button
                      type="button"
                      className="forgot-password-btn"
                      onClick={() => setShowForgotPassword(true)}
                    >
                      Forgot Password?
                    </button>
                  </div>
                )}
                
                <button type="submit" className="auth-btn" disabled={loading}>
                  {loading ? <FaSpinner className="spinner" /> : (isLogin ? 'Login' : 'Sign Up')}
                  {!loading && <FaArrowRight className="btn-arrow" />}
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
                      setSignupSuccess(false)
                      setFormData({ name: '', email: '', password: '' })
                    }} 
                    className="switch-auth"
                  >
                    {isLogin ? 'Sign Up' : 'Login'}
                  </button>
                </p>
              </div>
            </>
          ) : (
            <div className="forgot-password-form">
              <button
                type="button"
                className="back-to-login"
                onClick={() => {
                  setShowForgotPassword(false)
                  setOtpStep(1)
                  setOtpEmail('')
                  setOtp('')
                  setNewPassword('')
                  setConfirmPassword('')
                  setOtpMessage('')
                  setOtpError('')
                }}
              >
                <FaArrowLeft /> Back to Login
              </button>

              {otpError && <div className="auth-error">{otpError}</div>}
              {otpMessage && <div className="auth-success">{otpMessage}</div>}

              {otpStep === 1 && (
                <form onSubmit={handleSendOtp}>
                  <div className="input-group">
                    <FaEnvelope className="input-icon" />
                    <input
                      type="email"
                      placeholder="Enter your email"
                      value={otpEmail}
                      onChange={(e) => setOtpEmail(e.target.value)}
                      required
                    />
                  </div>
                  <button type="submit" className="auth-btn" disabled={otpLoading}>
                    {otpLoading ? <FaSpinner className="spinner" /> : 'Send OTP'}
                  </button>
                </form>
              )}

              {otpStep === 2 && (
                <form onSubmit={handleVerifyOtp}>
                  <p className="otp-info">Enter the 6-digit OTP sent to <strong>{otpEmail}</strong></p>
                  <div className="input-group">
                    <input
                      type="text"
                      placeholder="Enter OTP"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      maxLength="6"
                      required
                    />
                  </div>
                  <button type="submit" className="auth-btn" disabled={otpLoading}>
                    {otpLoading ? <FaSpinner className="spinner" /> : 'Verify OTP'}
                  </button>
                  {resendTimer > 0 ? (
                    <p className="resend-timer">Resend OTP in {resendTimer}s</p>
                  ) : (
                    <button
                      type="button"
                      className="resend-btn"
                      onClick={handleSendOtp}
                    >
                      Resend OTP
                    </button>
                  )}
                </form>
              )}

              {otpStep === 3 && (
                <form onSubmit={handleResetPassword}>
                  <div className="input-group">
                    <FaLock className="input-icon" />
                    <input
                      type="password"
                      placeholder="New Password (min 6 characters)"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      minLength="6"
                      required
                    />
                  </div>
                  <div className="input-group">
                    <FaLock className="input-icon" />
                    <input
                      type="password"
                      placeholder="Confirm New Password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>
                  <button type="submit" className="auth-btn" disabled={otpLoading}>
                    {otpLoading ? <FaSpinner className="spinner" /> : 'Reset Password'}
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default LoginPage