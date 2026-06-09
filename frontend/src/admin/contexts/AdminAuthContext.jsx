import { createContext, useState, useContext, useEffect } from 'react'

const AdminAuthContext = createContext()

export function AdminAuthProvider({ children }) {
  const [admin, setAdmin] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const adminData = localStorage.getItem('admin_data')
    if (adminData) {
      setAdmin(JSON.parse(adminData))
    }
    setLoading(false)
  }, [])

  // Hardcoded login - abhi ke liye (baad mein backend se connect kar lena)
  const login = async (email, password) => {
    // Hardcoded credentials
    const validEmail = 'xahmedmalik30600@gmail.com'
    const validPassword = 'password'
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500))
    
    if (email === validEmail && password === validPassword) {
      const adminData = {
        id: 1,
        name: 'Ahmed Malik',
        email: email,
        role: 'super_admin'
      }
      localStorage.setItem('admin_data', JSON.stringify(adminData))
      setAdmin(adminData)
      return true
    }
    return false
  }

  const logout = () => {
    localStorage.removeItem('admin_data')
    setAdmin(null)
  }

  return (
    <AdminAuthContext.Provider value={{ admin, loading, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  )
}

export function useAdminAuth() {
  return useContext(AdminAuthContext)
}