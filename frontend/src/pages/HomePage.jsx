import { useState, useEffect, useMemo, useCallback } from 'react'
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
  const [isLoading, setIsLoading] = useState(true)

  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api'
  const APP_URL = 'http://127.0.0.1:8000'

  // ✅ Check if data is already in sessionStorage
  useEffect(() => {
    const cachedData = sessionStorage.getItem('homepage_data')
    if (cachedData) {
      try {
        const parsed = JSON.parse(cachedData)
        setTopSellers(parsed.topSellers || [])
        setDeals(parsed.deals || [])
        setBanners(parsed.banners || [])
        setDataLoaded(true)
        setIsLoading(false)
        console.log('✅ Homepage data loaded from cache')
      } catch (e) {
        console.error('Cache parse error:', e)
      }
    }
  }, [])

  const fetchData = useCallback(async () => {
    try {
      const [topRes, dealsRes, bannersRes] = await Promise.all([
        fetch(`${API_BASE_URL}/top-sellers`),
        fetch(`${API_BASE_URL}/deals`),
        fetch(`${API_BASE_URL}/banners`)
      ])
      
      const topData = await topRes.json()
      const dealsData = await dealsRes.json()
      const bannersData = await bannersRes.json()
      
      // ✅ Cache data in sessionStorage
      try {
        sessionStorage.setItem('homepage_data', JSON.stringify({
          topSellers: topData,
          deals: dealsData,
          banners: bannersData
        }))
        console.log('✅ Homepage data cached')
      } catch (e) {
        console.error('Cache save error:', e)
      }
      
      setTopSellers(topData)
      setDeals(dealsData)
      setBanners(bannersData)
      setDataLoaded(true)
      
    } catch (err) {
      console.error('Error fetching data:', err)
      setDataLoaded(true)
    } finally {
      setIsLoading(false)
    }
  }, [API_BASE_URL])

  useEffect(() => {
    // ✅ Only fetch if not already loaded from cache
    if (!dataLoaded) {
      fetchData()
    }
  }, [dataLoaded, fetchData])

  const getImageUrl = useCallback((imagePath) => {
    if (!imagePath) return null
    if (imagePath.startsWith('http')) return imagePath
    return `${APP_URL}${imagePath}`
  }, [APP_URL])

  // ✅ Memoize products to prevent unnecessary re-renders
  const displayTopSellers = useMemo(() => topSellers.slice(0, 4), [topSellers])
  const displayDeals = useMemo(() => deals.slice(0, 4), [deals])

  // ✅ Memoize components
  const BestSellersSection = useMemo(() => (
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
  ), [displayTopSellers, dataLoaded])

  const DealsSection = useMemo(() => (
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
  ), [displayDeals, dataLoaded])

  const BannersSection = useMemo(() => (
    dataLoaded && banners.length > 0 && banners.map((banner, index) => (
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
    ))
  ), [banners, dataLoaded, getImageUrl])

  // ✅ If still loading and no cache, show minimal loading
  if (isLoading && !dataLoaded) {
    return (
      <div className="homepage">
        <Hero />
      </div>
    )
  }

  return (
    <div className="homepage">
      <Hero />
      
      {BestSellersSection}
      
      {BannersSection}
      
      {DealsSection}
      
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