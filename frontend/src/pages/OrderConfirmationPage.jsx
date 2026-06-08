import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

function OrderConfirmationPage() {
  const navigate = useNavigate()
  const [order, setOrder] = useState(null)
  
  useEffect(() => {
    const savedOrder = localStorage.getItem('pendingOrder')
    if (savedOrder) {
      setOrder(JSON.parse(savedOrder))
      // Clear cart after order
      localStorage.removeItem('cart')
    } else {
      const confirmedOrders = JSON.parse(localStorage.getItem('confirmedOrders') || '[]')
      if (confirmedOrders.length > 0) {
        setOrder(confirmedOrders[confirmedOrders.length - 1])
      }
    }
  }, [])
  
  if (!order) {
    return (
      <div className="confirmation-page">
        <div className="confirmation-container">
          <h2>No order found</h2>
          <Link to="/shop" className="continue-shop-btn">Continue Shopping →</Link>
        </div>
      </div>
    )
  }
  
  return (
    <div className="confirmation-page">
      <div className="confirmation-container">
        <div className="success-icon">✓</div>
        <h1>Thank You!</h1>
        <p className="order-id">Order ID: <strong>{order.orderId}</strong></p>
        <p className="success-message">
          Your payment proof has been submitted successfully. Admin will review it and approve your order within 24 hours.
        </p>
        
        <div className="next-steps">
          <h3>What's Next?</h3>
          <ul>
            <li>Admin will verify your payment</li>
            <li>You will receive email confirmation once approved</li>
            <li>Order status can be tracked on Track Order page</li>
          </ul>
        </div>
        
        <div className="confirmation-buttons">
          <Link to="/track-order" className="track-btn">Track Order →</Link>
          <Link to="/shop" className="shop-more-btn">Continue Shopping →</Link>
        </div>
      </div>
    </div>
  )
}

export default OrderConfirmationPage