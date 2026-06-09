import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getProducts, deleteProduct } from '../services/adminApi'
import '../styles/Products.css'

function Products() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

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

  if (loading) return <div className="admin-loading">Loading products...</div>

  return (
    <div className="admin-products-page">
      <div className="admin-page-header">
        <h2>Products</h2>
        <Link to="/admin/products/create" className="admin-btn-primary">Add New Product</Link>
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
            {products.map(product => (
              <tr key={product.product_id}>
                <td>{product.product_id}</td>
                <td>
                  <img 
                    src={product.image_url} 
                    alt={product.name} 
                    className="admin-product-image"
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
    </div>
  )
}

export default Products