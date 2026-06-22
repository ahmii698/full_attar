import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { FaArrowLeft, FaFacebook, FaTwitter, FaWhatsapp, FaLinkedin, FaRegBookmark, FaShareAlt } from 'react-icons/fa'
import { API_URL, STORAGE_URL } from '../../config'  // ✅ IMPORT FROM CONFIG

function BlogDetailPage() {
  const { id } = useParams()
  const [blog, setBlog] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // ✅ USING CONFIG
  const APP_URL = STORAGE_URL.replace('/storage', '') || 'http://127.0.0.1:8000'

  useEffect(() => {
    fetchBlog()
  }, [id])

  const fetchBlog = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${API_URL}/blogs/${id}`)  // ✅ USING API_URL
      
      if (!response.ok) {
        throw new Error('Failed to fetch blog')
      }
      
      const data = await response.json()
      console.log('Blog data:', data)
      setBlog(data)
    } catch (err) {
      setError(err.message)
      console.error('Error fetching blog:', err)
    } finally {
      setLoading(false)
    }
  }

  // ✅ FINAL - Handle all image path types (same as BlogsPage)
  const getImageUrl = (imagePath) => {
    if (!imagePath) {
      return '/assets/at1.jpg'
    }
    
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
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
      const filename = imagePath.split('/').pop()
      return `/assets/${filename}`
    }
    
    return '/assets/at1.jpg'
  }

  const parseTags = (tagsStr) => {
    if (!tagsStr) return []
    return tagsStr.split(',').map(t => t.trim())
  }

  const handleShare = (platform) => {
    const url = window.location.href
    const text = blog?.title || 'Royal Attar Blog'
    if (platform === 'facebook') {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank')
    } else if (platform === 'twitter') {
      window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank')
    } else if (platform === 'whatsapp') {
      window.open(`https://wa.me/?text=${text} ${url}`, '_blank')
    } else if (platform === 'linkedin') {
      window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank')
    }
  }

  if (loading) {
    return (
      <div className="shop-page">
        <div className="shop-header">
          <h1>Loading Blog...</h1>
        </div>
      </div>
    )
  }

  if (error || !blog) {
    return (
      <div className="shop-page">
        <div className="shop-header">
          <h1>Blog Not Found</h1>
          <p>The article you're looking for doesn't exist.</p>
          <Link to="/blogs" className="explore-btn" style={{ marginTop: '20px' }}>← Back to Blogs</Link>
        </div>
      </div>
    )
  }

  const blogTags = parseTags(blog.tags)
  const imageUrl = getImageUrl(blog.image_url)

  return (
    <div className="blog-detail-page">
      <div className="blog-detail-header">
        <Link to="/blogs" className="back-to-blogs">
          <FaArrowLeft /> Back to Blogs
        </Link>
        
        <div className="blog-detail-image">
          <img 
            src={imageUrl} 
            alt={blog.title}
            style={{ width: '100%', maxHeight: '400px', objectFit: 'cover' }}
            onError={(e) => {
              console.error('Image failed:', imageUrl)
              e.target.src = '/assets/at1.jpg'
            }}
          />
        </div>
        
        <div className="blog-detail-info">
          <h1>{blog.title}</h1>
          <div className="blog-detail-meta">
            <span>📅 {blog.date}</span>
            <span>⏱️ {blog.read_time}</span>
          </div>
          
          <div className="blog-author-name">
            <span className="author-name">By {blog.author}</span>
          </div>
          
          {blogTags.length > 0 && (
            <div className="blog-detail-tags">
              {blogTags.map((tag, i) => (
                <span key={i} className="detail-tag">#{tag}</span>
              ))}
            </div>
          )}
          
          <div className="blog-share-section">
            <span className="share-label">Share this article:</span>
            <div className="share-buttons">
              <button onClick={() => handleShare('facebook')} className="share-btn facebook"><FaFacebook /></button>
              <button onClick={() => handleShare('twitter')} className="share-btn twitter"><FaTwitter /></button>
              <button onClick={() => handleShare('whatsapp')} className="share-btn whatsapp"><FaWhatsapp /></button>
              <button onClick={() => handleShare('linkedin')} className="share-btn linkedin"><FaLinkedin /></button>
              <button className="share-btn bookmark"><FaRegBookmark /></button>
              <button className="share-btn share"><FaShareAlt /></button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="blog-detail-content">
        <div dangerouslySetInnerHTML={{ __html: blog.content }} />
      </div>
      
      <div className="blog-detail-footer">
        <Link to="/blogs" className="more-blogs-btn">
          View All Blogs →
        </Link>
      </div>
    </div>
  )
}

export default BlogDetailPage