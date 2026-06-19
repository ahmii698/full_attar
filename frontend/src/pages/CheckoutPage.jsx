import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useCart } from '../contexts/CartContext'
import { useAuth } from '../contexts/AuthContext'
import './CheckoutPage.css'

function CheckoutPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { cartItems, getCartTotal, getCartCount, clearCart } = useCart()
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zipcode: '',
    notes: '',
    payment_method: 'bank_transfer'
  })

  const subtotal = getCartTotal()
  const shipping = 200
  const total = subtotal + shipping

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        full_name: user.name || '',
        email: user.email || '',
        phone: user.phone || ''
      }))
    }
  }, [user])

  useEffect(() => {
    if (cartItems.length === 0 && !loading) {
      navigate('/cart')
    }
  }, [cartItems, navigate, loading])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    const orderData = {
      full_name: formData.full_name,
      email: formData.email,
      phone: formData.phone,
      street_address: formData.address,
      city: formData.city,
      zipcode: formData.zipcode,
      notes: formData.notes,
      payment_method: formData.payment_method,
      shipping_amount: shipping,
      items: cartItems.map(item => ({
        product_id: item.id,
        product_name: item.name,
        quantity: item.quantity,
        ml: item.ml || 50,
        price: item.priceNum || 0
      }))
    }

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api'
      const token = localStorage.getItem('token')

      const response = await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : ''
        },
        body: JSON.stringify(orderData)
      })

      const data = await response.json()

      if (response.ok && data.success) {
        const orderDataToPass = {
          orderId: data.data.order.order_id,
          orderNumber: data.data.order_number,
          total: data.data.grand_total,
          subtotal: data.data.subtotal,
          shipping: data.data.shipping,
          full_name: formData.full_name,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          payment_method: formData.payment_method
        }

        navigate(`/payment/${data.data.order.order_id}`, {
          state: orderDataToPass
        })

        setTimeout(() => {
          clearCart()
        }, 100)

      } else {
        alert(data.error || data.message || 'Failed to create order. Please try again.')
        setLoading(false)
      }
    } catch (error) {
      console.error('Error creating order:', error)
      alert('Network error. Please check your connection and try again.')
      setLoading(false)
    }
  }

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        <Link to="/cart" className="back-to-cart">← Back to Cart</Link>

        <div className="checkout-grid">
          <div className="billing-form">

            <div className="form-header">
              <h2>Billing Details</h2>
              <p>Fill in your information to complete the order</p>
            </div>

            <form onSubmit={handleSubmit}>
              {/* Full Name */}
              <div className="form-group" style={{ marginBottom: '38px' }}>
                <label style={{ display: 'block', marginBottom: '10px', color: 'rgba(255,255,255,0.6)', fontSize: '15px', fontWeight: '600' }}>
                  Full Name <span style={{ color: '#d4af37', fontSize: '13px' }}>*</span>
                </label>
                <input
                  type="text"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                  required
                  placeholder="Ahmed"
                  style={{
                    width: '100%',
                    padding: '14px 18px',
                    background: 'rgba(255,255,255,0.03)',
                    border: '1.5px solid rgba(255,255,255,0.06)',
                    borderRadius: '10px',
                    color: '#ffffff',
                    fontSize: '15px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              {/* Email Address */}
              <div className="form-group" style={{ marginBottom: '38px' }}>
                <label style={{ display: 'block', marginBottom: '10px', color: 'rgba(255,255,255,0.6)', fontSize: '15px', fontWeight: '600' }}>
                  Email Address <span style={{ color: '#d4af37', fontSize: '13px' }}>*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="you@example.com"
                  style={{
                    width: '100%',
                    padding: '14px 18px',
                    background: 'rgba(255,255,255,0.03)',
                    border: '1.5px solid rgba(255,255,255,0.06)',
                    borderRadius: '10px',
                    color: '#ffffff',
                    fontSize: '15px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              {/* Phone Number */}
              <div className="form-group" style={{ marginBottom: '38px' }}>
                <label style={{ display: 'block', marginBottom: '10px', color: 'rgba(255,255,255,0.6)', fontSize: '15px', fontWeight: '600' }}>
                  Phone Number <span style={{ color: '#d4af37', fontSize: '13px' }}>*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  placeholder="03XX-XXXXXXX"
                  style={{
                    width: '100%',
                    padding: '14px 18px',
                    background: 'rgba(255,255,255,0.03)',
                    border: '1.5px solid rgba(255,255,255,0.06)',
                    borderRadius: '10px',
                    color: '#ffffff',
                    fontSize: '15px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              {/* Street Address */}
              <div className="form-group" style={{ marginBottom: '38px' }}>
                <label style={{ display: 'block', marginBottom: '10px', color: 'rgba(255,255,255,0.6)', fontSize: '15px', fontWeight: '600' }}>
                  Street Address <span style={{ color: '#d4af37', fontSize: '13px' }}>*</span>
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  placeholder="House #, Street, Area"
                  style={{
                    width: '100%',
                    padding: '14px 18px',
                    background: 'rgba(255,255,255,0.03)',
                    border: '1.5px solid rgba(255,255,255,0.06)',
                    borderRadius: '10px',
                    color: '#ffffff',
                    fontSize: '15px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              {/* City and Zipcode Row */}
              <div className="form-row-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '22px', marginBottom: '0' }}>
                <div className="form-group" style={{ marginBottom: '38px' }}>
                  <label style={{ display: 'block', marginBottom: '10px', color: 'rgba(255,255,255,0.6)', fontSize: '15px', fontWeight: '600' }}>
                    City <span style={{ color: '#d4af37', fontSize: '13px' }}>*</span>
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                    placeholder="Karachi"
                    style={{
                      width: '100%',
                      padding: '14px 18px',
                      background: 'rgba(255,255,255,0.03)',
                      border: '1.5px solid rgba(255,255,255,0.06)',
                      borderRadius: '10px',
                      color: '#ffffff',
                      fontSize: '15px',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
                <div className="form-group" style={{ marginBottom: '38px' }}>
                  <label style={{ display: 'block', marginBottom: '10px', color: 'rgba(255,255,255,0.6)', fontSize: '15px', fontWeight: '600' }}>
                    Zipcode
                  </label>
                  <input
                    type="text"
                    name="zipcode"
                    value={formData.zipcode}
                    onChange={handleChange}
                    placeholder="75500"
                    style={{
                      width: '100%',
                      padding: '14px 18px',
                      background: 'rgba(255,255,255,0.03)',
                      border: '1.5px solid rgba(255,255,255,0.06)',
                      borderRadius: '10px',
                      color: '#ffffff',
                      fontSize: '15px',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>

              {/* Payment Method */}
              <div className="form-group" style={{ marginBottom: '38px' }}>
                <label style={{ display: 'block', marginBottom: '10px', color: 'rgba(255,255,255,0.6)', fontSize: '15px', fontWeight: '600' }}>
                  Payment Method <span style={{ color: '#d4af37', fontSize: '13px' }}>*</span>
                </label>
                <select
                  name="payment_method"
                  value={formData.payment_method}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%',
                    padding: '14px 18px',
                    background: 'rgba(255,255,255,0.03)',
                    border: '1.5px solid rgba(255,255,255,0.06)',
                    borderRadius: '10px',
                    color: '#ffffff',
                    fontSize: '15px',
                    outline: 'none',
                    boxSizing: 'border-box',
                    cursor: 'pointer',
                    appearance: 'none',
                    WebkitAppearance: 'none',
                    paddingRight: '40px'
                  }}
                >
                  <option value="bank_transfer">Bank Transfer</option>
                  <option value="scan_qr">Scan QR</option>
                  <option value="mobile_banking">Mobile Banking</option>
                </select>
              </div>

              {/* Order Notes */}
              <div className="form-group" style={{ marginBottom: '38px' }}>
                <label style={{ display: 'block', marginBottom: '10px', color: 'rgba(255,255,255,0.6)', fontSize: '15px', fontWeight: '600' }}>
                  Order Notes <span style={{ color: '#d4af37', fontSize: '13px' }}>(Optional)</span>
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows="3"
                  placeholder="Any special instructions..."
                  style={{
                    width: '100%',
                    padding: '14px 18px',
                    background: 'rgba(255,255,255,0.03)',
                    border: '1.5px solid rgba(255,255,255,0.06)',
                    borderRadius: '10px',
                    color: '#ffffff',
                    fontSize: '15px',
                    outline: 'none',
                    boxSizing: 'border-box',
                    resize: 'vertical',
                    minHeight: '90px',
                    fontFamily: 'inherit'
                  }}
                ></textarea>
              </div>

              <button
                type="submit"
                className="confirm-order-btn"
                disabled={loading}
                style={{
                  width: '100%',
                  background: 'linear-gradient(135deg, #d4af37, #b8960c)',
                  border: 'none',
                  padding: '16px 20px',
                  borderRadius: '12px',
                  fontWeight: '700',
                  fontSize: '16px',
                  color: '#000000',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s ease',
                  letterSpacing: '0.5px',
                  marginTop: '12px',
                  opacity: loading ? '0.5' : '1'
                }}
              >
                {loading ? 'Processing...' : 'Proceed to Payment →'}
              </button>
            </form>

          </div>

          {/* Order Summary */}
          <div className="order-summary-side">
            <h3>Order Summary</h3>
            <p className="item-count">{getCartCount()} items</p>
            {cartItems.map(item => (
              <div key={item.id} className="summary-item">
                <span>{item.name} x{item.quantity} {item.ml ? `(${item.ml}ml)` : ''}</span>
                <span>Rs. {((item.priceNum || 0) * item.quantity).toLocaleString()}</span>
              </div>
            ))}
            <div className="summary-divider"></div>
            <div className="summary-row">
              <span>Subtotal</span>
              <span>Rs. {subtotal.toLocaleString()}</span>
            </div>
            <div className="summary-row">
              <span>Shipping</span>
              <span>Rs. {shipping.toLocaleString()}</span>
            </div>
            <div className="summary-total">
              <span>Total</span>
              <span>Rs. {total.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CheckoutPage