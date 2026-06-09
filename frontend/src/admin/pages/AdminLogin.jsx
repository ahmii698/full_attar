import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAdminAuth } from '../contexts/AdminAuthContext'
import '../styles/AdminLogin.css'

function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAdminAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    // Hardcoded credentials for testing - abhi ke liye
    // Baad mein backend se connect kar lena
    if (email === 'xahmedmalik30600@gmail.com' && password === 'password') {
      // Create mock admin data
      const mockAdmin = {
        id: 1,
        name: 'Ahmed Malik',
        email: email,
        role: 'super_admin'
      }
      localStorage.setItem('admin_token', 'mock-token-12345')
      localStorage.setItem('admin_data', JSON.stringify(mockAdmin))
      navigate('/admin/products')  // ← YAHAN CHANGE KIYA (dashboard se products)
    } else {
      setError('Invalid email or password')
    }
    setLoading(false)
    
    // Original API call - jab backend ready ho toh uncomment karna
    // const success = await login(email, password)
    // if (success) {
    //   navigate('/admin/products')
    // } else {
    //   setError('Invalid email or password')
    // }
    // setLoading(false)
  }

  return (
    <div className="admin-login-container">
      <div className="login-card">
        <div className="login-header">
          <h2>Royal Attar</h2>
          <p>Admin Login</p>
        </div>
        {error && <div className="alert-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@royalattar.com"
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>
          <button type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login to Dashboard'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default AdminLogin