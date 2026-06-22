import { useState, useEffect, useMemo, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { FaWhatsapp } from 'react-icons/fa'
import Hero from '../components/Hero'
import SectionHeading from '../components/SectionHeading'
import ProductCard from '../components/ProductCard'
import CategoryBanner from '../components/CategoryBanner'
import FAQSection from '../components/FAQSection'
import TestimonialSlider from '../components/TestimonialSlider'
import ContactPage from './ContactPage'
import Newsletter from '../components/Newsletter'
import { API_URL, STORAGE_URL } from '../../config'  // ✅ IMPORT FROM CONFIG

function HomePage() {
  const [topSellers, setTopSellers] = useState([])
  const [deals, setDeals] = useState([])
  const [banners, setBanners] = useState([])
  const [dataLoaded, setDataLoaded] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

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
      console.log('🔄 Fetching data from:', API_URL)
      
      const [topRes, dealsRes, bannersRes] = await Promise.all([
        fetch(`${API_URL}/top-sellers`),  // ✅ USING API_URL
        fetch(`${API_URL}/deals`),
        fetch(`${API_URL}/banners`)
      ])
      
      // ✅ Check if responses are OK
      if (!topRes.ok) throw new Error(`top-sellers: ${topRes.status}`)
      if (!dealsRes.ok) throw new Error(`deals: ${dealsRes.status}`)
      if (!bannersRes.ok) throw new Error(`banners: ${bannersRes.status}`)
      
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
      console.error('❌ Error fetching data:', err)
      setDataLoaded(true)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!dataLoaded) {
      fetchData()
    }
  }, [dataLoaded, fetchData])

  // ✅ Fix image URL - using STORAGE_URL
  const getImageUrl = useCallback((imagePath) => {
    if (!imagePath) return null
    if (imagePath.startsWith('http')) return imagePath
    // Remove /storage/ prefix if present to avoid duplication
    const cleanPath = imagePath.replace(/^\/storage\//, '')
    return `${STORAGE_URL}/${cleanPath}`
  }, [STORAGE_URL])

  const displayTopSellers = useMemo(() => topSellers.slice(0, 5), [topSellers])
  const displayDeals = useMemo(() => deals.slice(0, 5), [deals])

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
              image_url={getImageUrl(product.image_url)}
              ml_prices={product.ml_prices}
            />
          ))
        )}
      </div>
      <div className="view-all-wrapper">
        <Link to="/best-sellers" className="view-all-btn">View All →</Link>
      </div>
    </section>
  ), [displayTopSellers, dataLoaded, getImageUrl])

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
              image_url={getImageUrl(product.image_url)}
              ml_prices={product.ml_prices}
            />
          ))
        )}
      </div>
      <div className="view-all-wrapper">
        <Link to="/deals" className="view-all-btn">View All →</Link>
      </div>
    </section>
  ), [displayDeals, dataLoaded, getImageUrl])

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

  // ✅ WhatsApp Floating Button
  const WhatsAppButton = useMemo(() => (
    <a
      href="https://wa.me/923197753774"
      target="_blank"
      rel="noopener noreferrer"
      className="whatsapp-float"
      aria-label="Chat on WhatsApp"
    >
      <FaWhatsapp />
      <span className="whatsapp-tooltip">Chat with us!</span>
    </a>
  ), [])

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

      {/* ✅ WhatsApp Floating Button - Sirf Home Page par show hoga */}
      {WhatsAppButton}

      <style>{`
        .navbar { margin-bottom: 0 !important; padding-bottom: 0 !important; }
        .homepage .hero-wrapper { padding: 0 !important; margin: 0 !important; }
        .homepage .hero-wrapper .main-content { padding-top: 0 !important; padding-bottom: 0 !important; }
        .homepage .products-section:first-of-type { margin-top: 0 !important; padding-top: 0 !important; }
        .homepage .section-heading { margin-bottom: 10px !important; }
        .view-all-wrapper { text-align: center; margin-top: 15px !important; }
        .view-all-btn { display: inline-flex; align-items: center; justify-content: center; gap: 10px; padding: 10px 24px; background: linear-gradient(135deg, #d4af37, #b8960c); color: #000000; border: none; border-radius: 40px; font-weight: 700; font-size: 0.85rem; text-decoration: none; transition: all 0.3s ease; cursor: pointer; box-shadow: 0 4px 12px rgba(212, 175, 55, 0.3); }
        .view-all-btn:hover { background: linear-gradient(135deg, #c4a030, #a08010); transform: translateX(6px); gap: 14px; box-shadow: 0 6px 18px rgba(212, 175, 55, 0.4); }
        .no-products { grid-column: 1 / -1; text-align: center; padding: 40px; color: rgba(255,255,255,0.4); font-size: 16px; }
        .products-grid { gap: 12px !important; }
        
        /* ✅ WhatsApp Floating Button Styles */
        .whatsapp-float {
          position: fixed;
          bottom: 30px;
          right: 30px;
          width: 65px;
          height: 65px;
          background: linear-gradient(135deg, #25d366, #128C7E);
          color: #ffffff;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 36px;
          box-shadow: 0 6px 30px rgba(37, 211, 102, 0.4);
          transition: all 0.3s ease;
          z-index: 1000;
          text-decoration: none;
          animation: whatsappPulse 2s infinite;
        }

        .whatsapp-float:hover {
          transform: scale(1.12);
          box-shadow: 0 8px 40px rgba(37, 211, 102, 0.6);
          color: #ffffff;
        }

        .whatsapp-float:active {
          transform: scale(0.95);
        }

        /* ✅ Tooltip */
        .whatsapp-tooltip {
          position: absolute;
          right: 80px;
          background: rgba(0, 0, 0, 0.8);
          color: #ffffff;
          padding: 8px 16px;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 500;
          white-space: nowrap;
          opacity: 0;
          visibility: hidden;
          transition: all 0.3s ease;
          pointer-events: none;
        }

        .whatsapp-tooltip::after {
          content: '';
          position: absolute;
          right: -8px;
          top: 50%;
          transform: translateY(-50%);
          border-left: 8px solid rgba(0, 0, 0, 0.8);
          border-top: 6px solid transparent;
          border-bottom: 6px solid transparent;
        }

        .whatsapp-float:hover .whatsapp-tooltip {
          opacity: 1;
          visibility: visible;
          right: 85px;
        }

        /* ✅ Pulse Animation */
        @keyframes whatsappPulse {
          0%, 100% {
            box-shadow: 0 6px 30px rgba(37, 211, 102, 0.4);
          }
          50% {
            box-shadow: 0 6px 50px rgba(37, 211, 102, 0.7);
          }
        }

        /* ✅ Notification Badge */
        .whatsapp-float::after {
          content: '1';
          position: absolute;
          top: -5px;
          right: -5px;
          background: #ff4444;
          color: #ffffff;
          font-size: 11px;
          font-weight: 700;
          width: 22px;
          height: 22px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid #0a0a0a;
          animation: badgePulse 1.5s infinite;
        }

        @keyframes badgePulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.15);
          }
        }

        @media (max-width: 768px) {
          .homepage .hero-wrapper { margin-top: 0 !important; }
          .homepage .products-section:first-of-type { margin-top: 0 !important; }
          
          .whatsapp-float {
            width: 55px;
            height: 55px;
            font-size: 30px;
            bottom: 20px;
            right: 20px;
          }
          
          .whatsapp-tooltip {
            display: none;
          }
          
          .whatsapp-float::after {
            width: 18px;
            height: 18px;
            font-size: 9px;
          }
        }

        @media (max-width: 480px) {
          .homepage .hero-wrapper { margin-top: 0 !important; }
          .homepage .products-section:first-of-type { margin-top: 0 !important; }
          
          .whatsapp-float {
            width: 50px;
            height: 50px;
            font-size: 26px;
            bottom: 15px;
            right: 15px;
          }
        }
      `}</style>
    </div>
  )
}

export default HomePage