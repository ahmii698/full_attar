import { useState, useEffect } from 'react'
import axios from 'axios'
import { API_URL } from '../../../config'  // ✅ IMPORT FROM CONFIG
import '../styles/FAQs.css'

function FAQs() {
  const [faqs, setFaqs] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({ question: '', answer: '', category: 'General', is_active: 1 })

  useEffect(() => {
    fetchFAQs()
  }, [])

  const fetchFAQs = async () => {
    try {
      const token = localStorage.getItem('admin_token')
      const res = await axios.get(`${API_URL}/admin/faqs`, {  // ✅ USING API_URL
        headers: { Authorization: `Bearer ${token}` }
      })
      setFaqs(res.data)
    } catch (error) {
      console.error('Error fetching FAQs:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const token = localStorage.getItem('admin_token')
    
    try {
      if (editingId) {
        await axios.put(`${API_URL}/admin/faqs/${editingId}`, formData, {  // ✅ USING API_URL
          headers: { Authorization: `Bearer ${token}` }
        })
      } else {
        await axios.post(`${API_URL}/admin/faqs`, formData, {  // ✅ USING API_URL
          headers: { Authorization: `Bearer ${token}` }
        })
      }
      setFormData({ question: '', answer: '', category: 'General', is_active: 1 })
      setEditingId(null)
      fetchFAQs()
    } catch (error) {
      console.error('Error saving FAQ:', error)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this FAQ?')) {
      const token = localStorage.getItem('admin_token')
      await axios.delete(`${API_URL}/admin/faqs/${id}`, {  // ✅ USING API_URL
        headers: { Authorization: `Bearer ${token}` }
      })
      fetchFAQs()
    }
  }

  const handleEdit = (faq) => {
    setEditingId(faq.faq_id)
    setFormData({
      question: faq.question,
      answer: faq.answer,
      category: faq.category,
      is_active: faq.is_active
    })
  }

  const toggleActive = async (faq) => {
    const token = localStorage.getItem('admin_token')
    await axios.put(`${API_URL}/admin/faqs/${faq.faq_id}`, {  // ✅ USING API_URL
      ...faq,
      is_active: !faq.is_active
    }, {
      headers: { Authorization: `Bearer ${token}` }
    })
    fetchFAQs()
  }

  if (loading) return <div className="admin-loading">Loading...</div>

  return (
    <div className="faqs-admin-page">
      <div className="admin-page-header">
        <h2>FAQ Management</h2>
      </div>

      <div className="faq-form-section">
        <h3>{editingId ? 'Edit FAQ' : 'Add New FAQ'}</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Question</label>
            <input
              type="text"
              value={formData.question}
              onChange={(e) => setFormData({...formData, question: e.target.value})}
              className="form-control"
              required
            />
          </div>
          <div className="form-group">
            <label>Answer</label>
            <textarea
              value={formData.answer}
              onChange={(e) => setFormData({...formData, answer: e.target.value})}
              className="form-control"
              rows="4"
              required
            />
          </div>
          <div className="form-group">
            <label>Category</label>
            <input
              type="text"
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
              className="form-control"
            />
          </div>
          <div className="form-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={formData.is_active === 1}
                onChange={(e) => setFormData({...formData, is_active: e.target.checked ? 1 : 0})}
              />
              Active
            </label>
          </div>
          <div className="form-actions">
            <button type="submit" className="admin-btn-primary">
              {editingId ? 'Update' : 'Add'} FAQ
            </button>
            {editingId && (
              <button type="button" className="admin-btn-secondary" onClick={() => {
                setEditingId(null)
                setFormData({ question: '', answer: '', category: 'General', is_active: 1 })
              }}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="faq-list-section">
        <h3>FAQs List</h3>
        <div className="admin-data-table-container">
          <table className="admin-data-table">
            <thead>
              <tr><th>ID</th><th>Question</th><th>Category</th><th>Status</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {faqs.map(faq => (
                <tr key={faq.faq_id}>
                  <td>{faq.faq_id}</td>
                  <td>{faq.question}</td>
                  <td>{faq.category}</td>
                  <td>
                    <button onClick={() => toggleActive(faq)} className={`status-badge ${faq.is_active ? 'active' : 'inactive'}`}>
                      {faq.is_active ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td>
                    <button onClick={() => handleEdit(faq)} className="admin-btn-warning btn-sm">Edit</button>
                    <button onClick={() => handleDelete(faq.faq_id)} className="admin-btn-danger btn-sm">Delete</button>
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

export default FAQs