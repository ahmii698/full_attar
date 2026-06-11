import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { getBlogs, createBlog, updateBlog } from '../services/adminApi'
import '../styles/BlogForm.css'

function BlogForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState('')
  const [formData, setFormData] = useState({
    title: '',
    category: 'Oud',
    excerpt: '',
    content: '',
    author: 'Royal Attar',
    tags: '',
    image_url: '',
    date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
    read_time: '5 min read'
  })
  const [isEdit, setIsEdit] = useState(false)

  const APP_URL = 'http://localhost:8000'
  const FRONTEND_URL = 'http://localhost:5173'

  useEffect(() => {
    if (id) {
      setIsEdit(true)
      fetchBlog()
    }
  }, [id])

  const fetchBlog = async () => {
    try {
      setLoading(true)
      const res = await getBlogs()
      const blog = res.data.find(b => b.blog_id === parseInt(id))
      if (blog) {
        setFormData({
          title: blog.title || '',
          category: blog.category || 'Oud',
          excerpt: blog.excerpt || '',
          content: blog.content || '',
          author: blog.author || 'Royal Attar',
          tags: blog.tags || '',
          image_url: blog.image_url || '',
          date: blog.date || new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
          read_time: blog.read_time || '5 min read'
        })
        
        // ✅ FIXED: Image preview for both asset types
        if (blog.image_url) {
          if (blog.image_url.startsWith('/storage/')) {
            setImagePreview(`${APP_URL}${blog.image_url}`)
          } else if (blog.image_url.startsWith('/assets/')) {
            setImagePreview(`${FRONTEND_URL}${blog.image_url}`)
          } else {
            setImagePreview(blog.image_url)
          }
        }
      }
    } catch (error) {
      console.error('Error fetching blog:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImageFile(file)
      setImagePreview(URL.createObjectURL(file))
      setFormData(prev => ({ ...prev, image_url: '' }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const submitData = new FormData()
      
      Object.keys(formData).forEach(key => {
        if (formData[key]) {
          submitData.append(key, formData[key])
        }
      })
      
      if (imageFile) {
        submitData.append('image', imageFile)
      }

      if (isEdit) {
        await updateBlog(id, submitData)
      } else {
        await createBlog(submitData)
      }
      navigate('/admin/blogs')
    } catch (error) {
      console.error('Error saving blog:', error)
      alert('Error saving blog. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (loading && isEdit) return <div className="admin-loading">Loading blog...</div>

  return (
    <div className="blog-form">
      <div className="form-header">
        <h2>{isEdit ? 'Edit Blog' : 'Add New Blog'}</h2>
        <Link to="/admin/blogs" className="btn-secondary">Back to Blogs</Link>
      </div>

      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="form-grid">
          <div className="form-group full-width">
            <label>Blog Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>

          <div className="form-group">
            <label>Category *</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="form-control"
              required
            >
              <option value="Oud">Oud</option>
              <option value="Attar Guide">Attar Guide</option>
              <option value="Trending">Trending</option>
              <option value="Tips & Tricks">Tips & Tricks</option>
              <option value="Craftsmanship">Craftsmanship</option>
              <option value="Seasonal Guide">Seasonal Guide</option>
            </select>
          </div>

          <div className="form-group">
            <label>Author</label>
            <input
              type="text"
              name="author"
              value={formData.author}
              onChange={handleChange}
              className="form-control"
            />
          </div>

          <div className="form-group">
            <label>Read Time</label>
            <input
              type="text"
              name="read_time"
              value={formData.read_time}
              onChange={handleChange}
              className="form-control"
              placeholder="5 min read"
            />
          </div>

          <div className="form-group">
            <label>Date</label>
            <input
              type="text"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="form-control"
              placeholder="March 15, 2024"
            />
          </div>

          <div className="form-group">
            <label>Tags (comma separated)</label>
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              className="form-control"
              placeholder="Oud, History, Luxury"
            />
          </div>

          {/* Image Upload Section */}
          <div className="form-group">
            <label>Blog Image</label>
            <div className="image-upload-area">
              <input
                type="file"
                id="blog-image"
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: 'none' }}
              />
              <button 
                type="button" 
                className="upload-image-btn"
                onClick={() => document.getElementById('blog-image').click()}
              >
                📁 Choose Image from Computer
              </button>
              
              {imagePreview && (
                <div className="image-preview-container">
                  <img src={imagePreview} alt="Preview" className="image-preview" />
                  <button 
                    type="button" 
                    className="remove-image-btn"
                    onClick={() => {
                      setImageFile(null)
                      setImagePreview('')
                      setFormData(prev => ({ ...prev, image_url: '' }))
                    }}
                  >
                    ✕ Remove
                  </button>
                </div>
              )}
              
              <div className="image-url-alternative">
                <label className="alt-label">OR Enter Image URL:</label>
                <input
                  type="text"
                  name="image_url"
                  value={formData.image_url}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="/assets/blog-image.jpg or /storage/blogs/image.jpg"
                />
              </div>
            </div>
          </div>

          <div className="form-group full-width">
            <label>Excerpt (Short Description)</label>
            <textarea
              name="excerpt"
              value={formData.excerpt}
              onChange={handleChange}
              className="form-control"
              rows="3"
              placeholder="Brief summary of the blog post..."
            />
          </div>

          <div className="form-group full-width">
            <label>Content (Full Blog Body - HTML allowed)</label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              className="form-control content-editor"
              rows="15"
              placeholder="Write your blog content here... You can use HTML tags like <p>, <h2>, <strong>, etc."
            />
            <small className="form-text">
              You can use HTML tags: &lt;p&gt;, &lt;h1&gt;-&lt;h6&gt;, &lt;strong&gt;, &lt;em&gt;, &lt;ul&gt;, &lt;li&gt;, etc.
            </small>
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Saving...' : (isEdit ? 'Update Blog' : 'Create Blog')}
          </button>
          <Link to="/admin/blogs" className="btn-secondary">Cancel</Link>
        </div>
      </form>
    </div>
  )
}

export default BlogForm