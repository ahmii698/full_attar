// src/pages/CategorySection.jsx
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FaArrowRight } from 'react-icons/fa'
import SectionHeading from '../components/SectionHeading'
import { API_URL } from '../../config'
import './CategorySection.css'

// Fallback images for categories
const FALLBACK_IMAGES = {
  'ARABIC ATTAR': 'https://i.pinimg.com/736x/89/fa/e8/89fae889f67a6e996d54f0787fc5ff49.jpg',
  'FRENCH ATTARS': 'https://i.pinimg.com/736x/92/14/9f/92149f0fe1afb3f1f3b74113029b47c5.jpg',
  "PERFUME'S SPRAY": 'https://i.pinimg.com/1200x/b7/99/86/b79986b0cf485344dd12d2eb405853a2.jpg',
  'SHOES': 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'
}

// ✅ Sirf yeh 4 categories dikhayen
const DISPLAY_CATEGORIES = [
  'ARABIC ATTAR',
  'FRENCH ATTARS',
  "PERFUME'S SPRAY",
  'SHOES'
]

function CategorySection() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const catRes = await fetch(`${API_URL}/categories`)
      const catData = await catRes.json()
      
      // Handle different response structures
      let categoryList = []
      if (catData.data && Array.isArray(catData.data)) {
        categoryList = catData.data
      } else if (Array.isArray(catData)) {
        categoryList = catData
      } else if (catData.categories && Array.isArray(catData.categories)) {
        categoryList = catData.categories
      } else {
        categoryList = []
      }

      // ✅ Filter to only show categories in DISPLAY_CATEGORIES
      const filteredCategories = categoryList.filter(cat => {
        const catName = (cat.category_name || cat.name || '').toUpperCase().trim()
        return DISPLAY_CATEGORIES.includes(catName)
      })

      // ✅ Agar SHOES category API mein nahi hai toh manually add karo
      const hasShoes = filteredCategories.some(cat => 
        (cat.category_name || cat.name || '').toUpperCase().trim() === 'SHOES'
      )

      if (!hasShoes) {
        // Manually add SHOES category
        filteredCategories.push({
          category_id: 'shoes_coming_soon',
          category_name: 'Shoes',
          name: 'Shoes',
          image_url: FALLBACK_IMAGES['SHOES'],
          isComingSoon: true // ✅ Special flag for coming soon
        })
      }

      if (filteredCategories.length === 0) {
        setError('No categories found')
        setCategories([])
      } else {
        // ✅ Sort categories in the order defined in DISPLAY_CATEGORIES
        const sortedCategories = filteredCategories.sort((a, b) => {
          const nameA = (a.category_name || a.name || '').toUpperCase().trim()
          const nameB = (b.category_name || b.name || '').toUpperCase().trim()
          return DISPLAY_CATEGORIES.indexOf(nameA) - DISPLAY_CATEGORIES.indexOf(nameB)
        })
        setCategories(sortedCategories)
      }
    } catch (error) {
      setError(error.message)
      setCategories([])
    } finally {
      setLoading(false)
    }
  }

  // ✅ Handle card click - check if coming soon
  const handleCardClick = (category, e) => {
    if (category.isComingSoon) {
      e.preventDefault()
      // Navigate to coming soon page
      window.location.href = '/coming-soon'
    }
  }

  if (loading) {
    return (
      <section className="category-section-wrapper">
        <SectionHeading title="Shop by Category" subtitle="Explore our premium collections" />
        <div className="category-loading">Loading categories...</div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="category-section-wrapper">
        <SectionHeading title="Shop by Category" subtitle="Explore our premium collections" />
        <div className="category-error">
          <p>Error loading categories: {error}</p>
          <button onClick={fetchCategories} className="category-retry-btn">
            Retry
          </button>
        </div>
      </section>
    )
  }

  if (categories.length === 0) {
    return (
      <section className="category-section-wrapper">
        <SectionHeading title="Shop by Category" subtitle="Explore our premium collections" />
        <div className="category-empty">
          <p>No categories available</p>
        </div>
      </section>
    )
  }

  return (
    <section className="category-section-wrapper">
      <SectionHeading title="Shop by Category" subtitle="Explore our premium collections" />
      <div className="category-grid">
        {categories.map((category, index) => {
          const catName = (category.category_name || category.name || '').toUpperCase().trim()
          const displayName = category.category_name || category.name || ''
          const imageUrl = category.image_url || category.image || FALLBACK_IMAGES[catName] || FALLBACK_IMAGES['ARABIC ATTAR']
          const isComingSoon = category.isComingSoon || false

          // ✅ Agar SHOES hai toh coming soon link, warna normal link
          const linkTo = isComingSoon ? '/coming-soon' : `/shop?category=${encodeURIComponent(displayName)}`

          return (
            <Link
              key={category.category_id || category.id || index}
              to={linkTo}
              className="category-card-link"
              style={{ '--delay': `${index * 0.12}s` }}
              onClick={(e) => handleCardClick(category, e)}
            >
              <div className="category-card" data-letter={displayName.charAt(0)}>
                <div
                  className="category-card-image"
                  style={{ backgroundImage: `url(${imageUrl})` }}
                />
                <div className="category-card-overlay" />
                <div className="category-card-content">
                 
                  <h3 className="category-name">{displayName}</h3>
                  <p className="category-description">
                    {isComingSoon 
                      ? 'Exciting new collection coming soon! Stay tuned.' 
                      : `Explore our collection of ${displayName.toLowerCase()} fragrances`}
                  </p>
                  <span className="category-arrow">
                    {isComingSoon ? 'Coming Soon' : 'Shop Now'} <FaArrowRight />
                  </span>
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </section>
  )
}

export default CategorySection