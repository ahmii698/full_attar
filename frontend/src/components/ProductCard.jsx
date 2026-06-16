import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FaHeart, FaRegHeart, FaShoppingCart } from 'react-icons/fa'
import { useCart } from '../contexts/CartContext'

function ProductCard({ id, name, price, rating, priceNum, image_url, discount_price, discount_percent, is_deal, ml_prices }) {
  const { addToCart, addToWishlist, removeFromWishlist, wishlistItems } = useCart()
  
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [selectedMl, setSelectedMl] = useState(50)
  const [selectedPrice, setSelectedPrice] = useState(priceNum)

  const APP_URL = 'http://127.0.0.1:8000'
  const FRONTEND_URL = 'http://localhost:5173'

  // ✅ FORCE PARSE ml_prices - DIRECTLY USE WHAT'S PASSED
  const mlPrices = ml_prices && typeof ml_prices === 'object' ? ml_prices : {}
  
  // ✅ DEBUG: Check what's coming
  console.log('🔍 Product ID:', id)
  console.log('🔍 ml_prices prop:', ml_prices)
  console.log('🔍 Parsed mlPrices:', mlPrices)
  
  const mlOptions = [50, 60, 70, 80, 90, 100]

  const getPriceForMl = (ml) => {
    if (mlPrices && mlPrices[ml]) {
      return Number(mlPrices[ml])
    }
    return priceNum || 0
  }

  const getDisplayPriceForMl = (ml) => {
    const p = getPriceForMl(ml)
    return `Rs. ${p.toLocaleString()}`
  }

  const isMlAvailable = (ml) => {
    if (ml === 50) return true
    return !!(mlPrices && mlPrices[ml])
  }

  useEffect(() => {
    const newPrice = getPriceForMl(selectedMl)
    setSelectedPrice(newPrice)
  }, [selectedMl])

  useEffect(() => {
    setIsWishlisted(wishlistItems.some(item => item.id === id))
  }, [wishlistItems, id])

  const getImageUrl = () => {
    if (!image_url) {
      return 'https://via.placeholder.com/300x300/8B4513/white?text=No+Image'
    }
    
    if (image_url.startsWith('http://') || image_url.startsWith('https://')) {
      return image_url
    }
    
    if (image_url.startsWith('/images/')) {
      return `${APP_URL}${image_url}`
    }
    
    if (image_url.startsWith('/storage/')) {
      return `${APP_URL}${image_url}`
    }
    
    if (image_url.startsWith('/assets/')) {
      const filename = image_url.split('/').pop()
      return `/assets/${filename}`
    }
    
    return 'https://via.placeholder.com/300x300/8B4513/white?text=No+Image'
  }
  
  const calculatedDiscountPercent = discount_percent || (priceNum && discount_price ? Math.round(((priceNum - discount_price) / priceNum) * 100) : 0)
  
  const displayPrice = discount_price ? `Rs. ${discount_price.toLocaleString()}` : getDisplayPriceForMl(selectedMl)
  const originalPrice = discount_price ? price : null
  
  // ✅ CRITICAL FIX: Product object with ml_prices
  const product = {
    id,
    name,
    price: displayPrice,
    priceNum: selectedPrice || discount_price || priceNum || 0,
    rating: rating || 0,
    image: getImageUrl(),
    originalPrice: originalPrice,
    ml: selectedMl,
    ml_prices: mlPrices,  // ✅ Database se aayi hui ml_prices
    product: {
      ml_prices: mlPrices  // ✅ Database se aayi hui ml_prices
    }
  }
  
  console.log('📦 Product being sent to cart:', product)
  
  const handleWishlist = (e) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (isWishlisted) {
      removeFromWishlist(id)
    } else {
      addToWishlist(product)
    }
  }
  
  const handleAddToCart = (e) => {
    e.preventDefault()
    e.stopPropagation()
    console.log('🛒 Adding to cart with ml_prices:', mlPrices)
    addToCart(product)
  }

  const handleMlChange = (e, ml) => {
    e.preventDefault()
    e.stopPropagation()
    setSelectedMl(ml)
  }
  
  const finalImageUrl = getImageUrl()
  
  return (
    <Link to={`/product/${id}`} className="product-card-link">
      <div className={`product-card ${is_deal ? 'deal-card' : ''}`}>
        {is_deal && calculatedDiscountPercent > 0 && (
          <div className="discount-tag">{calculatedDiscountPercent}% OFF</div>
        )}
        
        <div className="product-image">
          <img 
            src={finalImageUrl} 
            alt={name}
            onError={(e) => {
              console.error('Image failed:', finalImageUrl)
              e.target.src = 'https://via.placeholder.com/300x300/8B4513/white?text=No+Image'
            }}
          />
          <button className="wishlist-btn" onClick={handleWishlist}>
            {isWishlisted ? <FaHeart color="#d4af37" /> : <FaRegHeart />}
          </button>
        </div>
        <div className="product-info">
          <h4>{name}</h4>
          <div className="product-price-row">
            {originalPrice ? (
              <>
                <span className="original-price">{originalPrice}</span>
                <span className="product-price">{displayPrice}</span>
              </>
            ) : (
              <span className="product-price">{getDisplayPriceForMl(selectedMl)}</span>
            )}
            <div className="product-rating">
              <span className="stars">★★★★★</span>
              <span className="rating-count">({rating || 0})</span>
            </div>
          </div>

          {/* ML SELECTOR */}
          <div className="ml-selector" onClick={(e) => e.preventDefault()}>
            <span className="ml-label">Size:</span>
            <div className="ml-options">
              {mlOptions.map(ml => (
                <button
                  key={ml}
                  className={`ml-btn ${selectedMl === ml ? 'active' : ''} ${!isMlAvailable(ml) ? 'disabled' : ''}`}
                  onClick={(e) => isMlAvailable(ml) && handleMlChange(e, ml)}
                  disabled={!isMlAvailable(ml)}
                  title={isMlAvailable(ml) ? `${ml}ml - ${getDisplayPriceForMl(ml)}` : 'Not available'}
                >
                  {ml}ml
                </button>
              ))}
            </div>
          </div>

          <button className="add-to-cart" onClick={handleAddToCart}>
            <FaShoppingCart /> Add to Cart
          </button>
        </div>
      </div>
    </Link>
  )
}

export default ProductCard