import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Hero from '../components/Hero'
import SectionHeading from '../components/SectionHeading'
import ProductCard from '../components/ProductCard'
import CategoryBanner from '../components/CategoryBanner'
import FAQSection from '../components/FAQSection'
import TestimonialSlider from '../components/TestimonialSlider'
import ContactPage from './ContactPage'
import Newsletter from '../components/Newsletter'

function HomePage() {
  const [topSellers, setTopSellers] = useState([])
  const [deals, setDeals] = useState([])
  const [banners, setBanners] = useState([])
  const [dataLoaded, setDataLoaded] = useState(false)

  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api'
  const APP_URL = 'http://127.0.0.1:8000'

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [topRes, dealsRes, bannersRes] = await Promise.all([
        fetch(`${API_BASE_URL}/top-sellers`),
        fetch(`${API_BASE_URL}/deals`),
        fetch(`${API_BASE_URL}/banners`)
      ])
      
      const topData = await topRes.json()
      const dealsData = await dealsRes.json()
      const bannersData = await bannersRes.json()
      
      setTopSellers(topData)
      setDeals(dealsData)
      setBanners(bannersData)
      setDataLoaded(true)
      
    } catch (err) {
      console.error('Error fetching data:', err)
      setDataLoaded(true) // ✅ Error ke baad bhi dataLoaded true karo
    }
  }

  const getImageUrl = (imagePath) => {
    if (!imagePath) return null
    if (imagePath.startsWith('http')) return imagePath
    return `${APP_URL}${imagePath}`
  }

  const displayTopSellers = topSellers.slice(0, 4)
  const displayDeals = deals.slice(0, 4)

  return (
    <div className="homepage">
      <Hero />
      
      {/* Best Sellers Section */}
      <section className="products-section">
        <SectionHeading title="Best Sellers" subtitle="Our most loved fragrances" />
        <div className="products-grid">
          {dataLoaded && displayTopSellers.length === 0 ? (
            <div className="no-products">No top sellers found.</div>
          ) : (
            displayTopSellers.map(product => (
              <ProductCard 
                key={product.product_id || product.id}
                id={product.product_id || product.id}
                name={product.name}
                price={product.price}
                priceNum={product.price_num}
                discount_price={product.discount_price}
                discount_percent={product.discount_percent}
                is_deal={product.is_deal === 1}
                rating={product.rating || 0}
                image_url={product.image_url}
                ml_prices={product.ml_prices}
              />
            ))
          )}
        </div>
        <div className="view-all-wrapper">
          <Link to="/best-sellers" className="view-all-btn">View All →</Link>
        </div>
      </section>
      
      {/* Banners */}
      {dataLoaded && banners.length > 0 && banners.map((banner, index) => (
        <CategoryBanner 
          key={banner.banner_id || index}
          title={banner.title}
          subtitle={banner.subtitle}
          description={banner.description}
          image={getImageUrl(banner.image_url)}
          direction={banner.direction || (index % 2 === 0 ? 'left' : 'right')}
          buttonText={banner.button_text}
          buttonLink={banner.button_link}
        />
      ))}
      
      {/* Deals Section */}
      <section className="products-section">
        <SectionHeading title="Hot Deals" subtitle="Limited time offers" />
        <div className="products-grid">
          {dataLoaded && displayDeals.length === 0 ? (
            <div className="no-products">No active deals at the moment. Check back soon!</div>
          ) : (
            displayDeals.map(product => (
              <ProductCard 
                key={product.product_id || product.id}
                id={product.product_id || product.id}
                name={product.name}
                price={product.price}
                priceNum={product.price_num}
                discount_price={product.discount_price}
                discount_percent={product.discount_percent}
                is_deal={true}
                rating={product.rating || 0}
                image_url={product.image_url}
                ml_prices={product.ml_prices}
              />
            ))
          )}
        </div>
        <div className="view-all-wrapper">
          <Link to="/deals" className="view-all-btn">View All →</Link>
        </div>
      </section>
      
      <FAQSection />
      
      <section className="testimonials-section">
        <SectionHeading title="What Our Customers Say" subtitle="Trusted by thousands" />
        <TestimonialSlider />
      </section>
      
      <ContactPage />
      <Newsletter />

      <style>{`
        .view-all-wrapper {
          text-align: center;
          margin-top: 40px;
        }
        
        .view-all-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          padding: 12px 28px;
          background: linear-gradient(135deg, #d4af37, #b8960c);
          color: #000000;
          border: none;
          border-radius: 40px;
          font-weight: 700;
          font-size: 0.9rem;
          text-decoration: none;
          transition: all 0.3s ease;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(212, 175, 55, 0.3);
        }
        
        .view-all-btn:hover {
          background: linear-gradient(135deg, #c4a030, #a08010);
          transform: translateX(6px);
          gap: 14px;
          box-shadow: 0 6px 18px rgba(212, 175, 55, 0.4);
        }

        .no-products {
          grid-column: 1 / -1;
          text-align: center;
          padding: 40px;
          color: rgba(255,255,255,0.4);
          font-size: 16px;
        }
      `}</style>
    </div>
  )
}

export default HomePage