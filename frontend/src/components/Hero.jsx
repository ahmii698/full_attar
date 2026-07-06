// import { useState, useEffect } from 'react'
// import BottleImage from './BottleImage'
// import { API_URL, STORAGE_URL } from '../../config'

// // ✅ Direct fallback image - instantly visible
// const FALLBACK_HERO = {
//   title: 'The Royal Essence',
//   subtitle: 'of Pure Oud',
//   description: 'Handcrafted with ancient techniques passed down through generations, our Royal Oud Attar is aged for 12 months in traditional copper vessels.',
//   badge_text: 'Premium Attar Since 1985',
//   button_text: 'Explore Collection',
//   button_link: '/shop',
//   image_url: '/images/hero/1781205304_a3.png' // Direct path
// }

// function Hero() {
//   const [heroData, setHeroData] = useState(FALLBACK_HERO) // ✅ Immediately show fallback
//   const [stats, setStats] = useState([
//     { stat_value: '60', stat_label: 'Natural Ingredients' },
//     { stat_value: '24', stat_label: 'Hours Longevity' },
//     { stat_value: '50', stat_label: 'Premium Blends' }
//   ])
//   const [loading, setLoading] = useState(false)

//   const APP_URL = STORAGE_URL.replace('/storage', '') || 'http://127.0.0.1:8000'

//   useEffect(() => {
//     fetchHeroData()
//     fetchStats()
//   }, [])

//   const fetchHeroData = async () => {
//     try {
//       const response = await fetch(`${API_URL}/hero`)
      
//       if (!response.ok) {
//         throw new Error(`HTTP ${response.status}`)
//       }
      
//       let text = await response.text()
      
//       if (text.startsWith('//')) {
//         text = text.substring(2).trim()
//       }
      
//       const data = JSON.parse(text)
      
//       let activeSlider = null
      
//       if (Array.isArray(data)) {
//         activeSlider = data.find(slider => slider.is_active === 1) || data[0]
//       } else {
//         activeSlider = data
//       }
      
//       if (activeSlider) {
//         setHeroData(activeSlider)
//       }
//     } catch (err) {
//       // Fallback already set, so silent fail
//     }
//   }

//   const fetchStats = async () => {
//     try {
//       const response = await fetch(`${API_URL}/hero-stats`)
      
//       if (!response.ok) {
//         throw new Error(`HTTP ${response.status}`)
//       }
      
//       let text = await response.text()
      
//       if (text.startsWith('//')) {
//         text = text.substring(2).trim()
//       }
      
//       const data = JSON.parse(text)
      
//       if (Array.isArray(data)) {
//         setStats(data)
//       } else if (data && typeof data === 'object') {
//         const statsArray = Object.entries(data).map(([value, label]) => ({
//           stat_value: value,
//           stat_label: label
//         }))
//         setStats(statsArray)
//       }
//     } catch (err) {
//       // Fallback stats already set
//     } finally {
//       setLoading(false)
//     }
//   }

//   const getImageUrl = (imagePath) => {
//     if (!imagePath) return null
    
//     if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
//       return imagePath
//     }
    
//     if (imagePath.startsWith('/images/')) {
//       return `${APP_URL}${imagePath}`
//     }
    
//     if (imagePath.startsWith('/storage/')) {
//       return `${APP_URL}${imagePath}`
//     }
    
//     const cleanPath = imagePath.replace(/^\//, '')
//     return `${APP_URL}/${cleanPath}`
//   }

//   const imageUrl = getImageUrl(heroData.image_url)

//   return (
//     <div className="hero-wrapper" style={{ marginTop: '-25px', paddingTop: '0' }}>
//       <div className="main-content" style={{ paddingTop: '0', paddingBottom: '0' }}>
//         <div className="left-content">
//           {heroData.badge_text && (
//             <div className="badge">
//               <span className="badge-dot"></span>
//               <span>{heroData.badge_text}</span>
//             </div>
//           )}

//           <h1 className="main-title">
//             {heroData.title && heroData.title.includes('\n') 
//               ? heroData.title.split('\n').map((line, i) => (
//                   <span key={i}>
//                     {line}
//                     {i < heroData.title.split('\n').length - 1 && <br />}
//                   </span>
//                 ))
//               : heroData.title || 'The Royal Essence of Pure Oud'
//             }
//           </h1>

//           {heroData.description && (
//             <div className="description-wrapper">
//               {heroData.description.split('\n').map((para, idx) => (
//                 <p key={idx} className="description">{para}</p>
//               ))}
//             </div>
//           )}

//           {stats.length > 0 && (
//             <div className="stats">
//               {stats.map((stat, index) => (
//                 <div key={index} className="stat">
//                   <h3>{stat.stat_value}</h3>
//                   <p>{stat.stat_label}</p>
//                 </div>
//               ))}
//             </div>
//           )}

//           <div className="button-group">
//             <button 
//               className="explore-btn"
//               onClick={() => {
//                 if (heroData.button_link) {
//                   window.location.href = heroData.button_link
//                 }
//               }}
//             >
//               {heroData.button_text || 'Explore Collection'} <span>→</span>
//             </button>
//           </div>
//         </div>

//         <div className="right-content">
//           <div className="bottle-wrapper">
//             {imageUrl ? (
//               <img 
//                 src={imageUrl} 
//                 alt={heroData.title || 'Hero Image'}
//                 className="bottle-img"
//                 loading="eager"
//                 onError={(e) => {
//                   e.target.style.display = 'none'
//                   if (e.target.nextSibling) {
//                     e.target.nextSibling.style.display = 'flex'
//                   }
//                 }}
//               />
//             ) : null}
            
//             <div style={{ display: imageUrl ? 'none' : 'flex' }}>
//               <BottleImage />
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

import { useState, useEffect, useRef } from 'react'
import './Hero.css'

// ✅ Import images from assets
import b1 from '../assets/b1.png'
import b3 from '../assets/b3.png'
import b4 from '../assets/b4.png'
import b5 from '../assets/b5.png'  // ✅ Mobile version for b3
import b6 from '../assets/b6.png'  // ✅ Mobile version for b4

// ✅ Desktop Images
const DESKTOP_IMAGES = [
  {
    id: 1,
    url: b1,
    alt: 'Banner 1'
  },
  {
    id: 2,
    url: b3,
    alt: 'Banner 2'
  },
  {
    id: 3,
    url: b4,
    alt: 'Banner 3'
  }
]

// ✅ Mobile Images (b5 = b3 ka mobile version, b6 = b4 ka mobile version)
const MOBILE_IMAGES = [
  {
    id: 1,
    url: b1,
    alt: 'Banner 1'
  },
  {
    id: 2,
    url: b5,
    alt: 'Banner 2 Mobile'
  },
  {
    id: 3,
    url: b6,
    alt: 'Banner 3 Mobile'
  }
]

function Hero() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [progress, setProgress] = useState(0)
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)
  const progressInterval = useRef(null)
  const slideInterval = useRef(null)

  // ✅ Check screen size on resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // ✅ Select images based on screen size
  const sliderImages = isMobile ? MOBILE_IMAGES : DESKTOP_IMAGES
  const totalSlides = sliderImages.length

  // ✅ Progress bar animation
  useEffect(() => {
    if (progressInterval.current) clearInterval(progressInterval.current)
    if (slideInterval.current) clearInterval(slideInterval.current)

    setProgress(0)

    progressInterval.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 100
        return prev + (100 / 70)
      })
    }, 100)

    slideInterval.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % totalSlides)
      setProgress(0)
    }, 7000)

    return () => {
      clearInterval(progressInterval.current)
      clearInterval(slideInterval.current)
    }
  }, [currentIndex, totalSlides])

  // ✅ Go to specific slide
  const goToSlide = (index) => {
    setCurrentIndex(index)
    setProgress(0)
    
    if (progressInterval.current) clearInterval(progressInterval.current)
    if (slideInterval.current) clearInterval(slideInterval.current)
    
    progressInterval.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 100
        return prev + (100 / 70)
      })
    }, 100)

    slideInterval.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % totalSlides)
      setProgress(0)
    }, 7000)
  }

  const currentImage = sliderImages[currentIndex]

  return (
    <div className="hero-slider-wrapper">
      <div className="hero-slider-container">
        {/* Image */}
        <img 
          src={currentImage.url} 
          alt={currentImage.alt}
          className="hero-slider-image"
          loading="eager"
        />

        {/* ✅ HORIZONTAL DOTS - Left Side */}
        <div className="hero-slider-dots">
          {sliderImages.map((_, index) => (
            <button
              key={index}
              className={`hero-dot ${index === currentIndex ? 'active' : ''}`}
              onClick={() => goToSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Bottom - Progress Bar */}
        <div className="hero-progress-bar">
          <div 
            className="hero-progress-fill" 
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  )
}

export default Hero