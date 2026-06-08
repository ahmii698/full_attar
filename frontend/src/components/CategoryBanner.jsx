function CategoryBanner({ title, subtitle, description, image, direction }) {
  return (
    <div 
      className={`category-banner-full ${direction === 'right' ? 'text-right' : 'text-left'}`}
      style={{ backgroundImage: `url(${image})` }}
    >
      <div className="banner-overlay-full"></div>
      <div className="banner-content-full">
        <span className="banner-tag-full">✨ Premium Collection</span>
        <h2>{title} <span className="gold">{subtitle}</span></h2>
        <p>{description}</p>
        <button className="banner-btn-full">View all →</button>
      </div>
    </div>
  )
}

export default CategoryBanner