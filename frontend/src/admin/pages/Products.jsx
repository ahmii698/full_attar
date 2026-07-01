import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getProducts, deleteProduct, getCategories } from '../services/adminApi'
import { API_URL, STORAGE_URL } from '../../../config'
import '../styles/Products.css'

function Products() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadingCategories, setLoadingCategories] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedGender, setSelectedGender] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const itemsPerPage = 8

  const APP_URL = STORAGE_URL?.replace('/storage', '') || 'http://localhost:8000'
  const FRONTEND_URL = window.location.origin || 'http://localhost:5173'

  useEffect(() => {
    fetchProducts()
    fetchCategories()
  }, [])

  const fetchProducts = async () => {
    try {
      const res = await getProducts()
      setProducts(res.data)
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      setLoadingCategories(true)
      const response = await getCategories()
      
      let categoryData = []
      if (response.data && response.data.success && Array.isArray(response.data.data)) {
        categoryData = response.data.data
      } else if (Array.isArray(response.data)) {
        categoryData = response.data
      }
      
      const filteredCategories = categoryData.filter(cat => cat.show_in_navbar === 1)
      setCategories(filteredCategories)
    } catch (error) {
      console.error('Error fetching categories:', error)
      setCategories([])
    } finally {
      setLoadingCategories(false)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      await deleteProduct(id)
      fetchProducts()
    }
  }

  const getImageUrl = (imagePath) => {
    if (!imagePath) {
      return '/assets/at1.jpg'
    }

    if (imagePath.startsWith('http')) {
      return imagePath
    }

    let cleanPath = imagePath.replace(/^\/+/, '')
    cleanPath = cleanPath.replace(/^storage\//, '')
    cleanPath = cleanPath.replace(/^images\/blogs\//, 'blogs/')

    const finalUrl = `${STORAGE_URL.replace(/\/+$/, '')}/${cleanPath}`
    return finalUrl
  }

  // ✅ Filter products based on category, gender, and search
  const filteredProducts = products.filter(product => {
    let match = true
    
    if (selectedCategory) {
      // ✅ Check if product has selected category (Many-to-Many)
      const productCategories = product.categories?.map(c => c.category_name || c.name) || []
      match = match && productCategories.includes(selectedCategory)
    }
    if (selectedGender) {
      match = match && product.gender === selectedGender
    }
    if (searchTerm) {
      match = match && product.name.toLowerCase().includes(searchTerm.toLowerCase())
    }
    
    return match
  })

  // Pagination calculations
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentProducts = filteredProducts.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage)

  const goToPage = (pageNumber) => {
    setCurrentPage(pageNumber)
  }

  const goToPrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  const goToNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  useEffect(() => {
    setCurrentPage(1)
  }, [selectedCategory, selectedGender, searchTerm])

  const clearFilters = () => {
    setSelectedCategory('')
    setSelectedGender('')
    setSearchTerm('')
  }

  if (loading) return <div className="admin-loading">Loading products...</div>

  return (
    <div className="admin-products-page">
      <div className="admin-page-header">
        <h2>Products</h2>
        <Link to="/admin/products/create" className="admin-btn-primary">+ Add New Product</Link>
      </div>

      <div className="admin-filters-section">
        <div className="admin-filters-row">
          <div className="filter-group">
            <label>Category</label>
            <select 
              value={selectedCategory} 
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="filter-select"
            >
              <option value="">All Categories</option>
              {loadingCategories ? (
                <option value="" disabled>Loading categories...</option>
              ) : (
                categories.map(cat => (
                  <option key={cat.category_id || cat.id} value={cat.category_name || cat.name}>
                    {cat.category_name || cat.name}
                  </option>
                ))
              )}
            </select>
          </div>

          <div className="filter-group">
            <label>Gender</label>
            <select 
              value={selectedGender} 
              onChange={(e) => setSelectedGender(e.target.value)}
              className="filter-select"
            >
              <option value="">All Genders</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Unisex">Unisex</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Search</label>
            <input 
              type="text" 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search products..."
              className="filter-input"
            />
          </div>

          <div className="filter-group filter-actions">
            <button onClick={clearFilters} className="filter-clear-btn">
              Clear Filters
            </button>
          </div>
        </div>

        <div className="filter-results-count">
          Found {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
          {selectedCategory && ` in "${selectedCategory}"`}
          {selectedGender && ` (${selectedGender})`}
        </div>
      </div>

      <div className="admin-data-table-container">
        <table className="admin-data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Image</th>
              <th>Name</th>
              <th>Price</th>
              <th>Deal Price</th>
              <th>Discount</th>
              <th>Categories</th>
              <th>Gender</th>
              <th>Top Seller</th>
              <th>New Arrival</th>
              <th>Deal</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentProducts.length === 0 ? (
              <tr>
                <td colSpan="12" className="no-products-found">
                  No products found {selectedCategory && `in "${selectedCategory}"`}
                </td>
              </tr>
            ) : (
              currentProducts.map(product => (
                <tr key={product.product_id}>
                  <td>{product.product_id}</td>
                  <td>
                    <img 
                      src={getImageUrl(product.image_url)} 
                      alt={product.name} 
                      className="admin-product-image"
                      style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }}
                      onError={(e) => {
                        e.target.src = 'https://placehold.co/50x50/1a1a2a/d4af37?text=No+Image'
                      }}
                    />
                  </td>
                  <td>{product.name}</td>
                  <td>{product.price}</td>
                  <td>{product.discount_price ? `Rs. ${product.discount_price.toLocaleString()}` : '-'}</td>
                  <td>{product.discount_percent ? `${product.discount_percent}%` : '-'}</td>
                  {/* ✅ Multiple Categories */}
                  <td>
                    {product.categories && product.categories.length > 0 ? (
                      <div className="category-tags">
                        {product.categories.map((cat, index) => (
                          <span key={cat.category_id || index} className="category-tag">
                            {cat.category_name || cat.name}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="no-category">-</span>
                    )}
                  </td>
                  <td>{product.gender}</td>
                  <td>{product.is_top_seller ? '✅' : '❌'}</td>
                  <td>{product.is_new_arrival ? '✅' : '❌'}</td>
                  <td>{product.is_deal ? '✅' : '❌'}</td>
                  <td>
                    <Link to={`/admin/products/edit/${product.product_id}`} className="admin-btn-warning">Edit</Link>
                    <button onClick={() => handleDelete(product.product_id)} className="admin-btn-danger">Delete</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="pagination-container">
          <button onClick={goToPrevious} disabled={currentPage === 1} className="pagination-btn">
            ← Previous
          </button>
          <div className="pagination-pages">
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index + 1}
                onClick={() => goToPage(index + 1)}
                className={`pagination-page ${currentPage === index + 1 ? 'active' : ''}`}
              >
                {index + 1}
              </button>
            ))}
          </div>
          <button onClick={goToNext} disabled={currentPage === totalPages} className="pagination-btn">
            Next →
          </button>
        </div>
      )}
      
      <div className="pagination-info">
        Showing {filteredProducts.length > 0 ? indexOfFirstItem + 1 : 0} to {Math.min(indexOfLastItem, filteredProducts.length)} of {filteredProducts.length} products
      </div>
    </div>
  )
}

export default Products