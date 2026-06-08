import { useState, useEffect } from 'react'
import imageSrc from '../assets/a3.png'

function BottleImage() {
  const [imageLoaded, setImageLoaded] = useState(false)
  
  useEffect(() => {
    const img = new Image()
    img.onload = () => setImageLoaded(true)
    img.onerror = (e) => {
      console.log('Image load error:', e)
      setImageLoaded(false)
    }
    img.src = imageSrc
  }, [])
  
  return (
    <div className="bottle-image-container">
      {!imageLoaded && (
        <div className="loader-gold">
          <div className="gold-ring"></div>
        </div>
      )}
      <img 
        src={imageSrc}
        alt="Royal Oud Attar Bottle"
        className={`bottle-img ${imageLoaded ? 'loaded' : ''}`}
        style={{ 
          display: imageLoaded ? 'block' : 'none',
          width: '100%',
          maxWidth: '750px',
          minHeight: '500px',
          height: 'auto',
          objectFit: 'contain',
          margin: '0 auto'
        }}
      />
    </div>
  )
}

export default BottleImage