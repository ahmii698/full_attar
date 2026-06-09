import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { getBlogs, createBlog, updateBlog } from '../services/adminApi'
import '../styles/BlogForm.css'

function BlogForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
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
      }
    } catch (error) {
      console.error('Error fetching blog:', error)
      // Fallback dummy data
      const dummyBlog = {
        title: 'The Art of Oud: A Journey Through Time',
        category: 'Oud',
        excerpt: 'Discover the rich history of oud from ancient Arabian traditions to modern luxury perfumery.',
        content: '<p>Oud, also known as agarwood, is one of the most precious and expensive natural fragrance ingredients in the world...</p>',
        author: 'Ahmed Raza',
        tags: 'Oud,History,Luxury',
        image_url: '/assets/at1.jpg'
      }
      setFormData({
        title: dummyBlog.title,
        category: dummyBlog.category,
        excerpt: dummyBlog.excerpt,
        content: dummyBlog.content,
        author: dummyBlog.author,
        tags: dummyBlog.tags,
        image_url: dummyBlog.image_url,
        date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
        read_time: '5 min read'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      if (isEdit) {
        await updateBlog(id, formData)
      } else {
        await createBlog(formData)
      }
      navigate('/admin/blogs')
    } catch (error) {
      console.error('Error saving blog:', error)
      alert('Error saving blog')
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

      <form onSubmit={handleSubmit}>
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

          <div className="form-group">
            <label>Image URL</label>
            <input
              type="text"
              name="image_url"
              value={formData.image_url}
              onChange={handleChange}
              className="form-control"
              placeholder="/assets/blog-image.jpg"
            />
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
              placeholder="Write your blog content here... You can use HTML tags like &lt;p&gt;, &lt;h2&gt;, &lt;strong&gt;, etc."
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