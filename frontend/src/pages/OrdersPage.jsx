import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { FaBox, FaEye, FaCheckCircle, FaClock, FaTruck, FaMapMarkerAlt, FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import { API_URL } from '../../config'  // ✅ IMPORT FROM CONFIG
import './OrdersPage.css'

function OrdersPage() {
  const { user } = useAuth()
  const [orders, setOrders] = useState([])
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const [totalItems, setTotalItems] = useState(0)

  const token = localStorage.getItem('token')

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${API_URL}/orders`, {  // ✅ USING API_URL
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const data = await response.json()
        setOrders(data)
        setTotalItems(data.length)
      } else {
        setError('Failed to fetch orders')
      }
    } catch (err) {
      console.error('Error fetching orders:', err)
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentOrders = orders.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(totalItems / itemsPerPage)

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber)
  }

  const getStatusIcon = (status) => {
    const statusMap = {
      'pending': <FaClock />,
      'pending_payment': <FaClock />,
      'confirmed': <FaCheckCircle />,
      'processing': <FaBox />,
      'shipped': <FaTruck />,
      'delivered': <FaCheckCircle />,
      'cancelled': <FaClock />
    }
    return statusMap[status] || <FaBox />
  }

  const getStatusColor = (status) => {
    const colorMap = {
      'pending': '#ff9800',
      'pending_payment': '#ff9800',
      'confirmed': '#2196f3',
      'processing': '#ff9800',
      'shipped': '#9c27b0',
      'delivered': '#4caf50',
      'cancelled': '#dc3545'
    }
    return colorMap[status] || '#d4af37'
  }

  const getStatusText = (status) => {
    const textMap = {
      'pending': 'Pending',
      'pending_payment': 'Pending Payment',
      'confirmed': 'Confirmed',
      'processing': 'Processing',
      'shipped': 'Shipped',
      'delivered': 'Delivered',
      'cancelled': 'Cancelled'
    }
    return textMap[status] || status
  }

  const getPaymentStatus = (status) => {
    return status === 'paid' ? 'Paid ✅' : 'Pending ⏳'
  }

  if (loading) {
    return (
      <div className="orders-page">
        <div className="orders-container">
          <div className="loading-spinner"></div>
          <p>Loading your orders...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="orders-page">
        <div className="orders-container">
          <div className="error-message">
            <p>⚠️ {error}</p>
            <button onClick={fetchOrders}>Try Again</button>
          </div>
        </div>
      </div>
    )
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
          {currentOrders.map((order) => (
            <div key={order.order_id} className="order-card">
              <div className="order-header">
                <div className="order-info">
                  <span className="order-id">Order #{order.order_number}</span>
                  <span className="order-date">{new Date(order.order_date).toLocaleDateString()}</span>
                </div>
                <div className="order-status" style={{ color: getStatusColor(order.status) }}>
                  {getStatusIcon(order.status)} {getStatusText(order.status)}
                </div>
              </div>

              <div className="order-items-preview">
                {order.items && order.items.slice(0, 2).map((item, idx) => (
                  <div key={idx} className="order-item-preview">
                    <span>{item.product_name || item.name} x{item.quantity}</span>
                    <span>Rs. {(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
                {order.items && order.items.length > 2 && (
                  <div className="more-items">+{order.items.length - 2} more items</div>
                )}
              </div>

              <div className="order-footer">
                <div className="order-total">
                  <span>Total Amount:</span>
                  <strong>Rs. {Number(order.total_amount || 0).toLocaleString()}</strong>
                </div>
                <button className="view-details-btn" onClick={() => setSelectedOrder(order)}>
                  <FaEye /> View Details
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="pagination-container">
            <div className="pagination">
              <button 
                onClick={() => handlePageChange(currentPage - 1)} 
                disabled={currentPage === 1}
                className="pagination-btn"
              >
                <FaChevronLeft /> Previous
              </button>
              
              <div className="page-numbers">
                {[...Array(totalPages).keys()].map(number => (
                  <button
                    key={number + 1}
                    onClick={() => handlePageChange(number + 1)}
                    className={`page-number ${currentPage === number + 1 ? 'active' : ''}`}
                  >
                    {number + 1}
                  </button>
                ))}
              </div>
              
              <button 
                onClick={() => handlePageChange(currentPage + 1)} 
                disabled={currentPage === totalPages}
                className="pagination-btn"
              >
                Next <FaChevronRight />
              </button>
            </div>
            <div className="showing-info">
              Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, totalItems)} of {totalItems} orders
            </div>
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="order-modal" onClick={() => setSelectedOrder(null)}>
          <div className="order-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedOrder(null)}>✕</button>
            <h2>Order Details</h2>
            <div className="modal-order-id">Order ID: {selectedOrder.order_number}</div>

            <div className="modal-status" style={{ borderLeftColor: getStatusColor(selectedOrder.status) }}>
              <div className="status-badge" style={{ background: getStatusColor(selectedOrder.status) }}>
                {getStatusText(selectedOrder.status)}
              </div>
              <span className="payment-status">
                Payment: {getPaymentStatus(selectedOrder.payment_status)}
              </span>
            </div>

            <div className="modal-items">
              <h3>Items Ordered</h3>
              {selectedOrder.items && selectedOrder.items.map((item, idx) => (
                <div key={idx} className="modal-item">
                  <div className="modal-item-info">
                    <span className="modal-item-name">{item.product_name || item.name}</span>
                    <span className="modal-item-qty">Qty: {item.quantity} {item.ml ? `(${item.ml}ml)` : ''}</span>
                  </div>
                  <div className="modal-item-price">Rs. {(item.price * item.quantity).toLocaleString()}</div>
                </div>
              ))}
            </div>

            <div className="modal-summary">
              <div className="modal-row">
                <span>Subtotal:</span>
                <span>Rs. {Number(selectedOrder.total_amount || 0).toLocaleString()}</span>
              </div>
              <div className="modal-row">
                <span>Shipping:</span>
                <span>Rs. 200</span>
              </div>
              <div className="modal-row total">
                <span>Total:</span>
                <span>Rs. {(Number(selectedOrder.total_amount || 0) + 200).toLocaleString()}</span>
              </div>
            </div>

            <div className="modal-shipping">
              <h3>Shipping Details</h3>
              <p><FaMapMarkerAlt /> {selectedOrder.shipping_address || 'N/A'}</p>
              <p>📞 {selectedOrder.phone || 'N/A'}</p>
              <p>📧 {selectedOrder.email || 'N/A'}</p>
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