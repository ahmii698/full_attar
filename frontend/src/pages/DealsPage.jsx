import { useState } from 'react'
import { FaHeart, FaRegHeart, FaShoppingCart } from 'react-icons/fa'
import { useCart } from '../contexts/CartContext'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import at1 from '../assets/at1.jpg'
import at2 from '../assets/at2.jpg'
import at3 from '../assets/at3.jpg'
import at4 from '../assets/at4.jpg'
import at5 from '../assets/at5.jpg'
import at6 from '../assets/at6.jpg'
import at7 from '../assets/at7.jpg'
import at8 from '../assets/at8.jpg'

function DealsPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { addToCart, addToWishlist, removeFromWishlist, wishlistItems } = useCart()
  
  const [wishlistState, setWishlistState] = useState(
    wishlistItems.map(item => item.id)
  )
  
  const dealsProducts = [
    { id: 1, name: "Black & Silver Platinum", price: "Rs. 2,100", priceNum: 2100, originalPrice: "Rs. 3,500", rating: 1330, discount: "40% OFF", image: at1 },
    { id: 2, name: "Ameer Al Oud", price: "Rs. 1,800", priceNum: 1800, originalPrice: "Rs. 2,800", rating: 890, discount: "35% OFF", image: at2 },
    { id: 3, name: "Oud Al Aswad", price: "Rs. 3,200", priceNum: 3200, originalPrice: "Rs. 5,000", rating: 650, discount: "36% OFF", image: at3 },
    { id: 4, name: "Sultan E Ameer", price: "Rs. 4,500", priceNum: 4500, originalPrice: "Rs. 7,000", rating: 420, discount: "35% OFF", image: at4 },
    { id: 5, name: "Winter Collection 2024", price: "Rs. 2,500", priceNum: 2500, originalPrice: "Rs. 3,500", rating: 120, discount: "28% OFF", image: at5 },
    { id: 6, name: "Oudh Al Ward", price: "Rs. 3,800", priceNum: 3800, originalPrice: "Rs. 5,500", rating: 95, discount: "30% OFF", image: at6 },
    { id: 7, name: "Silver & White", price: "Rs. 1,950", priceNum: 1950, originalPrice: "Rs. 2,800", rating: 78, discount: "30% OFF", image: at7 },
    { id: 8, name: "Musk Al Mahal", price: "Rs. 5,200", priceNum: 5200, originalPrice: "Rs. 7,500", rating: 156, discount: "30% OFF", image: at8 },
  ]
  
  const handleWishlist = (product) => {
    if (!user) {
      navigate('/login')
      return
    }
    
    if (wishlistState.includes(product.id)) {
      removeFromWishlist(product.id)
      setWishlistState(wishlistState.filter(id => id !== product.id))
    } else {
      addToWishlist({
        id: product.id,
        name: product.name,
        price: product.price,
        priceNum: product.priceNum,
        rating: product.rating,
        image: product.image
      })
      setWishlistState([...wishlistState, product.id])
    }
  }
  
  const handleAddToCart = (product) => {
    if (!user) {
      navigate('/login')
      return
    }
    
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      priceNum: product.priceNum,
      rating: product.rating,
      image: product.image
    })
  }
  
  const isInWishlist = (productId) => wishlistState.includes(productId)
  
  return (
    <div className="shop-page">
      <div className="shop-header">
        <h1>Hot Deals </h1>
        <p>Limited time offers. Up to 40% off on selected attars!</p>
      </div>
      <div className="products-section">
        <div className="products-grid">
          {dealsProducts.map(product => (
            <div key={product.id} className="product-card deal-card">
              <div className="discount-tag">{product.discount}</div>
              <div className="product-image">
                <img src={product.image} alt={product.name} />
                <button 
                  className="wishlist-btn" 
                  onClick={() => handleWishlist(product)}
                >
                  {isInWishlist(product.id) ? <FaHeart color="#d4af37" /> : <FaRegHeart />}
                </button>
              </div>
              <div className="product-info">
                <h4>{product.name}</h4>
                <div className="price-row">
                  <span className="original-price">{product.originalPrice}</span>
                  <span className="product-price">{product.price}</span>
                </div>
                <div className="product-rating">
                  <span className="stars">★★★★★</span>
                  <span className="rating-count">({product.rating})</span>
                </div>
                <button className="add-to-cart" onClick={() => handleAddToCart(product)}>
                  <FaShoppingCart /> Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default DealsPage