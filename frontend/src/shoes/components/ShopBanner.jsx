const DEFAULT_BANNER =
  "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=1800&auto=format&fit=crop&q=70";

export default function ShopBanner({
  eyebrow = "Premium Collection",
  title = "Sneakers",
  subtitle = "Step into style. Built for comfort. Designed for more.",
  ctaText = "Shop Now",
  onCta,
  image = DEFAULT_BANNER,
}) {
  return (
    <header className="shoes-banner" style={{ backgroundImage: `url(${image})` }}>
      <div className="shoes-banner__overlay" />
      <div className="shoes-banner__text">
        <span className="shoes-banner__eyebrow">{eyebrow}</span>
        <h1>{title}</h1>
        <p>{subtitle}</p>
        <button className="shoes-banner__cta" onClick={onCta}>
          {ctaText}
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </button>
      </div>
    </header>
  );
}