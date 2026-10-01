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

  // ADD TO CART
  const addToCart = useCallback((product, quantity = 1) => {
    if (!user) {
      return false
    }

    setCartItems(prev => {
      const isShoe = product.type === 'shoe'
      // Shoes mein ml nahi hota
      const ml = isShoe ? null : (product.ml || 50)
      const existing = prev.find(item => item.id === product.id && item.ml === ml)

      if (existing) {
        return prev.map(item =>
          item.id === product.id && item.ml === ml
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      }

      let mlPrices = {}

      if (product.ml_prices && typeof product.ml_prices === 'object') {
        mlPrices = product.ml_prices
      }

      if (Object.keys(mlPrices).length === 0 && product.product?.ml_prices) {
        mlPrices = product.product.ml_prices
      }

      const newItem = {
        id: product.id,
        type: product.type || 'attar', // 'shoe' ya 'attar'
        shoeId: product.shoeId || null,
        size: product.size || null,
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

      return [...prev, newItem]
    })
    return true
  }, [user])

  // REMOVE FROM CART
  const removeFromCart = useCallback((productId) => {
    if (!user) return
    setCartItems(prev => prev.filter(item => item.id !== productId))
  }, [user])

  // UPDATE QUANTITY
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

  // UPDATE CART ML
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

  // CLEAR CART
  const clearCart = useCallback(() => {
    if (!user) return
    setCartItems([])
  }, [user])

  // WISHLIST FUNCTIONS
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

  // GET CART TOTAL
  const getCartTotal = useCallback(() => {
    return cartItems.reduce((total, item) => {
      const price = item.priceNum || 0
      const qty = item.quantity || 0
      return total + (price * qty)
    }, 0)
  }, [cartItems])

  // GET CART COUNT
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