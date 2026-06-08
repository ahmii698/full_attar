import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import at1 from '../assets/at1.jpg'
import at2 from '../assets/at2.jpg'
import at3 from '../assets/at3.jpg'
import at4 from '../assets/at4.jpg'
import at5 from '../assets/at5.jpg'
import at6 from '../assets/at6.jpg'

const blogs = [
  {
    id: 1,
    title: "The Art of Oud: A Journey Through Time",
    excerpt: "Discover the rich history of oud, from ancient Arabian traditions to modern luxury perfumery. Learn how this precious ingredient is sourced and distilled.",
    image: at1,
    category: "Oud",
    date: "March 15, 2024",
    readTime: "5 min read",
    author: "Ahmed Raza",
    tags: ["Oud", "History", "Luxury"]
  },
  {
    id: 2,
    title: "How to Choose the Perfect Attar for Every Season",
    excerpt: "Summer fresh? Winter warm? Learn which attars work best for different weather conditions and occasions.",
    image: at2,
    category: "Attar Guide",
    date: "March 10, 2024",
    readTime: "4 min read",
    author: "Sarah Khan",
    tags: ["Attar", "Seasonal", "Guide"]
  },
  {
    id: 3,
    title: "The Difference Between Oud and Attar",
    excerpt: "Understanding the nuances between these two beloved fragrance forms. What makes each unique and special.",
    image: at3,
    category: "Oud",
    date: "March 5, 2024",
    readTime: "3 min read",
    author: "Omar Farooq",
    tags: ["Oud", "Attar", "Comparison"]
  },
  {
    id: 4,
    title: "Top 10 Best Selling Attars of 2024",
    excerpt: "Check out our most popular fragrances loved by customers worldwide. Discover what makes them special.",
    image: at4,
    category: "Trending",
    date: "February 28, 2024",
    readTime: "6 min read",
    author: "Fatima Al Mansouri",
    tags: ["Best Sellers", "Popular", "2024"]
  },
  {
    id: 5,
    title: "How to Apply Attar for Long Lasting Effect",
    excerpt: "Tips and tricks to make your fragrance stay all day long. Maximize your attar's longevity with these techniques.",
    image: at5,
    category: "Tips & Tricks",
    date: "February 20, 2024",
    readTime: "4 min read",
    author: "Bilal Ahmed",
    tags: ["Tips", "Application", "Longevity"]
  },
  {
    id: 6,
    title: "Behind the Scenes: How Our Attars Are Made",
    excerpt: "Take a look at our traditional distillation process. From raw materials to the final bottle.",
    image: at6,
    category: "Craftsmanship",
    date: "February 15, 2024",
    readTime: "7 min read",
    author: "Ahmed Raza",
    tags: ["Process", "Traditional", "Craftsmanship"]
  },
  {
    id: 7,
    title: "Understanding Different Oud Grades",
    excerpt: "From super king to cambodi, learn about various oud grades and their unique characteristics.",
    image: at1,
    category: "Oud",
    date: "February 10, 2024",
    readTime: "8 min read",
    author: "Ahmed Raza",
    tags: ["Oud", "Grades", "Education"]
  },
  {
    id: 8,
    title: "Attar vs Perfume: Which One Should You Choose?",
    excerpt: "Compare traditional attars with modern perfumes. Find out which suits your lifestyle better.",
    image: at2,
    category: "Attar Guide",
    date: "February 5, 2024",
    readTime: "5 min read",
    author: "Sarah Khan",
    tags: ["Attar", "Perfume", "Comparison"]
  },
  {
    id: 9,
    title: "Seasonal Fragrance Guide: Spring Edition",
    excerpt: "Discover the best floral and fresh attars to wear during spring season.",
    image: at3,
    category: "Seasonal Guide",
    date: "January 28, 2024",
    readTime: "4 min read",
    author: "Omar Farooq",
    tags: ["Spring", "Seasonal", "Floral"]
  }
]

// Categories - Updated (Oud Education -> Oud)
const categories = [
  { name: "All Posts", slug: "all", count: blogs.length },
  { name: "Oud", slug: "oud", count: blogs.filter(b => b.category === "Oud").length },
  { name: "Attar Guide", slug: "attar-guide", count: blogs.filter(b => b.category === "Attar Guide").length },
  { name: "Trending", slug: "trending", count: blogs.filter(b => b.category === "Trending").length },
  { name: "Tips & Tricks", slug: "tips-tricks", count: blogs.filter(b => b.category === "Tips & Tricks").length },
  { name: "Craftsmanship", slug: "craftsmanship", count: blogs.filter(b => b.category === "Craftsmanship").length },
  { name: "Seasonal Guide", slug: "seasonal-guide", count: blogs.filter(b => b.category === "Seasonal Guide").length },
]

// Get unique tags
const allTags = [...new Set(blogs.flatMap(b => b.tags))]

function BlogsPage() {
  const navigate = useNavigate()
  const [activeCategory, setActiveCategory] = useState("all")
  const [activeTag, setActiveTag] = useState(null)
  
  // Filter blogs by category and tag
  const filteredBlogs = blogs.filter(blog => {
    // Category filter
    if (activeCategory !== "all" && blog.category.toLowerCase().replace(/ /g, '-') !== activeCategory) {
      return false
    }
    // Tag filter
    if (activeTag && !blog.tags.includes(activeTag)) {
      return false
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
  
  return (
    <div className="blogs-page">
      <div className="shop-header">
        <h1>Royal Attar Blogs</h1>
        <p>Fragrance insights, tips, and stories from Royal Attar</p>
      </div>
      
      <div className="blogs-layout">
        {/* Sidebar */}
        <div className="blogs-sidebar">
          {/* Categories */}
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
          
          {/* Recent Posts */}
          <div className="sidebar-recent">
            <h3>Recent Posts</h3>
            <ul>
              {blogs.slice(0, 5).map(blog => (
                <li key={blog.id}>
                  <a onClick={() => handleRecentPostClick(blog.id)}>{blog.title}</a>
                  <span className="recent-date">{blog.date}</span>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Popular Tags */}
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
          
          {/* Clear Filters Button */}
          {(activeCategory !== "all" || activeTag) && (
            <div className="sidebar-clear">
              <button className="clear-filters-btn" onClick={clearFilters}>
                Clear All Filters
              </button>
            </div>
          )}
        </div>
        
        {/* Main Content - Blogs Grid */}
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
              {filteredBlogs.map(blog => (
                <div key={blog.id} className="blog-card">
                  <div className="blog-image">
                    <img src={blog.image} alt={blog.title} />
                    {/* CATEGORY TAG REMOVED - Sirf image */}
                  </div>
                  <div className="blog-content">
                    <div className="blog-meta">
                      <span className="blog-date">📅 {blog.date}</span>
                      <span className="blog-readtime">⏱️ {blog.readTime}</span>
                    </div>
                    <h3>{blog.title}</h3>
                    <p>{blog.excerpt}</p>
                    <div className="blog-tags">
                      {blog.tags.map((tag, i) => (
                        <span key={i} className="blog-tag" onClick={() => handleTagClick(tag)}>#{tag}</span>
                      ))}
                    </div>
                    <div className="blog-author">
                      <span>✍️ By {blog.author}</span>
                    </div>
                    <Link to={`/blog/${blog.id}`} className="read-more-btn">
                      Read More →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default BlogsPage