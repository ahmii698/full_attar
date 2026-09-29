import { useState } from "react";

export default function ProductCard({ shoe, onAddToCart }) {
  const [liked, setLiked] = useState(false);

  return (
    <article className="shoe-card">
      <div className="shoe-card__img">
        <img src={shoe.image} alt={shoe.name} loading="lazy" onError={(e) => (e.currentTarget.style.opacity = 0)} />
        {shoe.isNew && <span className="shoe-card__badge">NEW</span>}
      </div>

      <div className="shoe-card__body">
        <h3 className="shoe-card__name">{shoe.name}</h3>
        <p className="shoe-card__sub">{shoe.sub}</p>

        <div className="shoe-card__row">
          <span className="shoe-card__price">Rs. {shoe.price.toLocaleString()}</span>
          <button className={`shoe-card__heart ${liked ? "liked" : ""}`} onClick={() => setLiked(!liked)} aria-label="Wishlist">
            <svg width="16" height="16" viewBox="0 0 24 24" fill={liked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.8">
              <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1.1L12 21l7.8-7.5 1-1.1a5.5 5.5 0 0 0 0-7.8z" />
            </svg>
          </button>
        </div>

        <button className="shoe-card__btn" onClick={() => onAddToCart?.(shoe)}>ADD TO CART</button>
      </div>
    </article>
  );
}