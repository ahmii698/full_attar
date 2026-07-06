// src/pages/ComingSoon.jsx
import React from 'react'
import { Link } from 'react-router-dom'
import { 
  FiShoppingBag, 
  FiArrowLeft, 
  FiClock, 
  FiAward, 
  FiTruck, 
  FiShield 
} from 'react-icons/fi'
import './ComingSoon.css'

// ✅ Shoe image - Unsplash se real shoe ki image
const SHOE_IMAGE = 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&auto=format&fit=crop&q=80'

function ComingSoon() {
  return (
    <div className="coming-soon-page">
      <div className="coming-soon-wrapper">
        {/* Left Side - Decorative with Real Shoe Image */}
        <div className="coming-soon-left">
          <div className="coming-soon-decoration">
            <div className="deco-circle"></div>
            <div className="deco-circle-2"></div>
            <div className="deco-circle-3"></div>
            
            {/* ✅ Real Shoe Image */}
            <div className="deco-shoe-image-wrapper">
              <img 
                src={SHOE_IMAGE} 
                alt="Shoes Collection" 
                className="deco-shoe-image"
              />
              <div className="shoe-glow"></div>
            </div>
          </div>
        </div>

        {/* Right Side - Content */}
        <div className="coming-soon-right">
          <div className="coming-soon-badge">
            <FiClock className="badge-icon" />
            <span>Coming Soon</span>
          </div>

          <h1 className="coming-soon-title">
            Shoes Collection
          </h1>

          <p className="coming-soon-subtitle">
            Step into elegance with our upcoming footwear line
          </p>

          <p className="coming-soon-text">
            We're crafting the perfect blend of comfort and style. 
            Our shoes collection is almost ready to launch.
          </p>

          {/* Features */}
          <div className="coming-soon-features">
            <div className="feature-item">
              <FiAward className="feature-icon" />
              <span>Premium Quality</span>
            </div>
            <div className="feature-item">
              <FiTruck className="feature-icon" />
              <span>Fast Delivery</span>
            </div>
            <div className="feature-item">
              <FiShield className="feature-icon" />
              <span>Authentic Guarantee</span>
            </div>
          </div>

          {/* Loading Animation */}
          <div className="coming-soon-loader-wrapper">
            <div className="coming-soon-progress">
              <div className="progress-bar">
                <div className="progress-fill"></div>
              </div>
              <span className="progress-text">Under Development</span>
            </div>
          </div>

          {/* Buttons */}
          <div className="coming-soon-actions">
            <Link to="/" className="coming-soon-btn primary">
              <FiShoppingBag className="btn-icon" />
              Back to Shopping
            </Link>
            <Link to="/shop" className="coming-soon-btn secondary">
              <FiArrowLeft className="btn-icon" />
              Browse Other Collections
            </Link>
          </div>

          {/* Notification */}
          <div className="coming-soon-notify">
          </div>
        </div>
      </div>
    </div>
  )
}

export default ComingSoon