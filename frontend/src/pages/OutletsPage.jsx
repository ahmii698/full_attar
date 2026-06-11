import { useState, useEffect } from 'react'
import { FaStore, FaClock, FaPhone, FaMapMarkerAlt, FaDirections, FaStar } from 'react-icons/fa'

function OutletsPage() {
  const [selectedOutlet, setSelectedOutlet] = useState(null)
  const [outlets, setOutlets] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api'

  useEffect(() => {
    fetchOutlets()
  }, [])

  const fetchOutlets = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${API_BASE_URL}/outlets`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch outlets')
      }
      
      const data = await response.json()
      setOutlets(data)
      if (data.length > 0) {
        setSelectedOutlet(data[0].outlet_id)
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const parseFeatures = (features) => {
    if (!features) return []
    if (Array.isArray(features)) return features
    try {
      return JSON.parse(features)
    } catch (e) {
      return []
    }
  }

  const handleGetDirections = (address) => {
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`, '_blank')
  }

  const currentOutlet = outlets.find(o => o.outlet_id === selectedOutlet) || outlets[0]

  if (loading) {
    return (
      <div className="outlets-page">
        <div className="outlets-hero">
          <div className="outlets-hero-content">
            <h1>Our Outlets</h1>
            <p>Loading stores...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="outlets-page">
        <div className="outlets-hero">
          <div className="outlets-hero-content">
            <h1>Our Outlets</h1>
            <p>Error loading stores. Please try again later.</p>
          </div>
        </div>
      </div>
    )
  }

  if (outlets.length === 0) {
    return (
      <div className="outlets-page">
        <div className="outlets-hero">
          <div className="outlets-hero-content">
            <h1>Our Outlets</h1>
            <p>No stores found at the moment.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="outlets-page">
      <div className="outlets-hero">
        <div className="outlets-hero-content">
          <h1>Our Outlets</h1>
          <p>Visit our stores across Pakistan for an exclusive fragrance experience</p>
        </div>
      </div>
      
      <div className="outlets-container">
        <div className="outlets-grid">
          {outlets.map(outlet => (
            <div 
              key={outlet.outlet_id} 
              className={`outlet-card ${selectedOutlet === outlet.outlet_id ? 'selected' : ''}`} 
              onClick={() => setSelectedOutlet(outlet.outlet_id)}
            >
              <div className="outlet-card-header">
                <div className="outlet-icon">
                  <FaStore />
                </div>
                <h3>{outlet.name}</h3>
              </div>
              <div className="outlet-details">
                <p><FaMapMarkerAlt /> {outlet.location}</p>
                <p><FaClock /> {outlet.timings}</p>
                <p><FaPhone /> {outlet.phone}</p>
              </div>
              <div className="outlet-features">
                {parseFeatures(outlet.features).map((feature, idx) => (
                  <span key={idx} className="feature-tag">{feature}</span>
                ))}
              </div>
              <button className="outlet-btn" onClick={(e) => { e.stopPropagation(); handleGetDirections(outlet.address) }}>
                <FaDirections /> Get Directions
              </button>
            </div>
          ))}
        </div>
      </div>
      
      <div className="outlets-map-section">
        <h3>📍 {currentOutlet?.name}</h3>
        <p>Click on any outlet card to view location on map</p>
        <div className="outlets-map-container">
          <iframe 
            src={currentOutlet?.map_url}
            width="100%" 
            height="400" 
            style={{ border: 0, borderRadius: '20px' }}
            allowFullScreen=""
            loading="lazy"
            title="Outlet Location"
          ></iframe>
        </div>
        <div className="map-note">
          <FaStar /> All outlets are open 7 days a week • {currentOutlet?.timings}
        </div>
      </div>
    </div>
  )
}

export default OutletsPage