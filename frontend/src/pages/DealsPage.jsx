import { useState, useEffect } from 'react'
import { FaHeart, FaRegHeart, FaShoppingCart } from 'react-icons/fa'
import { useCart } from '../contexts/CartContext'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'

function DealsPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { addToCart, addToWishlist, removeFromWishlist, wishlistItems } = useCart()
  
  const [dealsProducts, setDealsProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [wishlistState, setWishlistState] = useState([])

  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api'
  const APP_URL = 'http://127.0.0.1:8000'
  const FRONTEND_URL = 'http://localhost:5173'

  useEffect(() => {
    fetchDealsProducts()
  }, [])

  useEffect(() => {
    setWishlistState(wishlistItems.map(item => item.id))
  }, [wishlistItems])

  const fetchDealsProducts = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${API_BASE_URL}/deals`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch deals')
      }
      
      let data = await response.json()
      console.log('Deals Products:', data)
      setDealsProducts(data)
    } catch (err) {
      setError(err.message)
      console.error('Error fetching deals:', err)
    } finally {
      setLoading(false)
    }
  }

  // ✅ Get image from database path
  const getImageUrl = (imagePath) => {
    if (!imagePath) {
      return 'https://via.placeholder.com/300x300/8B4513/white?text=No+Image'
    }
    
    if (imagePath.startsWith('http')) {
      return imagePath
    }
    
    // Uploaded image from admin panel (public/images/products/)
    if (imagePath.startsWith('/images/')) {
      return `${APP_URL}${imagePath}`
    }
    
    // Old storage images
    if (imagePath.startsWith('/storage/')) {
      return `${APP_URL}${imagePath}`
    }
    
    // Local assets (frontend public folder)
    if (imagePath.startsWith('/assets/')) {
      const filename = imagePath.split('/').pop()
      return `/assets/${filename}`
    }
    
    return 'https://via.placeholder.com/300x300/8B4513/white?text=No+Image'
  }

  const calculateDiscountPercent = (priceNum, discountPrice) => {
    if (discountPrice && priceNum && discountPrice < priceNum) {
      const discount = ((priceNum - discountPrice) / priceNum) * 100
      return Math.round(discount)
    }
    return 0
  }

  // ✅ Parse ml_prices
  const parseMlPrices = (product) => {
    if (!product.ml_prices) return {}
    if (typeof product.ml_prices === 'string') {
      try {
        return JSON.parse(product.ml_prices)
      } catch {
        return {}
      }
    }
    return product.ml_prices
  }

  // ✅ Get price for ML
  const getPriceForMl = (product, ml) => {
    const mlPrices = parseMlPrices(product)
    if (mlPrices[ml]) {
      return Number(mlPrices[ml])
    }
    return product.price_num || 0
  }

  // ✅ ProductCard Component inside DealsPage
  const ProductCardComponent = ({ product }) => {
    const productId = product.product_id || product.id
    const [selectedMl, setSelectedMl] = useState(50)
    const [selectedPrice, setSelectedPrice] = useState(product.price_num || 0)
    
    const mlPrices = parseMlPrices(product)
    const mlOptions = [50, 60, 70, 80, 90, 100]
    
    // Check if ML is available
    const isMlAvailable = (ml) => {
      if (ml === 50) return true
      return !!mlPrices[ml]
    }
    
    // Update price when ML changes
    useEffect(() => {
      const newPrice = getPriceForMl(product, selectedMl)
      setSelectedPrice(newPrice)
    }, [selectedMl])
    
    const discountPercent = calculateDiscountPercent(
      product.price_num, 
      product.discount_price
    )
    
    const displayPrice = `Rs. ${selectedPrice.toLocaleString()}`
    const originalPrice = product.discount_price 
      ? `Rs. ${product.price_num.toLocaleString()}`
      : null
    const imageUrl = getImageUrl(product.image_url)
    
    const handleWishlistClick = (e) => {
      e.preventDefault()
      e.stopPropagation()
      
      if (!user) {
        navigate('/login')
        return
      }
      
      if (wishlistState.includes(productId)) {
        removeFromWishlist(productId)
      } else {
        addToWishlist({
          id: productId,
          name: product.name,
          price: displayPrice,
          priceNum: selectedPrice,
          rating: product.rating,
          image: imageUrl,
          ml_prices: mlPrices
        })
      }
    }
    
    const handleAddToCartClick = (e) => {
      e.preventDefault()
      e.stopPropagation()
      
      if (!user) {
        navigate('/login')
        return
      }
      
      addToCart({
        id: productId,
        name: product.name,
        price: displayPrice,
        priceNum: selectedPrice,
        rating: product.rating,
        image: imageUrl,
        ml: selectedMl,
        ml_prices: mlPrices,
        product: {
          ml_prices: mlPrices
        }
      })
    }
    
    const handleMlChange = (e, ml) => {
      e.preventDefault()
      e.stopPropagation()
      setSelectedMl(ml)
    }
    
    return (
      <div className="product-card deal-card">
        {discountPercent > 0 && (
          <div className="discount-tag">{discountPercent}% OFF</div>
        )}
        <div className="product-image">
          <img 
            src={imageUrl} 
            alt={product.name}
            style={{ width: '100%', height: '200px', objectFit: 'cover' }}
            onError={(e) => {
              console.error('Image failed:', imageUrl)
              e.target.src = 'https://via.placeholder.com/300x300/8B4513/white?text=No+Image'
            }}
          />
          <button 
            className="wishlist-btn" 
            onClick={handleWishlistClick}
          >
            {wishlistState.includes(productId) ? (
              <FaHeart color="#d4af37" />
            ) : (
              <FaRegHeart />
            )}
          </button>
        </div>
        <div className="product-info">
          <h4>{product.name}</h4>
          <div className="price-row">
            {originalPrice && (
              <span className="original-price">{originalPrice}</span>
            )}
            <span className="product-price">{displayPrice}</span>
          </div>
          <div className="product-rating">
            <span className="stars">★★★★★</span>
            <span className="rating-count">({product.rating || 0})</span>
          </div>
          
          {/* ✅ ML SELECTOR */}
          <div className="ml-selector" onClick={(e) => e.preventDefault()}>
            <span className="ml-label">Size:</span>
            <div className="ml-options">
              {mlOptions.map(ml => {
                const priceForMl = getPriceForMl(product, ml)
                return (
                  <button
                    key={ml}
                    className={`ml-btn ${selectedMl === ml ? 'active' : ''} ${!isMlAvailable(ml) ? 'disabled' : ''}`}
                    onClick={(e) => isMlAvailable(ml) && handleMlChange(e, ml)}
                    disabled={!isMlAvailable(ml)}
                    title={isMlAvailable(ml) ? `${ml}ml - Rs. ${priceForMl.toLocaleString()}` : 'Not available'}
                  >
                    {ml}ml
                  </button>
                )
              })}
            </div>
          </div>
          
          <button 
            className="add-to-cart" 
            onClick={handleAddToCartClick}
          >
            <FaShoppingCart /> Add to Cart
          </button>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="shop-page">
        <div className="shop-header">
          <h1>Hot Deals 🔥</h1>
          <p>Limited time offers. Up to 40% off on selected attars!</p>
        </div>
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading deals...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="shop-page">
        <div className="shop-header">
          <h1>Hot Deals 🔥</h1>
          <p>Limited time offers. Up to 40% off on selected attars!</p>
        </div>
        <div className="error-container">
          <p>⚠️ Error: {error}</p>
          <button onClick={fetchDealsProducts}>Try Again</button>
        </div>
      </div>
    )
  }

  return (
    <div className="shop-page">
      <div className="shop-header">
        <h1>Hot Deals </h1>
        <p>Limited time offers. Up to 40% off on selected attars!</p>
      </div>
      
      <div className="products-section">
        {dealsProducts.length === 0 ? (
          <div className="no-products">
            <p>No active deals at the moment. Check back soon!</p>
          </div>
        ) : (
          <div className="products-grid">
            {dealsProducts.map(product => (
              <ProductCardComponent key={product.product_id || product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default DealsPage