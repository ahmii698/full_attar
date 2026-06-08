function ContactMapSection() {
  return (
    <div className="contact-map-section">
      <div className="contact-map-container">
        {/* Left Side - Map - Karachi Location */}
        <div className="map-side">
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d28958.64141174819!2d67.0011!3d24.8607!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3eb33e0666e6e6e7%3A0x1234567890abcdef!2sDolmen%20Mall%20Clifton!5e0!3m2!1sen!2s!4v1700000000000!5m2!1sen!2s" 
            width="100%" 
            height="100%" 
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Royal Attar Location - Karachi"
          ></iframe>
        </div>
        
        {/* Right Side - Contact Form */}
        <div className="form-side">
          <h3>Any Queries</h3>
          <p>Fill in your details and we'll get back to you</p>
          
          <form className="contact-form-appointment">
            <div className="form-group">
              <label>Full Name *</label>
              <input type="text" placeholder="Enter your full name" />
            </div>
            
            <div className="form-group">
              <label>Email Address *</label>
              <input type="email" placeholder="your@email.com" />
            </div>
            
            <div className="form-row-2col">
              <div className="form-group">
                <label>Phone *</label>
                <input type="tel" placeholder="+92 XXXXXXXXXX" />
              </div>
              <div className="form-group">
                <label>Date *</label>
                <input type="text" placeholder="mm/dd/yyyy" />
              </div>
            </div>
           
            <div className="form-group">
              <label>Message (Optional)</label>
              <textarea rows="3" placeholder="Tell us what you'd like to discuss..."></textarea>
            </div>
            
            <button type="submit" className="book-appointment-btn">Submit →</button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ContactMapSection