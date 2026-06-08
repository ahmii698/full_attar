import { useState } from 'react'
import { FaStore, FaClock, FaPhone, FaMapMarkerAlt, FaDirections, FaStar } from 'react-icons/fa'

function OutletsPage() {
  const [selectedOutlet, setSelectedOutlet] = useState(1)
  
  const outlets = [
    {
      id: 1,
      name: "Royal Attar - Dolmen Mall",
      location: "Dolmen Mall, Clifton, Karachi",
      address: "Tariq Road, Clifton, Karachi, Pakistan",
      timings: "11:00 AM - 11:00 PM",
      phone: "+92 21 1234567",
      mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d28958.64141174819!2d67.0011!3d24.8607!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3eb33e0666e6e6e7%3A0x1234567890abcdef!2sDolmen%20Mall%20Clifton!5e0!3m2!1sen!2s!4v1700000000000!5m2!1sen!2s",
      features: ["Premium Collection", "Testers Available", "Free Parking"]
    },
    {
      id: 2,
      name: "Royal Attar - Lucky One Mall",
      location: "Lucky One Mall, Rashid Minhas Road, Karachi",
      address: "Rashid Minhas Road, Gulshan-e-Iqbal, Karachi",
      timings: "11:00 AM - 11:00 PM",
      phone: "+92 21 1234568",
      mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d28958.64141174819!2d67.0011!3d24.8607!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3eb33e0666e6e6e7%3A0x1234567890abcdef!2sLucky%20One%20Mall!5e0!3m2!1sen!2s!4v1700000000000!5m2!1sen!2s",
      features: ["New Arrivals", "Best Sellers", "Gift Wrapping"]
    },
    {
      id: 3,
      name: "Royal Attar - Emporium Mall",
      location: "Emporium Mall, Lahore",
      address: "Abdul Haque Road, Johar Town, Lahore",
      timings: "11:00 AM - 11:00 PM",
      phone: "+92 42 1234567",
      mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d217159.123456789!2d74.0011!3d31.8607!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3918e6e6e6e6e6e7%3A0x1234567890abcdef!2sEmporium%20Mall!5e0!3m2!1sen!2s!4v1700000000000!5m2!1sen!2s",
      features: ["Luxury Lounge", "Fragrance Bar", "VIP Area"]
    },
    {
      id: 4,
      name: "Royal Attar - Centaurus Mall",
      location: "Centaurus Mall, Islamabad",
      address: "Jinnah Avenue, F-8, Islamabad",
      timings: "11:00 AM - 11:00 PM",
      phone: "+92 51 1234567",
      mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d217159.123456789!2d73.0011!3d33.8607!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38dfe6e6e6e6e6e7%3A0x1234567890abcdef!2sCentaurus%20Mall!5e0!3m2!1sen!2s!4v1700000000000!5m2!1sen!2s",
      features: ["Valet Parking", "Premium Testers", "Exclusive Offers"]
    },
  ]
  
  const currentOutlet = outlets.find(o => o.id === selectedOutlet) || outlets[0]
  
  const handleGetDirections = (address) => {
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`, '_blank')
  }
  
  return (
    <div className="outlets-page">
      <div className="outlets-hero">
        <div className="outlets-hero-content">
          <h1>Our Outlets</h1>
          <p>Visit our stores across Pakistan for an exclusive fragrance experience</p>
        </div>
      </div>
      
      <div className="outlets-container">
        <div className="outlets-grid">
          {outlets.map(outlet => (
            <div 
              key={outlet.id} 
              className={`outlet-card ${selectedOutlet === outlet.id ? 'selected' : ''}`} 
              onClick={() => setSelectedOutlet(outlet.id)}
            >
              <div className="outlet-card-header">
                <div className="outlet-icon">
                  <FaStore />
                </div>
                <h3>{outlet.name}</h3>
              </div>
              <div className="outlet-details">
                <p><FaMapMarkerAlt /> {outlet.location}</p>
                <p><FaClock /> {outlet.timings}</p>
                <p><FaPhone /> {outlet.phone}</p>
              </div>
              <div className="outlet-features">
                {outlet.features.map((feature, idx) => (
                  <span key={idx} className="feature-tag">{feature}</span>
                ))}
              </div>
              <button className="outlet-btn" onClick={(e) => { e.stopPropagation(); handleGetDirections(outlet.address) }}>
                <FaDirections /> Get Directions
              </button>
            </div>
          ))}
        </div>
      </div>
      
      <div className="outlets-map-section">
        <h3>📍 {currentOutlet.name}</h3>
        <p>Click on any outlet card to view location on map</p>
        <div className="outlets-map-container">
          <iframe 
            src={currentOutlet.mapUrl}
            width="100%" 
            height="400" 
            style={{ border: 0, borderRadius: '20px' }}
            allowFullScreen=""
            loading="lazy"
            title="Outlet Location"
          ></iframe>
        </div>
        <div className="map-note">
          <FaStar /> All outlets are open 7 days a week • {currentOutlet.timings}
        </div>
      </div>
    </div>
  )
}

export default OutletsPage