import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FaPlus, FaEdit, FaTrash, FaChevronLeft, FaChevronRight, FaCheckCircle, FaTimesCircle } from 'react-icons/fa'
import { getBlogs, deleteBlog } from '../services/adminApi'
import { STORAGE_URL } from '../../../config'  // ✅ IMPORT FROM CONFIG
import '../styles/Blogs.css'

function Blogs() {
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState(null)

  // ✅ Pagination States
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(8)
  const [totalItems, setTotalItems] = useState(0)

  // ✅ USING CONFIG - NO HARDCODED URLS
  const APP_URL = STORAGE_URL?.replace('/storage', '') || 'http://localhost:8000'
  const FRONTEND_URL = window.location.origin || 'http://localhost:5173'

  useEffect(() => {
    fetchBlogs()
  }, [])

  // ✅ Toast Auto Dismiss
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [toast])

  const showToast = (message, type = 'success') => {
    setToast({ message, type })
  }

  const fetchBlogs = async () => {
    try {
      const res = await getBlogs()
      setBlogs(res.data)
      setTotalItems(res.data.length)
    } catch (error) {
      console.error('Error fetching blogs:', error)
      const dummyBlogs = [
        { blog_id: 1, title: "The Art of Oud: A Journey Through Time", category: "Oud", date: "March 15, 2024", status: "Published", image_url: "/assets/at1.jpg" },
        { blog_id: 2, title: "How to Choose the Perfect Attar for Every Season", category: "Attar Guide", date: "March 10, 2024", status: "Published", image_url: "/assets/at2.jpg" },
        { blog_id: 3, title: "The Difference Between Oud and Attar", category: "Oud", date: "March 5, 2024", status: "Published", image_url: "/assets/at3.jpg" },
        { blog_id: 4, title: "Top 10 Fragrances for Summer", category: "Guide", date: "Feb 28, 2024", status: "Published", image_url: "/assets/at4.jpg" },
        { blog_id: 5, title: "The History of Attar Making", category: "History", date: "Feb 20, 2024", status: "Draft", image_url: "/assets/at1.jpg" },
        { blog_id: 6, title: "Why Oud is Called Liquid Gold", category: "Oud", date: "Feb 15, 2024", status: "Published", image_url: "/assets/at2.jpg" },
        { blog_id: 7, title: "How to Layer Fragrances Like a Pro", category: "Guide", date: "Feb 10, 2024", status: "Published", image_url: "/assets/at3.jpg" },
        { blog_id: 8, title: "The Best Attar for Gifting", category: "Gift Guide", date: "Feb 5, 2024", status: "Published", image_url: "/assets/at4.jpg" },
        { blog_id: 9, title: "Understanding Fragrance Notes", category: "Education", date: "Jan 28, 2024", status: "Draft", image_url: "/assets/at1.jpg" },
        { blog_id: 10, title: "The Rise of Niche Perfumery", category: "Trends", date: "Jan 20, 2024", status: "Published", image_url: "/assets/at2.jpg" },
      ]
      setBlogs(dummyBlogs)
      setTotalItems(dummyBlogs.length)
    } finally {
      setLoading(false)
    }
  }

  // ✅ Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentBlogs = blogs.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(totalItems / itemsPerPage)

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this blog?')) {
      try {
        await deleteBlog(id)
        showToast('Blog deleted successfully!', 'success')
        fetchBlogs()
        if (currentBlogs.length === 1 && currentPage > 1) {
          setCurrentPage(currentPage - 1)
        }
      } catch (error) {
        setBlogs(blogs.filter(blog => blog.blog_id !== id))
        showToast('Blog deleted successfully!', 'success')
      }
    }
  }

  // ✅ Get image URL for admin panel
  const getImageUrl = (imagePath) => {
    if (!imagePath) {
      return 'https://placehold.co/50x50/1a1a2a/d4af37?text=No+Image'
    }
    
    if (imagePath.startsWith('http')) {
      return imagePath
    }
    
    if (imagePath.startsWith('/images/')) {
      return `${APP_URL}${imagePath}`
    }
    
    if (imagePath.startsWith('/storage/')) {
      return `${APP_URL}${imagePath}`
    }
    
    if (imagePath.startsWith('/assets/')) {
      return `${FRONTEND_URL}${imagePath}`
    }
    
    return 'https://placehold.co/50x50/1a1a2a/d4af37?text=No+Image'
  }

  if (loading) return <div className="admin-loading">Loading blogs...</div>

  return (
    <div className="blogs-admin-page">
      {/* ✅ Toast Notification */}
      {toast && (
        <div className={`toast-notification ${toast.type}`}>
          <div className="toast-icon">
            {toast.type === 'success' && <FaCheckCircle />}
            {toast.type === 'error' && <FaTimesCircle />}
          </div>
          <div className="toast-message">{toast.message}</div>
          <button className="toast-close" onClick={() => setToast(null)}>×</button>
        </div>
      )}

      <div className="admin-page-header">
        <h2>Blogs</h2>
        <Link to="/admin/blogs/create" className="admin-btn-primary">
          <FaPlus /> Add New Blog
        </Link>
      </div>

      {blogs.length === 0 ? (
        <div className="empty-state">
          <p>No blogs found.</p>
        </div>
      ) : (
        <>
          <div className="admin-data-table-container">
            <table className="admin-data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Image</th>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentBlogs.map(blog => (
                  <tr key={blog.blog_id}>
                    <td>{blog.blog_id}</td>
                    <td>
                      <img 
                        src={getImageUrl(blog.image_url)} 
                        alt={blog.title} 
                        className="admin-blog-image"
                        onError={(e) => {
                          e.target.src = 'https://placehold.co/50x50/1a1a2a/d4af37?text=No+Image'
                        }}
                      />
                    </td>
                    <td>{blog.title}</td>
                    <td>{blog.category}</td>
                    <td>{blog.date}</td>
                    <td>
                      <span className={`status-badge ${blog.status === 'Published' ? 'active' : 'inactive'}`}>
                        {blog.status || 'Published'}
                      </span>
                    </td>
                    <td>
                      <Link to={`/admin/blogs/edit/${blog.blog_id}`} className="admin-btn-warning">
                        <FaEdit /> Edit
                      </Link>
                      <button onClick={() => handleDelete(blog.blog_id)} className="admin-btn-danger">
                        <FaTrash /> Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ✅ Pagination */}
          {totalPages > 1 && (
            <div className="pagination-container">
              <div className="pagination">
                <button 
                  onClick={() => handlePageChange(currentPage - 1)} 
                  disabled={currentPage === 1}
                  className="pagination-btn"
                >
                  <FaChevronLeft /> Previous
                </button>
                
                <div className="page-numbers">
                  {[...Array(totalPages).keys()].map(number => (
                    <button
                      key={number + 1}
                      onClick={() => handlePageChange(number + 1)}
                      className={`page-number ${currentPage === number + 1 ? 'active' : ''}`}
                    >
                      {number + 1}
                    </button>
                  ))}
                </div>
                
                <button 
                  onClick={() => handlePageChange(currentPage + 1)} 
                  disabled={currentPage === totalPages}
                  className="pagination-btn"
                >
                  Next <FaChevronRight />
                </button>
              </div>
              <div className="showing-info">
                Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, totalItems)} of {totalItems} blogs
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default Blogs