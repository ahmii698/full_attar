import { useState, useEffect, memo } from 'react'
import { Link } from 'react-router-dom'
import { FaHeart, FaRegHeart, FaShoppingCart, FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa'
import { useCart } from '../contexts/CartContext';
import { STORAGE_URL } from "../../config";
import './ProductCard.css'

function ProductCard({ 
  id, 
  name, 
  price, 
  rating, 
  priceNum, 
  image_url, 
  discount_price, 
  discount_percent, 
  is_deal, 
  ml_prices,
  theme = 'dark' // ✅ Default dark, 'light' for Theme 4
}) {
  const { addToCart, addToWishlist, removeFromWishlist, wishlistItems } = useCart()
  
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [selectedMl, setSelectedMl] = useState(3)
  const [selectedPrice, setSelectedPrice] = useState(priceNum)

  const mlPrices = ml_prices && typeof ml_prices === 'object' ? ml_prices : {}
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
    if (ml === 3) return true
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
    if (image_url.startsWith('/assets/')) {
      return image_url
    }
    let cleanPath = image_url.replace(/^\/+/, '')
    cleanPath = cleanPath.replace(/^storage\//, '')
    cleanPath = cleanPath.replace(/^images\/(blogs|products)\//, '$1/')
    return `${STORAGE_URL.replace(/\/+$/, '')}/${cleanPath}`
  }
  
  const calculatedDiscountPercent = discount_percent || (priceNum && discount_price ? Math.round(((priceNum - discount_price) / priceNum) * 100) : 0)
  
  const displayPrice = discount_price ? `Rs. ${discount_price.toLocaleString()}` : getDisplayPriceForMl(selectedMl)
  const originalPrice = discount_price ? price : null
  
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

  const renderStars = (rating) => {
    const stars = []
    const numRating = Number(rating) || 0
    const fullStars = Math.floor(numRating)
    const hasHalfStar = numRating % 1 >= 0.5
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={`full-${i}`} className={theme === 'light' ? 'star-filled-light' : 'star-filled'} />)
    }
    if (hasHalfStar) {
      stars.push(<FaStarHalfAlt key="half" className={theme === 'light' ? 'star-half-light' : 'star-half'} />)
    }
    const emptyStars = 5 - stars.length
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<FaRegStar key={`empty-${i}`} className={theme === 'light' ? 'star-empty-light' : 'star-empty'} />)
    }
    return stars
  }

  // ✅ Theme-based class names
  const isLight = theme === 'light'
  
  const cardClass = isLight ? 'product-card-light' : 'product-card'
  const linkClass = isLight ? 'product-card-link-light' : 'product-card-link'
  const dealClass = isLight ? 'deal-card-light' : 'deal-card'
  const imageClass = isLight ? 'product-image-light' : 'product-image'
  const wishlistClass = isLight ? 'wishlist-btn-light' : 'wishlist-btn'
  const heartClass = isLight ? 'heart-filled-light' : ''
  const infoClass = isLight ? 'product-info-light' : 'product-info'
  const nameClass = isLight ? '' : ''
  const priceRowClass = isLight ? 'product-price-row-light' : 'product-price-row'
  const priceClass = isLight ? 'product-price-light' : 'product-price'
  const originalPriceClass = isLight ? 'original-price-light' : 'original-price'
  const ratingClass = isLight ? 'product-rating-light' : 'product-rating'
  const starsClass = isLight ? 'stars-light' : 'stars'
  const ratingCountClass = isLight ? 'rating-count-light' : 'rating-count'
  const mlSelectorClass = isLight ? 'ml-selector-light' : 'ml-selector'
  const mlOptionsClass = isLight ? 'ml-options-light' : 'ml-options'
  const mlBtnClass = isLight ? 'ml-btn-light' : 'ml-btn'
  const addToCartClass = isLight ? 'add-to-cart-light' : 'add-to-cart'
  const discountClass = isLight ? 'discount-tag-light' : 'discount-tag'
  const discountLabelClass = isLight ? 'discount-label-light' : ''

  return (
    <Link to={`/product/${id}`} className={linkClass}>
      <div className={`${cardClass} ${is_deal ? dealClass : ''}`}>
        {is_deal && calculatedDiscountPercent > 0 && (
          <div className={discountClass}>
            <span>{calculatedDiscountPercent}%</span>
            {isLight && <span className={discountLabelClass}>OFF</span>}
          </div>
        )}
        
        <div className={imageClass}>
          <img 
            src={finalImageUrl} 
            alt={name}
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/300x300/8B4513/white?text=No+Image'
            }}
          />
          <button className={wishlistClass} onClick={handleWishlist}>
            {isWishlisted ? 
              <FaHeart className={heartClass} /> : 
              <FaRegHeart className={isLight ? 'heart-empty-light' : ''} />
            }
          </button>
        </div>
        <div className={infoClass}>
          <h4>{name}</h4>
          <div className={priceRowClass}>
            <span className={priceClass}>{displayPrice}</span>
            {originalPrice && (
              <span className={originalPriceClass}>{originalPrice}</span>
            )}
            <div className={ratingClass}>
              <span className={starsClass}>
                {renderStars(rating || 0)}
              </span>
              <span className={ratingCountClass}>({rating || 0})</span>
            </div>
          </div>

          <div className={mlSelectorClass} onClick={(e) => e.preventDefault()}>
            <div className={mlOptionsClass}>
              {mlOptions.map(ml => (
                <button
                  key={ml}
                  className={`${mlBtnClass} ${selectedMl === ml ? 'active' : ''} ${!isMlAvailable(ml) ? 'disabled' : ''}`}
                  onClick={(e) => isMlAvailable(ml) && handleMlChange(e, ml)}
                  disabled={!isMlAvailable(ml)}
                  title={isMlAvailable(ml) ? `${ml}ml - ${getDisplayPriceForMl(ml)}` : 'Not available'}
                >
                  {ml}ml
                </button>
              ))}
            </div>
          </div>

          <button className={addToCartClass} onClick={handleAddToCart}>
            <FaShoppingCart /> Add to Cart
          </button>
        </div>
      </div>
    </Link>
  )
}

export default memo(ProductCard)