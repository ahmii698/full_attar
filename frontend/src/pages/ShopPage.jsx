import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import ProductCard from '../components/ProductCard'

function ShopPage() {
  const location = useLocation()
  const navigate = useNavigate()
  
  const [allProducts, setAllProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedGender, setSelectedGender] = useState("All")
  const [priceRange, setPriceRange] = useState(10000)
  const [selectedNotes, setSelectedNotes] = useState([])
  const [searchQuery, setSearchQuery] = useState("")
  
  const [categories, setCategories] = useState(["All"])
  const [genders, setGenders] = useState(["All", "Male", "Female", "Unisex"])
  const [fragranceNotes, setFragranceNotes] = useState(["Oud", "Amber", "Musk", "Rose"])

  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api'

  // Fetch all products from database
  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${API_BASE_URL}/products`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch products')
      }
      
      const data = await response.json()
      console.log('Products from DB:', data)
      
      setAllProducts(data)
      
      // Extract unique categories from products
      const uniqueCategories = ["All", ...new Set(data.map(p => p.category).filter(Boolean))]
      setCategories(uniqueCategories)
      
    } catch (err) {
      setError(err.message)
      console.error('Error fetching products:', err)
    } finally {
      setLoading(false)
    }
  }

  // Get category or gender from URL params
  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const categoryParam = params.get('category')
    const genderParam = params.get('gender')
    
    if (categoryParam) {
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
  
  const handleNoteChange = (note) => {
    setSelectedNotes(prev =>
      prev.includes(note) ? prev.filter(n => n !== note) : [...prev, note]
    )
  }
  
  const handleGenderClick = (gender) => {
    setSelectedGender(gender)
    setSelectedCategory("All")
    if (gender === 'All') {
      navigate('/shop')
    } else {
      navigate(`/shop?gender=${gender}`)
    }
  }
  
  const handleCategoryClick = (category) => {
    setSelectedCategory(category)
    setSelectedGender("All")
    if (category === 'All') {
      navigate('/shop')
    } else {
      navigate(`/shop?category=${category}`)
    }
  }
  
  // Parse notes string to array (e.g., "Oud,Amber" -> ["Oud", "Amber"])
  const parseNotes = (notesStr) => {
    if (!notesStr) return []
    return notesStr.split(',').map(n => n.trim())
  }
  
  // Filter products
  const filteredProducts = allProducts.filter(product => {
    // Category filter
    if (selectedCategory !== "All" && product.category !== selectedCategory) {
      return false
    }
    
    // Gender filter
    if (selectedGender !== "All" && product.gender !== selectedGender) return false
    
    // Price filter
    const productPrice = product.price_num || 0
    if (productPrice > priceRange) return false
    
    // Fragrance notes filter
    if (selectedNotes.length > 0) {
      const productNotes = parseNotes(product.notes)
      const hasNote = selectedNotes.some(note => productNotes.includes(note))
      if (!hasNote) return false
    }
    
    // Search query filter
    if (searchQuery && !product.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false
    }
    
    return true
  })
  
  // Loading state
  if (loading) {
    return (
      <div className="shop-page">
        <div className="shop-header">
          <h1>Our Collection</h1>
          <p>Discover our premium range of attars</p>
        </div>
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading products...</p>
        </div>
      </div>
    )
  }
  
  // Error state
  if (error) {
    return (
      <div className="shop-page">
        <div className="shop-header">
          <h1>Our Collection</h1>
          <p>Discover our premium range of attars</p>
        </div>
        <div className="error-container">
          <p>⚠️ Error: {error}</p>
          <button onClick={fetchProducts}>Try Again</button>
        </div>
      </div>
    )
  }
  
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
              {categories.map(cat => (
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
                <ProductCard 
                  key={product.product_id || product.id}
                  id={product.product_id || product.id}
                  name={product.name}
                  price={product.price}
                  priceNum={product.price_num}
                  discount_price={product.discount_price}
                  discount_percent={product.discount_percent}
                  is_deal={product.is_deal === 1}
                  rating={product.rating || 0}
                  category={product.category}
                  gender={product.gender}
                  notes={product.notes}
                  image_url={product.image_url}
                  description={product.description}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ShopPage