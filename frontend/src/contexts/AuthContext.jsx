import { createContext, useContext, useState, useEffect, useCallback } from 'react'

const AuthContext = createContext()

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])
  
  const signup = useCallback(async (email, password, name) => {
    return new Promise((resolve, reject) => {
      const users = JSON.parse(localStorage.getItem('users') || '[]')
      
      if (users.find(u => u.email === email)) {
        reject(new Error('User already exists'))
        return
      }
      
      const newUser = {
        id: Date.now(),
        email,
        name,
        password: btoa(password),
        cart: [],
        wishlist: []
      }
      
      users.push(newUser)
      localStorage.setItem('users', JSON.stringify(users))
      
      const { password: _, ...userWithoutPassword } = newUser
      localStorage.setItem('user', JSON.stringify(userWithoutPassword))
      setUser(userWithoutPassword)
      resolve(userWithoutPassword)
    })
  }, [])
  
  const login = useCallback(async (email, password) => {
    return new Promise((resolve, reject) => {
      const users = JSON.parse(localStorage.getItem('users') || '[]')
      const foundUser = users.find(u => u.email === email && u.password === btoa(password))
      
      if (!foundUser) {
        reject(new Error('Invalid email or password'))
        return
      }
      
      const { password: _, ...userWithoutPassword } = foundUser
      localStorage.setItem('user', JSON.stringify(userWithoutPassword))
      setUser(userWithoutPassword)
      resolve(userWithoutPassword)
    })
  }, [])
  
  const logout = useCallback(() => {
    localStorage.removeItem('user')
    setUser(null)
  }, [])
  
  const updateUserCart = useCallback((cart) => {
    if (!user) return
    
    const users = JSON.parse(localStorage.getItem('users') || '[]')
    const userIndex = users.findIndex(u => u.id === user.id)
    
    if (userIndex !== -1) {
      users[userIndex].cart = cart
      localStorage.setItem('users', JSON.stringify(users))
      
      setUser(prev => prev ? { ...prev, cart } : prev)
    }
  }, [user])
  
  const updateUserWishlist = useCallback((wishlist) => {
    if (!user) return
    
    const users = JSON.parse(localStorage.getItem('users') || '[]')
    const userIndex = users.findIndex(u => u.id === user.id)
    
    if (userIndex !== -1) {
      users[userIndex].wishlist = wishlist
      localStorage.setItem('users', JSON.stringify(users))
      
      setUser(prev => prev ? { ...prev, wishlist } : prev)
    }
  }, [user])
  
  const value = {
    user,
    loading,
    signup,
    login,
    logout,
    updateUserCart,
    updateUserWishlist
  }
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}