import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaCopy, FaCheck, FaBuilding, FaQrcode, FaMobileAlt, FaShieldAlt, FaUniversity } from 'react-icons/fa'

function PaymentPage() {
  const navigate = useNavigate()
  const [order, setOrder] = useState(null)
  const [copied, setCopied] = useState(false)
  const [selectedMethod, setSelectedMethod] = useState('bank')
  
  useEffect(() => {
    const savedOrder = localStorage.getItem('pendingOrder')
    if (savedOrder) {
      setOrder(JSON.parse(savedOrder))
    } else {
      navigate('/cart')
    }
  }, [navigate])
  
  const copyAccountNumber = () => {
    navigator.clipboard.writeText('PK36ALFH000123456789')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  
  const handleHavePaid = () => {
    navigate('/upload-proof')
  }
  
  if (!order) return null
  
  // Generate QR code data
  const qrData = `Bank: Bank Alfalah|Account: PK36ALFH000123456789|Amount: Rs.${order.total}|Ref: ${order.orderId}`
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(qrData)}`
  
  return (
    <div className="payment-page">
      <div className="payment-container">
        <div className="payment-header">
          <h2>💳 Complete Payment</h2>
          <p>Choose your preferred payment method</p>
        </div>
        
        {/* Payment Method Tabs */}
        <div className="payment-tabs">
          <button 
            className={`tab-btn ${selectedMethod === 'bank' ? 'active' : ''}`}
            onClick={() => setSelectedMethod('bank')}
          >
            <FaUniversity /> Bank Transfer
          </button>
          <button 
            className={`tab-btn ${selectedMethod === 'qr' ? 'active' : ''}`}
            onClick={() => setSelectedMethod('qr')}
          >
            <FaQrcode /> Scan QR
          </button>
          <button 
            className={`tab-btn ${selectedMethod === 'mobile' ? 'active' : ''}`}
            onClick={() => setSelectedMethod('mobile')}
          >
            <FaMobileAlt /> Mobile Banking
          </button>
        </div>
        
        {/* Bank Transfer Method */}
        {selectedMethod === 'bank' && (
          <div className="payment-method-content">
            <div className="amount-card">
              <span className="amount-label">Total Amount to Pay</span>
              <div className="amount-value">Rs. {order.total}</div>
            </div>
            
            <div className="bank-info-card">
              <h3>Bank Account Details</h3>
              <div className="bank-row">
                <span className="bank-label">Bank Name:</span>
                <span className="bank-value">Bank Alfalah Limited</span>
              </div>
              <div className="bank-row">
                <span className="bank-label">Account Title:</span>
                <span className="bank-value">Royal Attar (PVT) LTD</span>
              </div>
              <div className="bank-row">
                <span className="bank-label">Account Number:</span>
                <span className="bank-value account-num">PK36 ALFH 0001 2345 6789</span>
                <button className="copy-btn" onClick={copyAccountNumber}>
                  {copied ? <FaCheck /> : <FaCopy />}
                </button>
              </div>
              <div className="bank-row">
                <span className="bank-label">IBAN:</span>
                <span className="bank-value">PK36ALFH000123456789</span>
              </div>
              <div className="bank-row">
                <span className="bank-label">SWIFT Code:</span>
                <span className="bank-value">ALFHPKKA</span>
              </div>
            </div>
            
            <div className="instruction-card">
              <h4>📝 Instructions:</h4>
              <ul>
                <li>Use your full name as reference when transferring</li>
                <li>Keep transaction ID for proof</li>
                <li>Amount must match exactly: Rs. {order.total}</li>
              </ul>
            </div>
          </div>
        )}
        
        {/* QR Code Method */}
        {selectedMethod === 'qr' && (
          <div className="payment-method-content">
            <div className="amount-card">
              <span className="amount-label">Total Amount to Pay</span>
              <div className="amount-value">Rs. {order.total}</div>
            </div>
            
            <div className="qr-section">
              <div className="qr-card">
                <img src={qrCodeUrl} alt="Payment QR Code" className="qr-image-real" />
                <p className="qr-note">Scan with your banking app</p>
              </div>
              
              <div className="upi-info">
                <p>📱 Or pay via Easypaisa / JazzCash</p>
                <div className="upi-number">0300 1234567</div>
              </div>
            </div>
            
            <div className="instruction-card">
              <h4>📝 Instructions:</h4>
              <ul>
                <li>Open your banking app and scan QR code</li>
                <li>Amount will be auto-filled: Rs. {order.total}</li>
                <li>Add your order ID as reference: {order.orderId}</li>
              </ul>
            </div>
          </div>
        )}
        
        {/* Mobile Banking Method */}
        {selectedMethod === 'mobile' && (
          <div className="payment-method-content">
            <div className="amount-card">
              <span className="amount-label">Total Amount to Pay</span>
              <div className="amount-value">Rs. {order.total}</div>
            </div>
            
            <div className="mobile-apps">
              <div className="app-card">
                <div className="app-icon">📱</div>
                <div className="app-details">
                  <h4>Easypaisa / JazzCash</h4>
                  <p>Account Number: <strong>0300 1234567</strong></p>
                  <p>Account Title: <strong>Royal Attar</strong></p>
                </div>
              </div>
              
              <div className="app-card">
                <div className="app-icon">🏦</div>
                <div className="app-details">
                  <h4>Bank Alfalah Mobile App</h4>
                  <p>Login → Payments → New Payment</p>
                  <p>Enter Account: PK36ALFH000123456789</p>
                </div>
              </div>
            </div>
            
            <div className="instruction-card">
              <h4>📝 Instructions:</h4>
              <ul>
                <li>Open your mobile banking app</li>
                <li>Select "Send Money" or "Pay to Account"</li>
                <li>Enter account number and amount: Rs. {order.total}</li>
                <li>Add reference: {order.orderId}</li>
              </ul>
            </div>
          </div>
        )}
        
        {/* Security Note */}
        <div className="security-note">
          <FaShieldAlt />
          <span>Your payment is secure and encrypted</span>
        </div>
        
        <button onClick={handleHavePaid} className="have-paid-btn">
          I have made the payment →
        </button>
      </div>
    </div>
  )
}

export default PaymentPage