import { useState, useEffect } from 'react'
import { FaSearch, FaCheckCircle, FaTruck, FaBox, FaShippingFast, FaClipboardList } from 'react-icons/fa'

function TrackOrderPage() {
  const [orderId, setOrderId] = useState('')
  const [orderStatus, setOrderStatus] = useState(null)
  const [searched, setSearched] = useState(false)
  const [loading, setLoading] = useState(false)
  
  // Get order from localStorage or API
  const trackOrder = (e) => {
    e.preventDefault()
    if (!orderId.trim()) return
    
    setLoading(true)
    setSearched(true)
    
    // Simulate API call
    setTimeout(() => {
      // Check in pending orders
      const pendingOrder = localStorage.getItem('pendingOrder')
      const confirmedOrders = JSON.parse(localStorage.getItem('confirmedOrders') || '[]')
      
      let foundOrder = null
      
      if (pendingOrder) {
        const pending = JSON.parse(pendingOrder)
        if (pending.orderId === orderId) {
          foundOrder = { ...pending, status: 'pending_payment', statusCode: 1 }
        }
      }
      
      if (!foundOrder) {
        foundOrder = confirmedOrders.find(o => o.orderId === orderId)
        if (foundOrder) {
          foundOrder = { ...foundOrder, status: 'approved', statusCode: 3 }
        }
      }
      
      // Demo orders for tracking
      const demoOrders = {
        'LXE1780584044612': {
          orderId: 'LXE1780584044612',
          status: 'delivered',
          statusCode: 4,
          items: [{ name: "Black & Silver Platinum", quantity: 1, price: 2100 }],
          total: 2300,
          date: '2024-03-15',
          estimatedDelivery: '2024-03-18'
        },
        'LXE1780584044613': {
          orderId: 'LXE1780584044613',
          status: 'shipped',
          statusCode: 3,
          items: [{ name: "Ameer Al Oud", quantity: 2, price: 1800 }],
          total: 3800,
          date: '2024-03-14',
          estimatedDelivery: '2024-03-20'
        },
        'LXE1780584044614': {
          orderId: 'LXE1780584044614',
          status: 'processing',
          statusCode: 2,
          items: [{ name: "Oud Al Aswad", quantity: 1, price: 3200 }],
          total: 3400,
          date: '2024-03-16',
          estimatedDelivery: '2024-03-22'
        },
        'LXE1780584044615': {
          orderId: 'LXE1780584044615',
          status: 'confirmed',
          statusCode: 1,
          items: [{ name: "Sultan E Ameer", quantity: 1, price: 4500 }],
          total: 4700,
          date: '2024-03-17',
          estimatedDelivery: '2024-03-24'
        }
      }
      
      if (demoOrders[orderId]) {
        foundOrder = demoOrders[orderId]
      }
      
      setOrderStatus(foundOrder)
      setLoading(false)
    }, 1000)
  }
  
  const statusSteps = [
    { id: 1, label: 'Order Confirmed', icon: <FaClipboardList />, status: 'confirmed' },
    { id: 2, label: 'Processing', icon: <FaBox />, status: 'processing' },
    { id: 3, label: 'Shipped', icon: <FaTruck />, status: 'shipped' },
    { id: 4, label: 'Delivered', icon: <FaShippingFast />, status: 'delivered' }
  ]
  
  const getCurrentStep = () => {
    if (!orderStatus) return 0
    const statusMap = {
      'pending_payment': 0,
      'confirmed': 1,
      'processing': 2,
      'shipped': 3,
      'delivered': 4
    }
    return statusMap[orderStatus.status] || 0
  }
  
  const getStatusText = () => {
    if (!orderStatus) return ''
    const statusMap = {
      'pending_payment': 'Awaiting Payment Verification',
      'confirmed': 'Order Confirmed',
      'processing': 'Order is Being Processed',
      'shipped': 'Order is On The Way',
      'delivered': 'Order Delivered Successfully'
    }
    return statusMap[orderStatus.status] || 'Status Unknown'
  }
  
  const getStatusColor = () => {
    if (!orderStatus) return '#d4af37'
    const colorMap = {
      'pending_payment': '#ff9800',
      'confirmed': '#2196f3',
      'processing': '#ff9800',
      'shipped': '#9c27b0',
      'delivered': '#4caf50'
    }
    return colorMap[orderStatus.status] || '#d4af37'
  }
  
  return (
    <div className="track-order-page">
      <div className="track-order-container">
        <div className="track-order-header">
          <h1>Track Your Order</h1>
          <p>Enter your order ID to track the status of your order</p>
        </div>
        
        {/* Search Form */}
        <form onSubmit={trackOrder} className="track-search-form">
          <input 
            type="text" 
            placeholder="Enter Order ID (e.g., LXE1780584044612)"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
          />
          <button type="submit" disabled={loading}>
            <FaSearch /> {loading ? 'Tracking...' : 'Track Order'}
          </button>
        </form>
        
        {/* Sample Order IDs */}
        <div className="sample-orders">
          <p>Try these sample Order IDs:</p>
          <div className="sample-buttons">
            <button onClick={() => setOrderId('LXE1780584044612')}>LXE1780584044612</button>
            <button onClick={() => setOrderId('LXE1780584044613')}>LXE1780584044613</button>
            <button onClick={() => setOrderId('LXE1780584044614')}>LXE1780584044614</button>
            <button onClick={() => setOrderId('LXE1780584044615')}>LXE1780584044615</button>
          </div>
        </div>
        
        {/* Order Status */}
        {searched && !loading && orderStatus && (
          <div className="order-status-card">
            <div className="status-header" style={{ borderColor: getStatusColor() }}>
              <div className="status-icon" style={{ background: getStatusColor() }}>
                <FaCheckCircle />
              </div>
              <div className="status-info">
                <h3>{getStatusText()}</h3>
                <p>Order ID: <strong>{orderStatus.orderId}</strong></p>
              </div>
            </div>
            
            {/* Progress Steps */}
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
            
            {/* Order Details */}
            <div className="order-details">
              <h4>Order Details</h4>
              <div className="details-grid">
                <div className="detail-row">
                  <span>Order Date:</span>
                  <span>{orderStatus.date || new Date().toLocaleDateString()}</span>
                </div>
                <div className="detail-row">
                  <span>Estimated Delivery:</span>
                  <span>{orderStatus.estimatedDelivery || '3-5 business days'}</span>
                </div>
                <div className="detail-row">
                  <span>Total Amount:</span>
                  <span>Rs. {orderStatus.total}</span>
                </div>
                <div className="detail-row">
                  <span>Payment Status:</span>
                  <span className={orderStatus.status === 'pending_payment' ? 'pending' : 'paid'}>
                    {orderStatus.status === 'pending_payment' ? 'Pending' : 'Completed'}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Items List */}
            {orderStatus.items && orderStatus.items.length > 0 && (
              <div className="order-items">
                <h4>Items Ordered</h4>
                {orderStatus.items.map((item, idx) => (
                  <div key={idx} className="order-item">
                    <div className="item-info">
                      <span className="item-name">{item.name}</span>
                      <span className="item-qty">Qty: {item.quantity}</span>
                    </div>
                    <div className="item-price">Rs. {item.price * item.quantity}</div>
                  </div>
                ))}
              </div>
            )}
            
            {/* Help Section */}
            <div className="help-section">
              <p>❓ Need help? <a href="/contact">Contact our support team</a></p>
            </div>
          </div>
        )}
        
        {/* Not Found */}
        {searched && !loading && !orderStatus && (
          <div className="not-found-card">
            <div className="not-found-icon">🔍</div>
            <h3>Order Not Found</h3>
            <p>We couldn't find an order with ID <strong>{orderId}</strong></p>
            <p>Please check the order ID and try again.</p>
            <button onClick={() => setSearched(false)}>Try Again</button>
          </div>
        )}
      </div>
    </div>
  )
}

export default TrackOrderPage