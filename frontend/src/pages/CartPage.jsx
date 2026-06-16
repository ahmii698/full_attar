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

  const getMlOptions = () => {
    return [50, 60, 70, 80, 90, 100]
  }

  // ✅ FIXED: Database se price lega - sab ko number mein convert karo
  const getPriceForMl = (item, ml) => {
    // Check direct ml_prices on item
    if (item.ml_prices && item.ml_prices[ml] !== undefined) {
      return Number(item.ml_prices[ml])
    }
    
    // Check nested product.ml_prices
    if (item.product?.ml_prices && item.product.ml_prices[ml] !== undefined) {
      return Number(item.product.ml_prices[ml])
    }
    
    // Fallback to base price
    return Number(item.priceNum || 0)
  }

  const handleMlChange = (item, newMl) => {
    const newPrice = getPriceForMl(item, newMl)
    const currentPrice = Number(item.priceNum || 0)
    if (newPrice !== currentPrice) {
      updateCartML(item.id, newMl, newPrice)
    }
  }

  const getDisplayPriceForMl = (item, ml) => {
    const price = getPriceForMl(item, ml)
    return `Rs. ${price.toLocaleString()}`
  }
  
  return (
    <div className="cart-page">
      <div className="cart-container">
        <div className="cart-items">
          <h2>Shopping Cart ({getCartCount()} items)</h2>
          {cartItems.map(item => {
            const mlOptions = getMlOptions()
            const currentMl = item.ml || 50
            
            return (
              <div key={item.id} className="cart-item">
                <img src={item.image} alt={item.name} />
                <div className="cart-item-details">
                  <h4>{item.name}</h4>
                  <p className="cart-item-price">Rs. {Number(item.priceNum || 0).toLocaleString()}</p>
                  
                  {/* ML SELECTOR */}
                  <div className="cart-ml-selector">
                    <span className="ml-label">Size:</span>
                    <div className="ml-options">
                      {mlOptions.map(ml => {
                        const priceForMl = getPriceForMl(item, ml)
                        return (
                          <button
                            key={ml}
                            className={`ml-btn ${currentMl === ml ? 'active' : ''}`}
                            onClick={() => handleMlChange(item, ml)}
                          >
                            {ml}ml
                            <span className="ml-price">
                              Rs. {priceForMl.toLocaleString()}
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