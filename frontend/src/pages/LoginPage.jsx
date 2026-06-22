import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { FaSpinner, FaEnvelope, FaLock, FaUser, FaArrowRight, FaEye, FaEyeSlash } from 'react-icons/fa'
import { API_URL } from '../../config'  // ✅ IMPORT FROM CONFIG
import './LoginPage.css'

function LoginPage({ redirectTo }) {
  const navigate = useNavigate()
  const location = useLocation()
  const { login, signup } = useAuth()
  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [signupSuccess, setSignupSuccess] = useState(false)
  
  const from = redirectTo || location.state?.from?.pathname || '/'
  
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  })

  const [signupData, setSignupData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    password_confirmation: ''
  })

  const handleLoginChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value })
    setError('')
  }

  const handleSignupChange = (e) => {
    setSignupData({ ...signupData, [e.target.name]: e.target.value })
    setError('')
    setSignupSuccess(false)
  }

  const handleLoginSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    try {
      await login(loginData.email, loginData.password)
      navigate(from, { replace: true })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSignupSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSignupSuccess(false)
    
    // ✅ Client-side validation
    if (signupData.password !== signupData.password_confirmation) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    if (signupData.password.length < 8) {
      setError('Password must be at least 8 characters')
      setLoading(false)
      return
    }

    try {
      const response = await fetch(`${API_URL}/register`, {  // ✅ USING API_URL
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          first_name: signupData.first_name,
          last_name: signupData.last_name,
          email: signupData.email,
          password: signupData.password,
          password_confirmation: signupData.password_confirmation
        })
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setSignupSuccess(true)
        setError('')
        setSignupData({
          first_name: '',
          last_name: '',
          email: '',
          password: '',
          password_confirmation: ''
        })
        setTimeout(() => {
          setSignupSuccess(false)
          setIsLogin(true)
        }, 3000)
      } else {
        const errorMsg = data.errors ? Object.values(data.errors).flat().join(', ') : data.message || 'Registration failed'
        setError(errorMsg)
        setSignupSuccess(false)
      }
    } catch (err) {
      console.error('Error:', err)
      setError('Network error. Please try again.')
      setSignupSuccess(false)
    } finally {
      setLoading(false)
    }
  }

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
      const response = await fetch(`${API_URL}/user/forgot-password`, {  // ✅ USING API_URL
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
      const response = await fetch(`${API_URL}/user/verify-otp`, {  // ✅ USING API_URL
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
      const response = await fetch(`${API_URL}/user/reset-password`, {  // ✅ USING API_URL
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: otpEmail,
          otp: otp,
          password: newPassword,
          password_confirmation: confirmPassword
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
        const errorMsg = data.errors 
          ? Object.values(data.errors).flat().join(', ') 
          : data.error || data.message || 'Failed to reset password'
        setOtpError(errorMsg)
      }
    } catch (error) {
      console.error('Error resetting password:', error)
      setOtpError('Network error. Please try again.')
    } finally {
      setOtpLoading(false)
    }
  }

  // Forgot Password View (Code remains same, only API_URL changed)
  if (showForgotPassword) {
    return (
      <div className="auth-page">
        <div className="section">
          <div className="container">
            <div className="row full-height justify-content-center">
              <div className="col-12 text-center align-self-center py-5">
                <div className="section pb-5 pt-5 pt-sm-2 text-center">
                  <div className="card-3d-wrap mx-auto">
                    <div className="card-3d-wrapper">
                      <div className="card-front">
                        <div className="center-wrap">
                          <div className="section text-center">
                            <h4 className="mb-4 pb-3">Reset Password</h4>
                            {otpError && <div className="auth-error">{otpError}</div>}
                            {otpMessage && <div className="auth-success">{otpMessage}</div>}
                            
                            {otpStep === 1 && (
                              <>
                                <div className="form-group" style={{ marginBottom: '22px' }}>
                                  <label className="form-label" style={{ display: 'block', marginBottom: '8px', color: 'rgba(255,255,255,0.5)', fontSize: '13px', fontWeight: '500' }}>Email Address</label>
                                  <div className="input-icon-wrapper" style={{ position: 'relative', width: '100%' }}>
                                    <input
                                      type="email"
                                      className="form-style"
                                      placeholder="Enter your email"
                                      value={otpEmail}
                                      onChange={(e) => setOtpEmail(e.target.value)}
                                      required
                                      style={{ padding: '12px 20px 12px 48px', height: '46px', width: '100%', fontWeight: '500', borderRadius: '8px', fontSize: '14px', lineHeight: '22px', letterSpacing: '0.5px', outline: 'none', color: '#ffffff', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.06)', transition: 'all 200ms linear', boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)', boxSizing: 'border-box' }}
                                    />
                                    <i className="input-icon uil uil-at" style={{ position: 'absolute', top: '50%', left: '16px', transform: 'translateY(-50%)', fontSize: '18px', color: '#d4af37', zIndex: '2', pointerEvents: 'none' }}></i>
                                  </div>
                                </div>
                                <button className="btn mt-4" onClick={handleSendOtp} disabled={otpLoading} style={{ width: '100%', padding: '12px', fontSize: '15px', fontWeight: '600', borderRadius: '8px', background: 'linear-gradient(135deg, #d4af37, #b8960c)', color: '#000000', border: 'none', cursor: 'pointer', transition: 'all 0.3s ease', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', fontFamily: 'Poppins, sans-serif', opacity: otpLoading ? '0.6' : '1' }}>
                                  {otpLoading ? <FaSpinner className="spinner" /> : 'Send OTP'}
                                </button>
                              </>
                            )}

                            {otpStep === 2 && (
                              <>
                                <p className="otp-info" style={{ color: '#888', fontSize: '13px', marginBottom: '15px' }}>Enter the 6-digit OTP sent to <strong style={{ color: '#d4af37' }}>{otpEmail}</strong></p>
                                <div className="form-group" style={{ marginBottom: '22px' }}>
                                  <label className="form-label" style={{ display: 'block', marginBottom: '8px', color: 'rgba(255,255,255,0.5)', fontSize: '13px', fontWeight: '500' }}>OTP Code</label>
                                  <div className="input-icon-wrapper" style={{ position: 'relative', width: '100%' }}>
                                    <input
                                      type="text"
                                      className="form-style"
                                      placeholder="Enter OTP"
                                      value={otp}
                                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                      maxLength="6"
                                      required
                                      style={{ padding: '12px 20px 12px 48px', height: '46px', width: '100%', fontWeight: '500', borderRadius: '8px', fontSize: '14px', lineHeight: '22px', letterSpacing: '0.5px', outline: 'none', color: '#ffffff', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.06)', transition: 'all 200ms linear', boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)', boxSizing: 'border-box' }}
                                    />
                                    <i className="input-icon uil uil-mobile-android-alt" style={{ position: 'absolute', top: '50%', left: '16px', transform: 'translateY(-50%)', fontSize: '18px', color: '#d4af37', zIndex: '2', pointerEvents: 'none' }}></i>
                                  </div>
                                </div>
                                <button className="btn mt-4" onClick={handleVerifyOtp} disabled={otpLoading} style={{ width: '100%', padding: '12px', fontSize: '15px', fontWeight: '600', borderRadius: '8px', background: 'linear-gradient(135deg, #d4af37, #b8960c)', color: '#000000', border: 'none', cursor: 'pointer', transition: 'all 0.3s ease', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', fontFamily: 'Poppins, sans-serif', opacity: otpLoading ? '0.6' : '1' }}>
                                  {otpLoading ? <FaSpinner className="spinner" /> : 'Verify OTP'}
                                </button>
                                {resendTimer > 0 ? (
                                  <p className="resend-timer" style={{ color: '#666', fontSize: '12px', marginTop: '10px' }}>Resend OTP in {resendTimer}s</p>
                                ) : (
                                  <button className="resend-btn" onClick={handleSendOtp} style={{ background: 'transparent', border: 'none', color: '#d4af37', fontSize: '13px', padding: '5px', marginTop: '10px', cursor: 'pointer', textTransform: 'none', letterSpacing: '0', boxShadow: 'none' }}>
                                    Resend OTP
                                  </button>
                                )}
                              </>
                            )}

                            {otpStep === 3 && (
                              <>
                                <div className="form-group" style={{ marginBottom: '22px' }}>
                                  <label className="form-label" style={{ display: 'block', marginBottom: '8px', color: 'rgba(255,255,255,0.5)', fontSize: '13px', fontWeight: '500' }}>New Password</label>
                                  <div className="input-icon-wrapper" style={{ position: 'relative', width: '100%' }}>
                                    <input
                                      type="password"
                                      className="form-style"
                                      placeholder="New Password (min 6 characters)"
                                      value={newPassword}
                                      onChange={(e) => setNewPassword(e.target.value)}
                                      minLength="6"
                                      required
                                      style={{ padding: '12px 20px 12px 48px', height: '46px', width: '100%', fontWeight: '500', borderRadius: '8px', fontSize: '14px', lineHeight: '22px', letterSpacing: '0.5px', outline: 'none', color: '#ffffff', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.06)', transition: 'all 200ms linear', boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)', boxSizing: 'border-box' }}
                                    />
                                    <i className="input-icon uil uil-lock-alt" style={{ position: 'absolute', top: '50%', left: '16px', transform: 'translateY(-50%)', fontSize: '18px', color: '#d4af37', zIndex: '2', pointerEvents: 'none' }}></i>
                                  </div>
                                </div>
                                <div className="form-group" style={{ marginBottom: '22px' }}>
                                  <label className="form-label" style={{ display: 'block', marginBottom: '8px', color: 'rgba(255,255,255,0.5)', fontSize: '13px', fontWeight: '500' }}>Confirm Password</label>
                                  <div className="input-icon-wrapper" style={{ position: 'relative', width: '100%' }}>
                                    <input
                                      type="password"
                                      className="form-style"
                                      placeholder="Confirm New Password"
                                      value={confirmPassword}
                                      onChange={(e) => setConfirmPassword(e.target.value)}
                                      required
                                      style={{ padding: '12px 20px 12px 48px', height: '46px', width: '100%', fontWeight: '500', borderRadius: '8px', fontSize: '14px', lineHeight: '22px', letterSpacing: '0.5px', outline: 'none', color: '#ffffff', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.06)', transition: 'all 200ms linear', boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)', boxSizing: 'border-box' }}
                                    />
                                    <i className="input-icon uil uil-lock-alt" style={{ position: 'absolute', top: '50%', left: '16px', transform: 'translateY(-50%)', fontSize: '18px', color: '#d4af37', zIndex: '2', pointerEvents: 'none' }}></i>
                                  </div>
                                </div>
                                <button className="btn mt-4" onClick={handleResetPassword} disabled={otpLoading} style={{ width: '100%', padding: '12px', fontSize: '15px', fontWeight: '600', borderRadius: '8px', background: 'linear-gradient(135deg, #d4af37, #b8960c)', color: '#000000', border: 'none', cursor: 'pointer', transition: 'all 0.3s ease', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', fontFamily: 'Poppins, sans-serif', opacity: otpLoading ? '0.6' : '1' }}>
                                  {otpLoading ? <FaSpinner className="spinner" /> : 'Reset Password'}
                                </button>
                              </>
                            )}

                            <button className="back-to-login" onClick={() => {
                              setShowForgotPassword(false)
                              setOtpStep(1)
                              setOtpEmail('')
                              setOtp('')
                              setNewPassword('')
                              setConfirmPassword('')
                              setOtpMessage('')
                              setOtpError('')
                            }} style={{ background: 'transparent', border: 'none', color: '#888', fontSize: '13px', padding: '10px', marginTop: '15px', cursor: 'pointer', textTransform: 'none', letterSpacing: '0', boxShadow: 'none' }}>
                              ← Back to Login
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="auth-page">
      <div className="section">
        <div className="container">
          <div className="row full-height justify-content-center">
            <div className="col-12 text-center align-self-center py-5" style={{ paddingTop: '0.5rem', paddingBottom: '1rem' }}>
              <div className="section pb-5 pt-5 pt-sm-2 text-center">
                {/* Toggle Buttons */}
                <div className="toggle-container" style={{ position: 'relative', display: 'inline-flex', background: 'rgba(255,255,255,0.05)', borderRadius: '50px', padding: '4px', marginBottom: '8px', border: '1px solid rgba(212,175,55,0.15)' }}>
                  <button 
                    className={`toggle-btn ${isLogin ? 'active' : ''}`}
                    onClick={() => setIsLogin(true)}
                    style={{ position: 'relative', zIndex: '2', padding: '8px 32px', border: 'none', background: 'transparent', color: isLogin ? '#000000' : 'rgba(255,255,255,0.3)', fontSize: '14px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.3s ease', borderRadius: '50px', fontFamily: 'Poppins, sans-serif', textTransform: 'uppercase', letterSpacing: '1px' }}
                  >
                    Log In
                  </button>
                  <button 
                    className={`toggle-btn ${!isLogin ? 'active' : ''}`}
                    onClick={() => setIsLogin(false)}
                    style={{ position: 'relative', zIndex: '2', padding: '8px 32px', border: 'none', background: 'transparent', color: !isLogin ? '#000000' : 'rgba(255,255,255,0.3)', fontSize: '14px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.3s ease', borderRadius: '50px', fontFamily: 'Poppins, sans-serif', textTransform: 'uppercase', letterSpacing: '1px' }}
                  >
                    Sign Up
                  </button>
                  <div className={`toggle-slider ${isLogin ? 'left' : 'right'}`} style={{ position: 'absolute', top: '4px', left: '4px', height: 'calc(100% - 8px)', width: 'calc(50% - 4px)', background: 'linear-gradient(135deg, #d4af37, #b8960c)', borderRadius: '50px', transition: 'all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)', zIndex: '1', transform: isLogin ? 'translateX(0)' : 'translateX(100%)' }}></div>
                </div>

                <div className={`card-3d-wrap mx-auto ${!isLogin ? 'show-signup' : ''}`} style={{ position: 'relative', width: '440px', maxWidth: '100%', height: '470px', transformStyle: 'preserve-3d', perspective: '800px', margin: '2px auto 0', transition: 'all 0.6s ease' }}>
                  <div className="card-3d-wrapper" style={{ width: '100%', height: '100%', position: 'absolute', top: '0', left: '0', transformStyle: 'preserve-3d', transition: 'all 600ms ease-out', transform: !isLogin ? 'rotateY(180deg)' : 'rotateY(0deg)' }}>
                    
                    {/* Login Card - Front */}
                    <div className="card-front" style={{ width: '100%', height: '100%', background: 'linear-gradient(145deg, #0d0d0d, #1a1a1a)', position: 'absolute', borderRadius: '12px', left: '0', top: '0', transformStyle: 'preserve-3d', backfaceVisibility: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '12px 0', border: '1px solid rgba(212,175,55,0.08)', boxShadow: '0 20px 60px rgba(0,0,0,0.8)' }}>
                      <div className="center-wrap" style={{ position: 'relative', width: '100%', padding: '0 35px', zIndex: '20', display: 'block' }}>
                        <div className="section text-center">
                          <h4 className="form-title" style={{ fontWeight: '700', fontSize: '22px', color: '#ffffff', marginBottom: '14px', textAlign: 'center' }}>Log In</h4>
                          {error && <div className="auth-error" style={{ background: 'rgba(255,0,0,0.08)', color: '#ff6b6b', padding: '8px 12px', borderRadius: '8px', fontSize: '13px', width: '100%', marginBottom: '12px', textAlign: 'center', border: '1px solid rgba(255,0,0,0.08)' }}>{error}</div>}
                          
                          <div className="form-group" style={{ marginBottom: '14px' }}>
                            <label className="form-label" style={{ display: 'block', color: 'rgba(255,255,255,0.5)', fontSize: '13px', fontWeight: '500', marginBottom: '5px', textAlign: 'left', letterSpacing: '0.3px' }}>Email Address</label>
                            <div className="input-icon-wrapper" style={{ position: 'relative', width: '100%' }}>
                              <FaEnvelope className="input-icon" style={{ position: 'absolute', top: '50%', left: '16px', transform: 'translateY(-50%)', fontSize: '18px', color: '#d4af37', zIndex: '2', pointerEvents: 'none' }} />
                              <input
                                type="email"
                                name="email"
                                className="form-style"
                                placeholder="Enter your email"
                                value={loginData.email}
                                onChange={handleLoginChange}
                                required
                                style={{ padding: '12px 20px 12px 48px', height: '46px', width: '100%', fontWeight: '500', borderRadius: '8px', fontSize: '14px', lineHeight: '22px', letterSpacing: '0.5px', outline: 'none', color: '#ffffff', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.06)', transition: 'all 200ms linear', boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)', boxSizing: 'border-box' }}
                              />
                            </div>
                          </div>
                          
                          <div className="form-group" style={{ marginBottom: '14px' }}>
                            <label className="form-label" style={{ display: 'block', color: 'rgba(255,255,255,0.5)', fontSize: '13px', fontWeight: '500', marginBottom: '5px', textAlign: 'left', letterSpacing: '0.3px' }}>Password</label>
                            <div className="input-icon-wrapper" style={{ position: 'relative', width: '100%' }}>
                              <FaLock className="input-icon" style={{ position: 'absolute', top: '50%', left: '16px', transform: 'translateY(-50%)', fontSize: '18px', color: '#d4af37', zIndex: '2', pointerEvents: 'none' }} />
                              <input
                                type="password"
                                name="password"
                                className="form-style"
                                placeholder="Enter your password"
                                value={loginData.password}
                                onChange={handleLoginChange}
                                required
                                style={{ padding: '12px 20px 12px 48px', height: '46px', width: '100%', fontWeight: '500', borderRadius: '8px', fontSize: '14px', lineHeight: '22px', letterSpacing: '0.5px', outline: 'none', color: '#ffffff', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.06)', transition: 'all 200ms linear', boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)', boxSizing: 'border-box' }}
                              />
                            </div>
                          </div>
                          
                          <button 
                            className="btn-submit" 
                            onClick={handleLoginSubmit} 
                            disabled={loading}
                            style={{ width: '100%', padding: '12px', fontSize: '15px', fontWeight: '600', borderRadius: '8px', background: 'linear-gradient(135deg, #d4af37, #b8960c)', color: '#000000', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', transition: 'all 0.3s ease', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', fontFamily: 'Poppins, sans-serif', marginTop: '4px', opacity: loading ? '0.6' : '1' }}
                            onMouseEnter={(e) => {
                              if (!loading) {
                                e.target.style.transform = 'translateY(-2px)'
                                e.target.style.boxShadow = '0 10px 30px rgba(212,175,55,0.25)'
                              }
                            }}
                            onMouseLeave={(e) => {
                              if (!loading) {
                                e.target.style.transform = 'translateY(0px)'
                                e.target.style.boxShadow = '0 8px 24px 0 rgba(212,175,55,0.2)'
                              }
                            }}
                          >
                            {loading ? <FaSpinner className="spinner" /> : 'Submit'}
                            {!loading && <FaArrowRight />}
                          </button>
                          
                          <p className="forgot-link" style={{ marginTop: '12px', textAlign: 'center' }}>
                            <a href="#" className="link" onClick={(e) => {
                              e.preventDefault()
                              setShowForgotPassword(true)
                            }} style={{ color: '#888', fontSize: '13px', cursor: 'pointer', transition: 'all 200ms linear' }}>
                              Forgot your password?
                            </a>
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Sign Up Card - Back */}
                    <div className="card-back" style={{ width: '100%', height: '100%', background: 'linear-gradient(145deg, #0d0d0d, #1a1a1a)', position: 'absolute', borderRadius: '12px', left: '0', top: '0', transformStyle: 'preserve-3d', backfaceVisibility: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '6px 0', border: '1px solid rgba(212,175,55,0.08)', boxShadow: '0 20px 60px rgba(0,0,0,0.8)', transform: 'rotateY(180deg)' }}>
                      <div className="center-wrap" style={{ position: 'relative', width: '100%', padding: '0 30px', zIndex: '20', display: 'block' }}>
                        <div className="section text-center">
                          <h4 className="form-title" style={{ fontWeight: '700', fontSize: '20px', color: '#ffffff', marginBottom: '10px', textAlign: 'center' }}>Sign Up</h4>
                          {error && <div className="auth-error" style={{ background: 'rgba(255,0,0,0.08)', color: '#ff6b6b', padding: '6px 10px', borderRadius: '6px', fontSize: '12px', width: '100%', marginBottom: '8px', textAlign: 'center', border: '1px solid rgba(255,0,0,0.08)' }}>{error}</div>}
                          {signupSuccess && <div className="auth-success" style={{ background: 'rgba(76,175,80,0.08)', color: '#4caf50', padding: '6px 10px', borderRadius: '6px', fontSize: '12px', width: '100%', marginBottom: '8px', textAlign: 'center', border: '1px solid rgba(76,175,80,0.08)' }}>✅ Account created! Please login.</div>}
                          
                          {/* First Name */}
                          <div className="form-group" style={{ marginBottom: '8px' }}>
                            <label className="form-label" style={{ display: 'block', color: 'rgba(255,255,255,0.5)', fontSize: '12px', fontWeight: '500', marginBottom: '4px', textAlign: 'left', letterSpacing: '0.3px' }}>First Name</label>
                            <div className="input-icon-wrapper" style={{ position: 'relative', width: '100%' }}>
                              <FaUser className="input-icon" style={{ position: 'absolute', top: '50%', left: '14px', transform: 'translateY(-50%)', fontSize: '16px', color: '#d4af37', zIndex: '2', pointerEvents: 'none' }} />
                              <input
                                type="text"
                                name="first_name"
                                className="form-style"
                                placeholder="John"
                                value={signupData.first_name}
                                onChange={handleSignupChange}
                                required
                                style={{ padding: '10px 16px 10px 42px', height: '40px', width: '100%', fontWeight: '500', borderRadius: '8px', fontSize: '13px', lineHeight: '22px', letterSpacing: '0.5px', outline: 'none', color: '#ffffff', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.06)', transition: 'all 200ms linear', boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)', boxSizing: 'border-box' }}
                              />
                            </div>
                          </div>

                          {/* Last Name */}
                          <div className="form-group" style={{ marginBottom: '8px' }}>
                            <label className="form-label" style={{ display: 'block', color: 'rgba(255,255,255,0.5)', fontSize: '12px', fontWeight: '500', marginBottom: '4px', textAlign: 'left', letterSpacing: '0.3px' }}>Last Name</label>
                            <div className="input-icon-wrapper" style={{ position: 'relative', width: '100%' }}>
                              <FaUser className="input-icon" style={{ position: 'absolute', top: '50%', left: '14px', transform: 'translateY(-50%)', fontSize: '16px', color: '#d4af37', zIndex: '2', pointerEvents: 'none' }} />
                              <input
                                type="text"
                                name="last_name"
                                className="form-style"
                                placeholder="Doe"
                                value={signupData.last_name}
                                onChange={handleSignupChange}
                                required
                                style={{ padding: '10px 16px 10px 42px', height: '40px', width: '100%', fontWeight: '500', borderRadius: '8px', fontSize: '13px', lineHeight: '22px', letterSpacing: '0.5px', outline: 'none', color: '#ffffff', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.06)', transition: 'all 200ms linear', boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)', boxSizing: 'border-box' }}
                              />
                            </div>
                          </div>

                          {/* Email */}
                          <div className="form-group" style={{ marginBottom: '8px' }}>
                            <label className="form-label" style={{ display: 'block', color: 'rgba(255,255,255,0.5)', fontSize: '12px', fontWeight: '500', marginBottom: '4px', textAlign: 'left', letterSpacing: '0.3px' }}>Email Address</label>
                            <div className="input-icon-wrapper" style={{ position: 'relative', width: '100%' }}>
                              <FaEnvelope className="input-icon" style={{ position: 'absolute', top: '50%', left: '14px', transform: 'translateY(-50%)', fontSize: '16px', color: '#d4af37', zIndex: '2', pointerEvents: 'none' }} />
                              <input
                                type="email"
                                name="email"
                                className="form-style"
                                placeholder="you@example.com"
                                value={signupData.email}
                                onChange={handleSignupChange}
                                required
                                style={{ padding: '10px 16px 10px 42px', height: '40px', width: '100%', fontWeight: '500', borderRadius: '8px', fontSize: '13px', lineHeight: '22px', letterSpacing: '0.5px', outline: 'none', color: '#ffffff', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.06)', transition: 'all 200ms linear', boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)', boxSizing: 'border-box' }}
                              />
                            </div>
                          </div>

                          {/* Password */}
                          <div className="form-group" style={{ marginBottom: '8px' }}>
                            <label className="form-label" style={{ display: 'block', color: 'rgba(255,255,255,0.5)', fontSize: '12px', fontWeight: '500', marginBottom: '4px', textAlign: 'left', letterSpacing: '0.3px' }}>Password</label>
                            <div className="input-icon-wrapper" style={{ position: 'relative', width: '100%' }}>
                              <FaLock className="input-icon" style={{ position: 'absolute', top: '50%', left: '14px', transform: 'translateY(-50%)', fontSize: '16px', color: '#d4af37', zIndex: '2', pointerEvents: 'none' }} />
                              <input
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                className="form-style"
                                placeholder="Min 8 characters"
                                value={signupData.password}
                                onChange={handleSignupChange}
                                required
                                minLength="8"
                                style={{ padding: '10px 16px 10px 42px', height: '40px', width: '100%', fontWeight: '500', borderRadius: '8px', fontSize: '13px', lineHeight: '22px', letterSpacing: '0.5px', outline: 'none', color: '#ffffff', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.06)', transition: 'all 200ms linear', boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)', boxSizing: 'border-box', paddingRight: '38px' }}
                              />
                              <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                style={{ position: 'absolute', top: '50%', right: '12px', transform: 'translateY(-50%)', background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.3)', cursor: 'pointer', padding: '4px' }}
                              >
                                {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                              </button>
                            </div>
                          </div>

                          {/* Confirm Password */}
                          <div className="form-group" style={{ marginBottom: '8px' }}>
                            <label className="form-label" style={{ display: 'block', color: 'rgba(255,255,255,0.5)', fontSize: '12px', fontWeight: '500', marginBottom: '4px', textAlign: 'left', letterSpacing: '0.3px' }}>Confirm Password</label>
                            <div className="input-icon-wrapper" style={{ position: 'relative', width: '100%' }}>
                              <FaLock className="input-icon" style={{ position: 'absolute', top: '50%', left: '14px', transform: 'translateY(-50%)', fontSize: '16px', color: '#d4af37', zIndex: '2', pointerEvents: 'none' }} />
                              <input
                                type={showConfirmPassword ? 'text' : 'password'}
                                name="password_confirmation"
                                className="form-style"
                                placeholder="Confirm password"
                                value={signupData.password_confirmation}
                                onChange={handleSignupChange}
                                required
                                style={{ padding: '10px 16px 10px 42px', height: '40px', width: '100%', fontWeight: '500', borderRadius: '8px', fontSize: '13px', lineHeight: '22px', letterSpacing: '0.5px', outline: 'none', color: '#ffffff', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.06)', transition: 'all 200ms linear', boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)', boxSizing: 'border-box', paddingRight: '38px' }}
                              />
                              <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                style={{ position: 'absolute', top: '50%', right: '12px', transform: 'translateY(-50%)', background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.3)', cursor: 'pointer', padding: '4px' }}
                              >
                                {showConfirmPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                              </button>
                            </div>
                          </div>

                          <button 
                            className="btn-submit" 
                            onClick={handleSignupSubmit} 
                            disabled={loading}
                            style={{ width: '100%', padding: '10px', fontSize: '14px', fontWeight: '600', borderRadius: '8px', background: 'linear-gradient(135deg, #d4af37, #b8960c)', color: '#000000', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', transition: 'all 0.3s ease', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontFamily: 'Poppins, sans-serif', marginTop: '4px', opacity: loading ? '0.6' : '1' }}
                            onMouseEnter={(e) => {
                              if (!loading) {
                                e.target.style.transform = 'translateY(-2px)'
                                e.target.style.boxShadow = '0 10px 30px rgba(212,175,55,0.25)'
                              }
                            }}
                            onMouseLeave={(e) => {
                              if (!loading) {
                                e.target.style.transform = 'translateY(0px)'
                                e.target.style.boxShadow = '0 8px 24px 0 rgba(212,175,55,0.2)'
                              }
                            }}
                          >
                            {loading ? <FaSpinner className="spinner" /> : 'Submit'}
                            {!loading && <FaArrowRight />}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage