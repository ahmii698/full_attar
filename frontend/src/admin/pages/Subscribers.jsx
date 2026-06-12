import { useState, useEffect } from 'react'
import { getSubscribers, deleteSubscriber, toggleSubscriberStatus } from '../services/adminApi'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import '../styles/Subscribers.css'

function Subscribers() {
  const [subscribers, setSubscribers] = useState([])
  const [loading, setLoading] = useState(true)
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(8)
  const [totalItems, setTotalItems] = useState(0)

  useEffect(() => {
    fetchSubscribers()
  }, [currentPage])

  const fetchSubscribers = async () => {
    try {
      const res = await getSubscribers()
      setSubscribers(res.data)
      setTotalItems(res.data.length)
    } catch (error) {
      console.error('Error fetching subscribers:', error)
      setSubscribers([])
      setTotalItems(0)
    } finally {
      setLoading(false)
    }
  }

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentSubscribers = subscribers.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(totalItems / itemsPerPage)

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber)
  }

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      await toggleSubscriberStatus(id, !currentStatus)
      fetchSubscribers()
    } catch (error) {
      console.error('Error toggling status:', error)
      alert('Failed to update status')
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this subscriber?')) {
      try {
        await deleteSubscriber(id)
        fetchSubscribers()
        if (currentSubscribers.length === 1 && currentPage > 1) {
          setCurrentPage(currentPage - 1)
        }
      } catch (error) {
        console.error('Error deleting subscriber:', error)
        alert('Failed to delete subscriber')
      }
    }
  }

  if (loading) return <div className="admin-loading">Loading subscribers...</div>

  return (
    <div className="subscribers-admin-page">
      <div className="admin-page-header">
        <h2>Newsletter Subscribers</h2>
        <div className="total-count">Total: {totalItems} subscribers</div>
      </div>

      {subscribers.length === 0 ? (
        <div className="empty-state">
          <p>No subscribers found.</p>
        </div>
      ) : (
        <>
          <div className="admin-data-table-container">
            <table className="admin-data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Email</th>
                  <th>Subscribed On</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentSubscribers.map(sub => (
                  <tr key={sub.subscriber_id}>
                    <td>{sub.subscriber_id}</td>
                    <td>{sub.email}</td>
                    <td>{new Date(sub.subscribed_at).toLocaleDateString()}</td>
                    <td>
                      <button 
                        onClick={() => handleToggleStatus(sub.subscriber_id, sub.is_active)}
                        className={`status-btn ${sub.is_active ? 'active' : 'inactive'}`}
                      >
                        {sub.is_active ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td>
                      <button onClick={() => handleDelete(sub.subscriber_id)} className="delete-btn">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
                Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, totalItems)} of {totalItems} subscribers
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default Subscribers