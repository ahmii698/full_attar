import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaEnvelope, FaLock, FaArrowLeft, FaSpinner } from 'react-icons/fa'
import { useAdminAuth } from '../contexts/AdminAuthContext'
import { API_URL } from '../../../config'  // ✅ IMPORT FROM CONFIG
import '../styles/AdminLogin.css'

function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAdminAuth()
  const navigate = useNavigate()

  // Forgot Password States
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [otpStep, setOtpStep] = useState(1) // 1: Email, 2: OTP, 3: New Password
  const [otpEmail, setOtpEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [otpLoading, setOtpLoading] = useState(false)
  const [otpMessage, setOtpMessage] = useState('')
  const [otpError, setOtpError] = useState('')
  const [resendTimer, setResendTimer] = useState(0)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const success = await login(email, password)
      if (success) {
        navigate('/admin/products')
      } else {
        setError('Invalid email or password')
      }
    } catch (err) {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // ✅ Send OTP
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
      const response = await fetch(`${API_URL}/admin/forgot-password`, {  // ✅ USING API_URL
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

  // ✅ Verify OTP
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
      const response = await fetch(`${API_URL}/admin/verify-otp`, {  // ✅ USING API_URL
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

  // ✅ Reset Password
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
      const response = await fetch(`${API_URL}/admin/reset-password`, {  // ✅ USING API_URL
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: otpEmail,
          otp: otp,
          password: newPassword,
          password_confirmation: confirmPassword  // ✅ Added for validation
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
    <div className="admin-login-container">
      <div className="login-card">
        <div className="login-header">
          <h2>Royal Attar</h2>
          <p>{!showForgotPassword ? 'Admin Login' : 'Reset Password'}</p>
        </div>

        {!showForgotPassword ? (
          // ✅ Login Form
          <form onSubmit={handleSubmit}>
            {error && <div className="alert-error">{error}</div>}
            <div className="form-group">
              <label>Email Address</label>
              <div className="input-wrapper">
                <FaEnvelope className="input-icon" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@royalattar.com"
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <label>Password</label>
              <div className="input-wrapper">
                <FaLock className="input-icon" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>
            <button type="submit" disabled={loading}>
              {loading ? <FaSpinner className="spinner" /> : 'Login to Dashboard'}
            </button>

            <div className="login-links">
              <button
                type="button"
                className="forgot-password-btn"
                onClick={() => setShowForgotPassword(true)}
              >
                Forgot Password?
              </button>
            </div>
          </form>
        ) : (
          // ✅ Forgot Password Form
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

            {otpError && <div className="alert-error">{otpError}</div>}
            {otpMessage && <div className="alert-success">{otpMessage}</div>}

            {/* Step 1: Email */}
            {otpStep === 1 && (
              <form onSubmit={handleSendOtp}>
                <div className="form-group">
                  <label>Email Address</label>
                  <div className="input-wrapper">
                    <FaEnvelope className="input-icon" />
                    <input
                      type="email"
                      placeholder="Enter your email"
                      value={otpEmail}
                      onChange={(e) => setOtpEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <button type="submit" disabled={otpLoading}>
                  {otpLoading ? <FaSpinner className="spinner" /> : 'Send OTP'}
                </button>
              </form>
            )}

            {/* Step 2: OTP */}
            {otpStep === 2 && (
              <form onSubmit={handleVerifyOtp}>
                <p className="otp-info">Enter the 6-digit OTP sent to <strong>{otpEmail}</strong></p>
                <div className="form-group">
                  <label>OTP Code</label>
                  <div className="input-wrapper">
                    <input
                      type="text"
                      placeholder="Enter OTP"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      maxLength="6"
                      required
                    />
                  </div>
                </div>
                <button type="submit" disabled={otpLoading}>
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

            {/* Step 3: New Password */}
            {otpStep === 3 && (
              <form onSubmit={handleResetPassword}>
                <div className="form-group">
                  <label>New Password</label>
                  <div className="input-wrapper">
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
                </div>
                <div className="form-group">
                  <label>Confirm Password</label>
                  <div className="input-wrapper">
                    <FaLock className="input-icon" />
                    <input
                      type="password"
                      placeholder="Confirm New Password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <button type="submit" disabled={otpLoading}>
                  {otpLoading ? <FaSpinner className="spinner" /> : 'Reset Password'}
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminLogin