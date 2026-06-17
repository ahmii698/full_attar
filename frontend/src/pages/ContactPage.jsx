import { useState } from 'react'

function ContactMapSection() {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    query_date: '',
    message: ''
  })

  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api'

  const handleChange = (e) => {
    const { name, value } = e.target
    
    // ✅ Phone number - only numbers allowed
    if (name === 'phone') {
      const numbersOnly = value.replace(/\D/g, '')
      setFormData({
        ...formData,
        [name]: numbersOnly
      })
      return
    }
    
    setFormData({
      ...formData,
      [name]: value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validation
    if (!formData.full_name) {
      setMessage('Please enter your full name')
      setIsSuccess(false)
      setTimeout(() => setMessage(''), 3000)
      return
    }
    
    if (!formData.email || !formData.email.includes('@')) {
      setMessage('Please enter a valid email address')
      setIsSuccess(false)
      setTimeout(() => setMessage(''), 3000)
      return
    }
    
    if (!formData.phone || formData.phone.length < 10) {
      setMessage('Please enter a valid phone number (min 10 digits)')
      setIsSuccess(false)
      setTimeout(() => setMessage(''), 3000)
      return
    }
    
    if (!formData.query_date) {
      setMessage('Please select a date')
      setIsSuccess(false)
      setTimeout(() => setMessage(''), 3000)
      return
    }
    
    setLoading(true)
    setMessage('')
    
    try {
      console.log('📤 Sending data:', formData)
      
      const response = await fetch(`${API_BASE_URL}/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })
      
      console.log('📥 Response status:', response.status)
      
      let data
      try {
        data = await response.json()
      } catch (parseError) {
        console.error('❌ Parse error:', parseError)
        setMessage('Server error. Please try again.')
        setIsSuccess(false)
        setLoading(false)
        return
      }
      
      console.log('📥 Response data:', data)
      
      if (response.ok && data.success) {
        setMessage('Your message has been sent successfully! We will get back to you soon.')
        setIsSuccess(true)
        setFormData({
          full_name: '',
          email: '',
          phone: '',
          query_date: '',
          message: ''
        })
      } else {
        setMessage(data.message || data.error || 'Something went wrong. Please try again.')
        setIsSuccess(false)
      }
    } catch (error) {
      console.error('❌ Network error:', error)
      setMessage('Network error. Please check your connection and try again.')
      setIsSuccess(false)
    } finally {
      setLoading(false)
      setTimeout(() => setMessage(''), 5000)
    }
  }

  return (
    <div className="contact-map-section">
      <div className="contact-map-container">
        {/* Left Side - Map */}
        <div className="map-side">
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d28958.64141174819!2d67.0011!3d24.8607!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3eb33e0666e6e6e7%3A0x1234567890abcdef!2sDolmen%20Mall%20Clifton!5e0!3m2!1sen!2s!4v1700000000000!5m2!1sen!2s" 
            width="100%" 
            height="100%" 
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Royal Attar Location - Karachi"
          ></iframe>
        </div>
        
        {/* Right Side - Contact Form */}
        <div className="form-side">
          <h3>Any Queries</h3>
          <p>Fill in your details and we'll get back to you</p>
          
          <form onSubmit={handleSubmit} className="contact-form-appointment">
            <div className="form-group">
              <label>Full Name *</label>
              <input 
                type="text" 
                name="full_name"
                placeholder="Enter your full name" 
                value={formData.full_name}
                onChange={handleChange}
                disabled={loading}
                required
              />
            </div>
            
            <div className="form-group">
              <label>Email Address *</label>
              <input 
                type="email" 
                name="email"
                placeholder="your@email.com" 
                value={formData.email}
                onChange={handleChange}
                disabled={loading}
                required
              />
            </div>
            
            <div className="form-row-2col">
              <div className="form-group">
                <label>Phone *</label>
                <input 
                  type="tel" 
                  name="phone"
                  placeholder="03XXXXXXXXX" 
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={loading}
                  required
                  maxLength="15"
                />
              </div>
              <div className="form-group">
                <label>Date *</label>
                <input 
                  type="date" 
                  name="query_date"
                  value={formData.query_date}
                  onChange={handleChange}
                  disabled={loading}
                  required
                />
              </div>
            </div>
           
            <div className="form-group">
              <label>Message (Optional)</label>
              <textarea 
                name="message"
                rows="3" 
                placeholder="Tell us what you'd like to discuss..."
                value={formData.message}
                onChange={handleChange}
                disabled={loading}
              ></textarea>
            </div>
            
            <button type="submit" className="book-appointment-btn" disabled={loading}>
              {loading ? 'Sending...' : 'Submit →'}
            </button>
          </form>
          
          {message && (
            <div className={`contact-message ${isSuccess ? 'success' : 'error'}`}>
              {message}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ContactMapSection