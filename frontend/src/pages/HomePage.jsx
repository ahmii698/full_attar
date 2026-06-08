import Hero from '../components/Hero'
import SectionHeading from '../components/SectionHeading'
import ProductCard from '../components/ProductCard'
import CategoryBanner from '../components/CategoryBanner'
import FAQSection from '../components/FAQSection'
import TestimonialSlider from '../components/TestimonialSlider'
import ContactPage from './ContactPage'  // <-- Changed: ContactMapSection se ContactPage kar diya
import Newsletter from '../components/Newsletter'

// Import your images
import westernAttarImg from '../assets/western-attar.jpg'
import easternAttarImg from '../assets/eastern-attar.jpg'

const topSellers = [
  { id: 1, name: "Black & Silver Platinum", price: "Rs. 2,100", rating: 1330 },
  { id: 2, name: "Ameer Al Oud", price: "Rs. 1,800", rating: 890 },
  { id: 3, name: "Oud Al Aswad", price: "Rs. 3,200", rating: 650 },
  { id: 4, name: "Sultan E Ameer", price: "Rs. 4,500", rating: 420 },
]

const newArrivals = [
  { id: 5, name: "Winter Collection 2024", price: "Rs. 2,500", rating: 120 },
  { id: 6, name: "Oudh Al Ward", price: "Rs. 3,800", rating: 95 },
  { id: 7, name: "Silver & White", price: "Rs. 1,950", rating: 78 },
  { id: 8, name: "Musk Al Mahal", price: "Rs. 5,200", rating: 156 },
]

function HomePage() {
  return (
    <div className="homepage">
      <Hero />
      
      {/* Top Sellers Section */}
      <section className="products-section">
        <SectionHeading title="Top Sellers" subtitle="Our most loved fragrances" />
        <div className="products-grid">
          {topSellers.map(product => (
            <ProductCard key={product.id} {...product} />
          ))}
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
      
      {/* New Arrivals Section */}
      <section className="products-section">
        <SectionHeading title="New Arrivals" subtitle="Fresh from our atelier" />
        <div className="products-grid">
          {newArrivals.map(product => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      </section>
      
      {/* FAQ Section */}
      <FAQSection />
      
      {/* Testimonials Slider */}
      <section className="testimonials-section">
        <SectionHeading title="What Our Customers Say" subtitle="Trusted by thousands" />
        <TestimonialSlider />
      </section>
      
      {/* Contact Section - Using ContactPage component */}
      <ContactPage />
      
      <Newsletter />
    </div>
  )
}

export default HomePage