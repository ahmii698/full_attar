import { useState, useEffect } from 'react'
import { getContacts, deleteContact, markContactAsRead } from '../services/adminApi'
import '../styles/Contacts.css'

function Contacts() {
  const [contacts, setContacts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchContacts()
  }, [])

  const fetchContacts = async () => {
    try {
      const res = await getContacts()
      setContacts(res.data)
    } catch (error) {
      console.error('Error fetching contacts:', error)
      setContacts([])
    } finally {
      setLoading(false)
    }
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
      } catch (error) {
        console.error('Error deleting contact:', error)
        alert('Failed to delete contact')
      }
    }
  }

  if (loading) return <div className="admin-loading">Loading contacts...</div>

  return (
    <div className="contacts-admin-page">
      <div className="admin-page-header">
        <h2>Contact Queries</h2>
      </div>

      {contacts.length === 0 ? (
        <div className="empty-state">
          <p>No contact queries found.</p>
        </div>
      ) : (
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
              {contacts.map(contact => (
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
                    <button onClick={() => handleDelete(contact.query_id)} className="delete-btn">
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

export default Contacts