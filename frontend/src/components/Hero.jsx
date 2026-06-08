import BottleImage from './BottleImage'

function Hero() {
  return (
    <div className="hero-wrapper">
      <div className="main-content">
        <div className="left-content">
          <div className="badge">
            <span className="badge-dot"></span>
            <span>Premium Attar Since 1985</span>
          </div>
          
          <h1 className="main-title">
            The <span className="gold">Royal Essence</span>
            <br />
            of <span className="gold">Pure Oud</span>
          </h1>
          
          <p className="description">
            Handcrafted with ancient techniques passed down through generations, 
            our Royal Oud Attar is aged for 12 months in traditional copper vessels. 
            This patience allows the rich, woody notes to fully develop and mature.
          </p>
          
          <p className="description">
            Our Royal Oud Attar captures the true essence of luxury — 
            long-lasting, 100% natural, and unforgettable. The fragrance opens 
            with rare agarwood from ancient forests, revealing layers of 
            smoky oud, warm amber, and hints of precious saffron.
          </p>
          
          <p className="description">
            Each drop tells a story of dedication, patience, and the finest 
            ingredients sourced from the heart of nature. Free from synthetic 
            additives or alcohol, just pure, concentrated attar that stays 
            with you for over 24 hours.
          </p>
          
          <div className="stats">
            <div className="stat">
              <h3>100%</h3>
              <p>Natural Ingredients</p>
            </div>
            <div className="stat">
              <h3>24+</h3>
              <p>Hours Longevity</p>
            </div>
            <div className="stat">
              <h3>50+</h3>
              <p>Premium Blends</p>
            </div>
          </div>
          
          <div className="button-group">
            <button className="explore-btn">
              Explore Collection <span>→</span>
            </button>
          </div>
        </div>
        
        <div className="right-content">
          <div className="bottle-wrapper">
            <BottleImage />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Hero