// src/pages/CategorySection.jsx
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FaArrowRight } from 'react-icons/fa'
import SectionHeading from '../components/SectionHeading'
import { API_URL } from '../../config'
import './CategorySection.css'

// ⚠️ Pinterest-hosted images — these can break anytime (Pinterest may block hotlinking
// or change/delete the URL) and may not be licensed for commercial use on your site.
// Best move: download these and serve from /public/images/categories/ instead.
const FALLBACK_IMAGES = {
  Premium: 'https://i.pinimg.com/736x/89/fa/e8/89fae889f67a6e996d54f0787fc5ff49.jpg',
  Western: 'https://i.pinimg.com/736x/92/14/9f/92149f0fe1afb3f1f3b74113029b47c5.jpg',
  Eastern: 'https://i.pinimg.com/1200x/b7/99/86/b79986b0cf485344dd12d2eb405853a2.jpg',
}

function CategorySection() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      setLoading(true)

      const catRes = await fetch(`${API_URL}/categories`)
      const catData = await catRes.json()
      const categoryList = catData.data || catData || []

      // ✅ Sirf Premium, Western, Eastern filter karo
      const filteredCategories = categoryList.filter(cat =>
        ['Premium', 'Western', 'Eastern'].includes(cat.category_name || cat.name)
      )

      setCategories(filteredCategories)
    } catch (error) {
      console.error('Error fetching categories:', error)
    } finally {
      setLoading(false)
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

  return (
    <section className="category-section-wrapper">
      <SectionHeading title="Shop by Category" subtitle="Explore our premium collections" />
      <div className="category-grid">
        {categories.map((category, index) => {
          const catName = category.category_name || category.name
          const imageUrl =
            category.image_url || category.image || FALLBACK_IMAGES[catName] || FALLBACK_IMAGES.Premium

          return (
            <Link
              key={category.category_id || category.id}
              to={`/shop?category=${encodeURIComponent(catName)}`}
              className="category-card-link"
              style={{ '--delay': `${index * 0.12}s` }}
            >
              <div className="category-card" data-letter={catName.charAt(0)}>
                <div
                  className="category-card-image"
                  style={{ backgroundImage: `url(${imageUrl})` }}
                />
                <div className="category-card-overlay" />
                <div className="category-card-content">
                  <span className="category-eyebrow">Collection</span>
                  <h3 className="category-name">{catName}</h3>
                  <p className="category-description">
                    Explore our collection of {catName.toLowerCase()} fragrances
                  </p>
                  <span className="category-arrow">
                    Shop Now <FaArrowRight />
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