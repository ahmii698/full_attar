import { useState } from 'react'
import './Newsletter.css'

function Newsletter() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)

  const API_BASE_URL =
    import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api'

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!email) {
      setMessage('Please enter your email address')
      setIsSuccess(false)
      setTimeout(() => setMessage(''), 3000)
      return
    }

    if (!email.includes('@') || !email.includes('.')) {
      setMessage('Please enter a valid email address')
      setIsSuccess(false)
      setTimeout(() => setMessage(''), 3000)
      return
    }

    setLoading(true)
    setMessage('')

    try {
      const response = await fetch(`${API_BASE_URL}/newsletter`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (response.ok) {
        setMessage('Successfully subscribed to newsletter!')
        setIsSuccess(true)
        setEmail('')
      } else {
        setMessage(data.message || 'Something went wrong. Please try again.')
        setIsSuccess(false)
      }
    } catch (error) {
      console.error('Error:', error)
      setMessage('Network error. Please try again.')
      setIsSuccess(false)
    } finally {
      setLoading(false)
      setTimeout(() => setMessage(''), 5000)
    }
  }

  return (
    <section className="newsletter-section">
      <div className="newsletter-container">

        <div className="newsletter-content">
          <div className="stay-updated">STAY UPDATED</div>

          <h2>Subscribe to Our Newsletter</h2>

          <p className="offer-text">
            Get updates on new arrivals, exclusive deals & special offers!
          </p>

          <p className="privacy-text">
            No spam, unsubscribe anytime. By subscribing you agree to our Privacy Policy.
          </p>
        </div>

        <div className="newsletter-right">
          <form onSubmit={handleSubmit} className="newsletter-form">
            <input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />

            <button type="submit" disabled={loading}>
              {loading ? 'Subscribing...' : 'Subscribe'}
            </button>
          </form>

          {message && (
            <div
              className={`newsletter-message ${
                isSuccess ? 'success' : 'error'
              }`}
            >
              {message}
            </div>
          )}
        </div>

      </div>
    </section>
  )
}

export default Newsletter