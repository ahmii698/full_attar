import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import ProductCard from '../components/ProductCard'
import { FiSearch, FiFilter, FiX } from 'react-icons/fi'
import { API_URL } from '../../config'

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
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false)
  
  // ✅ Dynamic categories from database
  const [categories, setCategories] = useState(["All"])
  const [genders, setGenders] = useState(["All", "Male", "Female", "Unisex"])
  const [fragranceNotes, setFragranceNotes] = useState([])

  useEffect(() => {
    fetchProducts()
    fetchCategories()
  }, [])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${API_URL}/products`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch products')
      }
      
      const data = await response.json()
      
      setAllProducts(data)
      
      // ✅ Dynamic fragrance notes from products
      const allNotes = []
      data.forEach(product => {
        if (product.notes) {
          const notes = product.notes.split(',').map(n => n.trim()).filter(Boolean)
          notes.forEach(note => {
            if (!allNotes.includes(note)) {
              allNotes.push(note)
            }
          })
        }
      })
      setFragranceNotes(allNotes)
      
    } catch (err) {
      setError(err.message)
      console.error('Error fetching products:', err)
    } finally {
      setLoading(false)
    }
  }

  // ✅ Fetch categories from database - SAARI CATEGORIES (NO FILTER)
  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_URL}/categories`)
      const result = await response.json()
      
      let categoryData = []
      if (result.success && result.data) {
        categoryData = result.data
      } else if (Array.isArray(result)) {
        categoryData = result
      } else if (result.data && Array.isArray(result.data)) {
        categoryData = result.data
      }
      
      // ✅ SAARI CATEGORIES - NO FILTER
      const categoryNames = ["All", ...categoryData.map(cat => cat.category_name || cat.name)]
      setCategories(categoryNames)
      
    } catch (error) {
      console.error('Error fetching categories:', error)
      // ✅ Fallback: Products se categories generate karo
      if (allProducts.length > 0) {
        const uniqueCategories = ["All", ...new Set(allProducts.map(p => p.category).filter(Boolean))]
        setCategories(uniqueCategories)
      }
    }
  }

  const findSimilarProducts = (searchTerm, products) => {
    if (!searchTerm || searchTerm === 'All') return []
    
    const searchLower = searchTerm.toLowerCase()
    
    let exactMatches = products.filter(p => 
      p.name.toLowerCase() === searchLower
    )
    
    if (exactMatches.length > 0) {
      return exactMatches
    }
    
    let containsMatches = products.filter(p => 
      p.name.toLowerCase().includes(searchLower)
    )
    
    if (containsMatches.length > 0) {
      return containsMatches
    }
    
    const searchWords = searchLower.split(' ')
    let wordMatches = products.filter(p => {
      const productLower = p.name.toLowerCase()
      let matchCount = 0
      searchWords.forEach(word => {
        if (word.length > 2 && productLower.includes(word)) {
          matchCount++
        }
      })
      return matchCount >= Math.ceil(searchWords.length / 2)
    })
    
    if (wordMatches.length > 0) {
      return wordMatches
    }
    
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

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    let categoryParam = params.get('category')
    const genderParam = params.get('gender')
    
    if (categoryParam) {
      categoryParam = decodeURIComponent(categoryParam)
      
      if (categoryParam === 'Male' || categoryParam === 'Female' || categoryParam === 'Unisex') {
        setSelectedGender(categoryParam)
        setSelectedCategory("All")
        setSearchQuery("")
      } 
      else if (categories.includes(categoryParam)) {
        setSelectedCategory(categoryParam)
        setSelectedGender("All")
        setSearchQuery("")
      }
      else {
        const similarProducts = findSimilarProducts(categoryParam, allProducts)
        
        if (similarProducts.length > 0) {
          setSearchQuery(categoryParam)
          setSelectedCategory("All")
          setSelectedGender("All")
        } else {
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
  
  // ✅ Updated filter - Check multiple categories
  const filteredProducts = allProducts.filter(product => {
    // ✅ Check if product has selected category (Many-to-Many)
    if (selectedCategory !== "All") {
      const productCategories = product.categories?.map(c => c.category_name || c.name) || []
      // ✅ Also check old category field for backward compatibility
      const allProductCategories = [...productCategories]
      if (product.category && !allProductCategories.includes(product.category)) {
        allProductCategories.push(product.category)
      }
      if (!allProductCategories.includes(selectedCategory)) {
        return false
      }
    }
    
    if (selectedGender !== "All" && product.gender !== selectedGender) return false
    
    if (searchQuery) {
      const similarProducts = findSimilarProducts(searchQuery, [product])
      if (similarProducts.length === 0) return false
    }
    
    const productPrice = product.price_num || 0
    if (productPrice > priceRange) return false
    
    if (selectedNotes.length > 0) {
      const productNotes = parseNotes(product.notes)
      const hasNote = selectedNotes.some(note => productNotes.includes(note))
      if (!hasNote) return false
    }
    
    return true
  })
  
  const clearAllFilters = () => {
    setSelectedCategory("All")
    setSelectedGender("All")
    setPriceRange(10000)
    setSelectedNotes([])
    setSearchQuery("")
    navigate('/shop')
  }
  
  const hasActiveFilters = selectedCategory !== "All" || selectedGender !== "All" || priceRange < 10000 || selectedNotes.length > 0 || searchQuery

  if (loading) {
    return (
      <div className="shop-page">
        <div className="shop-header">
          <h1>Our Collection</h1>
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
      </div>
      
      {/* Mobile Filter Toggle */}
      <div className="mobile-filter-toggle">
        <button onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}>
          <FiFilter /> Filters
          {hasActiveFilters && <span className="filter-badge">{filteredProducts.length}</span>}
        </button>
        {searchQuery && (
          <button className="clear-search-btn" onClick={() => {
            setSearchQuery("")
            navigate('/shop')
          }}>
            <FiX /> Clear Search
          </button>
        )}
      </div>
      
      <div className="shop-container">
        {/* Sidebar */}
        <div className={`shop-sidebar ${isMobileFilterOpen ? 'open' : ''}`}>
          <div className="sidebar-close" onClick={() => setIsMobileFilterOpen(false)}>
            <FiX />
          </div>
          
          <div className="sidebar-section">
            <h4><FiSearch /> Search</h4>
            <input 
              type="text" 
              placeholder="Search products..." 
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                if (e.target.value) {
                  navigate(`/shop?category=${encodeURIComponent(e.target.value)}`)
                } else {
                  navigate('/shop')
                }
              }}
              className="search-input"
            />
          </div>
          
          {/* ✅ ALL CATEGORIES - NO FILTER */}
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
                    {selectedCategory === cat && <span className="active-dot">●</span>}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          {/* ✅ GENDER */}
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
                    {selectedGender === gender && <span className="active-dot">●</span>}
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
          
          {/* ✅ DYNAMIC FRAGRANCE NOTES */}
          <div className="sidebar-section">
            <h4>Fragrance Notes</h4>
            {fragranceNotes.length === 0 ? (
              <p className="no-notes">No fragrance notes available</p>
            ) : (
              <div className="notes-grid">
                {fragranceNotes.map(note => (
                  <label key={note} className={`checkbox-label ${selectedNotes.includes(note) ? 'active' : ''}`}>
                    <input 
                      type="checkbox" 
                      checked={selectedNotes.includes(note)}
                      onChange={() => handleNoteChange(note)}
                    /> 
                    <span>{note}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
          
          {hasActiveFilters && (
            <div className="sidebar-section">
              <button className="reset-btn" onClick={clearAllFilters}>
                Clear All Filters
              </button>
            </div>
          )}
        </div>
        
        {/* Products */}
        <div className="shop-products">
          <div className="products-header">
            <div className="products-count">
              {filteredProducts.length} {filteredProducts.length === 1 ? 'Product' : 'Products'}
            </div>
            {hasActiveFilters && (
              <button className="clear-filters-btn" onClick={clearAllFilters}>
                Clear Filters
              </button>
            )}
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
                  ml_prices={product.ml_prices}
                  categories={product.categories}
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