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

// Import your images
import westernAttarImg from '../assets/western-attar.jpg'
import easternAttarImg from '../assets/eastern-attar.jpg'

function HomePage() {
  const [topSellers, setTopSellers] = useState([])
  const [deals, setDeals] = useState([])
  const [loading, setLoading] = useState(true)

  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api'

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      
      // Fetch top sellers from API (is_top_seller = 1)
      const topRes = await fetch(`${API_BASE_URL}/top-sellers`)
      const topData = await topRes.json()
      setTopSellers(topData)
      
      // Fetch deals from API (is_deal = 1)
      const dealsRes = await fetch(`${API_BASE_URL}/deals`)
      const dealsData = await dealsRes.json()
      setDeals(dealsData)
      
    } catch (err) {
      console.error('Error fetching data:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="homepage">
        <Hero />
        <div className="loading-container">Loading products...</div>
      </div>
    )
  }

  // Get only first 4 products
  const displayTopSellers = topSellers.slice(0, 4)
  const displayDeals = deals.slice(0, 4)

  return (
    <div className="homepage">
      <Hero />
      
      {/* Top Sellers Section - Only 4 products with View All button */}
      <section className="products-section">
        <div className="section-header-with-link">
          <SectionHeading title="Top Sellers" subtitle="Our most loved fragrances" />
          <Link to="/top-sellers" className="view-all-btn">
            View All →
          </Link>
        </div>
        <div className="products-grid">
          {displayTopSellers.length === 0 ? (
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
              />
            ))
          )}
        </div>
      </section>
      
      {/* Banner 1 - Western Attars */}
      <CategoryBanner 
        title="Western" 
        subtitle="Attars"
        description="Experience the blend of modern luxury with traditional craftsmanship. Perfect for everyday elegance."
        image={westernAttarImg}
        direction="left"
      />
      
      {/* Deals Section - Only 4 products with View All button */}
      <section className="products-section">
        <div className="section-header-with-link">
          <SectionHeading title="Hot Deals " subtitle="Limited time offers" />
          <Link to="/deals" className="view-all-btn">
            View All →
          </Link>
        </div>
        <div className="products-grid">
          {displayDeals.length === 0 ? (
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
              />
            ))
          )}
        </div>
      </section>
      
      {/* FAQ Section */}
      <FAQSection />
      
      {/* Testimonials Slider */}
      <section className="testimonials-section">
        <SectionHeading title="What Our Customers Say" subtitle="Trusted by thousands" />
        <TestimonialSlider />
      </section>
      
      {/* Contact Section */}
      <ContactPage />
      
      <Newsletter />
    </div>
  )
}

export default HomePage