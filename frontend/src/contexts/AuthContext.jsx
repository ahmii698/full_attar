import { createContext, useContext, useState, useEffect, useCallback } from 'react'

const AuthContext = createContext()

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [token, setToken] = useState(localStorage.getItem('token'))

  useEffect(() => {
    if (token) {
      fetchUser()
    } else {
      setLoading(false)
    }
  }, [token])

  const fetchUser = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/user`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        const userData = data.user || data
        const userId = userData.user_id || userData.id
        
        const savedCart = localStorage.getItem(`cart_${userId}`)
        const savedWishlist = localStorage.getItem(`wishlist_${userId}`)
        
        setUser({
          ...userData,
          cart: savedCart ? JSON.parse(savedCart) : [],
          wishlist: savedWishlist ? JSON.parse(savedWishlist) : []
        })
      } else {
        localStorage.removeItem('token')
        setToken(null)
      }
    } catch (error) {
      console.error('Error fetching user:', error)
      localStorage.removeItem('token')
      setToken(null)
    } finally {
      setLoading(false)
    }
  }

  const signup = useCallback(async (name, email, password) => {
    const response = await fetch(`${API_BASE_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    })
    
    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(data.message || 'Signup failed')
    }
    
    localStorage.setItem('token', data.token)
    setToken(data.token)
    setUser({
      ...data.user,
      cart: [],
      wishlist: []
    })
    
    return data
  }, [])

  const login = useCallback(async (email, password) => {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })
    
    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(data.message || 'Login failed')
    }
    
    localStorage.setItem('token', data.token)
    setToken(data.token)
    
    const userData = data.user || data
    const userId = userData.user_id || userData.id
    
    const savedCart = localStorage.getItem(`cart_${userId}`)
    const savedWishlist = localStorage.getItem(`wishlist_${userId}`)
    
    setUser({
      ...userData,
      cart: savedCart ? JSON.parse(savedCart) : [],
      wishlist: savedWishlist ? JSON.parse(savedWishlist) : []
    })
    
    return data
  }, [])

  const logout = useCallback(async () => {
    if (token) {
      try {
        await fetch(`${API_BASE_URL}/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })
      } catch (error) {
        console.error('Logout error:', error)
      }
    }
    
    localStorage.removeItem('token')
    setToken(null)
    setUser(null)
  }, [token])

  const updateUserCart = useCallback((cart) => {
    if (user) {
      const userId = user.user_id || user.id
      localStorage.setItem(`cart_${userId}`, JSON.stringify(cart))
      setUser(prev => prev ? { ...prev, cart } : prev)
    }
  }, [user])

  const updateUserWishlist = useCallback((wishlist) => {
    if (user) {
      const userId = user.user_id || user.id
      localStorage.setItem(`wishlist_${userId}`, JSON.stringify(wishlist))
      setUser(prev => prev ? { ...prev, wishlist } : prev)
    }
  }, [user])

  // ✅ FIXED - Direct API call without localStorage interference
  const updateProfile = useCallback(async (name, email) => {
    console.log('📤 Sending update:', { name, email })
    
    const response = await fetch(`${API_BASE_URL}/profile`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name, email })
    })
    
    const data = await response.json()
    console.log('📥 API Response:', data)
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to update profile')
    }
    
    // ✅ Update user state with response data
    const updatedUser = data.user || { ...user, name, email }
    setUser(prev => ({ ...prev, ...updatedUser }))
    
    return data
  }, [token, user])

  const changePassword = useCallback(async (currentPassword, newPassword) => {
    const response = await fetch(`${API_BASE_URL}/change-password`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        current_password: currentPassword, 
        new_password: newPassword 
      })
    })
    
    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to change password')
    }
    
    return data
  }, [token])

  const value = {
    user,
    loading,
    signup,
    login,
    logout,
    token,
    updateUserCart,
    updateUserWishlist,
    updateProfile,
    changePassword
  }
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}