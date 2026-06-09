import { useState, useEffect } from 'react'
import axios from 'axios'

function HeroSettings() {
  const [hero, setHero] = useState(null)
  const [stats, setStats] = useState([])
  const [loading, setLoading] = useState(true)

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
    } catch (error) {
      console.error('Error fetching hero data:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateHero = async (data) => {
    try {
      const token = localStorage.getItem('admin_token')
      await axios.put(`http://localhost:8000/api/admin/hero-sliders/${hero.slider_id}`, data, {
        headers: { Authorization: `Bearer ${token}` }
      })
      alert('Hero updated successfully!')
    } catch (error) {
      console.error('Error updating hero:', error)
      alert('Error updating hero')
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
          <div className="form-group">
            <label>Image URL</label>
            <input
              type="text"
              value={hero.image_url || ''}
              onChange={(e) => setHero({...hero, image_url: e.target.value})}
              className="form-control"
            />
          </div>
          <button onClick={() => updateHero(hero)} className="admin-btn-primary">Save Changes</button>
        </div>
      )}

      <div className="stats-section" style={{marginTop: '40px'}}>
        <h3>Hero Stats</h3>
        {stats.map((stat) => (
          <div key={stat.stat_id} className="stat-row" style={{display: 'flex', gap: '10px', marginBottom: '10px'}}>
            <input
              type="text"
              value={stat.stat_value}
              onChange={(e) => updateStat(stat.stat_id, {...stat, stat_value: e.target.value})}
              className="form-control"
              style={{width: '100px'}}
            />
            <input
              type="text"
              value={stat.stat_label}
              onChange={(e) => updateStat(stat.stat_id, {...stat, stat_label: e.target.value})}
              className="form-control"
              style={{flex: 1}}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export default HeroSettings