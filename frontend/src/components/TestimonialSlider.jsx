import { useState, useEffect } from 'react'

function TestimonialSlider() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [testimonials, setTestimonials] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api'

  useEffect(() => {
    fetchTestimonials()
  }, [])

  const fetchTestimonials = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${API_BASE_URL}/testimonials`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch testimonials')
      }
      
      const data = await response.json()
      console.log('Testimonials:', data)
      
      // Filter only approved testimonials (is_approved = 1)
      const approvedTestimonials = data.filter(t => t.is_approved === 1)
      setTestimonials(approvedTestimonials)
      
    } catch (err) {
      setError(err.message)
      console.error('Error fetching testimonials:', err)
    } finally {
      setLoading(false)
    }
  }

  // Auto-slide effect
  useEffect(() => {
    if (testimonials.length === 0) return
    
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length)
    }, 7000) // 7 seconds
    
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

  // Loading state
  if (loading) {
    return (
      <div className="testimonial-slider">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading reviews...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="testimonial-slider">
        <div className="error-message">
          <p>⚠️ Unable to load testimonials</p>
          <button onClick={fetchTestimonials}>Try Again</button>
        </div>
      </div>
    )
  }

  // No testimonials
  if (testimonials.length === 0) {
    return (
      <div className="testimonial-slider">
        <div className="no-testimonials">
          <p>No reviews yet. Be the first to share your experience!</p>
        </div>
      </div>
    )
  }

  const currentTestimonial = testimonials[currentIndex]

  return (
    <div className="testimonial-slider">
      <div className="testimonial-slide">
        <p className="testimonial-text">{currentTestimonial.review}</p>
        <div className="testimonial-rating">
          {'★'.repeat(currentTestimonial.rating)}
          {'☆'.repeat(5 - currentTestimonial.rating)}
        </div>
        <h4 className="testimonial-name">{currentTestimonial.user_name}</h4>
        <p className="testimonial-location">{currentTestimonial.user_location}</p>
        {currentTestimonial.date && (
          <p className="testimonial-date">{currentTestimonial.date}</p>
        )}
      </div>
      
      {/* Navigation Buttons */}
      {testimonials.length > 1 && (
        <>
          <button className="slider-nav prev" onClick={goToPrevious}>‹</button>
          <button className="slider-nav next" onClick={goToNext}>›</button>
          
          {/* Dots Indicator */}
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
    </div>
  )
}

export default TestimonialSlider