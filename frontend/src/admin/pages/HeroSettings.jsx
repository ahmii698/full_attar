import { useState, useEffect } from 'react'
import axios from 'axios'
import '../styles/HeroSettings.css'

function HeroSettings() {
  const [hero, setHero] = useState(null)
  const [stats, setStats] = useState([])
  const [loading, setLoading] = useState(true)
  const [image, setImage] = useState(null)
  const [imagePreview, setImagePreview] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchHeroData()
  }, [])

  const fetchHeroData = async () => {
    try {
      const token = localStorage.getItem('admin_token')
      const [heroRes, statsRes] = await Promise.all([
        axios.get('http://localhost:8000/api/admin/hero-sliders', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get('http://localhost:8000/api/admin/hero-stats', {
          headers: { Authorization: `Bearer ${token}` }
        })
      ])
      setHero(heroRes.data[0] || null)
      setStats(statsRes.data)
      if (heroRes.data[0]?.image_url) {
        setImagePreview(heroRes.data[0].image_url)
      }
    } catch (error) {
      console.error('Error fetching hero data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImage(file)
      setImagePreview(URL.createObjectURL(file))
    }
  }

  const updateHero = async (data) => {
    setSaving(true)
    try {
      const token = localStorage.getItem('admin_token')
      let formData = new FormData()
      
      formData.append('badge_text', data.badge_text || '')
      formData.append('title', data.title || '')
      formData.append('subtitle', data.subtitle || '')
      formData.append('description', data.description || '')
      formData.append('button_text', data.button_text || 'Explore Collection')
      formData.append('button_link', data.button_link || '/shop')
      formData.append('is_active', data.is_active || 1)
      
      if (image) {
        formData.append('image', image)
      }
      
      // Use PUT with FormData (need to send as POST with _method)
      await axios.post(`http://localhost:8000/api/admin/hero-sliders/${hero.slider_id}?_method=PUT`, formData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      })
      
      alert('Hero updated successfully!')
      setImage(null)
      fetchHeroData()
    } catch (error) {
      console.error('Error updating hero:', error)
      alert('Error updating hero: ' + (error.response?.data?.error || error.message))
    } finally {
      setSaving(false)
    }
  }

  const updateStat = async (id, data) => {
    try {
      const token = localStorage.getItem('admin_token')
      await axios.put(`http://localhost:8000/api/admin/hero-stats/${id}`, data, {
        headers: { Authorization: `Bearer ${token}` }
      })
      fetchHeroData()
    } catch (error) {
      console.error('Error updating stat:', error)
    }
  }

  if (loading) {
    return <div className="admin-loading">Loading...</div>
  }

  return (
    <div className="hero-settings-page">
      <div className="admin-page-header">
        <h2>Hero Section Settings</h2>
      </div>

      {hero && (
        <div className="settings-form">
          <div className="form-group">
            <label>Badge Text</label>
            <input
              type="text"
              value={hero.badge_text || ''}
              onChange={(e) => setHero({...hero, badge_text: e.target.value})}
              className="form-control"
            />
          </div>
          
          <div className="form-group">
            <label>Title</label>
            <input
              type="text"
              value={hero.title || ''}
              onChange={(e) => setHero({...hero, title: e.target.value})}
              className="form-control"
            />
          </div>
          
          <div className="form-group">
            <label>Subtitle</label>
            <input
              type="text"
              value={hero.subtitle || ''}
              onChange={(e) => setHero({...hero, subtitle: e.target.value})}
              className="form-control"
            />
          </div>
          
          <div className="form-group">
            <label>Description</label>
            <textarea
              value={hero.description || ''}
              onChange={(e) => setHero({...hero, description: e.target.value})}
              className="form-control"
              rows="8"
            />
          </div>
          
          <div className="form-group">
            <label>Button Text</label>
            <input
              type="text"
              value={hero.button_text || 'Explore Collection'}
              onChange={(e) => setHero({...hero, button_text: e.target.value})}
              className="form-control"
            />
          </div>
          
          {/* Image Upload Section */}
          <div className="form-group">
            <label>Hero Image</label>
            <div className="image-upload-section">
              {imagePreview && (
                <div className="current-image">
                  <img 
                    src={imagePreview} 
                    alt="Hero Preview" 
                    className="hero-image-preview"
                  />
                  <button 
                    type="button" 
                    className="remove-image-btn"
                    onClick={() => {
                      setImagePreview('')
                      setImage(null)
                      setHero({...hero, image_url: ''})
                    }}
                  >
                    Remove Image
                  </button>
                </div>
              )}
              
              <div className="upload-area">
                <input
                  type="file"
                  id="hero-image-input"
                  onChange={handleImageChange}
                  accept="image/*"
                  className="file-input"
                />
                <label htmlFor="hero-image-input" className="upload-label">
                  <i className="fas fa-cloud-upload-alt"></i> Choose Image from Desktop
                </label>
                <small className="form-text">Recommended size: 600x600px. JPG, PNG, WEBP</small>
              </div>
            </div>
          </div>
          
          <button onClick={() => updateHero(hero)} className="admin-btn-primary" disabled={saving}>
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      )}

      <div className="stats-section">
        <h3>Hero Stats</h3>
        {stats.map((stat) => (
          <div key={stat.stat_id} className="stat-row">
            <input
              type="text"
              value={stat.stat_value}
              onChange={(e) => updateStat(stat.stat_id, {...stat, stat_value: e.target.value})}
              className="form-control stat-value"
              placeholder="Value"
            />
            <input
              type="text"
              value={stat.stat_label}
              onChange={(e) => updateStat(stat.stat_id, {...stat, stat_label: e.target.value})}
              className="form-control stat-label"
              placeholder="Label"
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export default HeroSettings