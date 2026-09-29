const DEFAULT_BANNER =
  "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=1600&auto=format&fit=crop&q=70";

export default function ShopBanner({
  title = "Shoes",
  subtitle = "Step into comfort. Walk with confidence.",
  image = DEFAULT_BANNER,
}) {
  return (
    <header className="shoes-banner" style={{ backgroundImage: `url(${image})` }}>
      <div className="shoes-banner__overlay" />
      <div className="shoes-banner__text">
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>
    </header>
  );
}