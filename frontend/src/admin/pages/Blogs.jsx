import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getBlogs, deleteBlog } from '../services/adminApi'
import '../styles/Blogs.css'

function Blogs() {
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)

  const APP_URL = 'http://localhost:8000'
  const FRONTEND_URL = 'http://localhost:5173'

  useEffect(() => {
    fetchBlogs()
  }, [])

  const fetchBlogs = async () => {
    try {
      const res = await getBlogs()
      setBlogs(res.data)
    } catch (error) {
      console.error('Error fetching blogs:', error)
      const dummyBlogs = [
        { blog_id: 1, title: "The Art of Oud: A Journey Through Time", category: "Oud", date: "March 15, 2024", status: "Published", image_url: "/assets/at1.jpg" },
        { blog_id: 2, title: "How to Choose the Perfect Attar for Every Season", category: "Attar Guide", date: "March 10, 2024", status: "Published", image_url: "/assets/at2.jpg" },
        { blog_id: 3, title: "The Difference Between Oud and Attar", category: "Oud", date: "March 5, 2024", status: "Published", image_url: "/assets/at3.jpg" },
      ]
      setBlogs(dummyBlogs)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this blog?')) {
      try {
        await deleteBlog(id)
        fetchBlogs()
      } catch (error) {
        setBlogs(blogs.filter(blog => blog.blog_id !== id))
      }
    }
  }

  // ✅ FINAL - Get image URL for admin panel (handle all path types)
  const getImageUrl = (imagePath) => {
    if (!imagePath) {
      return 'https://placehold.co/50x50/1a1a2a/d4af37?text=No+Image'
    }
    
    if (imagePath.startsWith('http')) {
      return imagePath
    }
    
    // Images from public/images/blogs folder
    if (imagePath.startsWith('/images/')) {
      return `${APP_URL}${imagePath}`
    }
    
    // Uploaded image from admin panel (starts with /storage/)
    if (imagePath.startsWith('/storage/')) {
      return `${APP_URL}${imagePath}`
    }
    
    // Local asset (starts with /assets/)
    if (imagePath.startsWith('/assets/')) {
      return `${FRONTEND_URL}${imagePath}`
    }
    
    return 'https://placehold.co/50x50/1a1a2a/d4af37?text=No+Image'
  }

  if (loading) return <div className="admin-loading">Loading blogs...</div>

  return (
    <div className="blogs-admin-page">
      <div className="admin-page-header">
        <h2>Blogs</h2>
        <Link to="/admin/blogs/create" className="admin-btn-primary">Add New Blog</Link>
      </div>
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
            {blogs.map(blog => (
              <tr key={blog.blog_id}>
                <td>{blog.blog_id}</td>
                <td>
                  <img 
                    src={getImageUrl(blog.image_url)} 
                    alt={blog.title} 
                    className="admin-blog-image"
                    style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }}
                    onError={(e) => {
                      console.error('Image failed:', getImageUrl(blog.image_url))
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
                  <Link to={`/admin/blogs/edit/${blog.blog_id}`} className="admin-btn-warning">Edit</Link>
                  <button onClick={() => handleDelete(blog.blog_id)} className="admin-btn-danger">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Blogs