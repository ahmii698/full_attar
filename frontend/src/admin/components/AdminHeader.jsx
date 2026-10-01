import { useAdminAuth } from '../contexts/AdminAuthContext'
import { useNavigate, useLocation } from 'react-router-dom'
import '../styles/AdminHeader.css'

const PAGE_TITLES = {
  '': 'Dashboard',
  'dashboard': 'Dashboard',
  'products': 'Products',
  'shoes': 'Shoes',
  'categories': 'Categories',
  'blogs': 'Blogs',
  'orders': 'Orders',
  'users': 'Users',
  'testimonials': 'Testimonials',
  'contacts': 'Contacts',
  'subscribers': 'Subscribers',
  'faqs': 'FAQs',
  'hero-settings': 'Hero Settings',
  'banners': 'Banners',
  'site-settings': 'Site Settings',
}

function AdminHeader() {
  const { admin, logout } = useAdminAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    logout()
    navigate('/admin/login')
  }

  // "/admin/users" -> "users"
  const segment = location.pathname.replace(/^\/admin\/?/, '').split('/')[0]
  const title =
    PAGE_TITLES[segment] ||
    segment.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())

  const adminName =
    admin?.name ||
    [admin?.first_name, admin?.last_name].filter(Boolean).join(' ') ||
    admin?.username ||
    admin?.email ||
    ''

  return (
    <div className="admin-header">
      <div className="header-title">
        <h1>{title}</h1>
        <p>Welcome back{adminName ? `, ${adminName}` : ''}</p>
      </div>
      <div className="header-actions">
        <div className="admin-info">
          <span>{adminName}</span>
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