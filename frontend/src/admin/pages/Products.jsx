import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getProducts, deleteProduct } from '../services/adminApi'
import { API_URL, STORAGE_URL } from '../../../config'  // ✅ IMPORT FROM CONFIG
import '../styles/Products.css'

function Products() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 8

  // ✅ USING CONFIG - NO HARDCODED URLS
  const APP_URL = STORAGE_URL?.replace('/storage', '') || 'http://localhost:8000'
  const FRONTEND_URL = window.location.origin || 'http://localhost:5173'

  useEffect(() => {
    fetchProducts()
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

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      await deleteProduct(id)
      fetchProducts()
    }
  }

const getImageUrl = (imagePath) => {
  if (!imagePath) {
    console.log("IMAGE DEBUG → empty path, using default")
    return '/assets/at1.jpg'
  }

  if (imagePath.startsWith('http')) {
    console.log("IMAGE DEBUG → full URL:", imagePath)
    return imagePath
  }

  // Clean leading slash
  let cleanPath = imagePath.replace(/^\/+/, '')

  // Remove "storage/" prefix since STORAGE_URL already ends in /storage
  cleanPath = cleanPath.replace(/^storage\//, '')

  // Fix wrong "images/blogs/" prefix → actual folder is just "blogs/"
  cleanPath = cleanPath.replace(/^images\/blogs\//, 'blogs/')

  // Build final URL with exactly one slash
  const finalUrl = `${STORAGE_URL.replace(/\/+$/, '')}/${cleanPath}`

  console.log("IMAGE DEBUG → built URL:", {
    imagePath,
    cleanPath,
    STORAGE_URL,
    finalUrl
  })

  return finalUrl
}

  // Pagination calculations
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentProducts = products.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(products.length / itemsPerPage)

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

  if (loading) return <div className="admin-loading">Loading products...</div>

  return (
    <div className="admin-products-page">
      <div className="admin-page-header">
        <h2>Products</h2>
        <Link to="/admin/products/create" className="admin-btn-primary">+ Add New Product</Link>
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
              <th>Category</th>
              <th>Gender</th>
              <th>Top Seller</th>
              <th>New Arrival</th>
              <th>Deal</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentProducts.map(product => (
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
                <td>{product.category}</td>
                <td>{product.gender}</td>
                <td>{product.is_top_seller ? '✅' : '❌'}</td>
                <td>{product.is_new_arrival ? '✅' : '❌'}</td>
                <td>{product.is_deal ? '✅' : '❌'}</td>
                <td>
                  <Link to={`/admin/products/edit/${product.product_id}`} className="admin-btn-warning">Edit</Link>
                  <button onClick={() => handleDelete(product.product_id)} className="admin-btn-danger">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Section */}
      {totalPages > 1 && (
        <div className="pagination-container">
          <button 
            onClick={goToPrevious} 
            disabled={currentPage === 1}
            className="pagination-btn"
          >
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
          
          <button 
            onClick={goToNext} 
            disabled={currentPage === totalPages}
            className="pagination-btn"
          >
            Next →
          </button>
        </div>
      )}
      
      <div className="pagination-info">
        Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, products.length)} of {products.length} products
      </div>
    </div>
  )
}

export default Products