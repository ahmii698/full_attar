import { useState, useEffect } from 'react'
import axios from 'axios'
import '../styles/Banners.css'

function Banners() {
  const [banners, setBanners] = useState([])
  const [loading, setLoading] = useState(true)
  const [editedBanners, setEditedBanners] = useState({})
  const [saving, setSaving] = useState(false)
  const [imageFiles, setImageFiles] = useState({})

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
      // Initialize edited banners
      const initialEdits = {}
      res.data.forEach(banner => {
        initialEdits[banner.banner_id] = { ...banner }
      })
      setEditedBanners(initialEdits)
    } catch (error) {
      console.error('Error fetching banners:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFieldChange = (bannerId, field, value) => {
    setEditedBanners(prev => ({
      ...prev,
      [bannerId]: {
        ...prev[bannerId],
        [field]: value
      }
    }))
  }

  const handleImageChange = (bannerId, file) => {
    if (file) {
      setImageFiles(prev => ({ ...prev, [bannerId]: file }))
      // Preview update
      setEditedBanners(prev => ({
        ...prev,
        [bannerId]: {
          ...prev[bannerId],
          image_preview: URL.createObjectURL(file)
        }
      }))
    }
  }

  const handleRemoveImage = (bannerId) => {
    setImageFiles(prev => {
      const newState = { ...prev }
      delete newState[bannerId]
      return newState
    })
    setEditedBanners(prev => ({
      ...prev,
      [bannerId]: {
        ...prev[bannerId],
        image_url: '',
        image_preview: null
      }
    }))
  }

  const handleSave = async (bannerId) => {
    setSaving(true)
    try {
      const token = localStorage.getItem('admin_token')
      const bannerData = editedBanners[bannerId]
      const imageFile = imageFiles[bannerId]
      
      let formData = new FormData()
      formData.append('title', bannerData.title || '')
      formData.append('subtitle', bannerData.subtitle || '')
      formData.append('description', bannerData.description || '')
      formData.append('position', bannerData.position || 'left')
      formData.append('button_text', bannerData.button_text || 'View All')
      formData.append('button_link', bannerData.button_link || '/shop')
      formData.append('is_active', bannerData.is_active !== undefined ? bannerData.is_active : 1)
      
      if (imageFile) {
        formData.append('image', imageFile)
      } else if (bannerData.image_url) {
        formData.append('image_url', bannerData.image_url)
      }
      
      await axios.post(`http://localhost:8000/api/admin/banners/${bannerId}?_method=PUT`, formData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      })
      
      alert('Banner updated successfully!')
      setImageFiles(prev => {
        const newState = { ...prev }
        delete newState[bannerId]
        return newState
      })
      fetchBanners()
    } catch (error) {
      console.error('Error updating banner:', error)
      alert('Error updating banner: ' + (error.response?.data?.error || error.message))
    } finally {
      setSaving(false)
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
          <h3>{editedBanners[banner.banner_id]?.title} {editedBanners[banner.banner_id]?.subtitle}</h3>
          
          <div className="form-group">
            <label>Title</label>
            <input
              type="text"
              value={editedBanners[banner.banner_id]?.title || ''}
              onChange={(e) => handleFieldChange(banner.banner_id, 'title', e.target.value)}
              className="form-control"
            />
          </div>
          
          <div className="form-group">
            <label>Subtitle</label>
            <input
              type="text"
              value={editedBanners[banner.banner_id]?.subtitle || ''}
              onChange={(e) => handleFieldChange(banner.banner_id, 'subtitle', e.target.value)}
              className="form-control"
            />
          </div>
          
          <div className="form-group">
            <label>Description</label>
            <textarea
              value={editedBanners[banner.banner_id]?.description || ''}
              onChange={(e) => handleFieldChange(banner.banner_id, 'description', e.target.value)}
              className="form-control"
              rows="3"
            />
          </div>
          
          {/* Image Upload Section */}
          <div className="form-group">
            <label>Banner Image</label>
            <div className="image-upload-section">
              {(editedBanners[banner.banner_id]?.image_preview || editedBanners[banner.banner_id]?.image_url) && (
                <div className="current-image">
                  <img 
                    src={editedBanners[banner.banner_id]?.image_preview || editedBanners[banner.banner_id]?.image_url} 
                    alt="Banner Preview" 
                    className="banner-image-preview"
                  />
                  <button 
                    type="button" 
                    className="remove-image-btn"
                    onClick={() => handleRemoveImage(banner.banner_id)}
                  >
                    Remove Image
                  </button>
                </div>
              )}
              
              <div className="upload-area">
                <input
                  type="file"
                  id={`banner-image-${banner.banner_id}`}
                  onChange={(e) => handleImageChange(banner.banner_id, e.target.files[0])}
                  accept="image/*"
                  className="file-input"
                />
                <label htmlFor={`banner-image-${banner.banner_id}`} className="upload-label">
                  <i className="fas fa-cloud-upload-alt"></i> Choose Image from Desktop
                </label>
                <small className="form-text">Recommended size: 1920x600px. JPG, PNG, WEBP</small>
              </div>
            </div>
          </div>
          
          <div className="form-group">
            <label>Position (left/right)</label>
            <select
              value={editedBanners[banner.banner_id]?.position || 'left'}
              onChange={(e) => handleFieldChange(banner.banner_id, 'position', e.target.value)}
              className="form-control"
            >
              <option value="left">Left</option>
              <option value="right">Right</option>
            </select>
          </div>
          
          <div className="form-actions">
            <button 
              onClick={() => handleSave(banner.banner_id)} 
              className="save-btn"
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default Banners