import { useState, useEffect } from 'react'

function TestimonialSlider() {
  const [currentIndex, setCurrentIndex] = useState(0)
  
  const testimonials = [
    { 
      id: 1, 
      name: "Ahmed Raza", 
      review: "Absolutely the best attar I've ever used! The longevity is incredible and the fragrance is mesmerizing. Will definitely buy again.", 
      rating: 5, 
      location: "Dubai, UAE",
      date: "2 weeks ago"
    },
    { 
      id: 2, 
      name: "Sarah Khan", 
      review: "Pure luxury in a bottle. The Royal Oud is worth every penny. Lasts over 24 hours on my skin. Highly recommended!", 
      rating: 5, 
      location: "London, UK",
      date: "1 month ago"
    },
    { 
      id: 3, 
      name: "Omar Farooq", 
      review: "Authentic oud scent that stays all day. The quality is exceptional and the customer service is great. 10/10!", 
      rating: 5, 
      location: "Karachi, Pakistan",
      date: "3 weeks ago"
    },
    { 
      id: 4, 
      name: "Fatima Al Mansouri", 
      review: "The Amber Rose attar is my new signature scent. So elegant and sophisticated. Love the packaging too!", 
      rating: 5, 
      location: "Abu Dhabi, UAE",
      date: "1 week ago"
    },
    { 
      id: 5, 
      name: "Bilal Ahmed", 
      review: "Been using Royal Attar for years. Never disappointed. The quality is consistent and the fragrances are unmatched.", 
      rating: 5, 
      location: "Toronto, Canada",
      date: "2 months ago"
    },
  ]
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length)
    }, 7000) // 7 seconds
    
    return () => clearInterval(interval)
  }, [testimonials.length])
  
  const currentTestimonial = testimonials[currentIndex]
  
  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length)
  }
  
  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length)
  }
  
  const goToSlide = (index) => {
    setCurrentIndex(index)
  }
  
  return (
    <div className="testimonial-slider">
      <div className="testimonial-slide">
        {/* REMOVED - quote icon <div className="quote-icon">“</div> */}
        <p className="testimonial-text">{currentTestimonial.review}</p>
        <div className="testimonial-rating">
          {'★'.repeat(currentTestimonial.rating)}{'☆'.repeat(5 - currentTestimonial.rating)}
        </div>
        <h4 className="testimonial-name">{currentTestimonial.name}</h4>
        <p className="testimonial-location">{currentTestimonial.location}</p>
        {currentTestimonial.date && <p className="testimonial-date">{currentTestimonial.date}</p>}
      </div>
      
      {/* Navigation Buttons */}
      <button className="slider-nav prev" onClick={goToPrevious}>‹</button>
      <button className="slider-nav next" onClick={goToNext}>›</button>
      
      {/* Dots Indicator */}
      <div className="slider-dots">
        {testimonials.map((_, index) => (
          <button
            key={index}
            className={`slider-dot ${index === currentIndex ? 'active' : ''}`}
            onClick={() => goToSlide(index)}
          />
        ))}
      </div>
    </div>
  )
}

export default TestimonialSlider