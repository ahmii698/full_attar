import { useState, useEffect } from 'react'
import axios from 'axios'
import '../styles/Outlets.css'

function Outlets() {
  const [outlets, setOutlets] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    address: '',
    timings: '11:00 AM - 11:00 PM',
    phone: '',
    map_url: '',
    features: [],
    is_active: 1
  })
  const [featureInput, setFeatureInput] = useState('')

  useEffect(() => {
    fetchOutlets()
  }, [])

  const fetchOutlets = async () => {
    try {
      const token = localStorage.getItem('admin_token')
      const res = await axios.get('http://localhost:8000/api/admin/outlets', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setOutlets(res.data)
    } catch (error) {
      console.error('Error fetching outlets:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const token = localStorage.getItem('admin_token')
    
    try {
      if (editingId) {
        await axios.put(`http://localhost:8000/api/admin/outlets/${editingId}`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        })
      } else {
        await axios.post('http://localhost:8000/api/admin/outlets', formData, {
          headers: { Authorization: `Bearer ${token}` }
        })
      }
      setFormData({ name: '', location: '', address: '', timings: '11:00 AM - 11:00 PM', phone: '', map_url: '', features: [], is_active: 1 })
      setEditingId(null)
      setFeatureInput('')
      fetchOutlets()
    } catch (error) {
      console.error('Error saving outlet:', error)
      alert('Error saving outlet')
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this outlet?')) {
      const token = localStorage.getItem('admin_token')
      await axios.delete(`http://localhost:8000/api/admin/outlets/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      fetchOutlets()
    }
  }

  const handleEdit = (outlet) => {
    setEditingId(outlet.outlet_id)
    setFormData({
      name: outlet.name,
      location: outlet.location,
      address: outlet.address,
      timings: outlet.timings,
      phone: outlet.phone,
      map_url: outlet.map_url,
      features: outlet.features || [],
      is_active: outlet.is_active
    })
  }

  const addFeature = () => {
    if (featureInput.trim()) {
      setFormData({
        ...formData,
        features: [...formData.features, featureInput.trim()]
      })
      setFeatureInput('')
    }
  }

  const removeFeature = (index) => {
    setFormData({
      ...formData,
      features: formData.features.filter((_, i) => i !== index)
    })
  }

  if (loading) return <div className="admin-loading">Loading...</div>

  return (
    <div className="outlets-admin-page">
      <div className="admin-page-header">
        <h2>Outlet Management</h2>
      </div>

      <div className="outlet-form-section">
        <h3>{editingId ? 'Edit Outlet' : 'Add New Outlet'}</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label>Outlet Name *</label>
              <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="form-control" required />
            </div>
            <div className="form-group">
              <label>Location *</label>
              <input type="text" value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} className="form-control" required />
            </div>
            <div className="form-group">
              <label>Address *</label>
              <input type="text" value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} className="form-control" required />
            </div>
            <div className="form-group">
              <label>Timings</label>
              <input type="text" value={formData.timings} onChange={(e) => setFormData({...formData, timings: e.target.value})} className="form-control" />
            </div>
            <div className="form-group">
              <label>Phone *</label>
              <input type="text" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="form-control" required />
            </div>
            <div className="form-group">
              <label>Google Maps Embed URL</label>
              <input type="text" value={formData.map_url} onChange={(e) => setFormData({...formData, map_url: e.target.value})} className="form-control" placeholder="https://www.google.com/maps/embed?pb=..." />
            </div>
            <div className="form-group">
              <label>Features</label>
              <div className="feature-input-group">
                <input type="text" value={featureInput} onChange={(e) => setFeatureInput(e.target.value)} className="form-control" placeholder="e.g., Premium Collection" />
                <button type="button" onClick={addFeature} className="btn-sm">Add</button>
              </div>
              <div className="features-list">
                {formData.features.map((feature, idx) => (
                  <span key={idx} className="feature-badge">
                    {feature}
                    <button type="button" onClick={() => removeFeature(idx)}>×</button>
                  </span>
                ))}
              </div>
            </div>
            <div className="form-group checkbox-group">
              <label className="checkbox-label">
                <input type="checkbox" checked={formData.is_active === 1} onChange={(e) => setFormData({...formData, is_active: e.target.checked ? 1 : 0})} />
                Active
              </label>
            </div>
          </div>
          <div className="form-actions">
            <button type="submit" className="admin-btn-primary">{editingId ? 'Update' : 'Add'} Outlet</button>
            {editingId && (
              <button type="button" className="admin-btn-secondary" onClick={() => {
                setEditingId(null)
                setFormData({ name: '', location: '', address: '', timings: '11:00 AM - 11:00 PM', phone: '', map_url: '', features: [], is_active: 1 })
                setFeatureInput('')
              }}>Cancel</button>
            )}
          </div>
        </form>
      </div>

      <div className="outlet-list-section">
        <h3>Outlets List</h3>
        <div className="admin-data-table-container">
          <table className="admin-data-table">
            <thead>
              <tr><th>ID</th><th>Name</th><th>Location</th><th>Phone</th><th>Status</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {outlets.map(outlet => (
                <tr key={outlet.outlet_id}>
                  <td>{outlet.outlet_id}</td>
                  <td>{outlet.name}</td>
                  <td>{outlet.location}</td>
                  <td>{outlet.phone}</td>
                  <td><span className={`status-badge ${outlet.is_active ? 'active' : 'inactive'}`}>{outlet.is_active ? 'Active' : 'Inactive'}</span></td>
                  <td>
                    <button onClick={() => handleEdit(outlet)} className="admin-btn-warning btn-sm">Edit</button>
                    <button onClick={() => handleDelete(outlet.outlet_id)} className="admin-btn-danger btn-sm">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Outlets