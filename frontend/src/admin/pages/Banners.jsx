import { useState, useEffect } from 'react'
import axios from 'axios'
import '../styles/Banners.css'

function Banners() {
  const [banners, setBanners] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchBanners()
  }, [])

  const fetchBanners = async () => {
    try {
      const token = localStorage.getItem('admin_token')
      const res = await axios.get('http://localhost:8000/api/admin/banners', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setBanners(res.data)
    } catch (error) {
      console.error('Error fetching banners:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateBanner = async (id, data) => {
    try {
      const token = localStorage.getItem('admin_token')
      await axios.put(`http://localhost:8000/api/admin/banners/${id}`, data, {
        headers: { Authorization: `Bearer ${token}` }
      })
      alert('Banner updated successfully!')
      fetchBanners()
    } catch (error) {
      console.error('Error updating banner:', error)
    }
  }

  if (loading) return <div className="admin-loading">Loading...</div>

  return (
    <div className="banners-page">
      <div className="admin-page-header">
        <h2>Banners</h2>
      </div>

      {banners.map(banner => (
        <div key={banner.banner_id} className="banner-card">
          <h3>{banner.title} {banner.subtitle}</h3>
          <div className="form-group">
            <label>Title</label>
            <input
              type="text"
              value={banner.title}
              onChange={(e) => updateBanner(banner.banner_id, {...banner, title: e.target.value})}
              className="form-control"
            />
          </div>
          <div className="form-group">
            <label>Subtitle</label>
            <input
              type="text"
              value={banner.subtitle}
              onChange={(e) => updateBanner(banner.banner_id, {...banner, subtitle: e.target.value})}
              className="form-control"
            />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea
              value={banner.description}
              onChange={(e) => updateBanner(banner.banner_id, {...banner, description: e.target.value})}
              className="form-control"
              rows="3"
            />
          </div>
          <div className="form-group">
            <label>Image URL</label>
            <input
              type="text"
              value={banner.image_url}
              onChange={(e) => updateBanner(banner.banner_id, {...banner, image_url: e.target.value})}
              className="form-control"
            />
          </div>
          <div className="form-group">
            <label>Position (left/right)</label>
            <select
              value={banner.position}
              onChange={(e) => updateBanner(banner.banner_id, {...banner, position: e.target.value})}
              className="form-control"
            >
              <option value="left">Left</option>
              <option value="right">Right</option>
            </select>
          </div>
        </div>
      ))}
    </div>
  )
}

export default Banners