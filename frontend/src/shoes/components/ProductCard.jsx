import { Link } from "react-router-dom";
import { useCart } from "../../contexts/CartContext";

export default function ProductCard({ shoe }) {
  const { addToCart, addToWishlist, removeFromWishlist, wishlistItems } = useCart();

  // Attar ke ids se clash na ho, is liye shoes ka id "shoe-<id>" hai
  const cartId = `shoe-${shoe.id}`;
  const liked = wishlistItems.some((item) => item.id === cartId);
  const to = `/shoes/${shoe.id}`;
  const priceNum = Number(shoe.price) || 0;

  const product = {
    id: cartId,
    type: "shoe",
    shoeId: shoe.id,
    name: shoe.name,
    price: `Rs. ${priceNum.toLocaleString()}`,
    priceNum,
    image: shoe.image,
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (liked) {
      removeFromWishlist(cartId);
    } else if (!addToWishlist(product)) {
      alert("Pehle login karein");
    }
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!addToCart(product)) {
      alert("Pehle login karein");
    }
  };

  return (
    <article className="shoe-card">
      <Link to={to} className="shoe-card__img" style={{ display: "block" }}>
        <img src={shoe.image} alt={shoe.name} loading="lazy" onError={(e) => (e.currentTarget.style.opacity = 0)} />
        {shoe.isNew && <span className="shoe-card__badge">NEW</span>}
      </Link>

      <div className="shoe-card__body">
        <Link to={to}>
          <h3 className="shoe-card__name">{shoe.name}</h3>
        </Link>
        <p className="shoe-card__sub">{shoe.sub}</p>

        <div className="shoe-card__row">
          <span className="shoe-card__price">Rs. {priceNum.toLocaleString()}</span>
          <button className={`shoe-card__heart ${liked ? "liked" : ""}`} onClick={handleWishlist} aria-label="Wishlist">
            <svg width="16" height="16" viewBox="0 0 24 24" fill={liked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.8">
              <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1.1L12 21l7.8-7.5 1-1.1a5.5 5.5 0 0 0 0-7.8z" />
            </svg>
          </button>
        </div>

        <button className="shoe-card__btn" onClick={handleAddToCart}>ADD TO CART</button>
      </div>
    </article>
  );
}