import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { FaHeart, FaRegHeart, FaShoppingCart, FaStar, FaStarHalfAlt, FaChevronDown, FaChevronUp } from 'react-icons/fa'
import { useCart } from '../contexts/CartContext'
import { useAuth } from '../contexts/AuthContext'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

function ProductDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { addToCart, addToWishlist, removeFromWishlist, wishlistItems } = useCart()
  
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [selectedMl, setSelectedMl] = useState(50)
  const [selectedPrice, setSelectedPrice] = useState(0)
  const [showAllHighlights, setShowAllHighlights] = useState(false)
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)

  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api'
  const APP_URL = 'http://127.0.0.1:8000'
  const FRONTEND_URL = 'http://localhost:5173'

  // ✅ Check window resize for mobile detection
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    fetchProduct()
  }, [id])

  useEffect(() => {
    if (product && wishlistItems) {
      setIsWishlisted(wishlistItems.some(item => item.id === product.product_id))
    }
  }, [product, wishlistItems])

  useEffect(() => {
    if (product) {
      const defaultPrice = getPriceForMl(50)
      setSelectedPrice(defaultPrice)
    }
  }, [product])

  const fetchProduct = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${API_BASE_URL}/products/${id}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch product')
      }
      
      const data = await response.json()
      setProduct(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const getMlPrices = () => {
    if (!product) return {}
    if (product.ml_prices && typeof product.ml_prices === 'object') {
      return product.ml_prices
    }
    return {}
  }

  const getPriceForMl = (ml) => {
    const mlPrices = getMlPrices()
    if (mlPrices[ml]) {
      return Number(mlPrices[ml])
    }
    return product?.price_num || 0
  }

  const getDisplayPriceForMl = (ml) => {
    const price = getPriceForMl(ml)
    return `Rs. ${price.toLocaleString()}`
  }

  const isMlAvailable = (ml) => {
    if (ml === 50) return true
    const mlPrices = getMlPrices()
    return !!mlPrices[ml]
  }

  const handleMlChange = (ml) => {
    setSelectedMl(ml)
    const newPrice = getPriceForMl(ml)
    setSelectedPrice(newPrice)
  }

  const getImageUrl = (imagePath) => {
    if (!imagePath) {
      return 'https://via.placeholder.com/500x500/8B4513/white?text=No+Image'
    }
    
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath
    }
    
    if (imagePath.startsWith('/images/')) {
      return `${APP_URL}${imagePath}`
    }
    
    if (imagePath.startsWith('/storage/')) {
      return `${APP_URL}${imagePath}`
    }
    
    if (imagePath.startsWith('/assets/')) {
      const filename = imagePath.split('/').pop()
      return `${FRONTEND_URL}/assets/${filename}`
    }
    
    return 'https://via.placeholder.com/500x500/8B4513/white?text=No+Image'
  }

  const parseNotes = (notesStr) => {
    if (!notesStr) return []
    return notesStr.split(',').map(n => n.trim())
  }

  const renderStars = (rating) => {
    const stars = []
    const numRating = Number(rating) || 0
    const fullStars = Math.floor(numRating)
    const hasHalfStar = numRating % 1 >= 0.5
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={i} className="star-filled" />)
    }
    if (hasHalfStar) {
      stars.push(<FaStarHalfAlt key="half" className="star-half" />)
    }
    const emptyStars = 5 - stars.length
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<FaStar key={`empty-${i}`} className="star-empty" />)
    }
    return stars
  }

  const handleQuantityChange = (type) => {
    if (type === 'increase') {
      setQuantity(prev => prev + 1)
    } else if (type === 'decrease' && quantity > 1) {
      setQuantity(prev => prev - 1)
    }
  }

  const handleAddToCart = () => {
    if (!user) {
      toast.warning('Please login to add items to cart')
      navigate('/login')
      return
    }
    
    const productData = {
      id: product.product_id,
      name: product.name,
      price: `Rs. ${selectedPrice.toLocaleString()}`,
      priceNum: selectedPrice,
      rating: product.rating,
      image: getImageUrl(product.image_url),
      quantity: quantity,
      ml: selectedMl,
      ml_prices: getMlPrices(),
      product: {
        ml_prices: getMlPrices()
      }
    }
    
    for (let i = 0; i < quantity; i++) {
      addToCart(productData)
    }
    
    toast.success(`Added ${quantity} x ${product.name} (${selectedMl}ml) to cart!`, {
      position: "bottom-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    })
  }

  const handleWishlist = () => {
    if (!user) {
      toast.warning('Please login to add items to wishlist')
      navigate('/login')
      return
    }
    
    const productData = {
      id: product.product_id,
      name: product.name,
      price: `Rs. ${selectedPrice.toLocaleString()}`,
      priceNum: selectedPrice,
      rating: product.rating,
      image: getImageUrl(product.image_url),
      ml_prices: getMlPrices()
    }
    
    if (isWishlisted) {
      removeFromWishlist(product.product_id)
      setIsWishlisted(false)
      toast.info(`${product.name} removed from wishlist`, {
        position: "bottom-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      })
    } else {
      addToWishlist(productData)
      setIsWishlisted(true)
      toast.success(`${product.name} added to wishlist!`, {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      })
    }
  }

  if (loading) {
    return <div className="product-detail-page"><div className="loading-container">Loading...</div></div>
  }

  if (error || !product) {
    return (
      <div className="product-detail-page">
        <div className="error-container">
          <h2>Product Not Found</h2>
          <Link to="/shop" className="back-to-shop">← Back to Shop</Link>
        </div>
      </div>
    )
  }

  const mlOptions = [50, 60, 70, 80, 90, 100]
  const mlPrices = getMlPrices()
  const discountPercent = product.discount_price ? Math.round(((product.price_num - product.discount_price) / product.price_num) * 100) : 0
  const displayPrice = `Rs. ${selectedPrice.toLocaleString()}`
  const originalPrice = product.discount_price ? `Rs. ${product.price_num.toLocaleString()}` : null
  const fragranceNotes = parseNotes(product.notes)
  const imageUrl = getImageUrl(product.image_url)
  
  // ✅ Get top highlights - filter out empty ones
  const topHighlights = (product.top_highlights || []).filter(h => h.label && h.value)
  
  // ✅ Desktop: Show all, Mobile: Show first 3 then view all
  const initialDisplayCount = isMobile ? 3 : topHighlights.length
  const displayHighlights = showAllHighlights ? topHighlights : topHighlights.slice(0, initialDisplayCount)
  const shouldShowViewAll = isMobile && topHighlights.length > 3

  return (
    <>
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        style={{ zIndex: 9999 }}
      />
      
      <div className="product-detail-page">
        <div className="product-detail-container">
          <div className="breadcrumb">
            <Link to="/">Home</Link> / <Link to="/shop">Shop</Link> / <span>{product.name}</span>
          </div>

          <div className="product-detail-grid">
            <div className="product-detail-image">
              <img 
                src={imageUrl} 
                alt={product.name}
                onError={(e) => {
                  console.error('Image load error from:', imageUrl)
                  e.target.src = 'https://via.placeholder.com/500x500/8B4513/white?text=No+Image'
                }}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  borderRadius: '12px'
                }}
              />
            </div>

            <div className="product-detail-info">
              <h1>{product.name}</h1>
              
              <div className="product-rating-section">
                <div className="stars">{renderStars(product.rating || 0)}</div>
                <span className="rating-count">({product.rating || 0} reviews)</span>
              </div>
              
              <div className="product-price-section">
                {originalPrice ? (
                  <>
                    <span className="original-price">{originalPrice}</span>
                    <span className="discount-price">{displayPrice}</span>
                    <span className="discount-badge">{discountPercent}% OFF</span>
                  </>
                ) : (
                  <span className="product-price">{displayPrice}</span>
                )}
              </div>
              
              <div className="product-meta">
                <div className="meta-item">
                  <span className="meta-label">Category:</span>
                  <span className="meta-value">{product.category}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Gender:</span>
                  <span className="meta-value">{product.gender}</span>
                </div>
                {fragranceNotes.length > 0 && (
                  <div className="meta-item">
                    <span className="meta-label">Fragrance Notes:</span>
                    <span className="meta-value">{fragranceNotes.join(', ')}</span>
                  </div>
                )}
                <div className="meta-item">
                  <span className="meta-label">Stock:</span>
                  <span className="meta-value in-stock">In Stock</span>
                </div>
              </div>

              {/* ML SELECTOR */}
              <div className="ml-selector-section">
                <span className="ml-label">Select Size:</span>
                <div className="ml-options">
                  {mlOptions.map(ml => (
                    <button
                      key={ml}
                      className={`ml-btn ${selectedMl === ml ? 'active' : ''} ${!isMlAvailable(ml) ? 'disabled' : ''}`}
                      onClick={() => isMlAvailable(ml) && handleMlChange(ml)}
                      disabled={!isMlAvailable(ml)}
                    >
                      {ml}ml
                      <span className="ml-price">
                        {getDisplayPriceForMl(ml)}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="quantity-section">
                <span className="quantity-label">Quantity:</span>
                <div className="quantity-selector">
                  <button onClick={() => handleQuantityChange('decrease')}>-</button>
                  <span>{quantity}</span>
                  <button onClick={() => handleQuantityChange('increase')}>+</button>
                </div>
              </div>
              
              <div className="action-buttons">
                <button className="add-to-cart-btn" onClick={handleAddToCart}>
                  <FaShoppingCart /> Add to Cart
                </button>
                <button className={`wishlist-btn ${isWishlisted ? 'active' : ''}`} onClick={handleWishlist}>
                  {isWishlisted ? <FaHeart /> : <FaRegHeart />}
                  {isWishlisted ? ' Added to Wishlist' : ' Add to Wishlist'}
                </button>
              </div>
            </div>
          </div>

          {/* ✅ TOP HIGHLIGHTS SECTION - VIEW ALL ONLY ON MOBILE */}
          {topHighlights.length > 0 && (
            <div className="top-highlights-section">
              <h3 className="highlights-title"> Top Highlights</h3>
              <div className={`highlights-grid ${isMobile ? 'mobile-grid' : 'desktop-grid'}`}>
                {displayHighlights.map((highlight, index) => (
                  <div key={index} className="highlight-item">
                    <span className="highlight-label">{highlight.label}</span>
                    <span className="highlight-value">{highlight.value}</span>
                  </div>
                ))}
              </div>
              
              {/* ✅ View All / Show Less Button - ONLY ON MOBILE */}
              {shouldShowViewAll && (
                <button 
                  className="view-all-highlights-btn"
                  onClick={() => setShowAllHighlights(!showAllHighlights)}
                >
                  {showAllHighlights ? (
                    <>Show Less <FaChevronUp /></>
                  ) : (
                    <>View All ({topHighlights.length}) <FaChevronDown /></>
                  )}
                </button>
              )}
            </div>
          )}

          {/* ✅ DESCRIPTION SECTION - SCROLLABLE WITH HTML RENDERING */}
          <div className="description-section">
            <h3 className="description-title">Description</h3>
            <div className="description-content">
              {product.description ? (
                <div 
                  className="description-scroll"
                  dangerouslySetInnerHTML={{ __html: product.description }}
                />
              ) : (
                <p className="no-description">No description available for this product.</p>
              )}
            </div>
          </div>
        </div>

        <style>{`
          .product-detail-page {
            max-width: 1200px;
            margin: 0 auto;
            padding: 130px 20px 40px;
            min-height: 60vh;
            background: #0a0a0a;
          }

          .breadcrumb {
            margin-bottom: 30px;
            font-size: 16px;
            color: rgba(255,255,255,0.5);
          }
          .breadcrumb a {
            color: #d4af37;
            text-decoration: none;
          }
          .breadcrumb span {
            color: rgba(255,255,255,0.7);
          }

          .product-detail-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 50px;
            margin-bottom: 50px;
          }

          .product-detail-image {
            background: transparent;
            border-radius: 20px;
            padding: 0;
            border: none;
            text-align: center;
            overflow: hidden;
            height: 500px;
            width: 100%;
          }
          .product-detail-image img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            border-radius: 16px;
          }

          .product-detail-info h1 {
            font-size: 38px;
            font-weight: 700;
            margin-bottom: 15px;
            color: #fff;
          }

          .product-rating-section {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-bottom: 20px;
          }
          .stars {
            display: flex;
            gap: 4px;
          }
          .star-filled {
            color: #ffc107;
            font-size: 20px;
          }
          .star-half {
            color: #ffc107;
            font-size: 20px;
          }
          .star-empty {
            color: rgba(255,255,255,0.2);
            font-size: 20px;
          }
          .rating-count {
            color: rgba(255,255,255,0.5);
            font-size: 15px;
          }

          .product-price-section {
            margin-bottom: 20px;
            padding-bottom: 15px;
            border-bottom: 1px solid rgba(212,175,55,0.1);
          }
          .original-price {
            text-decoration: line-through;
            color: rgba(255,255,255,0.4);
            font-size: 18px;
            margin-right: 10px;
          }
          .discount-price, .product-price {
            font-size: 32px;
            font-weight: 700;
            color: #d4af37;
          }
          .discount-badge {
            background: #ff4444;
            color: #fff;
            padding: 3px 10px;
            border-radius: 15px;
            font-size: 13px;
            margin-left: 10px;
          }

          .product-meta {
            background: rgba(255,255,255,0.03);
            border-radius: 12px;
            padding: 15px 20px;
            margin-bottom: 25px;
          }
          .meta-item {
            display: flex;
            margin-bottom: 10px;
            font-size: 15px;
          }
          .meta-label {
            width: 120px;
            color: #d4af37;
            font-weight: 500;
          }
          .meta-value {
            color: rgba(255,255,255,0.8);
          }
          .in-stock {
            color: #4caf50;
            font-weight: 500;
          }

          .ml-selector-section {
            margin-bottom: 25px;
            padding: 18px 20px;
            background: rgba(255,255,255,0.03);
            border-radius: 12px;
            border: 1px solid rgba(212,175,55,0.1);
          }
          .ml-label {
            display: block;
            color: rgba(255,255,255,0.6);
            font-size: 15px;
            font-weight: 500;
            margin-bottom: 12px;
          }
          .ml-options {
            display: flex;
            gap: 10px;
            flex-wrap: wrap;
          }
          .ml-btn {
            background: rgba(255,255,255,0.05);
            border: 1px solid rgba(255,255,255,0.08);
            border-radius: 25px;
            padding: 8px 16px;
            font-size: 14px;
            color: rgba(255,255,255,0.5);
            cursor: pointer;
            transition: all 0.3s;
            font-family: inherit;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 3px;
            min-width: 65px;
          }
          .ml-btn:hover:not(.disabled):not(.active) {
            background: rgba(255,255,255,0.1);
            border-color: rgba(255,255,255,0.2);
            color: #fff;
          }
          .ml-btn.active {
            background: linear-gradient(135deg, #d4af37, #b8960c);
            border-color: #d4af37;
            color: #000;
            font-weight: 600;
          }
          .ml-btn.active .ml-price {
            opacity: 1;
          }
          .ml-btn.disabled {
            opacity: 0.3;
            cursor: not-allowed;
          }
          .ml-price {
            font-size: 12px;
            font-weight: 400;
            opacity: 0.6;
          }

          .quantity-section {
            display: flex;
            align-items: center;
            gap: 20px;
            margin-bottom: 25px;
          }
          .quantity-label {
            color: rgba(255,255,255,0.7);
            font-size: 15px;
          }
          .quantity-selector {
            display: flex;
            align-items: center;
            gap: 15px;
            background: rgba(255,255,255,0.05);
            border-radius: 30px;
            padding: 3px 10px;
          }
          .quantity-selector button {
            width: 36px;
            height: 36px;
            border-radius: 50%;
            border: none;
            background: #d4af37;
            color: #000;
            font-size: 18px;
            font-weight: bold;
            cursor: pointer;
          }
          .quantity-selector span {
            font-size: 18px;
            min-width: 35px;
            text-align: center;
            color: #fff;
          }

          .action-buttons {
            display: flex;
            gap: 15px;
            flex-wrap: wrap;
          }
          .add-to-cart-btn {
            background: linear-gradient(135deg, #d4af37, #b8960c);
            color: #000;
            border: none;
            padding: 14px 32px;
            border-radius: 40px;
            font-weight: 700;
            font-size: 16px;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 10px;
            transition: 0.3s;
          }
          .add-to-cart-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(212,175,55,0.3);
          }
          .wishlist-btn {
            background: rgba(255,255,255,0.05);
            border: 1px solid rgba(212,175,55,0.3);
            color: #fff;
            padding: 14px 28px;
            border-radius: 40px;
            font-weight: 700;
            font-size: 16px;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 10px;
          }
          .wishlist-btn.active {
            background: rgba(212,175,55,0.2);
            color: #d4af37;
          }

          /* ✅ TOP HIGHLIGHTS */
          .top-highlights-section {
            background: rgba(255, 255, 255, 0.02);
            border-radius: 16px;
            padding: 25px 30px;
            margin: 25px 0;
            border: 1px solid rgba(212, 175, 55, 0.08);
          }

          .highlights-title {
            color: #d4af37;
            font-size: 18px;
            font-weight: 700;
            margin-bottom: 18px;
            padding-bottom: 10px;
            border-bottom: 1px solid rgba(212, 175, 55, 0.1);
            display: flex;
            align-items: center;
            gap: 8px;
          }

          /* ✅ DESKTOP GRID - 3 Columns */
          .highlights-grid.desktop-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 12px 20px;
          }

          /* ✅ MOBILE GRID - 1 Column */
          .highlights-grid.mobile-grid {
            display: grid;
            grid-template-columns: 1fr;
            gap: 10px;
          }

          .highlight-item {
            display: flex;
            flex-direction: column;
            padding: 10px 14px;
            background: rgba(255, 255, 255, 0.02);
            border-radius: 8px;
            border-left: 3px solid #d4af37;
            transition: all 0.3s ease;
          }

          .highlight-item:hover {
            background: rgba(255, 255, 255, 0.04);
            transform: translateX(3px);
          }

          .highlight-label {
            font-size: 11px;
            color: rgba(255, 255, 255, 0.4);
            text-transform: uppercase;
            letter-spacing: 0.5px;
            font-weight: 600;
          }

          .highlight-value {
            font-size: 14px;
            color: rgba(255, 255, 255, 0.9);
            font-weight: 500;
            margin-top: 3px;
          }

          /* ✅ VIEW ALL BUTTON - ONLY SHOW ON MOBILE */
          .view-all-highlights-btn {
            display: none;
            margin-top: 15px;
            padding: 10px 24px;
            background: rgba(212, 175, 55, 0.08);
            color: #d4af37;
            border: 1px solid rgba(212, 175, 55, 0.2);
            border-radius: 8px;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            align-items: center;
            gap: 8px;
            font-family: inherit;
          }

          .view-all-highlights-btn:hover {
            background: rgba(212, 175, 55, 0.15);
            border-color: #d4af37;
            transform: translateY(-2px);
          }

          .view-all-highlights-btn svg {
            font-size: 14px;
            transition: transform 0.3s ease;
          }

          /* ✅ SHOW VIEW ALL ONLY ON MOBILE */
          @media (max-width: 768px) {
            .view-all-highlights-btn {
              display: inline-flex;
            }
            
            .highlights-grid.desktop-grid {
              display: none;
            }
          }

          /* ✅ HIDE VIEW ALL ON DESKTOP */
          @media (min-width: 769px) {
            .view-all-highlights-btn {
              display: none !important;
            }
            
            .highlights-grid.mobile-grid {
              display: none;
            }
          }

          /* ✅ DESCRIPTION SECTION - SCROLLABLE */
          .description-section {
            background: rgba(255,255,255,0.02);
            border-radius: 16px;
            padding: 30px 35px;
            margin-top: 25px;
            border: 1px solid rgba(212,175,55,0.1);
            max-height: 400px;
            display: flex;
            flex-direction: column;
          }

          .description-title {
            color: #d4af37;
            font-size: 22px;
            font-weight: 700;
            margin-bottom: 18px;
            padding-bottom: 12px;
            border-bottom: 1px solid rgba(212,175,55,0.2);
            flex-shrink: 0;
          }

          .description-content {
            flex: 1;
            overflow-y: auto;
            padding-right: 10px;
          }

          .description-content::-webkit-scrollbar {
            width: 6px;
          }

          .description-content::-webkit-scrollbar-track {
            background: rgba(255,255,255,0.03);
            border-radius: 3px;
          }

          .description-content::-webkit-scrollbar-thumb {
            background: #d4af37;
            border-radius: 3px;
          }

          .description-content::-webkit-scrollbar-thumb:hover {
            background: #b8960c;
          }

          /* ✅ DESCRIPTION HTML CONTENT STYLING */
          .description-scroll {
            color: #ffffff;
            line-height: 1.9;
            font-size: 16px;
          }

          .description-scroll h1,
          .description-scroll h2,
          .description-scroll h3,
          .description-scroll h4,
          .description-scroll h5,
          .description-scroll h6 {
            color: #d4af37;
            margin-top: 18px;
            margin-bottom: 12px;
            font-weight: 600;
          }

          .description-scroll h1 { font-size: 28px; }
          .description-scroll h2 { font-size: 24px; }
          .description-scroll h3 { font-size: 20px; }
          .description-scroll h4 { font-size: 18px; }
          .description-scroll h5 { font-size: 16px; }
          .description-scroll h6 { font-size: 14px; }

          .description-scroll p {
            margin-bottom: 14px;
            line-height: 1.8;
          }

          .description-scroll strong,
          .description-scroll b {
            color: #d4af37;
            font-weight: 700;
          }

          .description-scroll ul,
          .description-scroll ol {
            padding-left: 24px;
            margin-bottom: 14px;
          }

          .description-scroll li {
            margin-bottom: 6px;
            line-height: 1.6;
          }

          .description-scroll blockquote {
            border-left: 4px solid #d4af37;
            padding-left: 16px;
            margin: 14px 0;
            color: rgba(255,255,255,0.8);
            font-style: italic;
          }

          .description-scroll a {
            color: #d4af37;
            text-decoration: underline;
          }

          .description-scroll code {
            background: rgba(255,255,255,0.05);
            padding: 2px 8px;
            border-radius: 4px;
            font-family: monospace;
            font-size: 14px;
          }

          .description-scroll img {
            max-width: 100%;
            border-radius: 8px;
            margin: 10px 0;
          }

          .description-scroll br {
            display: block;
            content: "";
            margin: 5px 0;
          }

          .no-description {
            color: rgba(255,255,255,0.4);
            font-style: italic;
            text-align: center;
            padding: 20px 0;
          }

          .loading-container, .error-container {
            text-align: center;
            padding: 60px;
          }
          .back-to-shop {
            display: inline-block;
            margin-top: 15px;
            color: #d4af37;
            text-decoration: none;
          }

          /* ✅ RESPONSIVE */
          @media (max-width: 768px) {
            .product-detail-page {
              padding: 110px 15px 30px;
            }
            .product-detail-grid {
              grid-template-columns: 1fr;
              gap: 30px;
            }
            .product-detail-image {
              height: 320px;
            }
            .product-detail-info h1 {
              font-size: 30px;
            }
            .discount-price, .product-price {
              font-size: 26px;
            }
            .meta-label {
              width: 100px;
            }
            .action-buttons {
              flex-direction: column;
            }
            .add-to-cart-btn, .wishlist-btn {
              width: 100%;
              justify-content: center;
            }
            .top-highlights-section {
              padding: 20px;
            }
            .description-section {
              padding: 20px;
              max-height: 300px;
            }
            .ml-options {
              justify-content: center;
            }
            .ml-btn {
              min-width: 55px;
              padding: 6px 12px;
              font-size: 12px;
            }
            .view-all-highlights-btn {
              font-size: 13px;
              padding: 8px 18px;
            }
            .description-scroll {
              font-size: 15px;
            }
            .description-scroll h1 { font-size: 24px; }
            .description-scroll h2 { font-size: 20px; }
            .description-scroll h3 { font-size: 18px; }
          }

          @media (max-width: 480px) {
            .product-detail-page {
              padding: 100px 12px 20px;
            }
            .product-detail-image {
              height: 250px;
            }
            .product-detail-info h1 {
              font-size: 24px;
            }
            .discount-price, .product-price {
              font-size: 22px;
            }
            .meta-label {
              width: 80px;
              font-size: 13px;
            }
            .top-highlights-section {
              padding: 15px;
            }
            .highlight-item {
              padding: 8px 12px;
            }
            .highlight-value {
              font-size: 13px;
            }
            .highlight-label {
              font-size: 10px;
            }
            .description-section {
              padding: 15px;
              max-height: 250px;
            }
            .ml-btn {
              padding: 4px 10px;
              font-size: 11px;
              min-width: 45px;
            }
            .ml-price {
              font-size: 10px;
            }
            .add-to-cart-btn, .wishlist-btn {
              font-size: 14px;
              padding: 12px 20px;
            }
            .breadcrumb {
              font-size: 13px;
            }
            .star-filled, .star-half, .star-empty {
              font-size: 16px;
            }
            .view-all-highlights-btn {
              font-size: 12px;
              padding: 6px 14px;
              width: 100%;
              justify-content: center;
            }
            .description-scroll {
              font-size: 14px;
            }
            .description-scroll h1 { font-size: 20px; }
            .description-scroll h2 { font-size: 18px; }
            .description-scroll h3 { font-size: 16px; }
          }
        `}</style>
      </div>
    </>
  )
}

export default ProductDetailPage