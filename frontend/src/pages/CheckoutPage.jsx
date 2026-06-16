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
    address: '',
    city: '',
    zipcode: '',
    phone: '',
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

  // ✅ FIX: Only redirect if cart is empty AND not in checkout process
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
        console.log('✅ Order created successfully!')
        
        // ✅ Save order data first
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
        
        // ✅ First navigate to payment page
        navigate(`/payment/${data.data.order.order_id}`, {
          state: orderDataToPass
        })
        
        // ✅ Then clear cart after navigation (with slight delay)
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
            <h2>Billing Details</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Full Name *</label>
                <input 
                  type="text" 
                  name="full_name" 
                  value={formData.full_name}
                  onChange={handleChange} 
                  required 
                />
              </div>
              <div className="form-group">
                <label>Email Address *</label>
                <input 
                  type="email" 
                  name="email" 
                  value={formData.email}
                  onChange={handleChange} 
                  required 
                />
              </div>
              <div className="form-group">
                <label>Phone Number *</label>
                <input 
                  type="tel" 
                  name="phone" 
                  value={formData.phone}
                  onChange={handleChange} 
                  required 
                />
              </div>
              <div className="form-group">
                <label>Street Address *</label>
                <input 
                  type="text" 
                  name="address" 
                  value={formData.address}
                  onChange={handleChange} 
                  required 
                />
              </div>
              <div className="form-row-2">
                <div className="form-group">
                  <label>City *</label>
                  <input 
                    type="text" 
                    name="city" 
                    value={formData.city}
                    onChange={handleChange} 
                    required 
                  />
                </div>
                <div className="form-group">
                  <label>Zipcode</label>
                  <input 
                    type="text" 
                    name="zipcode" 
                    value={formData.zipcode}
                    onChange={handleChange} 
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label>Payment Method *</label>
                <select 
                  name="payment_method" 
                  value={formData.payment_method} 
                  onChange={handleChange}
                  required
                >
                  <option value="bank_transfer">Bank Transfer</option>
                  <option value="scan_qr">Scan QR</option>
                  <option value="mobile_banking">Mobile Banking</option>
                </select>
              </div>
              
              <div className="form-group">
                <label>Order Notes (Optional)</label>
                <textarea 
                  name="notes" 
                  value={formData.notes}
                  onChange={handleChange} 
                  rows="3"
                  placeholder="Any special instructions..."
                ></textarea>
              </div>
              
              <button type="submit" className="confirm-order-btn" disabled={loading}>
                {loading ? 'Processing...' : 'Proceed to Payment →'}
              </button>
            </form>
          </div>
          
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