import { useState, useEffect } from 'react'
import { FaStar, FaUser, FaMapMarkerAlt, FaTimes } from 'react-icons/fa'
import { API_URL } from '../../config'  // ✅ IMPORT FROM CONFIG

function TestimonialSlider() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [testimonials, setTestimonials] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [formMessage, setFormMessage] = useState('')
  
  const [formData, setFormData] = useState({
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
      setLoading(true)
      const response = await fetch(`${API_URL}/testimonials`)  // ✅ USING API_URL
      
      if (!response.ok) {
        throw new Error('Failed to fetch testimonials')
      }
      
      const data = await response.json()
      
      // ✅ FIX: Handle both boolean and number
      const approvedTestimonials = data.filter(t => t.is_approved === true || t.is_approved === 1)
      setTestimonials(approvedTestimonials)
      
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.user_name || !formData.review) {
      setFormMessage('Please fill in all required fields')
      setTimeout(() => setFormMessage(''), 3000)
      return
    }
    
    setSubmitting(true)
    setFormMessage('')
    
    try {
      const response = await fetch(`${API_URL}/testimonials`, {  // ✅ USING API_URL
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          user_name: formData.user_name,
          user_location: formData.user_location || '',
          rating: formData.rating,
          review: formData.review
        })
      })
      
      const data = await response.json()
      
      if (response.ok) {
        setFormMessage('Thank you! Your testimonial has been submitted and will appear after approval.')
        setFormData({
          user_name: '',
          user_location: '',
          rating: 5,
          review: ''
        })
        setTimeout(() => {
          setFormMessage('')
          setShowForm(false)
        }, 3000)
        fetchTestimonials()
      } else {
        setFormMessage(data.message || 'Something went wrong. Please try again.')
      }
    } catch (err) {
      setFormMessage('Network error. Please try again.')
    } finally {
      setSubmitting(false)
      setTimeout(() => setFormMessage(''), 3000)
    }
  }

  useEffect(() => {
    if (testimonials.length === 0) return
    
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length)
    }, 7000)
    
    return () => clearInterval(interval)
  }, [testimonials.length])

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length)
  }

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length)
  }

  const goToSlide = (index) => {
    setCurrentIndex(index)
  }

  if (loading) {
    return (
      <div className="testimonials-section">
        <div className="testimonial-slider">
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Loading reviews...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="testimonials-section">
        <div className="testimonial-slider">
          <div className="error-message">
            <p>⚠️ Unable to load testimonials</p>
            <button onClick={fetchTestimonials}>Try Again</button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="testimonials-section">
      <div className="testimonial-slider">
        {testimonials.length === 0 ? (
          <div className="no-testimonials">
            <p>No reviews yet. Be the first to share your experience!</p>
          </div>
        ) : (
          <>
            <div className="testimonial-slide">
              <p className="testimonial-text">"{testimonials[currentIndex]?.review}"</p>
              <div className="testimonial-rating">
                {'★'.repeat(testimonials[currentIndex]?.rating || 0)}
                {'☆'.repeat(5 - (testimonials[currentIndex]?.rating || 0))}
              </div>
              <h4 className="testimonial-name">{testimonials[currentIndex]?.user_name}</h4>
              {testimonials[currentIndex]?.user_location && (
                <p className="testimonial-location">{testimonials[currentIndex]?.user_location}</p>
              )}
            </div>
            
            {testimonials.length > 1 && (
              <>
                <button className="slider-nav prev" onClick={goToPrevious}>‹</button>
                <button className="slider-nav next" onClick={goToNext}>›</button>
                
                <div className="slider-dots">
                  {testimonials.map((_, index) => (
                    <button
                      key={index}
                      className={`slider-dot ${index === currentIndex ? 'active' : ''}`}
                      onClick={() => goToSlide(index)}
                    />
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </div>

      <div className="add-testimonial-container">
        <button className="add-testimonial-btn" onClick={() => setShowForm(true)}>
          + Add Your Testimonial
        </button>
      </div>

      {showForm && (
        <div className="testimonial-modal-overlay" onClick={() => setShowForm(false)}>
          <div className="testimonial-modal" onClick={(e) => e.stopPropagation()}>
            <div className="testimonial-modal-header">
              <h3>Share Your Experience</h3>
              <button className="modal-close" onClick={() => setShowForm(false)}>
                <FaTimes />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="testimonial-form">
              <div className="form-group">
                <label>Your Name *</label>
                <div className="input-icon">
                  <FaUser />
                  <input
                    type="text"
                    placeholder="Enter your name"
                    value={formData.user_name}
                    onChange={(e) => setFormData({ ...formData, user_name: e.target.value })}
                    required
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label>Your Location</label>
                <div className="input-icon">
                  <FaMapMarkerAlt />
                  <input
                    type="text"
                    placeholder="e.g., Karachi, Pakistan"
                    value={formData.user_location}
                    onChange={(e) => setFormData({ ...formData, user_location: e.target.value })}
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label>Rating *</label>
                <div className="rating-selector">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      className={`rating-star ${star <= formData.rating ? 'active' : ''}`}
                      onClick={() => setFormData({ ...formData, rating: star })}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="form-group">
                <label>Your Review *</label>
                <textarea
                  rows="4"
                  placeholder="Tell us about your experience with Royal Attar..."
                  value={formData.review}
                  onChange={(e) => setFormData({ ...formData, review: e.target.value })}
                  required
                />
              </div>
              
              {formMessage && (
                <div className={`form-message ${formMessage.includes('Thank you') ? 'success' : 'error'}`}>
                  {formMessage}
                </div>
              )}
              
              <button type="submit" className="submit-review-btn" disabled={submitting}>
                {submitting ? 'Submitting...' : 'Submit Review'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default TestimonialSlider