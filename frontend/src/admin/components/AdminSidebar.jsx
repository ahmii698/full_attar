import { NavLink } from 'react-router-dom'
import '../styles/AdminSidebar.css'

function AdminSidebar() {
  return (
    <div className="admin-sidebar">
      <div className="sidebar-header">
        <h3>Royal Attar</h3>
        <p>Admin Panel</p>
      </div>
      <nav className="sidebar-nav">
        {/* Dashboard */}
        <NavLink to="/admin/dashboard" className="nav-item">
          <i className="fas fa-chart-line"></i> Dashboard
        </NavLink>
        
        {/* Products */}
        <NavLink to="/admin/products" className="nav-item">
          <i className="fas fa-box"></i> Products
        </NavLink>
        
        {/* ✅ CATEGORIES - NEW */}
        <NavLink to="/admin/categories" className="nav-item">
          <i className="fas fa-tags"></i> Categories
        </NavLink>
        
        {/* Blogs */}
        <NavLink to="/admin/blogs" className="nav-item">
          <i className="fas fa-newspaper"></i> Blogs
        </NavLink>
        
        {/* Orders */}
        <NavLink to="/admin/orders" className="nav-item">
          <i className="fas fa-shopping-cart"></i> Orders
        </NavLink>
        
        {/* Users */}
        <NavLink to="/admin/users" className="nav-item">
          <i className="fas fa-users"></i> Users
        </NavLink>
        
        {/* Testimonials */}
        <NavLink to="/admin/testimonials" className="nav-item">
          <i className="fas fa-star"></i> Testimonials
        </NavLink>
        
        {/* Contacts */}
        <NavLink to="/admin/contacts" className="nav-item">
          <i className="fas fa-envelope"></i> Contacts
        </NavLink>
        
        {/* Subscribers */}
        <NavLink to="/admin/subscribers" className="nav-item">
          <i className="fas fa-bell"></i> Subscribers
        </NavLink>
        
        {/* FAQs */}
        <NavLink to="/admin/faqs" className="nav-item">
          <i className="fas fa-question-circle"></i> FAQs
        </NavLink>
        
        {/* Hero Settings */}
        <NavLink to="/admin/hero-settings" className="nav-item">
          <i className="fas fa-image"></i> Hero Settings
        </NavLink>
        
        {/* Banners */}
        <NavLink to="/admin/banners" className="nav-item">
          <i className="fas fa-flag"></i> Banners
        </NavLink>
        
        {/* Site Settings */}
        <NavLink to="/admin/site-settings" className="nav-item">
          <i className="fas fa-cog"></i> Site Settings
        </NavLink>
      </nav>
    </div>
  )
}

export default AdminSidebar