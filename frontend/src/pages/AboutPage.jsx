import SectionHeading from '../components/SectionHeading'
import { FaLeaf, FaCrown, FaClock, FaGem, FaStore, FaTrophy, FaUsers, FaGlobe } from 'react-icons/fa'

function AboutPage() {
  return (
    <div className="about-page">
      <div className="about-hero">
        <div className="about-hero-content">
          <h1>About Royal Attar</h1>
          <p>Crafting excellence since 1985</p>
          <div className="hero-decoration"></div>
        </div>
      </div>
      
      <div className="about-container">
        <div className="about-story">
          <SectionHeading title="Our Story" subtitle="A legacy of fragrance" />
          <p>Royal Attar was founded in 1985 with a simple mission: to bring the finest quality attars to discerning customers around the world. For nearly four decades, we have perfected our craft, blending ancient techniques with modern expertise.</p>
          <p>Our master perfumers source only the rarest ingredients — agarwood from ancient forests, saffron from Kashmir, roses from Damascus. Each attar is aged in traditional copper vessels for up to 12 months, allowing the notes to mature and harmonize.</p>
          <p>Today, Royal Attar is trusted by thousands of customers globally. From royalty to connoisseurs, our fragrances have become synonymous with luxury, authenticity, and excellence.</p>
        </div>
        
        <div className="about-values">
          <div className="value-card">
            <div className="value-icon"><FaLeaf /></div>
            <h3>100% Natural</h3>
            <p>No synthetic additives, just pure ingredients sourced from nature</p>
          </div>
          <div className="value-card">
            <div className="value-icon"><FaCrown /></div>
            <h3>Premium Quality</h3>
            <p>Sourced from the finest regions across the globe</p>
          </div>
          <div className="value-card">
            <div className="value-icon"><FaClock /></div>
            <h3>Traditional Methods</h3>
            <p>Age-old techniques preserved for generations</p>
          </div>
          <div className="value-card">
            <div className="value-icon"><FaGem /></div>
            <h3>Luxury Experience</h3>
            <p>Unforgettable fragrance journey awaits you</p>
          </div>
        </div>

        <div className="about-stats">
          <div className="stat-item">
            <h3>40+</h3>
            <p>Years of Excellence</p>
          </div>
          <div className="stat-item">
            <h3>100+</h3>
            <p>Premium Blends</p>
          </div>
          <div className="stat-item">
            <h3>50K+</h3>
            <p>Happy Customers</p>
          </div>
          <div className="stat-item">
            <h3>20+</h3>
            <p>Countries Served</p>
          </div>
        </div>

        <div className="about-features">
          <div className="feature-row">
            <div className="feature-icon"><FaStore /></div>
            <div className="feature-text">
              <h3>4 Physical Outlets</h3>
              <p>Visit our stores in Karachi, Lahore, and Islamabad for an exclusive fragrance experience</p>
            </div>
          </div>
          <div className="feature-row">
            <div className="feature-icon"><FaTrophy /></div>
            <div className="feature-text">
              <h3>Award Winning Fragrances</h3>
              <p>Recognized internationally for our commitment to quality and authenticity</p>
            </div>
          </div>
          <div className="feature-row">
            <div className="feature-icon"><FaUsers /></div>
            <div className="feature-text">
              <h3>Expert Perfumers</h3>
              <p>Our team brings decades of experience in traditional attar making</p>
            </div>
          </div>
          <div className="feature-row">
            <div className="feature-icon"><FaGlobe /></div>
            <div className="feature-text">
              <h3>Worldwide Shipping</h3>
              <p>We deliver our premium attars to customers across the globe</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AboutPage