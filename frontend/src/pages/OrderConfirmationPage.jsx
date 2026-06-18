import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { FaClock, FaArrowRight, FaShoppingBag, FaEnvelope, FaShieldAlt, FaBox, FaTruck, FaHourglassHalf } from 'react-icons/fa'
import './OrderConfirmationPage.css'

function OrderConfirmationPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    if (location.state && location.state.orderNumber) {
      setOrder({
        orderNumber: location.state.orderNumber,
        total: location.state.total,
        success: location.state.success || true
      })
      setLoading(false)
      return
    }
    
    const pendingOrder = localStorage.getItem('pendingOrder')
    if (pendingOrder) {
      const parsed = JSON.parse(pendingOrder)
      setOrder({
        orderNumber: parsed.orderId || parsed.order_number || 'N/A',
        total: parsed.total || 0,
        success: true
      })
      localStorage.removeItem('pendingOrder')
      setLoading(false)
      return
    }
    
    const confirmedOrders = JSON.parse(localStorage.getItem('confirmedOrders') || '[]')
    if (confirmedOrders.length > 0) {
      const lastOrder = confirmedOrders[confirmedOrders.length - 1]
      setOrder({
        orderNumber: lastOrder.orderId || lastOrder.order_number || 'N/A',
        total: lastOrder.total || 0,
        success: true
      })
      setLoading(false)
      return
    }
    
    setLoading(false)
    navigate('/')
  }, [location.state, navigate])
  
  if (loading) {
    return (
      <div className="confirmation-page">
        <div className="confirmation-container">
          <div className="loading-spinner"></div>
          <p>Loading order details...</p>
        </div>
      </div>
    )
  }
  
  if (!order) {
    return (
      <div className="confirmation-page">
        <div className="confirmation-container">
          <h2>No order found</h2>
          <button onClick={() => navigate('/shop')} className="shop-more-btn">
            Continue Shopping →
          </button>
        </div>
      </div>
    )
  }
  
  return (
    <div className="confirmation-page">
      <div className="confirmation-container">
        <div className="pending-icon">
          <FaHourglassHalf />
        </div>
        <h1>Order Placed!</h1>
        <p className="order-id">
          Order ID: <strong>{order.orderNumber}</strong>
        </p>
        <p className="pending-message">
          Your order has been placed successfully! 
        </p>
        <p className="pending-sub-message">
          <FaClock className="clock-icon" /> 
          <span>Your order is pending admin approval. Please wait while we verify your payment.</span>
        </p>
        
        <div className="next-steps">
          <h3>What's Next?</h3>
          <ul>
            <li><FaEnvelope /> You will receive order confirmation email</li>
            <li><FaShieldAlt /> Admin will verify your payment</li>
            <li><FaBox /> We will process your order after approval</li>
            <li><FaTruck /> Track your order using the Order ID</li>
          </ul>
        </div>
        
        <div className="confirmation-buttons">
          <button 
            onClick={() => navigate('/track-order')} 
            className="track-btn"
          >
            Track Order <FaArrowRight />
          </button>
          <button 
            onClick={() => navigate('/shop')} 
            className="shop-more-btn"
          >
            <FaShoppingBag /> Continue Shopping
          </button>
        </div>
      </div>
    </div>
  )
}

export default OrderConfirmationPage