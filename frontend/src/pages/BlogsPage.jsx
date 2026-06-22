import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { API_URL, STORAGE_URL } from '../../config'  // ✅ IMPORT FROM CONFIG

function BlogsPage() {
  const navigate = useNavigate()
  const [blogs, setBlogs] = useState([])
  const [categories, setCategories] = useState([])
  const [allTags, setAllTags] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeCategory, setActiveCategory] = useState("all")
  const [activeTag, setActiveTag] = useState(null)

  // ✅ USING CONFIG
  const APP_URL = STORAGE_URL.replace('/storage', '') || 'http://127.0.0.1:8000'

  useEffect(() => {
    fetchBlogs()
  }, [])

  const fetchBlogs = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${API_URL}/blogs`)  // ✅ USING API_URL
      
      if (!response.ok) {
        throw new Error('Failed to fetch blogs')
      }
      
      const data = await response.json()
      console.log('Blogs from DB:', data)
      setBlogs(data)
      
      const uniqueCategories = [...new Set(data.map(blog => blog.category).filter(Boolean))]
      const categoryList = [
        { name: "All Posts", slug: "all", count: data.length },
        ...uniqueCategories.map(cat => ({
          name: cat,
          slug: cat.toLowerCase().replace(/ /g, '-'),
          count: data.filter(b => b.category === cat).length
        }))
      ]
      setCategories(categoryList)
      
      const tagsSet = new Set()
      data.forEach(blog => {
        if (blog.tags) {
          const tagsArray = blog.tags.split(',').map(t => t.trim())
          tagsArray.forEach(tag => tagsSet.add(tag))
        }
      })
      setAllTags([...tagsSet])
      
    } catch (err) {
      setError(err.message)
      console.error('Error fetching blogs:', err)
    } finally {
      setLoading(false)
    }
  }

  // ✅ FINAL - Handle all image path types
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

  const filteredBlogs = blogs.filter(blog => {
    if (activeCategory !== "all" && blog.category?.toLowerCase().replace(/ /g, '-') !== activeCategory) {
      return false
    }
    if (activeTag) {
      const blogTags = parseTags(blog.tags)
      if (!blogTags.includes(activeTag)) {
        return false
      }
    }
    return true
  })

  const handleCategoryClick = (slug) => {
    setActiveCategory(slug)
    setActiveTag(null)
  }

  const handleTagClick = (tag) => {
    setActiveTag(tag)
    setActiveCategory("all")
  }

  const handleRecentPostClick = (id) => {
    navigate(`/blog/${id}`)
  }

  const clearFilters = () => {
    setActiveCategory("all")
    setActiveTag(null)
  }

  if (loading) {
    return (
      <div className="blogs-page">
        <div className="shop-header">
          <h1>Royal Attar Blogs</h1>
          <p>Loading blogs...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="blogs-page">
        <div className="shop-header">
          <h1>Royal Attar Blogs</h1>
          <p>Error loading blogs. Please try again later.</p>
        </div>
      </div>
    )
  }

  const recentPosts = [...blogs].reverse().slice(0, 5)

  return (
    <div className="blogs-page">
      <div className="shop-header">
        <h1>Royal Attar Blogs</h1>
        <p>Fragrance insights, tips, and stories from Royal Attar</p>
      </div>
      
      <div className="blogs-layout">
        <div className="blogs-sidebar">
          <div className="sidebar-category">
            <h3>Categories</h3>
            <ul>
              {categories.map(cat => (
                <li 
                  key={cat.slug} 
                  className={activeCategory === cat.slug ? 'active' : ''}
                  onClick={() => handleCategoryClick(cat.slug)}
                >
                  <span>{cat.name}</span>
                  <span className="category-count">{cat.count}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="sidebar-recent">
            <h3>Recent Posts</h3>
            <ul>
              {recentPosts.map(blog => (
                <li key={blog.blog_id}>
                  <a onClick={() => handleRecentPostClick(blog.blog_id)}>{blog.title}</a>
                  <span className="recent-date">{blog.date}</span>
                </li>
              ))}
            </ul>
          </div>
          
          {allTags.length > 0 && (
            <div className="sidebar-tags">
              <h3>Popular Tags</h3>
              <div className="tags-cloud">
                {allTags.map(tag => (
                  <span 
                    key={tag} 
                    className={`tag-item ${activeTag === tag ? 'active' : ''}`}
                    onClick={() => handleTagClick(tag)}
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {(activeCategory !== "all" || activeTag) && (
            <div className="sidebar-clear">
              <button className="clear-filters-btn" onClick={clearFilters}>
                Clear All Filters
              </button>
            </div>
          )}
        </div>
        
        <div className="blogs-main">
          <div className="filter-info">
            {activeTag && <span className="active-filter">Tag: #{activeTag}</span>}
            {activeCategory !== "all" && <span className="active-filter">Category: {categories.find(c => c.slug === activeCategory)?.name}</span>}
            <span className="results-count">{filteredBlogs.length} posts found</span>
          </div>
          
          {filteredBlogs.length === 0 ? (
            <div className="no-blogs">
              <p>No blogs found in this category/tag.</p>
              <button className="reset-btn" onClick={clearFilters}>View All Posts</button>
            </div>
          ) : (
            <div className="blogs-container">
              {filteredBlogs.map(blog => {
                const blogTags = parseTags(blog.tags)
                const imageUrl = getImageUrl(blog.image_url)
                
                return (
                  <div key={blog.blog_id} className="blog-card">
                    <div className="blog-image">
                      <img 
                        src={imageUrl} 
                        alt={blog.title}
                        onError={(e) => {
                          console.error('Image failed:', imageUrl)
                          e.target.src = '/assets/at1.jpg'
                        }}
                      />
                    </div>
                    <div className="blog-content">
                      <div className="blog-meta">
                        <span className="blog-date">📅 {blog.date}</span>
                        <span className="blog-readtime">⏱️ {blog.read_time}</span>
                      </div>
                      <h3>{blog.title}</h3>
                      <p>{blog.excerpt || (blog.content?.substring(0, 120) + '...')}</p>
                      {blogTags.length > 0 && (
                        <div className="blog-tags">
                          {blogTags.map((tag, i) => (
                            <span key={i} className="blog-tag" onClick={() => handleTagClick(tag)}>#{tag}</span>
                          ))}
                        </div>
                      )}
                      <div className="blog-author">
                        <span>✍️ By {blog.author}</span>
                      </div>
                      <Link to={`/blog/${blog.blog_id}`} className="read-more-btn">
                        Read More →
                      </Link>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default BlogsPage