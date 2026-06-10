import { useState, useEffect } from 'react'
import BottleImage from './BottleImage'

function Hero() {
  const [heroData, setHeroData] = useState(null)
  const [stats, setStats] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api'
  const STORAGE_URL = import.meta.env.VITE_STORAGE_URL || 'http://127.0.0.1:8000/storage'

  useEffect(() => {
    fetchHeroData()
    fetchStats()
  }, [])

  const fetchHeroData = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/hero`)
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }
      
      const data = await response.json()
      console.log('Hero data:', data)
      
      let activeSlider = null
      
      if (Array.isArray(data)) {
        activeSlider = data.find(slider => slider.is_active === 1) || data[0]
      } else {
        activeSlider = data
      }
      
      console.log('Image URL from DB:', activeSlider?.image_url)
      setHeroData(activeSlider)
    } catch (err) {
      setError(err.message)
      console.error('Error fetching hero:', err)
    }
  }

  const fetchStats = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/hero-stats`)
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }
      
      const data = await response.json()
      console.log('Stats data:', data)
      
      if (Array.isArray(data)) {
        setStats(data)
      } else if (data && typeof data === 'object') {
        const statsArray = Object.entries(data).map(([value, label]) => ({
          stat_value: value,
          stat_label: label
        }))
        setStats(statsArray)
      } else {
        setStats([])
      }
    } catch (err) {
      console.error('Error fetching stats:', err)
      setStats([])
    } finally {
      setLoading(false)
    }
  }

  // ✅ Function to get correct image URL
  const getImageUrl = (imagePath) => {
    if (!imagePath) return null
    
    // If already has http/https, return as is
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath
    }
    
    // Remove leading slash if exists
    const cleanPath = imagePath.replace(/^\//, '')
    
    // Construct full URL
    return `${STORAGE_URL}/${cleanPath}`
  }

  // Loading state
  if (loading) {
    return (
      <div className="hero-wrapper">
        <div className="main-content">
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Loading...</p>
          </div>
        </div>
      </div>
    )
  }

  // Error state
  if (error || !heroData) {
    return (
      <div className="hero-wrapper">
        <div className="main-content">
          <div className="error-message">
            <p>⚠️ Error: {error || 'No hero data found'}</p>
            <button onClick={() => {
              setLoading(true)
              fetchHeroData()
              fetchStats()
            }}>Try Again</button>
          </div>
        </div>
      </div>
    )
  }

  const imageUrl = getImageUrl(heroData.image_url)
  console.log('Final image URL:', imageUrl)

  return (
    <div className="hero-wrapper">
      <div className="main-content">
        <div className="left-content">
          {/* Badge */}
          {heroData.badge_text && (
            <div className="badge">
              <span className="badge-dot"></span>
              <span>{heroData.badge_text}</span>
            </div>
          )}

          {/* Title */}
          <h1 className="main-title">
            {heroData.title && heroData.title.includes('\n') 
              ? heroData.title.split('\n').map((line, i) => (
                  <span key={i}>
                    {line}
                    {i < heroData.title.split('\n').length - 1 && <br />}
                  </span>
                ))
              : heroData.title || 'The Royal Essence of Pure Oud'
            }
          </h1>

          {/* Description */}
          {heroData.description && (
            <div className="description-wrapper">
              {heroData.description.split('\n').map((para, idx) => (
                <p key={idx} className="description">{para}</p>
              ))}
            </div>
          )}

          {/* Stats */}
          {stats.length > 0 && (
            <div className="stats">
              {stats.map((stat, index) => (
                <div key={index} className="stat">
                  <h3>{stat.stat_value}</h3>
                  <p>{stat.stat_label}</p>
                </div>
              ))}
            </div>
          )}

          {/* Button */}
          <div className="button-group">
            <button 
              className="explore-btn"
              onClick={() => {
                if (heroData.button_link) {
                  window.location.href = heroData.button_link
                }
              }}
            >
              {heroData.button_text || 'Explore Collection'} <span>→</span>
            </button>
          </div>
        </div>

        <div className="right-content">
          <div className="bottle-wrapper">
            {/* ✅ Show image if exists, otherwise show BottleImage component */}
            {imageUrl ? (
              <img 
                src={imageUrl} 
                alt={heroData.title || 'Hero Image'}
                className="hero-image"
                onError={(e) => {
                  console.error('Image failed to load:', imageUrl)
                  e.target.style.display = 'none'
                  // Show fallback
                  e.target.nextSibling.style.display = 'flex'
                }}
                onLoad={() => console.log('Image loaded successfully:', imageUrl)}
              />
            ) : null}
            
            {/* Fallback component when no image or image fails */}
            <div style={{ display: imageUrl ? 'none' : 'flex' }}>
              <BottleImage />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Hero