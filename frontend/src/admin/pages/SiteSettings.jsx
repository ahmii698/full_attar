import { useState, useEffect } from 'react'
import axios from 'axios'
import '../styles/SiteSettings.css'

function SiteSettings() {
  const [settings, setSettings] = useState({})
  const [socialLinks, setSocialLinks] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editedSettings, setEditedSettings] = useState({})
  const [editedSocialLinks, setEditedSocialLinks] = useState([])

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const token = localStorage.getItem('admin_token')
      const [settingsRes, socialRes] = await Promise.all([
        axios.get('http://localhost:8000/api/admin/site-settings', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get('http://localhost:8000/api/admin/social-links', {
          headers: { Authorization: `Bearer ${token}` }
        })
      ])
      const settingsObj = {}
      settingsRes.data.forEach(s => {
        settingsObj[s.setting_key] = s.setting_value
      })
      setSettings(settingsObj)
      setEditedSettings(settingsObj)
      setSocialLinks(socialRes.data)
      setEditedSocialLinks([...socialRes.data])
    } catch (error) {
      console.error('Error fetching settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSettingChange = (key, value) => {
    setEditedSettings(prev => ({ ...prev, [key]: value }))
  }

  const handleSocialLinkChange = (id, url) => {
    setEditedSocialLinks(prev => prev.map(link => 
      link.social_id === id ? { ...link, url } : link
    ))
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const token = localStorage.getItem('admin_token')
      
      // Save all settings
      for (const [key, value] of Object.entries(editedSettings)) {
        if (settings[key] !== value) {
          await axios.put(`http://localhost:8000/api/admin/site-settings/${key}`, { value }, {
            headers: { Authorization: `Bearer ${token}` }
          })
        }
      }
      
      // Save all social links
      for (const link of editedSocialLinks) {
        const originalLink = socialLinks.find(l => l.social_id === link.social_id)
        if (originalLink && originalLink.url !== link.url) {
          await axios.put(`http://localhost:8000/api/admin/social-links/${link.social_id}`, link, {
            headers: { Authorization: `Bearer ${token}` }
          })
        }
      }
      
      setSettings(editedSettings)
      setSocialLinks(editedSocialLinks)
      alert('Settings saved successfully!')
    } catch (error) {
      console.error('Error saving settings:', error)
      alert('Error saving settings')
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    setEditedSettings(settings)
    setEditedSocialLinks(socialLinks)
    alert('Changes discarded')
  }

  if (loading) return <div className="admin-loading">Loading...</div>

  return (
    <div className="site-settings-page">
      <div className="admin-page-header">
        <h2>Site Settings</h2>
      </div>

      <div className="settings-section">
        <h3>General Settings</h3>
        <div className="form-group">
          <label>Site Name</label>
          <input
            type="text"
            value={editedSettings.site_name || ''}
            onChange={(e) => handleSettingChange('site_name', e.target.value)}
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label>Contact Email</label>
          <input
            type="email"
            value={editedSettings.contact_email || ''}
            onChange={(e) => handleSettingChange('contact_email', e.target.value)}
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label>Contact Phone</label>
          <input
            type="text"
            value={editedSettings.contact_phone || ''}
            onChange={(e) => handleSettingChange('contact_phone', e.target.value)}
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label>Contact Address</label>
          <input
            type="text"
            value={editedSettings.contact_address || ''}
            onChange={(e) => handleSettingChange('contact_address', e.target.value)}
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label>Footer Copyright</label>
          <input
            type="text"
            value={editedSettings.footer_copyright || ''}
            onChange={(e) => handleSettingChange('footer_copyright', e.target.value)}
            className="form-control"
          />
        </div>
      </div>

      <div className="settings-section">
        <h3>Social Links</h3>
        {editedSocialLinks.map(link => (
          <div key={link.social_id} className="social-row">
            <div className="form-group">
              <label>{link.platform} URL</label>
              <input
                type="text"
                value={link.url}
                onChange={(e) => handleSocialLinkChange(link.social_id, e.target.value)}
                className="form-control"
              />
            </div>
          </div>
        ))}
      </div>

      <div className="form-actions">
        <button onClick={handleSave} className="save-btn" disabled={saving}>
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
        <button onClick={handleCancel} className="cancel-btn">Cancel</button>
      </div>
    </div>
  )
}

export default SiteSettings