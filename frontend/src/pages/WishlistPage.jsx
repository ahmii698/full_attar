import { Link } from 'react-router-dom'
import { FaTrash, FaShoppingCart } from 'react-icons/fa'
import { useCart } from '../contexts/CartContext'

function WishlistPage() {
  const { wishlistItems, removeFromWishlist, moveToCart } = useCart()
  
  if (wishlistItems.length === 0) {
    return (
      <div className="wishlist-page">
        <div className="wishlist-empty">
          <h2>Your Wishlist is Empty</h2>
          <p>Save your favorite items here.</p>
          <Link to="/shop" className="continue-shop-btn">Start Shopping →</Link>
        </div>
      </div>
    )
  }
  
  return (
    <div className="wishlist-page">
      <div className="wishlist-container">
        <h2>My Wishlist ({wishlistItems.length} items)</h2>
        <div className="wishlist-grid">
          {wishlistItems.map(item => (
            <div key={item.id} className="wishlist-item">
              <img src={item.image} alt={item.name} />
              <h4>{item.name}</h4>
              <p className="wishlist-price">{item.price}</p>
              <div className="wishlist-actions">
                <button onClick={() => moveToCart(item)} className="move-to-cart">
                  <FaShoppingCart /> Add to Cart
                </button>
                <button onClick={() => removeFromWishlist(item.id)} className="remove-wishlist">
                  <FaTrash />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default WishlistPage