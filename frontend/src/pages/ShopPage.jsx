import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import ProductCard from '../components/ProductCard'

const allProducts = [
  { id: 1, name: "Black & Silver Platinum", price: "Rs. 2,100", priceNum: 2100, rating: 1330, category: "Premium", gender: "Male", notes: ["Oud", "Amber"] },
  { id: 2, name: "Ameer Al Oud", price: "Rs. 1,800", priceNum: 1800, rating: 890, category: "Eastern", gender: "Male", notes: ["Oud", "Musk"] },
  { id: 3, name: "Oud Al Aswad", price: "Rs. 3,200", priceNum: 3200, rating: 650, category: "Premium", gender: "Male", notes: ["Oud"] },
  { id: 4, name: "Sultan E Ameer", price: "Rs. 4,500", priceNum: 4500, rating: 420, category: "Premium", gender: "Male", notes: ["Oud", "Amber", "Musk"] },
  { id: 5, name: "Winter Collection 2024", price: "Rs. 2,500", priceNum: 2500, rating: 120, category: "Western", gender: "Unisex", notes: ["Amber"] },
  { id: 6, name: "Oudh Al Ward", price: "Rs. 3,800", priceNum: 3800, rating: 95, category: "Eastern", gender: "Unisex", notes: ["Oud", "Rose"] },
  { id: 7, name: "Silver & White", price: "Rs. 1,950", priceNum: 1950, rating: 78, category: "Premium", gender: "Male", notes: ["Musk"] },
  { id: 8, name: "Musk Al Mahal", price: "Rs. 5,200", priceNum: 5200, rating: 156, category: "Premium", gender: "Unisex", notes: ["Musk", "Amber"] },
  { id: 9, name: "Royal Oud", price: "Rs. 6,500", priceNum: 6500, rating: 245, category: "Premium", gender: "Female", notes: ["Oud", "Rose"] },
  { id: 10, name: "Amber Rose", price: "Rs. 1,500", priceNum: 1500, rating: 89, category: "Western", gender: "Female", notes: ["Amber", "Rose"] },
  { id: 11, name: "Rose Princess", price: "Rs. 2,800", priceNum: 2800, rating: 200, category: "Premium", gender: "Female", notes: ["Rose"] },
  { id: 12, name: "Floral Dream", price: "Rs. 1,200", priceNum: 1200, rating: 150, category: "Western", gender: "Female", notes: ["Rose"] },
  { id: 13, name: "Royal Musk", price: "Rs. 3,500", priceNum: 3500, rating: 300, category: "Premium", gender: "Male", notes: ["Musk", "Amber"] },
  { id: 14, name: "Eastern Oud", price: "Rs. 2,200", priceNum: 2200, rating: 180, category: "Eastern", gender: "Male", notes: ["Oud"] },
]

function ShopPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedGender, setSelectedGender] = useState("All")
  const [priceRange, setPriceRange] = useState(10000)
  const [selectedNotes, setSelectedNotes] = useState([])
  const [searchQuery, setSearchQuery] = useState("")
  
  // Get category or gender from URL params
  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const categoryParam = params.get('category')
    const genderParam = params.get('gender')
    
    if (categoryParam) {
      // Check if categoryParam is a gender
      if (categoryParam === 'Male' || categoryParam === 'Female' || categoryParam === 'Unisex') {
        setSelectedGender(categoryParam)
        setSelectedCategory("All")
      } else {
        setSelectedCategory(categoryParam)
        setSelectedGender("All")
      }
      setSelectedNotes([])
      setPriceRange(10000)
      setSearchQuery("")
    }
    
    if (genderParam) {
      setSelectedGender(genderParam)
      setSelectedCategory("All")
    }
  }, [location.search])
  
  const categories = ["All", "Premium", "Western", "Eastern", "Black & Silver Platinum", "Royal Oud", "Musk Al Mahal", "Sultan E Ameer", "Oud Al Aswad", "Winter Collection 2024", "Amber Rose", "Silver & White", "Floral Dream", "Ameer Al Oud", "Oudh Al Ward", "Eastern Oud"]
  const genders = ["All", "Male", "Female", "Unisex"]
  const fragranceNotes = ["Oud", "Amber", "Musk", "Rose"]
  
  const handleNoteChange = (note) => {
    setSelectedNotes(prev =>
      prev.includes(note) ? prev.filter(n => n !== note) : [...prev, note]
    )
  }
  
  const handleGenderClick = (gender) => {
    setSelectedGender(gender)
    setSelectedCategory("All")
    // Update URL
    if (gender === 'All') {
      navigate('/shop')
    } else {
      navigate(`/shop?gender=${gender}`)
    }
  }
  
  const handleCategoryClick = (category) => {
    setSelectedCategory(category)
    setSelectedGender("All")
    // Update URL
    if (category === 'All') {
      navigate('/shop')
    } else {
      navigate(`/shop?category=${category}`)
    }
  }
  
  // Filter products
  const filteredProducts = allProducts.filter(product => {
    // Category filter
    if (selectedCategory !== "All" && product.category !== selectedCategory && product.name !== selectedCategory) {
      return false
    }
    
    // Gender filter
    if (selectedGender !== "All" && product.gender !== selectedGender) return false
    
    // Price filter
    if (product.priceNum > priceRange) return false
    
    // Fragrance notes filter
    if (selectedNotes.length > 0) {
      const hasNote = selectedNotes.some(note => product.notes.includes(note))
      if (!hasNote) return false
    }
    
    // Search query filter
    if (searchQuery && !product.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false
    }
    
    return true
  })
  
  return (
    <div className="shop-page">
      <div className="shop-header">
        <h1>Our Collection</h1>
        <p>Discover our premium range of attars</p>
      </div>
      
      <div className="shop-container">
        {/* Sidebar */}
        <div className="shop-sidebar">
          {/* Search Bar */}
          <div className="sidebar-section">
            <h4>Search</h4>
            <input 
              type="text" 
              placeholder="Search products..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>
          
          {/* Categories */}
          <div className="sidebar-section">
            <h4>Categories</h4>
            <ul>
              {categories.slice(0, 8).map(cat => (
                <li key={cat}>
                  <a 
                    href="#" 
                    className={selectedCategory === cat ? 'active' : ''}
                    onClick={(e) => { e.preventDefault(); handleCategoryClick(cat) }}
                  >
                    {cat}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Gender */}
          <div className="sidebar-section">
            <h4>Gender</h4>
            <ul>
              {genders.map(gender => (
                <li key={gender}>
                  <a 
                    href="#" 
                    className={selectedGender === gender ? 'active' : ''}
                    onClick={(e) => { e.preventDefault(); handleGenderClick(gender) }}
                  >
                    {gender}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Price Range */}
          <div className="sidebar-section">
            <h4>Price Range</h4>
            <input 
              type="range" 
              min="0" 
              max="10000" 
              step="100"
              value={priceRange}
              onChange={(e) => setPriceRange(Number(e.target.value))}
              className="price-range"
            />
            <div className="price-labels">
              <span>Rs. 0</span>
              <span>Rs. {priceRange.toLocaleString()}+</span>
            </div>
          </div>
          
          {/* Fragrance Notes */}
          <div className="sidebar-section">
            <h4>Fragrance Notes</h4>
            {fragranceNotes.map(note => (
              <label key={note} className="checkbox-label">
                <input 
                  type="checkbox" 
                  checked={selectedNotes.includes(note)}
                  onChange={() => handleNoteChange(note)}
                /> {note}
              </label>
            ))}
          </div>
          
          {/* Reset Filters */}
          {(selectedCategory !== "All" || selectedGender !== "All" || priceRange < 10000 || selectedNotes.length > 0 || searchQuery) && (
            <div className="sidebar-section">
              <button 
                className="reset-btn"
                onClick={() => {
                  setSelectedCategory("All")
                  setSelectedGender("All")
                  setPriceRange(10000)
                  setSelectedNotes([])
                  setSearchQuery("")
                  navigate('/shop')
                }}
              >
                Reset All Filters
              </button>
            </div>
          )}
        </div>
        
        {/* Products Grid */}
        <div className="shop-products">
          <div className="products-count">
            Showing {filteredProducts.length} products
          </div>
          {filteredProducts.length === 0 ? (
            <div className="no-products">
              <p>No products found. Try changing your filters.</p>
            </div>
          ) : (
            <div className="products-grid">
              {filteredProducts.map(product => (
                <ProductCard key={product.id} {...product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ShopPage