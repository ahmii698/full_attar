import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { FaBox, FaEye, FaCheckCircle, FaClock, FaTruck, FaMapMarkerAlt } from 'react-icons/fa'

function OrdersPage() {
  const { user } = useAuth()
  const [orders, setOrders] = useState([])
  const [selectedOrder, setSelectedOrder] = useState(null)
  
  useEffect(() => {
    // Get all confirmed orders
    const confirmedOrders = JSON.parse(localStorage.getItem('confirmedOrders') || '[]')
    // Filter orders for current user (by email)
    const userOrders = confirmedOrders.filter(order => order.email === user?.email)
    setOrders(userOrders.reverse())
  }, [user])
  
  const getStatusIcon = (status) => {
    const statusMap = {
      'pending_payment': <FaClock />,
      'confirmed': <FaCheckCircle />,
      'processing': <FaBox />,
      'shipped': <FaTruck />,
      'delivered': <FaCheckCircle />
    }
    return statusMap[status] || <FaBox />
  }
  
  const getStatusColor = (status) => {
    const colorMap = {
      'pending_payment': '#ff9800',
      'confirmed': '#2196f3',
      'processing': '#ff9800',
      'shipped': '#9c27b0',
      'delivered': '#4caf50'
    }
    return colorMap[status] || '#d4af37'
  }
  
  const getStatusText = (status) => {
    const textMap = {
      'pending_payment': 'Pending Payment',
      'confirmed': 'Confirmed',
      'processing': 'Processing',
      'shipped': 'Shipped',
      'delivered': 'Delivered'
    }
    return textMap[status] || status
  }
  
  if (orders.length === 0) {
    return (
      <div className="orders-page">
        <div className="orders-container">
          <div className="orders-header">
            <h1>My Orders</h1>
            <p>View your order history</p>
          </div>
          <div className="no-orders">
            <div className="no-orders-icon">📦</div>
            <h3>No Orders Yet</h3>
            <p>You haven't placed any orders yet.</p>
            <Link to="/shop" className="shop-now-btn">Start Shopping →</Link>
          </div>
        </div>
      </div>
    )
  }
  
  return (
    <div className="orders-page">
      <div className="orders-container">
        <div className="orders-header">
          <h1>My Orders</h1>
          <p>View and track your orders</p>
        </div>
        
        <div className="orders-list">
          {orders.map((order, index) => (
            <div key={index} className="order-card">
              <div className="order-header">
                <div className="order-info">
                  <span className="order-id">Order #{order.orderId}</span>
                  <span className="order-date">{new Date(order.timestamp).toLocaleDateString()}</span>
                </div>
                <div className="order-status" style={{ color: getStatusColor(order.status) }}>
                  {getStatusIcon(order.status)} {getStatusText(order.status)}
                </div>
              </div>
              
              <div className="order-items-preview">
                {order.items && order.items.slice(0, 2).map((item, idx) => (
                  <div key={idx} className="order-item-preview">
                    <span>{item.name} x{item.quantity}</span>
                    <span>Rs. {item.price * item.quantity}</span>
                  </div>
                ))}
                {order.items && order.items.length > 2 && (
                  <div className="more-items">+{order.items.length - 2} more items</div>
                )}
              </div>
              
              <div className="order-footer">
                <div className="order-total">
                  <span>Total Amount:</span>
                  <strong>Rs. {order.total}</strong>
                </div>
                <button className="view-details-btn" onClick={() => setSelectedOrder(order)}>
                  <FaEye /> View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="order-modal" onClick={() => setSelectedOrder(null)}>
          <div className="order-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedOrder(null)}>✕</button>
            <h2>Order Details</h2>
            <div className="modal-order-id">Order ID: {selectedOrder.orderId}</div>
            
            <div className="modal-status" style={{ borderLeftColor: getStatusColor(selectedOrder.status) }}>
              <div className="status-badge" style={{ background: getStatusColor(selectedOrder.status) }}>
                {getStatusText(selectedOrder.status)}
              </div>
            </div>
            
            <div className="modal-items">
              <h3>Items Ordered</h3>
              {selectedOrder.items && selectedOrder.items.map((item, idx) => (
                <div key={idx} className="modal-item">
                  <div className="modal-item-info">
                    <span className="modal-item-name">{item.name}</span>
                    <span className="modal-item-qty">Quantity: {item.quantity}</span>
                  </div>
                  <div className="modal-item-price">Rs. {item.price * item.quantity}</div>
                </div>
              ))}
            </div>
            
            <div className="modal-summary">
              <div className="modal-row">
                <span>Subtotal:</span>
                <span>Rs. {selectedOrder.subtotal}</span>
              </div>
              <div className="modal-row">
                <span>Shipping:</span>
                <span>Rs. {selectedOrder.shipping}</span>
              </div>
              <div className="modal-row total">
                <span>Total:</span>
                <span>Rs. {selectedOrder.total}</span>
              </div>
            </div>
            
            <div className="modal-shipping">
              <h3>Shipping Details</h3>
              <p><FaMapMarkerAlt /> {selectedOrder.address}, {selectedOrder.city}, {selectedOrder.zipcode}</p>
              <p>📞 {selectedOrder.phone}</p>
            </div>
            
            <Link to={`/track-order`} className="track-order-modal-btn" onClick={() => setSelectedOrder(null)}>
              Track Order →
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}

export default OrdersPage