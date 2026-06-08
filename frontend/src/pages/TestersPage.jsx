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
import at8 from '../assets/at8.jpg'

function TestersPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { addToCart, addToWishlist, removeFromWishlist, wishlistItems } = useCart()
  
  const [wishlistState, setWishlistState] = useState(
    wishlistItems.map(item => item.id)
  )
  
  const testerProducts = [
    { id: 1, name: "Black & Silver Platinum (Tester)", price: "Rs. 1,500", priceNum: 1500, rating: 120, size: "12ml", image: at1 },
    { id: 2, name: "Ameer Al Oud (Tester)", price: "Rs. 1,200", priceNum: 1200, rating: 89, size: "12ml", image: at2 },
    { id: 3, name: "Oud Al Aswad (Tester)", price: "Rs. 2,200", priceNum: 2200, rating: 65, size: "12ml", image: at3 },
    { id: 4, name: "Sultan E Ameer (Tester)", price: "Rs. 3,000", priceNum: 3000, rating: 42, size: "12ml", image: at4 },
    { id: 5, name: "Musk Al Mahal (Tester)", price: "Rs. 3,500", priceNum: 3500, rating: 56, size: "12ml", image: at8 },
    { id: 6, name: "Winter Collection 2024 (Tester)", price: "Rs. 1,800", priceNum: 1800, rating: 78, size: "12ml", image: at5 },
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
        <h1>Tester Attars </h1>
        <p>Authentic testers at best prices. Same quality, minimal packaging.</p>
      </div>
      <div className="products-section">
        <div className="products-grid">
          {testerProducts.map(product => (
            <div key={product.id} className="product-card">
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
                <div className="size-info">{product.size}</div>
                <div className="product-price-row">
                  <span className="product-price">{product.price}</span>
                  <div className="product-rating">
                    <span className="stars">★★★★★</span>
                    <span className="rating-count">({product.rating})</span>
                  </div>
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

export default TestersPage