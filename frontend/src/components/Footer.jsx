import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FaFacebookF, FaInstagram, FaTwitter, FaYoutube, FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa'
import footerLogo from '../assets/ra.png'

function Footer() {
  const [socialLinks, setSocialLinks] = useState([])
  const [loading, setLoading] = useState(true)

  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api'

  // Map platform names to icons
  const getIcon = (platform) => {
    switch (platform.toLowerCase()) {
      case 'facebook':
        return <FaFacebookF />
      case 'instagram':
        return <FaInstagram />
      case 'twitter':
        return <FaTwitter />
      case 'youtube':
        return <FaYoutube />
      default:
        return null
    }
  }

  useEffect(() => {
    fetchSocialLinks()
  }, [])

  const fetchSocialLinks = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/social-links`)
      const data = await response.json()
      setSocialLinks(data.filter(link => link.is_active === 1))
    } catch (error) {
      console.error('Error fetching social links:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-col">
          <div className="footer-logo-wrapper">
            <img src={footerLogo} alt="Royal Attar" className="footer-logo-img" />
          </div>
      
          <div className="social-links">
            {!loading && socialLinks.map((link) => (
              <a 
                key={link.social_id}
                href={link.url} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="social-icon"
              >
                {getIcon(link.platform)}
              </a>
            ))}
          </div>
        </div>
        
        <div className="footer-col">
          <h4>Quick Links</h4>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/shop">Shop</Link></li>
            <li><Link to="/best-sellers">Best Sellers</Link></li>
            <li><Link to="/deals">Deals</Link></li>
            <li><Link to="/outlets">Our Outlets</Link></li>
            <li><Link to="/blogs">Blogs</Link></li>
            <li><Link to="/contact">Contact</Link></li>
            <li><Link to="/faq">FAQ</Link></li>
          </ul>
        </div>
        
        <div className="footer-col">
          <h4>Categories</h4>
          <ul>
            <li><Link to="/shop?category=Premium">Premium Attars</Link></li>
            <li><Link to="/shop?category=Western">Western Attars</Link></li>
            <li><Link to="/shop?category=Eastern">Eastern Attars</Link></li>
            <li><Link to="/shop?gender=Male">Male Collection</Link></li>
            <li><Link to="/shop?gender=Female">Female Collection</Link></li>
            <li><Link to="/shop?gender=Unisex">Unisex Collection</Link></li>
          </ul>
        </div>
        
        <div className="footer-col">
          <h4>Contact Info</h4>
          <ul className="contact-info">
            <li><FaPhone /> +92 300 1234567</li>
            <li><FaEnvelope /> info@royalattar.com</li>
            <li><FaMapMarkerAlt /> Karachi, Pakistan</li>
          </ul>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; 2024 Royal Attar. All rights reserved.</p>
      </div>
    </footer>
  )
}

export default Footer