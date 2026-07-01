import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  FaPlus, FaEdit, FaTrash, FaTimes, FaSave, 
  FaTag, FaSpinner, FaEye, FaBox, FaToggleOn, FaToggleOff
} from 'react-icons/fa'
import { getCategories, createCategory, updateCategory, deleteCategory, getCategoryProducts, updateProduct } from '../services/adminApi'
import { API_URL } from '../../../config'
import '../styles/AdminCategories.css'

function AdminCategories() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingCategory, setEditingCategory] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    category_name: '',
    category_slug: '',
    show_in_navbar: true,
  })
  
  const [showProducts, setShowProducts] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [categoryProducts, setCategoryProducts] = useState([])
  const [loadingProducts, setLoadingProducts] = useState(false)
  const [updatingProduct, setUpdatingProduct] = useState(null)
  const [updatingCategory, setUpdatingCategory] = useState(null)

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      setLoading(true)
      const response = await getCategories()
      
      if (response.data && response.data.success && Array.isArray(response.data.data)) {
        setCategories(response.data.data)
      } else if (Array.isArray(response.data)) {
        setCategories(response.data)
      } else {
        console.error('Unexpected response format:', response)
        setCategories([])
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
      setCategories([])
    } finally {
      setLoading(false)
    }
  }

  const fetchCategoryProducts = async (categoryId) => {
    try {
      setLoadingProducts(true)
      const response = await getCategoryProducts(categoryId)
      const data = response.data?.data || response.data || []
      console.log('📦 Category Products Data:', data)
      console.log('📦 show_in_navbar values:', data.map(p => ({ 
        name: p.name, 
        show_in_navbar: p.show_in_navbar,
        category_id: categoryId 
      })))
      setCategoryProducts(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Error fetching category products:', error)
      setCategoryProducts([])
    } finally {
      setLoadingProducts(false)
    }
  }

  const handleViewProducts = async (category) => {
    setSelectedCategory(category)
    setShowProducts(true)
    await fetchCategoryProducts(category.category_id)
  }

  // ✅ Toggle category show_in_navbar
  const toggleCategoryNavbar = async (categoryId, currentStatus) => {
    try {
      setUpdatingCategory(categoryId)
      const newStatus = currentStatus === 1 ? 0 : 1
      
      const formData = new FormData()
      formData.append('show_in_navbar', newStatus)
      formData.append('_method', 'PUT')
      
      await updateCategory(categoryId, formData)
      
      setCategories(prev => 
        prev.map(c => 
          c.category_id === categoryId 
            ? { ...c, show_in_navbar: newStatus } 
            : c
        )
      )
    } catch (error) {
      console.error('Error updating category:', error)
      alert(error.response?.data?.message || 'Failed to update category. Please try again.')
    } finally {
      setUpdatingCategory(null)
    }
  }

  // ✅ FIX: Toggle product show_in_navbar - Category Specific
  const toggleNavbarProduct = async (productId, categoryId, currentStatus) => {
    try {
      setUpdatingProduct(productId)
      const currentStatusNum = Number(currentStatus)
      const newStatus = currentStatusNum === 1 ? 0 : 1
      
      console.log('🔄 Toggling product:', { 
        productId, 
        categoryId,
        currentStatus: currentStatusNum, 
        newStatus 
      })
      
      const token = localStorage.getItem('admin_token')
      const response = await fetch(`${API_URL}/admin/products/${productId}/category/${categoryId}/navbar`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ show_in_navbar: newStatus })
      })
      
      const result = await response.json()
      console.log('✅ API Response:', result)
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to update product')
      }
      
      // ✅ IMMEDIATE UI UPDATE - Update local state
      setCategoryProducts(prev => 
        prev.map(p => 
          p.product_id === productId 
            ? { ...p, show_in_navbar: newStatus } 
            : p
        )
      )
      
      // ✅ MODAL REFRESH
      await fetchCategoryProducts(selectedCategory.category_id)
      
      // ✅ NAVBAR REFRESH
      await refreshNavbarData()
      
    } catch (error) {
      console.error('❌ Error updating product:', error)
      alert(error.message || 'Failed to update product. Please try again.')
    } finally {
      setUpdatingProduct(null)
    }
  }

  // ✅ Navbar refresh function
  const refreshNavbarData = async () => {
    try {
      const response = await fetch(`${API_URL}/navbar-categories`)
      const result = await response.json()
      console.log('🔄 Navbar refreshed:', result)
    } catch (error) {
      console.error('Error refreshing navbar:', error)
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    
    try {
      if (editingCategory) {
        await updateCategory(editingCategory.category_id, formData)
      } else {
        await createCategory(formData)
      }
      resetForm()
      fetchCategories()
    } catch (error) {
      console.error('Error saving category:', error)
      alert(error.response?.data?.message || 'Error saving category. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this category?')) return
    
    try {
      await deleteCategory(id)
      fetchCategories()
      if (showProducts) {
        setShowProducts(false)
        setSelectedCategory(null)
      }
    } catch (error) {
      console.error('Error deleting category:', error)
      alert(error.response?.data?.message || 'Error deleting category. Please try again.')
    }
  }

  const handleEdit = (category) => {
    setEditingCategory(category)
    setFormData({
      category_name: category.category_name || '',
      category_slug: category.category_slug || '',
      show_in_navbar: category.show_in_navbar !== undefined ? !!category.show_in_navbar : true,
    })
    setShowForm(true)
  }

  const resetForm = () => {
    setShowForm(false)
    setEditingCategory(null)
    setFormData({
      category_name: '',
      category_slug: '',
      show_in_navbar: true,
    })
    setSubmitting(false)
  }

  const categoriesList = Array.isArray(categories) ? categories : []

  return (
    <div className="admin-categories">
      <div className="categories-header">
        <div className="header-left">
          <h2>Manage Categories</h2>
          <p className="header-subtitle">Create and manage product categories for your store</p>
        </div>
        <button className="btn-primary" onClick={() => setShowForm(true)}>
          <FaPlus /> Add Category
        </button>
      </div>

      {/* Category Form Modal */}
      {showForm && (
        <div className="category-form-modal">
          <div className="category-form-content">
            <div className="modal-header">
              <h3>
                <FaTag /> {editingCategory ? 'Edit Category' : 'Add New Category'}
              </h3>
              <button className="close-btn" onClick={resetForm}>
                <FaTimes />
              </button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Category Name *</label>
                <input
                  type="text"
                  name="category_name"
                  value={formData.category_name}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="e.g., Premium, Western, Eastern"
                  required
                />
              </div>

              <div className="form-group">
                <label>Slug (URL friendly)</label>
                <input
                  type="text"
                  name="category_slug"
                  value={formData.category_slug}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="e.g., premium, western, eastern"
                />
                <small className="helper-text">Leave empty to auto-generate from name</small>
              </div>

              <div className="form-group checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="show_in_navbar"
                    checked={formData.show_in_navbar}
                    onChange={handleChange}
                  />
                  <span className="checkbox-text">
                    {formData.show_in_navbar ? <FaToggleOn className="toggle-on" /> : <FaToggleOff className="toggle-off" />}
                    Show in Navbar
                  </span>
                </label>
                <small className="helper-text">Enable to show this category in the navbar mega menu</small>
              </div>

              <div className="form-actions">
                <button type="submit" className="btn-primary" disabled={submitting}>
                  {submitting ? (
                    <>
                      <FaSpinner className="spinning" /> Saving...
                    </>
                  ) : (
                    <>
                      <FaSave /> {editingCategory ? 'Update' : 'Add'} Category
                    </>
                  )}
                </button>
                <button type="button" className="btn-secondary" onClick={resetForm}>
                  <FaTimes /> Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Categories List */}
      <div className="categories-content">
        {loading ? (
          <div className="loading-state">
            <FaSpinner className="spinning" />
            <span>Loading categories...</span>
          </div>
        ) : categoriesList.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">
              <FaTag />
            </div>
            <h3>No Categories Found</h3>
            <p>Create your first category to organize your products</p>
            <button className="btn-primary" onClick={() => setShowForm(true)}>
              <FaPlus /> Add Category
            </button>
          </div>
        ) : (
          <div className="categories-grid">
            {categoriesList.map(category => (
              <div key={category.category_id} className="category-card">
                <div className="category-card-header">
                  <div className="category-icon" style={{ backgroundColor: category.show_in_navbar ? '#d4af37' : '#555' }}>
                    <i className="fa-tag"></i>
                  </div>
                  <div className="category-card-info">
                    <h4>{category.category_name}</h4>
                    <span className="category-slug">/{category.category_name}</span>
                  </div>
                </div>
                
                <div className="category-card-body">
                  <div className="category-meta">
                    <span className="category-product-count">
                      <FaTag /> {category.product_count || 0} Products
                    </span>
                    <span className={`category-status ${category.show_in_navbar ? 'active' : 'inactive'}`}>
                      {category.show_in_navbar ? 'In Navbar' : 'Hidden'}
                    </span>
                  </div>
                </div>

                <div className="category-card-actions">
                  <button 
                    className={`navbar-toggle-btn ${category.show_in_navbar ? 'active' : ''}`}
                    onClick={() => toggleCategoryNavbar(category.category_id, category.show_in_navbar)}
                    disabled={updatingCategory === category.category_id}
                    title={category.show_in_navbar ? 'Remove from Navbar' : 'Show in Navbar'}
                  >
                    {updatingCategory === category.category_id ? (
                      <FaSpinner className="spinning" />
                    ) : category.show_in_navbar ? (
                      <><FaToggleOn /> Show</>
                    ) : (
                      <><FaToggleOff /> Hide</>
                    )}
                  </button>
                  <button 
                    className="view-btn" 
                    onClick={() => handleViewProducts(category)}
                  >
                    <FaEye /> View Products
                  </button>
                  <button 
                    className="edit-btn" 
                    onClick={() => handleEdit(category)}
                  >
                    <FaEdit />
                  </button>
                  <button 
                    className="delete-btn" 
                    onClick={() => handleDelete(category.category_id)}
                    disabled={category.product_count > 0}
                    title={category.product_count > 0 ? 'Cannot delete category with products' : 'Delete category'}
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ✅ Products Modal - Category Specific Toggle */}
      {showProducts && selectedCategory && (
        <div className="products-modal-overlay" onClick={() => setShowProducts(false)}>
          <div className="products-modal" onClick={(e) => e.stopPropagation()}>
            <div className="products-modal-header">
              <h3>
                <FaBox /> Products in "{selectedCategory.category_name}"
              </h3>
              <button className="close-btn" onClick={() => setShowProducts(false)}>
                <FaTimes />
              </button>
            </div>
            
            <div className="products-modal-body">
              {loadingProducts ? (
                <div className="loading-state">
                  <FaSpinner className="spinning" />
                  <span>Loading products...</span>
                </div>
              ) : categoryProducts.length === 0 ? (
                <div className="empty-products">
                  <p>No products found in this category.</p>
                  <Link to="/admin/products/create" className="btn-primary">
                    <FaPlus /> Add Product to "{selectedCategory.category_name}"
                  </Link>
                </div>
              ) : (
                <div className="products-list">
                  {categoryProducts.map(product => (
                    <div key={product.product_id} className="product-item">
                      <div className="product-item-info">
                        <span className="product-item-name">{product.name}</span>
                        <span className="product-item-price">Rs. {product.price_num}</span>
                      </div>
                      <div className="product-item-actions">
                        {/* ✅ Category Specific Toggle - Category ID Pass */}
                        <button 
                          className={`navbar-toggle-btn ${Number(product.show_in_navbar) === 1 ? 'active' : ''}`}
                          onClick={() => toggleNavbarProduct(
                            product.product_id, 
                            selectedCategory.category_id, 
                            Number(product.show_in_navbar)
                          )}
                          disabled={updatingProduct === product.product_id}
                          title={Number(product.show_in_navbar) === 1 ? 'Remove from Navbar' : 'Show in Navbar'}
                        >
                          {updatingProduct === product.product_id ? (
                            <FaSpinner className="spinning" />
                          ) : Number(product.show_in_navbar) === 1 ? (
                            <><FaToggleOn /> Show</>
                          ) : (
                            <><FaToggleOff /> Hide</>
                          )}
                        </button>
                        <Link to={`/admin/products/edit/${product.product_id}`} className="edit-btn-small">
                          <FaEdit />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* ✅ Footer */}
            <div className="products-modal-footer">
              <button 
                className="btn-primary save-changes-btn"
                onClick={async () => {
                  setShowProducts(false)
                  await fetchCategories()
                  await fetchCategoryProducts(selectedCategory.category_id)
                  await refreshNavbarData()
                }}
              >
                <FaSave /> Save & Close
              </button>
              <Link to="/admin/products/create" className="btn-primary">
                <FaPlus /> Add New Product
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminCategories