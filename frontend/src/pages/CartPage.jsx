import { Link } from 'react-router-dom'
import { FaTrash, FaPlus, FaMinus } from 'react-icons/fa'
import { useCart } from '../contexts/CartContext'

function CartPage() {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal, getCartCount } = useCart()
  
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
  
  return (
    <div className="cart-page">
      <div className="cart-container">
        <div className="cart-items">
          <h2>Shopping Cart ({getCartCount()} items)</h2>
          {cartItems.map(item => (
            <div key={item.id} className="cart-item">
              <img src={item.image} alt={item.name} />
              <div className="cart-item-details">
                <h4>{item.name}</h4>
                <p className="cart-item-price">{item.price}</p>
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
                <p>Rs. {item.priceNum * item.quantity}</p>
                <button onClick={() => removeFromCart(item.id)} className="remove-btn">
                  <FaTrash />
                </button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="cart-summary">
          <h3>Order Summary</h3>
          <div className="summary-row">
            <span>Subtotal ({getCartCount()} items)</span>
            <span>Rs. {getCartTotal()}</span>
          </div>
          <div className="summary-row">
            <span>Shipping</span>
            <span>Rs. 200</span>
          </div>
          <div className="summary-total">
            <span>Total</span>
            <span>Rs. {getCartTotal() + 200}</span>
          </div>
          <Link to="/checkout" className="checkout-btn">Proceed to Checkout →</Link>
        </div>
      </div>
    </div>
  )
}

export default CartPage