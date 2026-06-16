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
  }, [user?.user_id, user?.id])

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
  
  // ✅ ADD TO CART - WITH CONSOLE LOGS
  const addToCart = useCallback((product, quantity = 1) => {
    if (!user) {
      console.log('❌ No user, cannot add to cart')
      return false
    }
    
    console.log('📦 Product received in addToCart:', product)
    console.log('📦 product.ml_prices:', product.ml_prices)
    
    setCartItems(prev => {
      const ml = product.ml || 50
      const existing = prev.find(item => item.id === product.id && item.ml === ml)
      
      if (existing) {
        return prev.map(item =>
          item.id === product.id && item.ml === ml
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      }
      
      // ✅ Get ml_prices from product
      let mlPrices = {}
      
      // Check product.ml_prices
      if (product.ml_prices && typeof product.ml_prices === 'object') {
        mlPrices = product.ml_prices
        console.log('✅ Got ml_prices from product.ml_prices:', mlPrices)
      }
      
      // If empty, check product.product.ml_prices
      if (Object.keys(mlPrices).length === 0 && product.product?.ml_prices) {
        mlPrices = product.product.ml_prices
        console.log('✅ Got ml_prices from product.product.ml_prices:', mlPrices)
      }
      
      console.log('✅ Final mlPrices being stored:', mlPrices)
      
      // ✅ Store product with ml_prices
      const newItem = { 
        id: product.id,
        name: product.name,
        price: product.price,
        priceNum: product.priceNum || product.price_num || 0,
        image: product.image,
        ml: ml,
        quantity: quantity,
        ml_prices: mlPrices,
        product: {
          ml_prices: mlPrices
        }
      }
      
      console.log('✅ New cart item created:', newItem)
      
      return [...prev, newItem]
    })
    return true
  }, [user])
  
  // ✅ REMOVE FROM CART
  const removeFromCart = useCallback((productId) => {
    if (!user) return
    setCartItems(prev => prev.filter(item => item.id !== productId))
  }, [user])
  
  // ✅ UPDATE QUANTITY
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
  
  // ✅ UPDATE CART ML
  const updateCartML = useCallback((productId, newMl, newPrice) => {
    if (!user) return
    
    setCartItems(prev => {
      return prev.map(item => {
        if (item.id === productId) {
          const mlPrices = item.ml_prices || item.product?.ml_prices || {}
          
          return {
            ...item,
            ml: newMl,
            priceNum: newPrice,
            price: `Rs. ${newPrice.toLocaleString()}`,
            ml_prices: mlPrices,
            product: {
              ...item.product,
              ml_prices: mlPrices
            }
          }
        }
        return item
      })
    })
  }, [user])
  
  // ✅ CLEAR CART
  const clearCart = useCallback(() => {
    if (!user) return
    setCartItems([])
  }, [user])
  
  // ✅ WISHLIST FUNCTIONS
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
  
  // ✅ GET CART TOTAL
  const getCartTotal = useCallback(() => {
    return cartItems.reduce((total, item) => {
      const price = item.priceNum || 0
      const qty = item.quantity || 0
      return total + (price * qty)
    }, 0)
  }, [cartItems])
  
  // ✅ GET CART COUNT
  const getCartCount = useCallback(() => {
    return cartItems.reduce((count, item) => count + (item.quantity || 0), 0)
  }, [cartItems])
  
  const value = {
    cartItems,
    wishlistItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    updateCartML,
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