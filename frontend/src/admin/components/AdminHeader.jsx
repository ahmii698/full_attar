import { useAdminAuth } from '../contexts/AdminAuthContext'
import { useNavigate } from 'react-router-dom'
import '../styles/AdminHeader.css'   // ← YEH CHANGE KARO (AdminLayout.css se AdminHeader.css)

function AdminHeader() {
  const { admin, logout } = useAdminAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/admin/login')
  }

  return (
    <div className="admin-header">
      <div className="header-title">
        <h1>Dashboard</h1>
        <p>Welcome back, {admin?.name}</p>
      </div>
      <div className="header-actions">
        <div className="admin-info">
          <span>{admin?.name}</span>
          <small>Administrator</small>
        </div>
        <button onClick={handleLogout} className="logout-btn">
          <i className="fas fa-sign-out-alt"></i> Logout
        </button>
      </div>
    </div>
  )
}

export default AdminHeader