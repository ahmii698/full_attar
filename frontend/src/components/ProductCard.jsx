import { useState, useEffect, memo } from 'react'
import { Link } from 'react-router-dom'
import { FaHeart, FaRegHeart, FaShoppingCart, FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa'
import { useCart } from '../contexts/CartContext';
import { API_URL } from "../../config";


function ProductCard({ id, name, price, rating, priceNum, image_url, discount_price, discount_percent, is_deal, ml_prices }) {
  const { addToCart, addToWishlist, removeFromWishlist, wishlistItems } = useCart()
  
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [selectedMl, setSelectedMl] = useState(3) // ✅ Default 3ml
  const [selectedPrice, setSelectedPrice] = useState(priceNum)

  // const API_URL = 'http://127.0.0.1:8000'

  // ✅ Parse ml_prices
  const mlPrices = ml_prices && typeof ml_prices === 'object' ? ml_prices : {}
  
  // ✅ SIRF 3 ML OPTIONS: 3, 6, 12
  const mlOptions = [3, 6, 12]

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
    if (ml === 3) return true // ✅ 3ml always available
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
      return `${API_URL}${image_url}`
    }
    
    if (image_url.startsWith('/storage/')) {
      return `${API_URL}${image_url}`
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
  
  // ✅ Product object with ml_prices
  const product = {
    id,
    name,
    price: displayPrice,
    priceNum: selectedPrice || discount_price || priceNum || 0,
    rating: rating || 0,
    image: getImageUrl(),
    originalPrice: originalPrice,
    ml: selectedMl,
    ml_prices: mlPrices,
    product: {
      ml_prices: mlPrices
    }
  }
  
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
    addToCart(product)
  }

  const handleMlChange = (e, ml) => {
    e.preventDefault()
    e.stopPropagation()
    setSelectedMl(ml)
  }
  
  const finalImageUrl = getImageUrl()

  // ✅ DYNAMIC STARS FUNCTION
  const renderStars = (rating) => {
    const stars = []
    const numRating = Number(rating) || 0
    const fullStars = Math.floor(numRating)
    const hasHalfStar = numRating % 1 >= 0.5
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={`full-${i}`} className="star-filled" />)
    }
    if (hasHalfStar) {
      stars.push(<FaStarHalfAlt key="half" className="star-half" />)
    }
    const emptyStars = 5 - stars.length
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<FaRegStar key={`empty-${i}`} className="star-empty" />)
    }
    return stars
  }
  
  return (
    <Link to={`/product/${id}`} className="product-card-link">
      <div className={`product-card ${is_deal ? 'deal-card' : ''}`}>
        {is_deal && calculatedDiscountPercent > 0 && (
          <div className="discount-tag">{calculatedDiscountPercent}%</div>
        )}
        
        <div className="product-image">
          <img 
            src={finalImageUrl} 
            alt={name}
            onError={(e) => {
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
            <span className="product-price">{displayPrice}</span>
            {originalPrice && (
              <span className="original-price">{originalPrice}</span>
            )}
            <div className="product-rating">
              <span className="stars">
                {renderStars(rating || 0)}
              </span>
              <span className="rating-count">({rating || 0})</span>
            </div>
          </div>

          {/* ✅ ML SELECTOR - SIRF 3 BUTTONS: 3ml, 6ml, 12ml */}
          <div className="ml-selector" onClick={(e) => e.preventDefault()}>
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

export default memo(ProductCard)