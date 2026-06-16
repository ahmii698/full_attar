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
      
      const uniqueCategories = ["All", ...new Set(data.map(p => p.category).filter(Boolean))]
      setCategories(uniqueCategories)
      
    } catch (err) {
      setError(err.message)
      console.error('Error fetching products:', err)
    } finally {
      setLoading(false)
    }
  }

  // ✅ Smart search function - finds products with similar names
  const findSimilarProducts = (searchTerm, products) => {
    if (!searchTerm || searchTerm === 'All') return []
    
    const searchLower = searchTerm.toLowerCase()
    
    // First try exact match
    let exactMatches = products.filter(p => 
      p.name.toLowerCase() === searchLower
    )
    
    if (exactMatches.length > 0) {
      return exactMatches
    }
    
    // Then try contains match
    let containsMatches = products.filter(p => 
      p.name.toLowerCase().includes(searchLower)
    )
    
    if (containsMatches.length > 0) {
      return containsMatches
    }
    
    // Then try word-by-word match (for "Royal Oud" vs "Royal Oudf")
    const searchWords = searchLower.split(' ')
    let wordMatches = products.filter(p => {
      const productLower = p.name.toLowerCase()
      // Check if at least 2 words match or 70% of search term matches
      let matchCount = 0
      searchWords.forEach(word => {
        if (word.length > 2 && productLower.includes(word)) {
          matchCount++
        }
      })
      // Return true if at least 50% of words match
      return matchCount >= Math.ceil(searchWords.length / 2)
    })
    
    if (wordMatches.length > 0) {
      return wordMatches
    }
    
    // Finally, try partial word match (first 3-4 characters)
    const firstFewChars = searchLower.substring(0, 4)
    if (firstFewChars.length >= 3) {
      let partialMatches = products.filter(p => 
        p.name.toLowerCase().includes(firstFewChars)
      )
      if (partialMatches.length > 0) {
        return partialMatches
      }
    }
    
    return []
  }

  // ✅ Handle URL params with smart matching
  useEffect(() => {
    const params = new URLSearchParams(location.search)
    let categoryParam = params.get('category')
    const genderParam = params.get('gender')
    
    console.log('Raw category param:', categoryParam)
    
    if (categoryParam) {
      categoryParam = decodeURIComponent(categoryParam)
      console.log('Decoded category param:', categoryParam)
      
      // First check if it's a gender
      if (categoryParam === 'Male' || categoryParam === 'Female' || categoryParam === 'Unisex') {
        setSelectedGender(categoryParam)
        setSelectedCategory("All")
        setSearchQuery("")
      } 
      // Check if it's a category
      else if (categories.includes(categoryParam)) {
        setSelectedCategory(categoryParam)
        setSelectedGender("All")
        setSearchQuery("")
      }
      // Otherwise treat as product name search with smart matching
      else {
        // Find similar products
        const similarProducts = findSimilarProducts(categoryParam, allProducts)
        
        if (similarProducts.length > 0) {
          // If we found similar products, set search query
          setSearchQuery(categoryParam)
          setSelectedCategory("All")
          setSelectedGender("All")
          console.log('Found similar products:', similarProducts.map(p => p.name))
        } else {
          // No matches found, set as category
          setSelectedCategory(categoryParam)
          setSelectedGender("All")
          setSearchQuery("")
        }
      }
      
      setSelectedNotes([])
      setPriceRange(10000)
    }
    
    if (genderParam) {
      setSelectedGender(genderParam)
      setSelectedCategory("All")
      setSearchQuery("")
    }
  }, [location.search, allProducts, categories])
  
  const handleNoteChange = (note) => {
    setSelectedNotes(prev =>
      prev.includes(note) ? prev.filter(n => n !== note) : [...prev, note]
    )
  }
  
  const handleGenderClick = (gender) => {
    setSelectedGender(gender)
    setSelectedCategory("All")
    setSearchQuery("")
    if (gender === 'All') {
      navigate('/shop')
    } else {
      navigate(`/shop?gender=${gender}`)
    }
  }
  
  const handleCategoryClick = (category) => {
    setSelectedCategory(category)
    setSelectedGender("All")
    setSearchQuery("")
    if (category === 'All') {
      navigate('/shop')
    } else {
      navigate(`/shop?category=${encodeURIComponent(category)}`)
    }
  }
  
  const parseNotes = (notesStr) => {
    if (!notesStr) return []
    return notesStr.split(',').map(n => n.trim())
  }
  
  // ✅ Smart filter products
  const filteredProducts = allProducts.filter(product => {
    // Category filter
    if (selectedCategory !== "All" && product.category !== selectedCategory) {
      return false
    }
    
    // Gender filter
    if (selectedGender !== "All" && product.gender !== selectedGender) return false
    
    // Smart search filter
    if (searchQuery) {
      const similarProducts = findSimilarProducts(searchQuery, [product])
      if (similarProducts.length === 0) return false
    }
    
    // Price filter
    const productPrice = product.price_num || 0
    if (productPrice > priceRange) return false
    
    // Fragrance notes filter
    if (selectedNotes.length > 0) {
      const productNotes = parseNotes(product.notes)
      const hasNote = selectedNotes.some(note => productNotes.includes(note))
      if (!hasNote) return false
    }
    
    return true
  })
  
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
        <div className="shop-sidebar">
          <div className="sidebar-section">
            <h4>Search</h4>
            <input 
              type="text" 
              placeholder="Search products..." 
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                // Update URL when searching
                if (e.target.value) {
                  navigate(`/shop?category=${encodeURIComponent(e.target.value)}`)
                } else {
                  navigate('/shop')
                }
              }}
              className="search-input"
            />
          </div>
          
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
                  ml_prices={product.ml_prices}  // ✅ ADD THIS LINE - IMPORTANT
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