import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { getProduct, createProduct, updateProduct } from '../services/adminApi'
import '../styles/ProductForm.css'

function ProductForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    price_num: '',
    discount_price: '',
    discount_percent: '',
    is_deal: false,
    rating: '',
    category: '',
    gender: '',
    notes: '',
    image_url: '',
    stock_quantity: 10,
    is_top_seller: false,
    is_new_arrival: false
  })
  const [isEdit, setIsEdit] = useState(false)

  const APP_URL = 'http://localhost:8000'
  const FRONTEND_URL = 'http://localhost:5173'

  useEffect(() => {
    if (id) {
      setIsEdit(true)
      fetchProduct()
    }
  }, [id])

  const fetchProduct = async () => {
    try {
      setLoading(true)
      const res = await getProduct(id)
      const product = res.data
      setFormData({
        name: product.name || '',
        price: product.price || '',
        price_num: product.price_num || '',
        discount_price: product.discount_price || '',
        discount_percent: product.discount_percent || '',
        is_deal: product.is_deal === 1,
        rating: product.rating || '',
        category: product.category || '',
        gender: product.gender || '',
        notes: product.notes || '',
        image_url: product.image_url || '',
        stock_quantity: product.stock_quantity || 10,
        is_top_seller: product.is_top_seller === 1,
        is_new_arrival: product.is_new_arrival === 1
      })
      
      if (product.image_url) {
        if (product.image_url.startsWith('/images/')) {
          setImagePreview(`${APP_URL}${product.image_url}`)
        } else if (product.image_url.startsWith('/assets/')) {
          setImagePreview(`${FRONTEND_URL}${product.image_url}`)
        } else if (product.image_url.startsWith('/storage/')) {
          setImagePreview(`${APP_URL}${product.image_url}`)
        } else {
          setImagePreview(product.image_url)
        }
      }
    } catch (error) {
      console.error('Error fetching product:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImageFile(file)
      setImagePreview(URL.createObjectURL(file))
      setFormData(prev => ({ ...prev, image_url: '' }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const submitData = new FormData()
      
      Object.keys(formData).forEach(key => {
        if (formData[key] !== undefined && formData[key] !== '') {
          if (key === 'is_deal' || key === 'is_top_seller' || key === 'is_new_arrival') {
            submitData.append(key, formData[key] ? 1 : 0)
          } else {
            submitData.append(key, formData[key])
          }
        }
      })
      
      if (imageFile) {
        submitData.append('image', imageFile)
      }

      if (isEdit) {
        await updateProduct(id, submitData)
      } else {
        await createProduct(submitData)
      }
      navigate('/admin/products')
    } catch (error) {
      console.error('Error saving product:', error)
      alert('Error saving product. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const getImageUrl = (imagePath) => {
    if (!imagePath) return ''
    if (imagePath.startsWith('http')) return imagePath
    if (imagePath.startsWith('/images/')) return `${APP_URL}${imagePath}`
    if (imagePath.startsWith('/storage/')) return `${APP_URL}${imagePath}`
    if (imagePath.startsWith('/assets/')) return `${FRONTEND_URL}${imagePath}`
    return imagePath
  }

  if (loading && isEdit) return <div className="admin-loading">Loading product...</div>

  return (
    <div className="product-form">
      <div className="form-header">
        <h2>{isEdit ? 'Edit Product' : 'Add New Product'}</h2>
        <Link to="/admin/products" className="btn-secondary">Back to Products</Link>
      </div>

      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="form-grid">
          <div className="form-group full-width">
            <label>Product Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>

          <div className="form-group">
            <label>Price (Numeric) *</label>
            <input
              type="number"
              name="price_num"
              value={formData.price_num}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>

          <div className="form-group">
            <label>Price Display (Rs. X,XXX)</label>
            <input
              type="text"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="form-control"
              placeholder="Rs. 2,100"
            />
          </div>

          <div className="form-group">
            <label>Discount Price</label>
            <input
              type="number"
              name="discount_price"
              value={formData.discount_price}
              onChange={handleChange}
              className="form-control"
            />
          </div>

          <div className="form-group">
            <label>Discount Percent</label>
            <input
              type="number"
              name="discount_percent"
              value={formData.discount_percent}
              onChange={handleChange}
              className="form-control"
              placeholder="e.g., 30"
            />
          </div>

          <div className="form-group">
            <label>Category *</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="form-control"
              required
            >
              <option value="">Select Category</option>
              <option value="Premium">Premium</option>
              <option value="Western">Western</option>
              <option value="Eastern">Eastern</option>
            </select>
          </div>

          <div className="form-group">
            <label>Gender *</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="form-control"
              required
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Unisex">Unisex</option>
            </select>
          </div>

          <div className="form-group">
            <label>Fragrance Notes (comma separated)</label>
            <input
              type="text"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              className="form-control"
              placeholder="Oud, Amber, Musk"
            />
          </div>

          <div className="form-group">
            <label>Rating (0-5)</label>
            <input
              type="number"
              name="rating"
              value={formData.rating}
              onChange={handleChange}
              className="form-control"
              step="0.1"
              min="0"
              max="5"
            />
          </div>

          <div className="form-group">
            <label>Stock Quantity</label>
            <input
              type="number"
              name="stock_quantity"
              value={formData.stock_quantity}
              onChange={handleChange}
              className="form-control"
            />
          </div>

          {/* Image Upload Section */}
          <div className="form-group full-width">
            <label>Product Image</label>
            <div className="image-upload-area">
              <input
                type="file"
                id="product-image"
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: 'none' }}
              />
              <button 
                type="button" 
                className="upload-image-btn"
                onClick={() => document.getElementById('product-image').click()}
              >
                📁 Choose Image from Computer
              </button>
              
              {imagePreview && (
                <div className="image-preview-container">
                  <img src={imagePreview} alt="Preview" className="image-preview" />
                  <button 
                    type="button" 
                    className="remove-image-btn"
                    onClick={() => {
                      setImageFile(null)
                      setImagePreview('')
                      setFormData(prev => ({ ...prev, image_url: '' }))
                    }}
                  >
                    ✕ Remove
                  </button>
                </div>
              )}
              
              {!imagePreview && formData.image_url && (
                <div className="image-preview-container">
                  <img src={getImageUrl(formData.image_url)} alt="Current" className="image-preview" />
                  <p className="current-image-text">Current image</p>
                </div>
              )}
              
              <div className="image-url-alternative">
                <label className="alt-label">OR Enter Image URL:</label>
                <input
                  type="text"
                  name="image_url"
                  value={formData.image_url}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="/assets/at1.jpg or /images/products/123.jpg"
                />
              </div>
            </div>
          </div>

          {/* Checkboxes */}
          <div className="form-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="is_deal"
                checked={formData.is_deal}
                onChange={handleChange}
              />
              Hot Deal
            </label>
          </div>

          <div className="form-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="is_top_seller"
                checked={formData.is_top_seller}
                onChange={handleChange}
              />
              Top Seller
            </label>
          </div>

          <div className="form-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="is_new_arrival"
                checked={formData.is_new_arrival}
                onChange={handleChange}
              />
              New Arrival
            </label>
          </div>

          <div className="form-group full-width">
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="form-control"
              rows="4"
              placeholder="Product description..."
            />
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Saving...' : (isEdit ? 'Update Product' : 'Create Product')}
          </button>
          <Link to="/admin/products" className="btn-secondary">Cancel</Link>
        </div>
      </form>
    </div>
  )
}

export default ProductForm