import { Link } from 'react-router-dom'
import { FaTrash, FaPlus, FaMinus } from 'react-icons/fa'
import { useCart } from '../contexts/CartContext'
import { useAuth } from '../contexts/AuthContext'
import LoginPage from './LoginPage'

function CartPage() {
  const { user } = useAuth()
  const { 
    cartItems, 
    removeFromCart, 
    updateQuantity, 
    updateCartML,
    getCartTotal, 
    getCartCount 
  } = useCart()
  
  if (!user) {
    return <LoginPage redirectTo="/cart" />
  }
  
  if (cartItems.length === 0) {
    return (
      <div className="cart-page">
        <div className="cart-empty">
          <h2>Your Cart is Empty</h2>
          <p>Looks like you haven't added any items yet.</p>
          <Link to="/shop" className="continue-shop-btn">Continue Shopping →</Link>
        </div>
      </div>
    )
  }

  // ✅ SIRF 3 ML OPTIONS: 3, 6, 12
  const getMlOptions = () => {
    return [3, 6, 12]
  }

  // ✅ Database se price lega - sab ko number mein convert karo
  const getPriceForMl = (item, ml) => {
    // Check direct ml_prices on item
    if (item.ml_prices && item.ml_prices[ml] !== undefined && item.ml_prices[ml] !== null && item.ml_prices[ml] !== '') {
      return Number(item.ml_prices[ml])
    }
    
    // Check nested product.ml_prices
    if (item.product?.ml_prices && item.product.ml_prices[ml] !== undefined && item.product.ml_prices[ml] !== null && item.product.ml_prices[ml] !== '') {
      return Number(item.product.ml_prices[ml])
    }
    
    // Agar price nahi hai toh null return karo
    return null
  }

  const handleMlChange = (item, newMl) => {
    const newPrice = getPriceForMl(item, newMl)
    if (newPrice !== null) {
      updateCartML(item.id, newMl, newPrice)
    }
  }

  const getDisplayPriceForMl = (item, ml) => {
    const price = getPriceForMl(item, ml)
    if (price !== null) {
      return `Rs. ${price.toLocaleString()}`
    }
    return 'N/A'
  }

  const isMlAvailable = (item, ml) => {
    const price = getPriceForMl(item, ml)
    return price !== null && price > 0
  }
  
  return (
    <div className="cart-page">
      <div className="cart-container">
        <div className="cart-items">
          <h2>Shopping Cart ({getCartCount()} items)</h2>
          {cartItems.map(item => {
            const mlOptions = getMlOptions()
            const currentMl = item.ml || 3 // ✅ Default 3ml
            
            return (
              <div key={item.id} className="cart-item">
                <img src={item.image} alt={item.name} />
                <div className="cart-item-details">
                  <h4>{item.name}</h4>
                  <p className="cart-item-price">Rs. {Number(item.priceNum || 0).toLocaleString()}</p>
                  
                  {/* ✅ ML SELECTOR - SIRF 3, 6, 12 */}
                  <div className="cart-ml-selector">
                    <span className="ml-label">Size:</span>
                    <div className="ml-options">
                      {mlOptions.map(ml => {
                        const available = isMlAvailable(item, ml)
                        const priceText = getDisplayPriceForMl(item, ml)
                        return (
                          <button
                            key={ml}
                            className={`ml-btn ${currentMl === ml && available ? 'active' : ''} ${!available ? 'disabled' : ''}`}
                            onClick={() => available && handleMlChange(item, ml)}
                            disabled={!available}
                            title={available ? `${ml}ml - ${priceText}` : `${ml}ml - Not Available`}
                          >
                            {ml}ml
                            <span className="ml-price">
                              {priceText}
                            </span>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                  
                  <div className="cart-item-quantity">
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                      <FaMinus />
                    </button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                      <FaPlus />
                    </button>
                  </div>
                </div>
                <div className="cart-item-total">
                  <p>Rs. {(Number(item.priceNum || 0) * (item.quantity || 0)).toLocaleString()}</p>
                  <button onClick={() => removeFromCart(item.id)} className="remove-btn">
                    <FaTrash />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
        
        <div className="cart-summary">
          <h3>Order Summary</h3>
          <div className="summary-row">
            <span>Subtotal ({getCartCount()} items)</span>
            <span>Rs. {getCartTotal().toLocaleString()}</span>
          </div>
          <div className="summary-row">
            <span>Shipping</span>
            <span>Rs. 200</span>
          </div>
          <div className="summary-total">
            <span>Total</span>
            <span>Rs. {(getCartTotal() + 200).toLocaleString()}</span>
          </div>
          <Link to="/checkout" className="checkout-btn">Proceed to Checkout →</Link>
        </div>
      </div>
    </div>
  )
}

export default CartPage