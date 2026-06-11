import { useState, useEffect } from 'react'
import { FaHeart, FaRegHeart, FaShoppingCart } from 'react-icons/fa'
import { useCart } from '../contexts/CartContext'

function ProductCard({ id, name, price, rating, priceNum, image_url, discount_price, discount_percent, is_deal }) {
  const { addToCart, addToWishlist, removeFromWishlist, wishlistItems } = useCart()
  
  const [isWishlisted, setIsWishlisted] = useState(false)

  const APP_URL = 'http://127.0.0.1:8000'
  const FRONTEND_URL = 'http://localhost:5173'

  useEffect(() => {
    setIsWishlisted(wishlistItems.some(item => item.id === id))
  }, [wishlistItems, id])

  // ✅ Get image URL from database
  const getImageUrl = () => {
    if (!image_url) {
      return 'https://via.placeholder.com/300x300/8B4513/white?text=No+Image'
    }
    
    // If already full URL
    if (image_url.startsWith('http://') || image_url.startsWith('https://')) {
      return image_url
    }
    
    // Uploaded image from admin panel (public/images/products/)
    if (image_url.startsWith('/images/')) {
      return `${APP_URL}${image_url}`
    }
    
    // Old storage images
    if (image_url.startsWith('/storage/')) {
      return `${APP_URL}${image_url}`
    }
    
    // Local assets (frontend public folder)
    if (image_url.startsWith('/assets/')) {
      const filename = image_url.split('/').pop()
      return `/assets/${filename}`
    }
    
    return 'https://via.placeholder.com/300x300/8B4513/white?text=No+Image'
  }
  
  // Calculate discount percent if not provided
  const calculatedDiscountPercent = discount_percent || (priceNum && discount_price ? Math.round(((priceNum - discount_price) / priceNum) * 100) : 0)
  
  // Determine display price
  const displayPrice = discount_price ? `Rs. ${discount_price.toLocaleString()}` : price
  const originalPrice = discount_price ? price : null
  
  const product = {
    id,
    name,
    price: displayPrice,
    priceNum: discount_price || priceNum || 0,
    rating: rating || 0,
    image: getImageUrl(),
    originalPrice: originalPrice
  }
  
  const handleWishlist = () => {
    if (isWishlisted) {
      removeFromWishlist(id)
    } else {
      addToWishlist(product)
    }
  }
  
  const finalImageUrl = getImageUrl()
  
  return (
    <div className={`product-card ${is_deal ? 'deal-card' : ''}`}>
      {/* Discount Badge */}
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
            <span className="product-price">{displayPrice}</span>
          )}
          <div className="product-rating">
            <span className="stars">★★★★★</span>
            <span className="rating-count">({rating || 0})</span>
          </div>
        </div>
        <button className="add-to-cart" onClick={() => addToCart(product)}>
          <FaShoppingCart /> Add to Cart
        </button>
      </div>
    </div>
  )
}

export default ProductCard