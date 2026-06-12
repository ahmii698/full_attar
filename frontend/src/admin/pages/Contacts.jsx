import { useState, useEffect } from 'react'
import { getContacts, deleteContact, markContactAsRead, replyToContact } from '../services/adminApi'
import { FaReply, FaTimes, FaPaperPlane, FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import '../styles/Contacts.css'

function Contacts() {
  const [contacts, setContacts] = useState([])
  const [loading, setLoading] = useState(true)
  const [replyModal, setReplyModal] = useState(null)
  const [replyMessage, setReplyMessage] = useState('')
  const [sending, setSending] = useState(false)
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(8)
  const [totalItems, setTotalItems] = useState(0)

  useEffect(() => {
    fetchContacts()
  }, [currentPage])

  const fetchContacts = async () => {
    try {
      const res = await getContacts()
      setContacts(res.data)
      setTotalItems(res.data.length)
    } catch (error) {
      console.error('Error fetching contacts:', error)
      setContacts([])
      setTotalItems(0)
    } finally {
      setLoading(false)
    }
  }

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentContacts = contacts.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(totalItems / itemsPerPage)

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber)
  }

  const handleMarkAsRead = async (id) => {
    try {
      await markContactAsRead(id)
      fetchContacts()
    } catch (error) {
      console.error('Error marking as read:', error)
      alert('Failed to mark as read')
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this query?')) {
      try {
        await deleteContact(id)
        fetchContacts()
        if (currentContacts.length === 1 && currentPage > 1) {
          setCurrentPage(currentPage - 1)
        }
      } catch (error) {
        console.error('Error deleting contact:', error)
        alert('Failed to delete contact')
      }
    }
  }

  const handleReply = async (contact) => {
    setReplyModal(contact)
    setReplyMessage('')
  }

  const sendReply = async () => {
    if (!replyMessage.trim()) {
      alert('Please enter a reply message')
      return
    }

    setSending(true)
    try {
      await replyToContact(replyModal.query_id, replyMessage)
      alert('Reply sent successfully!')
      setReplyModal(null)
      setReplyMessage('')
      await markContactAsRead(replyModal.query_id)
      fetchContacts()
    } catch (error) {
      console.error('Error sending reply:', error)
      alert('Failed to send reply. Please try again.')
    } finally {
      setSending(false)
    }
  }

  if (loading) return <div className="admin-loading">Loading contacts...</div>

  return (
    <div className="contacts-admin-page">
      <div className="admin-page-header">
        <h2>Contact Queries</h2>
        <div className="total-count">Total: {totalItems} queries</div>
      </div>

      {contacts.length === 0 ? (
        <div className="empty-state">
          <p>No contact queries found.</p>
        </div>
      ) : (
        <>
          <div className="admin-data-table-container">
            <table className="admin-data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Message</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentContacts.map(contact => (
                  <tr key={contact.query_id} className={!contact.is_read ? 'unread' : ''}>
                    <td>{contact.query_id}</td>
                    <td>{contact.full_name}</td>
                    <td>{contact.email}</td>
                    <td>{contact.phone || '-'}</td>
                    <td>
                      <div className="message-preview">
                        {contact.message?.length > 50 ? contact.message.substring(0, 50) + '...' : contact.message}
                      </div>
                    </td>
                    <td>{new Date(contact.created_at).toLocaleDateString()}</td>
                    <td>
                      {!contact.is_read ? (
                        <button 
                          onClick={() => handleMarkAsRead(contact.query_id)}
                          className="mark-read-btn"
                        >
                          Mark as Read
                        </button>
                      ) : (
                        <span className="read-badge">Read</span>
                      )}
                    </td>
                    <td>
                      <button 
                        onClick={() => handleReply(contact)} 
                        className="reply-btn"
                        title="Reply to this query"
                      >
                        <FaReply /> Reply
                      </button>
                      <button onClick={() => handleDelete(contact.query_id)} className="delete-btn">
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
                Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, totalItems)} of {totalItems} queries
              </div>
            </div>
          )}
        </>
      )}

      {/* Reply Modal */}
      {replyModal && (
        <div className="reply-modal-overlay" onClick={() => setReplyModal(null)}>
          <div className="reply-modal" onClick={(e) => e.stopPropagation()}>
            <div className="reply-modal-header">
              <h3>Reply to {replyModal.full_name}</h3>
              <button className="modal-close" onClick={() => setReplyModal(null)}>
                <FaTimes />
              </button>
            </div>

            <div className="original-message">
              <h4>Original Message:</h4>
              <p><strong>From:</strong> {replyModal.full_name} ({replyModal.email})</p>
              <p><strong>Phone:</strong> {replyModal.phone || 'N/A'}</p>
              <p><strong>Message:</strong></p>
              <div className="original-message-text">{replyModal.message}</div>
            </div>

            <div className="reply-form">
              <label>Your Reply:</label>
              <textarea
                rows="6"
                placeholder="Type your reply here..."
                value={replyMessage}
                onChange={(e) => setReplyMessage(e.target.value)}
              />
            </div>

            <div className="reply-modal-actions">
              <button 
                className="send-reply-btn" 
                onClick={sendReply} 
                disabled={sending}
              >
                <FaPaperPlane /> {sending ? 'Sending...' : 'Send Reply'}
              </button>
              <button className="cancel-btn" onClick={() => setReplyModal(null)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Contacts