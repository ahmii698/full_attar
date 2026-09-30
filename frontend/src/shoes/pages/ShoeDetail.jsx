import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { API_URL, STORAGE_URL } from "../../../config";
import "../styles/shoe-detail.css";

// Sizes hamesha yehi hain (DB mein bhi sirf 3 se 10 allowed hain)
const SIZES = [3, 4, 5, 6, 7, 8, 9, 10];

// Backend image path (/storage/shoes/1/a.jpg) ko poora URL bana deta hai
const imgUrl = (path) => {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return STORAGE_URL + path.replace(/^\/?storage/, "");
};

// Backend ka data page ke hisaab se set karte hain
const mapShoe = (s) => {
  let images = (s.images || []).map((i) => imgUrl(i.url));
  if (!images.length && s.image) images = [imgUrl(s.image)];

  return {
    id: s.id,
    name: s.name,
    sub: s.categories,
    price: s.price,
    description: s.description,
    isNew: s.is_new,
    images,
    availableSizes: (s.sizes || []).filter((x) => x.in_stock).map((x) => x.size),
  };
};

const FEATURES = [
  {
    title: "Free Shipping",
    text: "On orders over Rs. 5,000",
    icon: <path d="M3 7h11v9H3zM14 10h4l3 3v3h-7zM7 19a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zM17 19a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z" />,
  },
  {
    title: "Secure Payment",
    text: "100% secure checkout",
    icon: <path d="M12 3l8 3v6c0 4.5-3.4 8-8 9-4.6-1-8-4.5-8-9V6zM9 12l2 2 4-4" />,
  },
  {
    title: "Easy Returns",
    text: "Within 7 days",
    icon: <path d="M20 12a8 8 0 1 1-2.3-5.7M20 4v4h-4" />,
  },
];

export default function ShoeDetail() {
  const { id } = useParams();

  const [shoe, setShoe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [active, setActive] = useState(0);
  const [size, setSize] = useState(null);
  const [qty, setQty] = useState(1);
  const [wishlisted, setWishlisted] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    setLoading(true);
    setNotFound(false);
    setShoe(null);
    setActive(0);
    setSize(null);
    setQty(1);
    setError("");

    fetch(`${API_URL}/shoes/${id}`, { signal: controller.signal })
      .then((res) => {
        if (res.status === 404) {
          setNotFound(true);
          return null;
        }
        if (!res.ok) throw new Error("Server error");
        return res.json();
      })
      .then((data) => {
        if (data) setShoe(mapShoe(data));
        setLoading(false);
      })
      .catch((err) => {
        if (err.name === "AbortError") return;
        setNotFound(true);
        setLoading(false);
      });

    return () => controller.abort();
  }, [id]);

  if (loading) {
    return (
      <div className="sd-page">
        <div className="sd-wrap sd-notfound">
          <h2>Loading...</h2>
        </div>
      </div>
    );
  }

  if (notFound || !shoe) {
    return (
      <div className="sd-page">
        <div className="sd-wrap sd-notfound">
          <h2>Shoe nahi mila</h2>
          <Link to="/shoes" className="sd-btn sd-btn--outline">Back to Shoes</Link>
        </div>
      </div>
    );
  }

  const images = shoe.images;

  const prev = () => setActive((i) => (i - 1 + images.length) % images.length);
  const next = () => setActive((i) => (i + 1) % images.length);

  const handleAddToCart = () => {
    if (!size) {
      setError("Please select a size");
      return;
    }
    setError("");
    console.log("Added to cart:", { id: shoe.id, name: shoe.name, size, qty });
  };

  const handleWishlist = () => {
    const nextState = !wishlisted;
    setWishlisted(nextState);
    console.log(nextState ? "Added to wishlist:" : "Removed from wishlist:", shoe.name);
  };

  const description =
    shoe.description ||
    `The ${shoe.name} brings next-level comfort and style with its innovative design. Made for those who never stop, this shoe delivers responsive cushioning, a sleek look, and all-day support.`;

  return (
    <div className="sd-page">
      <div className="sd-wrap">
        {/* Breadcrumb */}
        <nav className="sd-crumbs">
          <Link to="/">Home</Link>
          <span>›</span>
          <Link to="/shoes">Shoes</Link>
          <span>›</span>
          <span className="sd-crumbs__current">{shoe.name}</span>
        </nav>

        <div className="sd-grid">
          {/* ---------- Gallery ---------- */}
          <section className="sd-gallery">
            <div className="sd-main">
              {images[active] && <img src={images[active]} alt={shoe.name} />}
              {shoe.isNew && <span className="sd-badge">NEW</span>}

              {images.length > 1 && (
                <>
                  <button className="sd-arrow sd-arrow--left" onClick={prev} aria-label="Previous image">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M15 5l-7 7 7 7" /></svg>
                  </button>
                  <button className="sd-arrow sd-arrow--right" onClick={next} aria-label="Next image">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M9 5l7 7-7 7" /></svg>
                  </button>
                </>
              )}
            </div>

            <div className="sd-thumbs">
              {images.map((src, i) => (
                <button
                  key={i}
                  className={`sd-thumb ${i === active ? "active" : ""}`}
                  onClick={() => setActive(i)}
                  aria-label={`Image ${i + 1}`}
                >
                  <img src={src} alt="" />
                </button>
              ))}
            </div>
          </section>

          {/* ---------- Info ---------- */}
          <section className="sd-info">
            <h1 className="sd-name">{shoe.name}</h1>
            <p className="sd-sub">{shoe.sub}</p>
            <p className="sd-price">Rs. {shoe.price.toLocaleString()}</p>
            <p className="sd-desc">{description}</p>

            {/* Size */}
            <h4 className="sd-label">SELECT SIZE</h4>
            <div className="sd-sizes">
              {SIZES.map((s) => {
                const available = shoe.availableSizes.includes(s);
                return (
                  <button
                    key={s}
                    disabled={!available}
                    className={`sd-size ${size === s ? "active" : ""}`}
                    onClick={() => {
                      setSize(s);
                      setError("");
                    }}
                  >
                    {s}
                  </button>
                );
              })}
            </div>
            {error && <p className="sd-error">{error}</p>}

            {/* Quantity */}
            <h4 className="sd-label sd-label--qty">QUANTITY</h4>
            <div className="sd-qty">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Decrease">−</button>
              <input
                type="number"
                min="1"
                value={qty}
                onChange={(e) => setQty(Math.max(1, Number(e.target.value) || 1))}
              />
              <button onClick={() => setQty((q) => q + 1)} aria-label="Increase">+</button>
            </div>

            {/* Actions */}
            <button className="sd-btn sd-btn--gold" onClick={handleAddToCart}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M3 4h2l2.4 11h11l2-8H6.5M9 20a1 1 0 1 0 0-2 1 1 0 0 0 0 2zM17 20a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" /></svg>
              ADD TO CART
            </button>

            <button
              className={`sd-btn sd-btn--outline sd-btn--wish ${wishlisted ? "active" : ""}`}
              onClick={handleWishlist}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill={wishlisted ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.8">
                <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1.1L12 21l7.8-7.5 1-1.1a5.5 5.5 0 0 0 0-7.8z" />
              </svg>
              {wishlisted ? "ADDED TO WISHLIST" : "ADD TO WISHLIST"}
            </button>

            {/* Features */}
            <div className="sd-features">
              {FEATURES.map((f) => (
                <div className="sd-feature" key={f.title}>
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">{f.icon}</svg>
                  <div>
                    <strong>{f.title}</strong>
                    <span>{f.text}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}