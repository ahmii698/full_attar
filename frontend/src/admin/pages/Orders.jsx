import { useState, useEffect } from 'react'
import { getOrders, updateOrderStatus } from '../services/adminApi'
import { FaEye, FaImage, FaSpinner, FaCheckCircle, FaTimesCircle, FaInfoCircle, FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import '../styles/Orders.css'

function Orders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [updating, setUpdating] = useState(false)
  const [showPaymentProof, setShowPaymentProof] = useState(false)
  const [paymentProof, setPaymentProof] = useState(null)
  const [toast, setToast] = useState(null)

  // ✅ Pagination States
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(8)
  const [totalItems, setTotalItems] = useState(0)

  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api'
  const APP_URL = 'http://127.0.0.1:8000'
  const token = localStorage.getItem('admin_token')

  useEffect(() => {
    fetchOrders()
  }, [])

  // ✅ Toast Auto Dismiss
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [toast])

  const showToast = (message, type = 'success') => {
    setToast({ message, type })
  }

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${API_BASE_URL}/admin/orders`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        setOrders(data)
        setTotalItems(data.length)
      }
    } catch (error) {
      console.error('Error fetching orders:', error)
      showToast('Failed to fetch orders', 'error')
    } finally {
      setLoading(false)
    }
  }

  // ✅ Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentOrders = orders.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(totalItems / itemsPerPage)

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber)
  }

  const updateStatus = async (id, newStatus) => {
    setUpdating(true)
    try {
      const response = await fetch(`${API_BASE_URL}/admin/orders/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      })

      if (response.ok) {
        setOrders(orders.map(order => 
          order.order_id === id ? { ...order, status: newStatus } : order
        ))
        if (selectedOrder && selectedOrder.order_id === id) {
          setSelectedOrder(prev => ({ ...prev, status: newStatus }))
        }
        showToast(`Order status updated to ${newStatus}!`, 'success')
      } else {
        showToast('Failed to update status', 'error')
      }
    } catch (error) {
      console.error('Error updating status:', error)
      showToast('Network error. Please try again.', 'error')
    } finally {
      setUpdating(false)
    }
  }

  // ✅ Update Payment Status
  const updatePaymentStatus = async (id, newPaymentStatus) => {
    setUpdating(true)
    try {
      const response = await fetch(`${API_BASE_URL}/admin/orders/${id}/payment-status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        },
        body: JSON.stringify({ payment_status: newPaymentStatus })
      })

      if (response.ok) {
        setOrders(orders.map(order => 
          order.order_id === id ? { ...order, payment_status: newPaymentStatus } : order
        ))
        if (selectedOrder && selectedOrder.order_id === id) {
          setSelectedOrder(prev => ({ ...prev, payment_status: newPaymentStatus }))
        }
        showToast(`Payment status updated to ${newPaymentStatus}!`, 'success')
      } else {
        showToast('Failed to update payment status', 'error')
      }
    } catch (error) {
      console.error('Error updating payment status:', error)
      showToast('Network error. Please try again.', 'error')
    } finally {
      setUpdating(false)
    }
  }

  const viewOrderDetails = (order) => {
    setSelectedOrder(order)
    setShowModal(true)
    if (order.payment_confirmation) {
      setPaymentProof(order.payment_confirmation)
    } else {
      setPaymentProof(null)
    }
  }

  const viewPaymentProof = async (orderId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/orders/${orderId}/payment-proof`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        setPaymentProof(data)
        setShowPaymentProof(true)
      } else {
        showToast('No payment proof found for this order', 'error')
      }
    } catch (error) {
      console.error('Error fetching payment proof:', error)
      showToast('Failed to fetch payment proof', 'error')
    }
  }

  const getStatusClass = (status) => {
    const classes = {
      'pending': 'status-pending',
      'processing': 'status-processing',
      'shipped': 'status-shipped',
      'delivered': 'status-delivered',
      'cancelled': 'status-cancelled'
    }
    return classes[status?.toLowerCase()] || 'status-pending'
  }

  const getPaymentBadgeClass = (status) => {
    const classes = {
      'paid': 'payment-paid',
      'pending': 'payment-pending',
      'failed': 'payment-failed',
      'refunded': 'payment-refunded'
    }
    return classes[status?.toLowerCase()] || 'payment-pending'
  }

  const statusOptions = ['pending', 'processing', 'shipped', 'delivered', 'cancelled']
  const paymentStatusOptions = ['pending', 'paid', 'failed', 'refunded']

  if (loading) return <div className="admin-loading">Loading orders...</div>

  return (
    <div className="orders-admin-page">
      {/* Toast Notification */}
      {toast && (
        <div className={`toast-notification ${toast.type}`}>
          <div className="toast-icon">
            {toast.type === 'success' && <FaCheckCircle />}
            {toast.type === 'error' && <FaTimesCircle />}
            {toast.type === 'info' && <FaInfoCircle />}
          </div>
          <div className="toast-message">{toast.message}</div>
          <button className="toast-close" onClick={() => setToast(null)}>×</button>
        </div>
      )}

      <div className="admin-page-header">
        <h2>Orders</h2>
        <span className="total-orders">Total: {totalItems} orders</span>
      </div>

      {orders.length === 0 ? (
        <div className="empty-state">
          <p>No orders found.</p>
        </div>
      ) : (
        <>
          <div className="admin-data-table-container">
            <table className="admin-data-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Payment</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentOrders.map(order => (
                  <tr key={order.order_id}>
                    <td className="order-id-cell">{order.order_number}</td>
                    <td>{order.full_name || order.user?.name || 'Guest'}</td>
                    <td>Rs. {Number(order.total_amount || 0).toLocaleString()}</td>
                    <td>
                      <div className="status-select-wrapper">
                        <select 
                          value={order.status || 'pending'} 
                          onChange={(e) => updateStatus(order.order_id, e.target.value)}
                          className={`status-select ${getStatusClass(order.status)}`}
                          disabled={updating}
                        >
                          {statusOptions.map(status => (
                            <option key={status} value={status}>
                              {status.charAt(0).toUpperCase() + status.slice(1)}
                            </option>
                          ))}
                        </select>
                      </div>
                    </td>
                    <td>
                      <div className="status-select-wrapper payment-select-wrapper">
                        <select 
                          value={order.payment_status || 'pending'} 
                          onChange={(e) => updatePaymentStatus(order.order_id, e.target.value)}
                          className={`payment-select ${getPaymentBadgeClass(order.payment_status)}`}
                          disabled={updating}
                        >
                          {paymentStatusOptions.map(status => (
                            <option key={status} value={status}>
                              {status.charAt(0).toUpperCase() + status.slice(1)}
                            </option>
                          ))}
                        </select>
                      </div>
                    </td>
                    <td>{order.order_date ? new Date(order.order_date).toLocaleDateString() : 'N/A'}</td>
                    <td>
                      <div className="action-buttons">
                        <button className="view-order-btn" onClick={() => viewOrderDetails(order)}>
                          <FaEye /> View
                        </button>
                        <button 
                          className="proof-btn" 
                          onClick={() => viewPaymentProof(order.order_id)}
                          title="View Payment Proof"
                        >
                          <FaImage />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ✅ Pagination */}
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
        </>
      )}

      {/* Order Details Modal */}
      {showModal && selectedOrder && (
        <div className="order-modal" onClick={() => setShowModal(false)}>
          <div className="order-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            <h2>Order Details</h2>
            <p className="modal-order-id">Order: {selectedOrder.order_number}</p>
            
            <div className="modal-section">
              <h3>Customer Information</h3>
              <p><span className="label">Name:</span> <span className="value">{selectedOrder.full_name || selectedOrder.user?.name || 'Guest'}</span></p>
              <p><span className="label">Email:</span> <span className="value">{selectedOrder.email || selectedOrder.user?.email || 'N/A'}</span></p>
              <p><span className="label">Phone:</span> <span className="value">{selectedOrder.phone || 'N/A'}</span></p>
            </div>

            <div className="modal-section">
              <h3>Shipping Details</h3>
              <p><span className="label">Address:</span> <span className="value">{selectedOrder.shipping_address || 'N/A'}</span></p>
              <p><span className="label">City:</span> <span className="value">{selectedOrder.city || 'N/A'}</span></p>
              <p><span className="label">Zipcode:</span> <span className="value">{selectedOrder.zipcode || 'N/A'}</span></p>
            </div>

            <div className="modal-section">
              <h3>Order Information</h3>
              <p>
                <span className="label">Status:</span>
                <select 
                  value={selectedOrder.status || 'pending'} 
                  onChange={(e) => {
                    const newStatus = e.target.value
                    setSelectedOrder(prev => ({ ...prev, status: newStatus }))
                    updateStatus(selectedOrder.order_id, newStatus)
                  }}
                  className={`status-select ${getStatusClass(selectedOrder.status)}`}
                  disabled={updating}
                >
                  {statusOptions.map(status => (
                    <option key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </option>
                  ))}
                </select>
                {updating && <span className="updating-text">Updating...</span>}
              </p>
              <p>
                <span className="label">Payment:</span>
                <select 
                  value={selectedOrder.payment_status || 'pending'} 
                  onChange={(e) => {
                    const newPaymentStatus = e.target.value
                    setSelectedOrder(prev => ({ ...prev, payment_status: newPaymentStatus }))
                    updatePaymentStatus(selectedOrder.order_id, newPaymentStatus)
                  }}
                  className={`payment-select ${getPaymentBadgeClass(selectedOrder.payment_status)}`}
                  disabled={updating}
                >
                  {paymentStatusOptions.map(status => (
                    <option key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </option>
                  ))}
                </select>
                {updating && <span className="updating-text">Updating...</span>}
              </p>
              <p><span className="label">Date:</span> <span className="value">{selectedOrder.order_date ? new Date(selectedOrder.order_date).toLocaleString() : 'N/A'}</span></p>
              <p><span className="label">Total Amount:</span> <span className="value amount">Rs. {Number(selectedOrder.total_amount || 0).toLocaleString()}</span></p>
            </div>

            <div className="modal-section">
              <h3>Payment Proof</h3>
              <button 
                className="view-proof-btn"
                onClick={() => viewPaymentProof(selectedOrder.order_id)}
              >
                <FaImage /> View Payment Screenshot
              </button>
            </div>

            {selectedOrder.notes && (
              <div className="modal-section">
                <h3>Order Notes</h3>
                <p className="notes-text">{selectedOrder.notes}</p>
              </div>
            )}

            {selectedOrder.items && selectedOrder.items.length > 0 && (
              <div className="modal-section">
                <h3>Items</h3>
                <table className="modal-items-table">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Qty</th>
                      <th>ML</th>
                      <th>Price</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedOrder.items.map((item, idx) => (
                      <tr key={idx}>
                        <td>{item.product_name}</td>
                        <td>{item.quantity}</td>
                        <td>{item.ml || '50'}ml</td>
                        <td>Rs. {Number(item.price).toLocaleString()}</td>
                        <td>Rs. {Number(item.price * item.quantity).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Payment Proof Modal */}
      {showPaymentProof && paymentProof && (
        <div className="order-modal" onClick={() => setShowPaymentProof(false)}>
          <div className="order-modal-content proof-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowPaymentProof(false)}>×</button>
            <h2>Payment Screenshot</h2>
            <p className="modal-order-id">Order: {paymentProof.order?.order_number || 'N/A'}</p>
            
            <div className="modal-section">
              <h3>Payment Details</h3>
              <p><span className="label">Transaction ID:</span> <span className="value">{paymentProof.transaction_id || 'N/A'}</span></p>
              <p><span className="label">Amount:</span> <span className="value amount">Rs. {Number(paymentProof.amount || 0).toLocaleString()}</span></p>
              <p><span className="label">Status:</span> 
                <span className={`payment-badge ${paymentProof.status === 'approved' ? 'payment-paid' : 'payment-pending'}`}>
                  {paymentProof.status || 'pending'}
                </span>
              </p>
            </div>

            <div className="modal-section">
              <h3>Screenshot</h3>
              {paymentProof.screenshot_path ? (
                <div className="proof-image-container">
                  <img 
                    src={`${APP_URL}${paymentProof.screenshot_path}`} 
                    alt="Payment Proof" 
                    className="proof-image"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/400x300/1a1a1a/d4af37?text=No+Image'
                    }}
                  />
                  <a 
                    href={`${APP_URL}${paymentProof.screenshot_path}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="download-proof-btn"
                  >
                    📥 Download Full Image
                  </a>
                </div>
              ) : (
                <p className="no-proof">No screenshot uploaded</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Orders