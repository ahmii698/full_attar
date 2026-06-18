import { useState, useEffect } from 'react'
import BottleImage from './BottleImage'

function Hero() {
  const [heroData, setHeroData] = useState(null)
  const [stats, setStats] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api'
  const APP_URL = 'http://127.0.0.1:8000'

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
      
      let activeSlider = null
      
      if (Array.isArray(data)) {
        activeSlider = data.find(slider => slider.is_active === 1) || data[0]
      } else {
        activeSlider = data
      }
      
      setHeroData(activeSlider)
    } catch (err) {
      setError(err.message)
    }
  }

  const fetchStats = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/hero-stats`)
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }
      
      const data = await response.json()
      
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
      setStats([])
    } finally {
      setLoading(false)
    }
  }

  const getImageUrl = (imagePath) => {
    if (!imagePath) return null
    
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath
    }
    
    if (imagePath.startsWith('/images/')) {
      return `${APP_URL}${imagePath}`
    }
    
    if (imagePath.startsWith('/storage/')) {
      return `${APP_URL}${imagePath}`
    }
    
    const cleanPath = imagePath.replace(/^\//, '')
    return `${APP_URL}/${cleanPath}`
  }

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

  return (
    // ✅ Sirf marginTop -25px kiya hai gap hataane ke liye, baaki sab original
    <div className="hero-wrapper" style={{ marginTop: '-25px', paddingTop: '0' }}>
      <div className="main-content" style={{ paddingTop: '0', paddingBottom: '0' }}>
        <div className="left-content">
          {heroData.badge_text && (
            <div className="badge">
              <span className="badge-dot"></span>
              <span>{heroData.badge_text}</span>
            </div>
          )}

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

          {heroData.description && (
            <div className="description-wrapper">
              {heroData.description.split('\n').map((para, idx) => (
                <p key={idx} className="description">{para}</p>
              ))}
            </div>
          )}

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
            {imageUrl ? (
              <img 
                src={imageUrl} 
                alt={heroData.title || 'Hero Image'}
                className="bottle-img"
                onError={(e) => {
                  console.error('Image failed:', imageUrl)
                  e.target.style.display = 'none'
                  if (e.target.nextSibling) {
                    e.target.nextSibling.style.display = 'flex'
                  }
                }}
              />
            ) : null}
            
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