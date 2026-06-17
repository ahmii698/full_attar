import { createContext, useState, useContext, useEffect } from 'react'

const AdminAuthContext = createContext()

export function AdminAuthProvider({ children }) {
  const [admin, setAdmin] = useState(null)
  const [loading, setLoading] = useState(true)

  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api'

  useEffect(() => {
    const token = localStorage.getItem('admin_token')
    const adminData = localStorage.getItem('admin_data')
    
    if (token && adminData) {
      setAdmin(JSON.parse(adminData))
    }
    setLoading(false)
  }, [])

  // ✅ REAL API LOGIN - Backend se connect karega
  const login = async (email, password) => {
    try {
      console.log('🔑 Attempting login for:', email)
      
      const response = await fetch(`${API_BASE_URL}/admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      })

      const data = await response.json()
      console.log('📥 Login response:', data)

      if (data.success && data.token) {
        localStorage.setItem('admin_token', data.token)
        localStorage.setItem('admin_data', JSON.stringify(data.admin))
        setAdmin(data.admin)
        return true
      } else {
        console.error('Login failed:', data.message)
        return false
      }
    } catch (error) {
      console.error('Login error:', error)
      return false
    }
  }

  const logout = async () => {
    try {
      const token = localStorage.getItem('admin_token')
      if (token) {
        await fetch(`${API_BASE_URL}/admin/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })
      }
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      localStorage.removeItem('admin_token')
      localStorage.removeItem('admin_data')
      setAdmin(null)
    }
  }

  const value = {
    admin,
    loading,
    login,
    logout,
    isAuthenticated: !!admin
  }

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  )
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext)
  if (!context) {
    throw new Error('useAdminAuth must be used within AdminAuthProvider')
  }
  return context
}