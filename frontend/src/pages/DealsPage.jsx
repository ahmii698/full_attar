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

  const handleWishlist = (product) => {
    if (!user) {
      navigate('/login')
      return
    }
    
    const productId = product.product_id || product.id
    
    if (wishlistState.includes(productId)) {
      removeFromWishlist(productId)
    } else {
      addToWishlist({
        id: productId,
        name: product.name,
        price: product.discount_price ? `Rs. ${product.discount_price}` : product.price,
        priceNum: product.discount_price || product.price_num,
        rating: product.rating,
        image: getImageUrl(product.image_url)
      })
    }
  }
  
  const handleAddToCart = (product) => {
    if (!user) {
      navigate('/login')
      return
    }
    
    const productId = product.product_id || product.id
    
    addToCart({
      id: productId,
      name: product.name,
      price: product.discount_price ? `Rs. ${product.discount_price}` : product.price,
      priceNum: product.discount_price || product.price_num,
      rating: product.rating,
      image: getImageUrl(product.image_url)
    })
  }
  
  const isInWishlist = (productId) => wishlistState.includes(productId)

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
            {dealsProducts.map(product => {
              const productId = product.product_id || product.id
              const discountPercent = calculateDiscountPercent(
                product.price_num, 
                product.discount_price
              )
              const displayPrice = product.discount_price 
                ? `Rs. ${product.discount_price.toLocaleString()}`
                : product.price
              const originalPrice = product.discount_price 
                ? `Rs. ${product.price_num.toLocaleString()}`
                : null
              const imageUrl = getImageUrl(product.image_url)
              
              return (
                <div key={productId} className="product-card deal-card">
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
                      onClick={() => handleWishlist(product)}
                    >
                      {isInWishlist(productId) ? (
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
                    <button 
                      className="add-to-cart" 
                      onClick={() => handleAddToCart(product)}
                    >
                      <FaShoppingCart /> Add to Cart
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default DealsPage