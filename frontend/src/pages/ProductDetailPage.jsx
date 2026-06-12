import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { FaHeart, FaRegHeart, FaShoppingCart, FaStar, FaStarHalfAlt } from 'react-icons/fa'
import { useCart } from '../contexts/CartContext'
import { useAuth } from '../contexts/AuthContext'

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

  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api'
  const APP_URL = 'http://127.0.0.1:8000'
  const FRONTEND_URL = 'http://localhost:5173'

  useEffect(() => {
    fetchProduct()
  }, [id])

  useEffect(() => {
    if (product && wishlistItems) {
      setIsWishlisted(wishlistItems.some(item => item.id === product.product_id))
    }
  }, [product, wishlistItems])

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

  // ✅ FIXED: Same image logic as ProductCard
  const getImageUrl = (imagePath) => {
    if (!imagePath) {
      return 'https://via.placeholder.com/500x500/8B4513/white?text=No+Image'
    }
    
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
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
      navigate('/login')
      return
    }
    
    const productData = {
      id: product.product_id,
      name: product.name,
      price: product.discount_price ? `Rs. ${product.discount_price}` : product.price,
      priceNum: product.discount_price || product.price_num,
      rating: product.rating,
      image: getImageUrl(product.image_url),
      quantity: quantity
    }
    
    for (let i = 0; i < quantity; i++) {
      addToCart(productData)
    }
    alert(`Added ${quantity} x ${product.name} to cart!`)
  }

  const handleWishlist = () => {
    if (!user) {
      navigate('/login')
      return
    }
    
    const productData = {
      id: product.product_id,
      name: product.name,
      price: product.discount_price ? `Rs. ${product.discount_price}` : product.price,
      priceNum: product.discount_price || product.price_num,
      rating: product.rating,
      image: getImageUrl(product.image_url)
    }
    
    if (isWishlisted) {
      removeFromWishlist(product.product_id)
      setIsWishlisted(false)
    } else {
      addToWishlist(productData)
      setIsWishlisted(true)
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

  const discountPercent = product.discount_price ? Math.round(((product.price_num - product.discount_price) / product.price_num) * 100) : 0
  const displayPrice = product.discount_price ? `Rs. ${product.discount_price.toLocaleString()}` : product.price
  const originalPrice = product.discount_price ? `Rs. ${product.price_num.toLocaleString()}` : null
  const fragranceNotes = parseNotes(product.notes)
  const imageUrl = getImageUrl(product.image_url)

  return (
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

        {/* Description Section */}
        <div className="description-section">
          <h3 className="description-title">Description</h3>
          <div className="description-content">
            <p>{product.description || 'No description available for this product.'}</p>
          </div>
        </div>
      </div>

      <style>{`
        .product-detail-page { max-width: 1200px; margin: 0 auto; padding: 40px 20px; min-height: 60vh; }
        .breadcrumb { margin-bottom: 30px; font-size: 14px; color: rgba(255,255,255,0.5); }
        .breadcrumb a { color: #d4af37; text-decoration: none; }
        .breadcrumb span { color: rgba(255,255,255,0.7); }
        .product-detail-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 50px; margin-bottom: 50px; }
        .product-detail-image { background: rgba(255,255,255,0.02); border-radius: 20px; padding: 20px; border: 1px solid rgba(212,175,55,0.1); text-align: center; }
        .product-detail-image img { width: 100%; max-width: 400px; height: auto; object-fit: contain; border-radius: 12px; }
        .product-detail-info h1 { font-size: 32px; font-weight: 700; margin-bottom: 15px; color: #fff; }
        .product-rating-section { display: flex; align-items: center; gap: 10px; margin-bottom: 20px; }
        .stars { display: flex; gap: 4px; }
        .star-filled { color: #ffc107; font-size: 16px; }
        .star-half { color: #ffc107; font-size: 16px; }
        .star-empty { color: rgba(255,255,255,0.2); font-size: 16px; }
        .rating-count { color: rgba(255,255,255,0.5); font-size: 13px; }
        .product-price-section { margin-bottom: 20px; padding-bottom: 15px; border-bottom: 1px solid rgba(212,175,55,0.1); }
        .original-price { text-decoration: line-through; color: rgba(255,255,255,0.4); font-size: 16px; margin-right: 10px; }
        .discount-price, .product-price { font-size: 28px; font-weight: 700; color: #d4af37; }
        .discount-badge { background: #ff4444; color: #fff; padding: 3px 8px; border-radius: 15px; font-size: 11px; margin-left: 10px; }
        .product-meta { background: rgba(255,255,255,0.03); border-radius: 12px; padding: 15px 20px; margin-bottom: 25px; }
        .meta-item { display: flex; margin-bottom: 10px; font-size: 14px; }
        .meta-label { width: 120px; color: #d4af37; font-weight: 500; }
        .meta-value { color: rgba(255,255,255,0.8); }
        .in-stock { color: #4caf50; font-weight: 500; }
        .quantity-section { display: flex; align-items: center; gap: 20px; margin-bottom: 25px; }
        .quantity-label { color: rgba(255,255,255,0.7); font-size: 14px; }
        .quantity-selector { display: flex; align-items: center; gap: 15px; background: rgba(255,255,255,0.05); border-radius: 30px; padding: 3px 10px; }
        .quantity-selector button { width: 32px; height: 32px; border-radius: 50%; border: none; background: #d4af37; color: #000; font-size: 16px; font-weight: bold; cursor: pointer; }
        .quantity-selector span { font-size: 16px; min-width: 35px; text-align: center; color: #fff; }
        .action-buttons { display: flex; gap: 15px; flex-wrap: wrap; }
        .add-to-cart-btn { background: linear-gradient(135deg, #d4af37, #b8960c); color: #000; border: none; padding: 12px 28px; border-radius: 40px; font-weight: 600; font-size: 14px; cursor: pointer; display: flex; align-items: center; gap: 8px; transition: 0.3s; }
        .add-to-cart-btn:hover { transform: translateY(-2px); box-shadow: 0 5px 15px rgba(212,175,55,0.3); }
        .wishlist-btn { background: rgba(255,255,255,0.05); border: 1px solid rgba(212,175,55,0.3); color: #fff; padding: 12px 25px; border-radius: 40px; font-weight: 600; font-size: 14px; cursor: pointer; display: flex; align-items: center; gap: 8px; }
        .wishlist-btn.active { background: rgba(212,175,55,0.2); color: #d4af37; }
        
        .description-section {
          background: rgba(255,255,255,0.02);
          border-radius: 16px;
          padding: 25px;
          margin-top: 25px;
          border: 1px solid rgba(212,175,55,0.1);
        }
        
        .description-title {
          color: #d4af37;
          font-size: 18px;
          font-weight: 600;
          margin-bottom: 15px;
          padding-bottom: 10px;
          border-bottom: 1px solid rgba(212,175,55,0.2);
        }
        
        .description-content p {
          color: #ffffff;
          line-height: 1.7;
          font-size: 14px;
        }
        
        .loading-container, .error-container { text-align: center; padding: 60px; }
        .back-to-shop { display: inline-block; margin-top: 15px; color: #d4af37; text-decoration: none; }
        
        @media (max-width: 768px) {
          .product-detail-grid { grid-template-columns: 1fr; gap: 30px; }
          .product-detail-info h1 { font-size: 26px; }
          .discount-price, .product-price { font-size: 24px; }
          .meta-label { width: 100px; }
          .action-buttons { flex-direction: column; }
          .add-to-cart-btn, .wishlist-btn { width: 100%; justify-content: center; }
          .description-section { padding: 20px; }
        }
        
        @media (max-width: 480px) {
          .product-detail-info h1 { font-size: 22px; }
          .meta-label { width: 90px; font-size: 12px; }
          .description-content p { font-size: 12px; }
          .description-section { padding: 15px; }
        }
      `}</style>
    </div>
  )
}

export default ProductDetailPage