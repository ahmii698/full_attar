import { useState, useEffect } from 'react'
import { getOrders, updateOrderStatus } from '../services/adminApi'
import '../styles/Orders.css'

function Orders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const res = await getOrders()
      setOrders(res.data)
    } catch (error) {
      console.error('Error fetching orders:', error)
      setOrders([])
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (id, newStatus) => {
    try {
      await updateOrderStatus(id, newStatus)
      // Update local state
      setOrders(orders.map(order => 
        order.order_id === id ? { ...order, status: newStatus } : order
      ))
    } catch (error) {
      console.error('Error updating status:', error)
      alert('Failed to update status')
    }
  }

  const viewOrderDetails = (order) => {
    setSelectedOrder(order)
    setShowModal(true)
  }

  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending': return 'status-pending'
      case 'processing': return 'status-processing'
      case 'shipped': return 'status-shipped'
      case 'delivered': return 'status-delivered'
      default: return 'status-pending'
    }
  }

  if (loading) return <div className="admin-loading">Loading orders...</div>

  return (
    <div className="orders-admin-page">
      <div className="admin-page-header">
        <h2>Orders</h2>
      </div>

      {orders.length === 0 ? (
        <div className="empty-state">
          <p>No orders found.</p>
        </div>
      ) : (
        <div className="admin-data-table-container">
          <table className="admin-data-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order.order_id}>
                  <td>{order.order_number}</td>
                  <td>{order.user?.name || 'N/A'}</td>
                  <td>Rs. {order.total_amount?.toLocaleString() || 0}</td>
                  <td>
                    <select 
                      value={order.status || 'pending'} 
                      onChange={(e) => updateStatus(order.order_id, e.target.value)}
                      className={`status-select ${getStatusClass(order.status)}`}
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                    </select>
                  </td>
                  <td>{new Date(order.order_date || order.created_at).toLocaleDateString()}</td>
                  <td>
                    <button className="view-order-btn" onClick={() => viewOrderDetails(order)}>
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
              <p><strong>Name:</strong> {selectedOrder.user?.name || 'N/A'}</p>
              <p><strong>Email:</strong> {selectedOrder.user?.email || 'N/A'}</p>
            </div>

            <div className="modal-section">
              <h3>Order Information</h3>
              <p><strong>Date:</strong> {new Date(selectedOrder.order_date || selectedOrder.created_at).toLocaleString()}</p>
              <p><strong>Status:</strong> 
                <span className={`status-badge ${getStatusClass(selectedOrder.status)}`}>
                  {selectedOrder.status}
                </span>
              </p>
              <p><strong>Payment Status:</strong> {selectedOrder.payment_status || 'pending'}</p>
              <p><strong>Total Amount:</strong> Rs. {selectedOrder.total_amount?.toLocaleString()}</p>
            </div>

            {selectedOrder.shipping_address && (
              <div className="modal-section">
                <h3>Shipping Address</h3>
                <p>{selectedOrder.shipping_address}</p>
              </div>
            )}

            {selectedOrder.items && selectedOrder.items.length > 0 && (
              <div className="modal-section">
                <h3>Items</h3>
                <table className="modal-items-table">
                  <thead>
                    <tr><th>Product</th><th>Quantity</th><th>Price</th><th>Total</th></tr>
                  </thead>
                  <tbody>
                    {selectedOrder.items.map((item, idx) => (
                      <tr key={idx}>
                        <td>{item.product_name}</td>
                        <td>{item.quantity}</td>
                        <td>Rs. {item.price}</td>
                        <td>Rs. {item.price * item.quantity}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default Orders