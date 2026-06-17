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
        <NavLink to="/admin/products" className="nav-item">
          <i className="fas fa-box"></i> Products
        </NavLink>
        <NavLink to="/admin/blogs" className="nav-item">
          <i className="fas fa-newspaper"></i> Blogs
        </NavLink>
        <NavLink to="/admin/orders" className="nav-item">
          <i className="fas fa-shopping-cart"></i> Orders
        </NavLink>
        {/* <NavLink to="/admin/users" className="nav-item">
          <i className="fas fa-users"></i> Users
        </NavLink> */}
        <NavLink to="/admin/testimonials" className="nav-item">
          <i className="fas fa-star"></i> Testimonials
        </NavLink>
        <NavLink to="/admin/contacts" className="nav-item">
          <i className="fas fa-envelope"></i> Contacts
        </NavLink>
        <NavLink to="/admin/subscribers" className="nav-item">
          <i className="fas fa-bell"></i> Subscribers
        </NavLink>
        
        {/* Outlets LINK */}
        <NavLink to="/admin/outlets" className="nav-item">
          <i className="fas fa-store"></i> Outlets
        </NavLink>
        
        {/* FAQ LINK */}
        <NavLink to="/admin/faqs" className="nav-item">
          <i className="fas fa-question-circle"></i> FAQs
        </NavLink>
        
        <NavLink to="/admin/hero-settings" className="nav-item">
          <i className="fas fa-image"></i> Hero Settings
        </NavLink>
        <NavLink to="/admin/banners" className="nav-item">
          <i className="fas fa-flag"></i> Banners
        </NavLink>
        <NavLink to="/admin/site-settings" className="nav-item">
          <i className="fas fa-cog"></i> Site Settings
        </NavLink>
      </nav>
    </div>
  )
}

export default AdminSidebar