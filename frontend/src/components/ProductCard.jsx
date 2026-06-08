import { useState } from 'react'
import { FaHeart, FaRegHeart, FaShoppingCart } from 'react-icons/fa'
import { useCart } from '../contexts/CartContext'
import at1 from '../assets/at1.jpg'
import at2 from '../assets/at2.jpg'
import at3 from '../assets/at3.jpg'
import at4 from '../assets/at4.jpg'
import at5 from '../assets/at5.jpg'
import at6 from '../assets/at6.jpg'
import at7 from '../assets/at7.jpg'
import at8 from '../assets/at8.jpg'
import at9 from '../assets/at9.jpg'
import at10 from '../assets/at10.jpg'

function ProductCard({ id, name, price, rating, priceNum }) {
  const { addToCart, addToWishlist, removeFromWishlist, wishlistItems } = useCart()
  
  const [isWishlisted, setIsWishlisted] = useState(
    wishlistItems.some(item => item.id === id)
  )
  
  // Local images mapping
  const getImageUrl = (name) => {
    const images = {
      'Black & Silver Platinum': at1,
      'Ameer Al Oud': at2,
      'Oud Al Aswad': at3,
      'Sultan E Ameer': at4,
      'Winter Collection 2024': at5,
      'Oudh Al Ward': at6,
      'Silver & White': at7,
      'Musk Al Mahal': at8,
      'Royal Oud': at9,
      'Amber Rose': at10,
    }
    return images[name] || at1
  }
  
  const product = {
    id,
    name,
    price,
    priceNum: priceNum || parseInt(price.replace(/[^0-9]/g, '')),
    rating,
    image: getImageUrl(name)
  }
  
  const handleWishlist = () => {
    if (isWishlisted) {
      removeFromWishlist(id)
      setIsWishlisted(false)
    } else {
      addToWishlist(product)
      setIsWishlisted(true)
    }
  }
  
  return (
    <div className="product-card">
      <div className="product-image">
        <img src={getImageUrl(name)} alt={name} />
        <button className="wishlist-btn" onClick={handleWishlist}>
          {isWishlisted ? <FaHeart color="#d4af37" /> : <FaRegHeart />}
        </button>
      </div>
      <div className="product-info">
        <h4>{name}</h4>
        <div className="product-price-row">
          <span className="product-price">{price}</span>
          <div className="product-rating">
            <span className="stars">★★★★★</span>
            <span className="rating-count">({rating})</span>
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