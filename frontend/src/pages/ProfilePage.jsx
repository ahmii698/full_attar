import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { FaUser, FaEnvelope, FaLock, FaSave, FaEdit, FaTimes } from 'react-icons/fa'

function ProfilePage() {
  const { user, updateProfile, changePassword } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || ''
  })
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [message, setMessage] = useState({ type: '', text: '' })
  const [showPasswordForm, setShowPasswordForm] = useState(false)

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || ''
      })
    }
  }, [user])
  
  const handleProfileUpdate = async (e) => {
    e.preventDefault()
    
    if (!formData.name) {
      setMessage({ type: 'error', text: 'Please fill all fields!' })
      setTimeout(() => setMessage({ type: '', text: '' }), 3000)
      return
    }
    
    setLoading(true)
    
    try {
      // ✅ Only update name, email will not be updated
      await updateProfile(formData.name, formData.email)
      setMessage({ type: 'success', text: 'Profile updated successfully!' })
      setIsEditing(false)
    } catch (err) {
      console.error('Update error:', err)
      setMessage({ type: 'error', text: err.message || 'Failed to update profile' })
    } finally {
      setLoading(false)
      setTimeout(() => setMessage({ type: '', text: '' }), 3000)
    }
  }
  
  const handlePasswordChange = async (e) => {
    e.preventDefault()
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match!' })
      setTimeout(() => setMessage({ type: '', text: '' }), 3000)
      return
    }
    
    if (passwordData.newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters!' })
      setTimeout(() => setMessage({ type: '', text: '' }), 3000)
      return
    }
    
    setLoading(true)
    
    try {
      await changePassword(passwordData.currentPassword, passwordData.newPassword)
      setMessage({ type: 'success', text: 'Password changed successfully!' })
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
      setShowPasswordForm(false)
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Failed to change password' })
    } finally {
      setLoading(false)
      setTimeout(() => setMessage({ type: '', text: '' }), 3000)
    }
  }
  
  if (!user) return null
  
  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="profile-header">
          <div className="profile-avatar">
            <FaUser />
          </div>
          <h1>My Profile</h1>
          <p>Manage your account information</p>
        </div>
        
        {message.text && (
          <div className={`profile-message ${message.type}`}>
            {message.text}
          </div>
        )}
        
        <div className="profile-content">
          {/* Profile Info Card */}
          <div className="profile-card">
            <div className="card-header">
              <h3>Personal Information</h3>
              {!isEditing ? (
                <button className="edit-btn" onClick={() => setIsEditing(true)}>
                  <FaEdit /> Edit Profile
                </button>
              ) : (
                <button className="cancel-btn" onClick={() => setIsEditing(false)}>
                  <FaTimes /> Cancel
                </button>
              )}
            </div>
            
            {isEditing ? (
              <form onSubmit={handleProfileUpdate} className="profile-form">
                <div className="form-group">
                  <label>Full Name</label>
                  <div className="input-icon">
                    <FaUser />
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Email Address</label>
                  <div className="input-icon">
                    <FaEnvelope />
                    <input
                      type="email"
                      value={formData.email}
                      disabled
                      readOnly
                      className="readonly-input"
                    />
                  </div>
                  <small className="email-note">Email cannot be changed</small>
                </div>
                <button type="submit" className="save-btn" disabled={loading}>
                  <FaSave /> {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </form>
            ) : (
              <div className="profile-info">
                <div className="info-row">
                  <span className="info-label">Full Name</span>
                  <span className="info-value">{user.name}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Email Address</span>
                  <span className="info-value">{user.email}</span>
                </div>
              </div>
            )}
          </div>
          
          {/* Change Password Card */}
          <div className="profile-card">
            <div className="card-header">
              <h3>Change Password</h3>
              {!showPasswordForm ? (
                <button className="edit-btn" onClick={() => setShowPasswordForm(true)}>
                  <FaLock /> Change Password
                </button>
              ) : (
                <button className="cancel-btn" onClick={() => setShowPasswordForm(false)}>
                  <FaTimes /> Cancel
                </button>
              )}
            </div>
            
            {showPasswordForm && (
              <form onSubmit={handlePasswordChange} className="profile-form">
                <div className="form-group">
                  <label>Current Password</label>
                  <div className="input-icon">
                    <FaLock />
                    <input
                      type="password"
                      placeholder="Enter current password"
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>New Password</label>
                  <div className="input-icon">
                    <FaLock />
                    <input
                      type="password"
                      placeholder="Enter new password (min 6 characters)"
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Confirm New Password</label>
                  <div className="input-icon">
                    <FaLock />
                    <input
                      type="password"
                      placeholder="Confirm new password"
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <button type="submit" className="save-btn" disabled={loading}>
                  <FaSave /> {loading ? 'Updating...' : 'Update Password'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .profile-page {
          max-width: 700px;
          margin: 0 auto;
          padding: 60px 20px;
          min-height: 60vh;
        }
        
        .profile-container {
          background: rgba(255,255,255,0.02);
          border-radius: 24px;
          padding: 40px;
          border: 1px solid rgba(212,175,55,0.1);
        }
        
        .profile-header {
          text-align: center;
          margin-bottom: 30px;
        }
        
        .profile-avatar {
          width: 80px;
          height: 80px;
          background: linear-gradient(135deg, #d4af37, #b8960c);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 20px;
        }
        
        .profile-avatar svg {
          font-size: 40px;
          color: #000;
        }
        
        .profile-header h1 {
          font-size: 28px;
          color: #fff;
          margin-bottom: 8px;
        }
        
        .profile-header p {
          color: rgba(255,255,255,0.5);
          font-size: 14px;
        }
        
        .profile-message {
          padding: 12px 20px;
          border-radius: 10px;
          margin-bottom: 25px;
          text-align: center;
          font-size: 14px;
        }
        
        .profile-message.success {
          background: rgba(76,175,80,0.15);
          color: #4caf50;
          border: 1px solid rgba(76,175,80,0.3);
        }
        
        .profile-message.error {
          background: rgba(244,67,54,0.15);
          color: #f44336;
          border: 1px solid rgba(244,67,54,0.3);
        }
        
        .profile-card {
          background: rgba(255,255,255,0.02);
          border-radius: 16px;
          padding: 25px;
          margin-bottom: 25px;
          border: 1px solid rgba(212,175,55,0.08);
        }
        
        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          padding-bottom: 15px;
          border-bottom: 1px solid rgba(212,175,55,0.15);
        }
        
        .card-header h3 {
          font-size: 18px;
          color: #d4af37;
          margin: 0;
        }
        
        .edit-btn {
          background: rgba(212,175,55,0.1);
          border: 1px solid rgba(212,175,55,0.3);
          color: #d4af37;
          padding: 6px 14px;
          border-radius: 8px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          transition: all 0.3s;
        }
        
        .edit-btn:hover {
          background: rgba(212,175,55,0.2);
        }
        
        .cancel-btn {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.15);
          color: #fff;
          padding: 6px 14px;
          border-radius: 8px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
        }
        
        .profile-info {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        
        .info-row {
          display: flex;
          align-items: baseline;
          padding: 8px 0;
        }
        
        .info-label {
          width: 110px;
          color: #d4af37;
          font-weight: 500;
          font-size: 14px;
        }
        
        .info-value {
          color: rgba(255,255,255,0.8);
          font-size: 14px;
        }
        
        .profile-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        
        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        
        .form-group label {
          color: rgba(255,255,255,0.7);
          font-size: 13px;
        }
        
        .input-icon {
          position: relative;
        }
        
        .input-icon svg {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: rgba(255,255,255,0.4);
          font-size: 14px;
        }
        
        .input-icon input {
          width: 100%;
          padding: 12px 15px 12px 42px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(212,175,55,0.2);
          border-radius: 10px;
          color: #fff;
          font-size: 14px;
          transition: all 0.3s;
        }
        
        .input-icon input:focus {
          outline: none;
          border-color: #d4af37;
          background: rgba(255,255,255,0.08);
        }
        
        /* ✅ Readonly input styles */
        .readonly-input {
          opacity: 0.7;
          cursor: not-allowed;
          background: rgba(255,255,255,0.02);
        }
        
        .email-note {
          display: block;
          margin-top: 5px;
          font-size: 11px;
          color: rgba(255,255,255,0.4);
        }
        
        .save-btn {
          background: linear-gradient(135deg, #d4af37, #b8960c);
          color: #000;
          border: none;
          padding: 10px 20px;
          border-radius: 10px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          font-weight: 600;
          font-size: 14px;
          transition: all 0.3s;
        }
        
        .save-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(212,175,55,0.3);
        }
        
        .save-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        
        @media (max-width: 768px) {
          .profile-page { padding: 40px 20px; }
          .profile-container { padding: 25px; }
          .card-header { flex-direction: column; gap: 12px; align-items: flex-start; }
          .info-row { flex-direction: column; gap: 5px; }
          .info-label { width: auto; }
        }
      `}</style>
    </div>
  )
}

export default ProfilePage