import { useState, useEffect } from 'react'
import { getSubscribers, deleteSubscriber, toggleSubscriberStatus } from '../services/adminApi'
import '../styles/Subscribers.css'

function Subscribers() {
  const [subscribers, setSubscribers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSubscribers()
  }, [])

  const fetchSubscribers = async () => {
    try {
      const res = await getSubscribers()
      setSubscribers(res.data)
    } catch (error) {
      console.error('Error fetching subscribers:', error)
      setSubscribers([])
    } finally {
      setLoading(false)
    }
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
      </div>

      {subscribers.length === 0 ? (
        <div className="empty-state">
          <p>No subscribers found.</p>
        </div>
      ) : (
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
              {subscribers.map(sub => (
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
      )}
    </div>
  )
}

export default Subscribers