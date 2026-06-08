import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { useAuth } from './AuthContext'

const CartContext = createContext()

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within CartProvider')
  }
  return context
}

export function CartProvider({ children }) {
  const { user, updateUserCart, updateUserWishlist } = useAuth()
  const [cartItems, setCartItems] = useState([])
  const [wishlistItems, setWishlistItems] = useState([])
  const [isLoaded, setIsLoaded] = useState(false)
  
  // Load user data when user changes
  useEffect(() => {
    if (user) {
      setCartItems(user.cart || [])
      setWishlistItems(user.wishlist || [])
      setIsLoaded(true)
    } else {
      setCartItems([])
      setWishlistItems([])
      setIsLoaded(false)
    }
  }, [user?.id]) // Only when user ID changes
  
  // Save cart to user - using ref to prevent infinite loop
  const cartString = JSON.stringify(cartItems)
  const wishlistString = JSON.stringify(wishlistItems)
  
  useEffect(() => {
    if (user && isLoaded && cartString !== JSON.stringify(user.cart || [])) {
      updateUserCart(cartItems)
    }
  }, [cartString, user, isLoaded, updateUserCart])
  
  useEffect(() => {
    if (user && isLoaded && wishlistString !== JSON.stringify(user.wishlist || [])) {
      updateUserWishlist(wishlistItems)
    }
  }, [wishlistString, user, isLoaded, updateUserWishlist])
  
  const addToCart = useCallback((product, quantity = 1) => {
    if (!user) return false
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id)
      if (existing) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      }
      return [...prev, { ...product, quantity }]
    })
    return true
  }, [user])
  
  const removeFromCart = useCallback((productId) => {
    if (!user) return
    setCartItems(prev => prev.filter(item => item.id !== productId))
  }, [user])
  
  const updateQuantity = useCallback((productId, quantity) => {
    if (!user) return
    if (quantity <= 0) {
      removeFromCart(productId)
      return
    }
    setCartItems(prev =>
      prev.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    )
  }, [user, removeFromCart])
  
  const clearCart = useCallback(() => {
    if (!user) return
    setCartItems([])
  }, [user])
  
  const addToWishlist = useCallback((product) => {
    if (!user) return false
    setWishlistItems(prev => {
      if (prev.find(item => item.id === product.id)) return prev
      return [...prev, product]
    })
    return true
  }, [user])
  
  const removeFromWishlist = useCallback((productId) => {
    if (!user) return
    setWishlistItems(prev => prev.filter(item => item.id !== productId))
  }, [user])
  
  const moveToCart = useCallback((product) => {
    if (!user) return
    addToCart(product, 1)
    removeFromWishlist(product.id)
  }, [user, addToCart, removeFromWishlist])
  
  const getCartTotal = useCallback(() => {
    return cartItems.reduce((total, item) => total + (item.priceNum * item.quantity), 0)
  }, [cartItems])
  
  const getCartCount = useCallback(() => {
    return cartItems.reduce((count, item) => count + item.quantity, 0)
  }, [cartItems])
  
  const value = {
    cartItems,
    wishlistItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    addToWishlist,
    removeFromWishlist,
    moveToCart,
    getCartTotal,
    getCartCount
  }
  
  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}