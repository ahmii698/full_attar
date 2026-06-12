import { useState, useEffect } from 'react'
import { getTestimonials, updateTestimonial, approveTestimonial, deleteTestimonial } from '../services/adminApi'
import '../styles/Testimonials.css'

function Testimonials() {
  const [testimonials, setTestimonials] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState(null)
  const [editForm, setEditForm] = useState({
    user_name: '',
    user_location: '',
    rating: 5,
    review: ''
  })

  useEffect(() => {
    fetchTestimonials()
  }, [])

  const fetchTestimonials = async () => {
    try {
      const res = await getTestimonials()
      setTestimonials(res.data)
    } catch (error) {
      console.error('Error fetching testimonials:', error)
      setTestimonials([])
    } finally {
      setLoading(false)
    }
  }

  const toggleApprove = async (id, currentStatus) => {
    if (currentStatus === 1) {
      if (window.confirm('This testimonial will become pending. Continue?')) {
        try {
          await updateTestimonial(id, { is_approved: 0 })
          fetchTestimonials()
          alert('Testimonial moved to pending')
        } catch (error) {
          console.error('Error updating testimonial:', error)
          alert('Failed to update status')
        }
      }
    } else {
      try {
        await approveTestimonial(id)
        fetchTestimonials()
        alert('Testimonial approved successfully!')
      } catch (error) {
        console.error('Error approving testimonial:', error)
        alert('Failed to approve testimonial')
      }
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this testimonial?')) {
      try {
        await deleteTestimonial(id)
        fetchTestimonials()
      } catch (error) {
        console.error('Error deleting testimonial:', error)
        alert('Failed to delete testimonial')
      }
    }
  }

  const handleEdit = (testimonial) => {
    setEditingId(testimonial.testimonial_id)
    setEditForm({
      user_name: testimonial.user_name,
      user_location: testimonial.user_location || '',
      rating: testimonial.rating,
      review: testimonial.review
    })
  }

  const handleUpdate = async (e) => {
    e.preventDefault()
    try {
      await updateTestimonial(editingId, editForm)
      setEditingId(null)
      fetchTestimonials()
      alert('Testimonial updated successfully!')
    } catch (error) {
      console.error('Error updating testimonial:', error)
      alert('Failed to update testimonial')
    }
  }

  const renderStars = (rating) => {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating)
  }

  if (loading) return <div className="admin-loading">Loading testimonials...</div>

  return (
    <div className="testimonials-admin-page">
      <div className="admin-page-header">
        <h2>Testimonials</h2>
      </div>

      {testimonials.length === 0 ? (
        <div className="empty-state">
          <p>No testimonials found.</p>
        </div>
      ) : (
        <div className="admin-data-table-container">
          <table className="admin-data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Location</th>
                <th>Rating</th>
                <th>Review</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {testimonials.map(t => (
                <tr key={t.testimonial_id}>
                  <td>{t.testimonial_id}</td>
                  <td>{t.user_name}</td>
                  <td>{t.user_location || '-'}</td>
                  <td>
                    <span className="rating-stars">
                      {renderStars(t.rating)}
                    </span>
                  </td>
                  <td>
                    <div className="review-preview">
                      {t.review?.length > 60 ? t.review.substring(0, 60) + '...' : t.review}
                    </div>
                  </td>
                  <td>
                    <button 
                      onClick={() => toggleApprove(t.testimonial_id, t.is_approved)}
                      className={`status-btn ${t.is_approved ? 'approved' : 'pending'}`}
                    >
                      {t.is_approved ? 'Approved' : 'Pending'}
                    </button>
                  </td>
                  <td>
                    <button onClick={() => handleEdit(t)} className="edit-btn">Edit</button>
                    <button onClick={() => handleDelete(t.testimonial_id)} className="delete-btn">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Edit Modal - Without Date Field */}
      {editingId && (
        <div className="edit-modal" onClick={() => setEditingId(null)}>
          <div className="edit-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setEditingId(null)}>×</button>
            <h3>Edit Testimonial</h3>
            <form onSubmit={handleUpdate}>
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  value={editForm.user_name}
                  onChange={(e) => setEditForm({...editForm, user_name: e.target.value})}
                  className="form-control"
                  required
                />
              </div>
              <div className="form-group">
                <label>Location</label>
                <input
                  type="text"
                  value={editForm.user_location}
                  onChange={(e) => setEditForm({...editForm, user_location: e.target.value})}
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label>Rating (1-5)</label>
                <select
                  value={editForm.rating}
                  onChange={(e) => setEditForm({...editForm, rating: parseInt(e.target.value)})}
                  className="form-control"
                >
                  <option value="5">★★★★★ (5)</option>
                  <option value="4">★★★★☆ (4)</option>
                  <option value="3">★★★☆☆ (3)</option>
                  <option value="2">★★☆☆☆ (2)</option>
                  <option value="1">★☆☆☆☆ (1)</option>
                </select>
              </div>
              <div className="form-group">
                <label>Review</label>
                <textarea
                  value={editForm.review}
                  onChange={(e) => setEditForm({...editForm, review: e.target.value})}
                  className="form-control"
                  rows="4"
                  required
                />
              </div>
              <div className="form-actions">
                <button type="submit" className="save-btn">Save Changes</button>
                <button type="button" onClick={() => setEditingId(null)} className="cancel-btn">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Testimonials