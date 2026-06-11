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
  const [savingStats, setSavingStats] = useState(false)

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

  // ✅ FIXED: Update stat in local state first, then save all at once
  const handleStatChange = (index, field, value) => {
    const newStats = [...stats]
    newStats[index][field] = value
    setStats(newStats)
  }

  // ✅ Save all stats at once
  const saveAllStats = async () => {
    setSavingStats(true)
    try {
      const token = localStorage.getItem('admin_token')
      
      for (let i = 0; i < stats.length; i++) {
        const stat = stats[i]
        await axios.put(`http://localhost:8000/api/admin/hero-stats/${stat.stat_id}`, {
          stat_value: stat.stat_value,
          stat_label: stat.stat_label,
          display_order: stat.display_order || i + 1,
          is_active: stat.is_active !== undefined ? stat.is_active : 1
        }, {
          headers: { Authorization: `Bearer ${token}` }
        })
      }
      
      alert('Stats saved successfully!')
      fetchHeroData()
    } catch (error) {
      console.error('Error saving stats:', error)
      alert('Error saving stats')
    } finally {
      setSavingStats(false)
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
                  📁 Choose Image from Desktop
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

      {/* ✅ FIXED: Stats Section - Local state update then save all */}
      <div className="stats-section">
        <h3>Hero Stats</h3>
        <p>Edit the statistics displayed on the hero section</p>
        
        <div className="stats-list">
          {stats.map((stat, index) => (
            <div key={stat.stat_id} className="stat-row">
              <div className="stat-value-wrapper">
                <label>Stat Value</label>
                <input
                  type="text"
                  value={stat.stat_value || ''}
                  onChange={(e) => handleStatChange(index, 'stat_value', e.target.value)}
                  className="form-control"
                  placeholder="e.g., 100%"
                />
              </div>
              <div className="stat-label-wrapper">
                <label>Stat Label</label>
                <input
                  type="text"
                  value={stat.stat_label || ''}
                  onChange={(e) => handleStatChange(index, 'stat_label', e.target.value)}
                  className="form-control"
                  placeholder="e.g., Natural Ingredients"
                />
              </div>
            </div>
          ))}
        </div>
        
        <button 
          onClick={saveAllStats} 
          className="admin-btn-primary save-stats-btn" 
          disabled={savingStats}
        >
          {savingStats ? 'Saving...' : 'Save All Stats'}
        </button>
      </div>
    </div>
  )
}

export default HeroSettings