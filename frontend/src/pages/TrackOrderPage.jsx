import { useState } from 'react'
import { FaSearch, FaCheckCircle, FaBox, FaTruck, FaShippingFast, FaClipboardList, FaExclamationTriangle } from 'react-icons/fa'
import { API_URL } from '../../config'  // ✅ IMPORT FROM CONFIG
import './TrackOrderPage.css'

function TrackOrderPage() {
  const [orderId, setOrderId] = useState('')
  const [orderStatus, setOrderStatus] = useState(null)
  const [searched, setSearched] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  
  const trackOrder = async (e) => {
    e.preventDefault()
    if (!orderId.trim()) {
      setError('Please enter an Order ID')
      return
    }
    
    setLoading(true)
    setError(null)
    setSearched(true)
    setOrderStatus(null)
    
    try {
      const token = localStorage.getItem('token')
      
      const response = await fetch(`${API_URL}/orders/track/${orderId.trim()}`, {  // ✅ USING API_URL
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : ''
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        setOrderStatus({
          ...data,
          orderId: data.order_number || data.order_id,
          statusCode: getStatusCode(data.status)
        })
        setLoading(false)
        return
      }
      
      if (token) {
        const userOrdersRes = await fetch(`${API_URL}/orders`, {  // ✅ USING API_URL
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        
        if (userOrdersRes.ok) {
          const orders = await userOrdersRes.json()
          const found = orders.find(o => o.order_number === orderId.trim() || o.order_id == orderId.trim())
          
          if (found) {
            setOrderStatus({
              ...found,
              orderId: found.order_number,
              statusCode: getStatusCode(found.status),
              items: found.items || []
            })
            setLoading(false)
            return
          }
        }
      }
      
      setError('Order not found. Please check the Order ID and try again.')
      setLoading(false)
      
    } catch (err) {
      console.error('Error tracking order:', err)
      setError('Network error. Please try again.')
      setLoading(false)
    }
  }
  
  const getStatusCode = (status) => {
    const statusMap = {
      'pending': 0,
      'pending_payment': 0,
      'confirmed': 1,
      'processing': 2,
      'shipped': 3,
      'delivered': 4,
      'cancelled': -1
    }
    return statusMap[status] || 0
  }
  
  const statusSteps = [
    { id: 1, label: 'Order Confirmed', icon: <FaClipboardList />, status: 'confirmed' },
    { id: 2, label: 'Processing', icon: <FaBox />, status: 'processing' },
    { id: 3, label: 'Shipped', icon: <FaTruck />, status: 'shipped' },
    { id: 4, label: 'Delivered', icon: <FaShippingFast />, status: 'delivered' }
  ]
  
  const getCurrentStep = () => {
    if (!orderStatus) return 0
    return orderStatus.statusCode || 0
  }
  
  const getStatusText = () => {
    if (!orderStatus) return ''
    const statusMap = {
      'pending': 'Awaiting Payment Verification',
      'pending_payment': 'Awaiting Payment Verification',
      'confirmed': 'Order Confirmed',
      'processing': 'Order is Being Processed',
      'shipped': 'Order is On The Way',
      'delivered': 'Order Delivered Successfully',
      'cancelled': 'Order Cancelled'
    }
    return statusMap[orderStatus.status] || 'Status Unknown'
  }
  
  const getStatusColor = () => {
    if (!orderStatus) return '#d4af37'
    if (orderStatus.status === 'cancelled') return '#dc3545'
    if (orderStatus.status === 'delivered') return '#4caf50'
    const colorMap = {
      'pending': '#ff9800',
      'pending_payment': '#ff9800',
      'confirmed': '#2196f3',
      'processing': '#ff9800',
      'shipped': '#9c27b0'
    }
    return colorMap[orderStatus.status] || '#d4af37'
  }
  
  // ✅ Calculate grand total (subtotal + shipping)
  const getGrandTotal = (order) => {
    const subtotal = Number(order.total_amount) || 0
    const shipping = 200
    return subtotal + shipping
  }
  
  return (
    <div className="track-order-page">
      <div className="track-order-container">
        <div className="track-order-header">
          <h1>Track Your Order</h1>
          <p>Enter your Order ID to track the status of your order</p>
        </div>
        
        <form onSubmit={trackOrder} className="track-search-form">
          <input 
            type="text" 
            placeholder="Enter Order ID (e.g., LXE1780584044612)"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            className="track-input"
          />
          <button type="submit" disabled={loading} className="track-btn">
            <FaSearch /> {loading ? 'Tracking...' : 'Track Order'}
          </button>
        </form>
        
        {error && (
          <div className="track-error">
            <FaExclamationTriangle />
            <span>{error}</span>
          </div>
        )}
        
        {searched && !loading && orderStatus && !error && (
          <div className="order-status-card">
            <div className="status-header" style={{ borderColor: getStatusColor() }}>
              <div className="status-icon" style={{ background: getStatusColor() }}>
                {orderStatus.status === 'cancelled' ? <FaExclamationTriangle /> : <FaCheckCircle />}
              </div>
              <div className="status-info">
                <h3>{getStatusText()}</h3>
                <p>Order ID: <strong>{orderStatus.orderId}</strong></p>
              </div>
            </div>
            
            {orderStatus.status !== 'cancelled' && (
              <div className="progress-steps">
                {statusSteps.map((step, index) => {
                  const currentStep = getCurrentStep()
                  const isCompleted = index + 1 <= currentStep
                  const isActive = index + 1 === currentStep
                  
                  return (
                    <div key={step.id} className={`step ${isCompleted ? 'completed' : ''} ${isActive ? 'active' : ''}`}>
                      <div className="step-circle">
                        {isCompleted ? <FaCheckCircle /> : step.icon}
                      </div>
                      <div className="step-label">{step.label}</div>
                      {index < statusSteps.length - 1 && (
                        <div className={`step-line ${isCompleted ? 'completed' : ''}`}></div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
            
            {orderStatus.status === 'cancelled' && (
              <div className="cancelled-status">
                <div className="cancelled-icon">❌</div>
                <h4>Order Cancelled</h4>
                <p>This order has been cancelled. Please contact support for more information.</p>
              </div>
            )}
            
            <div className="order-details">
              <h4>Order Details</h4>
              <div className="details-grid">
                <div className="detail-row">
                  <span>Order Date:</span>
                  <span>{orderStatus.order_date ? new Date(orderStatus.order_date).toLocaleDateString() : 'N/A'}</span>
                </div>
                <div className="detail-row">
                  <span>Payment Status:</span>
                  <span className={orderStatus.payment_status === 'paid' ? 'paid' : 'pending'}>
                    {orderStatus.payment_status === 'paid' ? 'Paid ✅' : 'Pending ⏳'}
                  </span>
                </div>
                <div className="detail-row">
                  <span>Subtotal:</span>
                  <span>Rs. {Number(orderStatus.total_amount || 0).toLocaleString()}</span>
                </div>
                <div className="detail-row">
                  <span>Shipping:</span>
                  <span>Rs. 200</span>
                </div>
                <div className="detail-row grand-total">
                  <span>Grand Total:</span>
                  <span>Rs. {getGrandTotal(orderStatus).toLocaleString()}</span>
                </div>
                <div className="detail-row">
                  <span>Shipping Address:</span>
                  <span>{orderStatus.shipping_address || 'N/A'}</span>
                </div>
              </div>
            </div>
            
            {orderStatus.items && orderStatus.items.length > 0 && (
              <div className="order-items">
                <h4>Items Ordered</h4>
                {orderStatus.items.map((item, idx) => (
                  <div key={idx} className="order-item">
                    <div className="item-info">
                      <span className="item-name">{item.product_name || item.name}</span>
                      <span className="item-qty">Qty: {item.quantity}</span>
                      {item.ml && <span className="item-ml">{item.ml}ml</span>}
                    </div>
                    <div className="item-price">Rs. {Number(item.price * item.quantity).toLocaleString()}</div>
                  </div>
                ))}
              </div>
            )}
            
            <div className="help-section">
              <p>❓ Need help? <a href="/contact">Contact our support team</a></p>
            </div>
          </div>
        )}
        
        {searched && !loading && !orderStatus && !error && (
          <div className="not-found-card">
            <div className="not-found-icon">🔍</div>
            <h3>Order Not Found</h3>
            <p>We couldn't find an order with ID <strong>{orderId}</strong></p>
            <p>Please check the order ID and try again.</p>
            <button onClick={() => { setSearched(false); setError(null) }} className="try-again-btn">
              Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default TrackOrderPage