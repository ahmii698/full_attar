import { useState, useEffect } from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { 
  FaUpload, FaFileImage, FaTrash, FaArrowRight, FaShieldAlt, 
  FaRegIdCard, FaInfoCircle, FaQuestionCircle, FaSpinner, FaCheck
} from 'react-icons/fa'
import { API_URL } from '../../config'  // ✅ IMPORT FROM CONFIG

function UploadProofPage() {
  const { id } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  
  const [order, setOrder] = useState(null)
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [uploaded, setUploaded] = useState(false)
  
  useEffect(() => {
    // ✅ Get order data from location state
    if (location.state) {
      setOrder({
        orderId: location.state.orderId,
        orderNumber: location.state.orderNumber,
        total: location.state.total
      })
    } else {
      navigate('/cart')
    }
  }, [location.state, navigate])
  
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    if (selectedFile && selectedFile.type.startsWith('image/')) {
      setFile(selectedFile)
      setPreview(URL.createObjectURL(selectedFile))
    }
  }
  
  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }
  
  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile && droppedFile.type.startsWith('image/')) {
      setFile(droppedFile)
      setPreview(URL.createObjectURL(droppedFile))
    }
  }
  
  const removeFile = () => {
    setFile(null)
    setPreview(null)
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!file) return
    
    setUploading(true)
    
    const formData = new FormData()
    formData.append('screenshot', file)
    formData.append('transaction_id', `TXN${Date.now()}`)
    
    try {
      const token = localStorage.getItem('token')
      
      const response = await fetch(`${API_URL}/orders/${id}/payment-confirmation`, {  // ✅ USING API_URL
        method: 'POST',
        headers: {
          'Authorization': token ? `Bearer ${token}` : ''
        },
        body: formData
      })

      const data = await response.json()

      if (response.ok) {
        setUploaded(true)
        setTimeout(() => {
          navigate('/order-confirmation', {
            state: {
              orderNumber: order?.orderNumber,
              total: order?.total,
              success: true
            }
          })
        }, 1500)
      } else {
        alert(data.error || data.message || 'Failed to upload payment proof. Please try again.')
        setUploading(false)
      }
    } catch (error) {
      console.error('Error uploading:', error)
      alert('Network error. Please check your connection and try again.')
      setUploading(false)
    }
  }
  
  if (!order) {
    return (
      <div className="upload-proof-page">
        <div className="upload-proof-container">
          <div className="loading-text">Loading order details...</div>
        </div>
      </div>
    )
  }
  
  if (uploaded) {
    return (
      <div className="upload-proof-page">
        <div className="upload-proof-container">
          <div className="success-container">
            <div className="success-icon">✅</div>
            <h2>Payment Confirmation Submitted!</h2>
            <p>Your payment confirmation has been uploaded successfully.</p>
            <p className="order-ref">Order Reference: <strong>{order?.orderNumber}</strong></p>
            <p>We will verify your payment and update you shortly.</p>
            <button onClick={() => navigate('/orders')} className="view-orders-btn">
              View My Orders
            </button>
          </div>
        </div>
      </div>
    )
  }
  
  return (
    <div className="upload-proof-page">
      <div className="upload-proof-container">
        {/* Header */}
        <div className="upload-header">
          <div className="header-icon">
            <FaUpload />
          </div>
          <h2>Upload Payment Proof</h2>
          <p>Please upload a screenshot of your payment confirmation</p>
        </div>
        
        {/* Order Reference */}
        <div className="order-ref-card">
          <div className="ref-header">
            <span className="ref-label">ORDER ID</span>
          </div>
          <div className="ref-value">{order.orderNumber}</div>
          <p className="ref-note">Use this Order ID to track your order</p>
        </div>
        
        {/* Instructions */}
        <div className="instructions-box">
          <div className="instructions-header">
            <FaShieldAlt />
            <h4>Important Instructions</h4>
          </div>
          <ul>
            <li>Upload clear screenshot of payment confirmation</li>
            <li>Screenshot should show transaction ID and amount</li>
            <li>File format: JPG, PNG Max 5MB</li>
            <li>Make sure the amount matches Rs. {order.total?.toLocaleString()}</li>
          </ul>
        </div>
        
        {/* Upload Form */}
        <form onSubmit={handleSubmit} className="upload-form">
          <label className="upload-label">Payment Screenshot *</label>
          
          <div 
            className={`upload-area ${dragActive ? 'drag-active' : ''} ${preview ? 'has-preview' : ''}`}
            onClick={() => document.getElementById('fileInput').click()}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            {preview ? (
              <div className="preview-container">
                <img src={preview} alt="Preview" className="image-preview" />
                <button type="button" className="remove-file-btn" onClick={removeFile}>
                  <FaTrash /> Remove
                </button>
              </div>
            ) : (
              <>
                <div className="upload-icon">
                  <FaFileImage />
                </div>
                <p className="upload-text">Click or drag to upload screenshot</p>
                <span className="upload-hint">PNG, JPG up to 5MB</span>
              </>
            )}
            <input 
              type="file" 
              id="fileInput" 
              accept="image/jpeg,image/png,image/jpg" 
              onChange={handleFileChange} 
              style={{ display: 'none' }} 
            />
          </div>
          
          {file && (
            <div className="file-info">
              <FaFileImage />
              <span>{file.name}</span>
              <span className="file-size">({(file.size / 1024).toFixed(1)} KB)</span>
            </div>
          )}
          
          <div className="upload-actions">
            <button 
              type="submit" 
              className={`upload-btn ${!file || uploading ? 'disabled' : ''}`}
              disabled={!file || uploading}
            >
              {uploading ? (
                <>Uploading... <FaSpinner className="spinner" /></>
              ) : (
                <>Submit Proof <FaArrowRight /></>
              )}
            </button>
            <button type="button" className="skip-btn" onClick={() => navigate(`/orders`)}>
              Skip for now? Track your order later
            </button>
          </div>
        </form>
        
        {/* Help Section */}
        <div className="help-section">
          <FaQuestionCircle />
          <p>Need help? <a href="/contact">Contact our support team</a></p>
        </div>
      </div>
    </div>
  )
}

export default UploadProofPage