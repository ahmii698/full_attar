import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useCart } from '../contexts/CartContext'

function CheckoutPage() {
  const navigate = useNavigate()
  const { cartItems, getCartTotal, getCartCount } = useCart()
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    address: '',
    city: '',
    zipcode: '',
    phone: ''
  })
  
  const subtotal = getCartTotal()
  const shipping = 200
  const total = subtotal + shipping
  
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }
  
  const handleSubmit = (e) => {
    e.preventDefault()
    // Save order details to localStorage
    const orderData = {
      ...formData,
      items: cartItems,
      subtotal,
      shipping,
      total,
      orderId: 'LXE' + Date.now() + Math.floor(Math.random() * 10000),
      date: new Date().toISOString()
    }
    localStorage.setItem('pendingOrder', JSON.stringify(orderData))
    navigate('/payment')
  }
  
  return (
    <div className="checkout-page">
      <div className="checkout-container">
        <Link to="/cart" className="back-to-cart">← Back to Cart</Link>
        
        <div className="checkout-grid">
          <div className="billing-form">
            <h2>Billing Details</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Full Name *</label>
                <input type="text" name="fullName" required onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Email Address *</label>
                <input type="email" name="email" required onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Street Address *</label>
                <input type="text" name="address" required onChange={handleChange} />
              </div>
              <div className="form-row-2">
                <div className="form-group">
                  <label>City *</label>
                  <input type="text" name="city" required onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label>Zipcode *</label>
                  <input type="text" name="zipcode" required onChange={handleChange} />
                </div>
              </div>
              <div className="form-group">
                <label>Phone Number *</label>
                <input type="tel" name="phone" required onChange={handleChange} />
              </div>
              <button type="submit" className="confirm-order-btn">Confirm Order →</button>
            </form>
          </div>
          
          <div className="order-summary-side">
            <h3>Order Summary</h3>
            {cartItems.map(item => (
              <div key={item.id} className="summary-item">
                <span>{item.name} x{item.quantity}</span>
                <span>Rs. {item.priceNum * item.quantity}</span>
              </div>
            ))}
            <div className="summary-divider"></div>
            <div className="summary-row">
              <span>Subtotal</span>
              <span>Rs. {subtotal}</span>
            </div>
            <div className="summary-row">
              <span>Shipping</span>
              <span>Rs. {shipping}</span>
            </div>
            <div className="summary-total">
              <span>Total</span>
              <span>Rs. {total}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CheckoutPage