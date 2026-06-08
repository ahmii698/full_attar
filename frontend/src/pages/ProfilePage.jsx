import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { FaUser, FaEnvelope, FaLock, FaSave, FaEdit, FaTimes } from 'react-icons/fa'

function ProfilePage() {
  const { user, updateUserData } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
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
  
  const handleProfileUpdate = (e) => {
    e.preventDefault()
    // Update user profile
    const users = JSON.parse(localStorage.getItem('users') || '[]')
    const userIndex = users.findIndex(u => u.id === user.id)
    
    if (userIndex !== -1) {
      users[userIndex] = { ...users[userIndex], name: formData.name, email: formData.email }
      localStorage.setItem('users', JSON.stringify(users))
      
      const updatedUser = { ...user, name: formData.name, email: formData.email }
      localStorage.setItem('user', JSON.stringify(updatedUser))
      updateUserData(updatedUser)
      
      setMessage({ type: 'success', text: 'Profile updated successfully!' })
      setIsEditing(false)
      setTimeout(() => setMessage({ type: '', text: '' }), 3000)
    }
  }
  
  const handlePasswordChange = (e) => {
    e.preventDefault()
    const users = JSON.parse(localStorage.getItem('users') || '[]')
    const userData = users.find(u => u.id === user.id)
    
    if (btoa(passwordData.currentPassword) !== userData.password) {
      setMessage({ type: 'error', text: 'Current password is incorrect!' })
      setTimeout(() => setMessage({ type: '', text: '' }), 3000)
      return
    }
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match!' })
      setTimeout(() => setMessage({ type: '', text: '' }), 3000)
      return
    }
    
    if (passwordData.newPassword.length < 4) {
      setMessage({ type: 'error', text: 'Password must be at least 4 characters!' })
      setTimeout(() => setMessage({ type: '', text: '' }), 3000)
      return
    }
    
    const userIndex = users.findIndex(u => u.id === user.id)
    users[userIndex].password = btoa(passwordData.newPassword)
    localStorage.setItem('users', JSON.stringify(users))
    
    setMessage({ type: 'success', text: 'Password changed successfully!' })
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
    setShowPasswordForm(false)
    setTimeout(() => setMessage({ type: '', text: '' }), 3000)
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
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <button type="submit" className="save-btn">
                  <FaSave /> Save Changes
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
                <div className="info-row">
                  <span className="info-label">Member Since</span>
                  <span className="info-value">{new Date(user.id).toLocaleDateString()}</span>
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
                      placeholder="Enter new password"
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
                <button type="submit" className="save-btn">
                  <FaSave /> Update Password
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage