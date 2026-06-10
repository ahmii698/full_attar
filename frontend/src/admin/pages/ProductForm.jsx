import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { getProducts, createProduct, updateProduct } from '../services/adminApi'
import '../styles/ProductForm.css'

function ProductForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [isDuplicateMode, setIsDuplicateMode] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    price_num: '',
    rating: 0,
    category: 'Premium',
    gender: 'Male',
    notes: '',
    stock_quantity: 10,
    is_top_seller: 0,
    is_new_arrival: 0,
    is_deal: 0,
    discount_price: '',
    discount_percent: '',
    description: ''
  })
  const [image, setImage] = useState(null)
  const [preview, setPreview] = useState('')
  const [isEdit, setIsEdit] = useState(false)
  const [originalImageUrl, setOriginalImageUrl] = useState('')

  useEffect(() => {
    if (id) {
      setIsEdit(true)
      fetchProduct()
    }
  }, [id])

  const fetchProduct = async () => {
    try {
      setLoading(true)
      const res = await getProducts()
      const product = res.data.find(p => p.product_id === parseInt(id))
      if (product) {
        setFormData({
          name: product.name || '',
          price: product.price || '',
          price_num: product.price_num || '',
          rating: product.rating || 0,
          category: product.category || 'Premium',
          gender: product.gender || 'Male',
          notes: product.notes || '',
          stock_quantity: product.stock_quantity || 10,
          is_top_seller: product.is_top_seller || 0,
          is_new_arrival: product.is_new_arrival || 0,
          is_deal: product.is_deal || 0,
          discount_price: product.discount_price || '',
          discount_percent: product.discount_percent || '',
          description: product.description || ''
        })
        setPreview(product.image_url)
        setOriginalImageUrl(product.image_url)
      }
    } catch (error) {
      console.error('Error fetching product:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDuplicate = () => {
    setIsDuplicateMode(true)
    setIsEdit(false)
    // Add " (Copy)" to the product name
    setFormData(prev => ({
      ...prev,
      name: prev.name + ' (Copy)'
    }))
    // Keep the original image URL for preview
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (checked ? 1 : 0) : value
    }))
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImage(file)
      setPreview(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    const data = new FormData()
    Object.keys(formData).forEach(key => {
      data.append(key, formData[key])
    })
    
    // Image handling - priority: new uploaded image > original image URL
    if (image) {
      // User uploaded a new image
      data.append('image', image)
    } else if (isDuplicateMode && originalImageUrl) {
      // Duplicate mode: use the same image URL from original product
      data.append('image_url', originalImageUrl)
    }

    try {
      if (isEdit && !isDuplicateMode) {
        await updateProduct(id, data)
      } else {
        await createProduct(data)
      }
      navigate('/admin/products')
    } catch (error) {
      console.error('Error saving product:', error)
      alert('Error saving product: ' + (error.response?.data?.error || error.message))
    } finally {
      setLoading(false)
    }
  }

  const handleCancelDuplicate = () => {
    setIsDuplicateMode(false)
    setIsEdit(true)
    fetchProduct()
  }

  if (loading && isEdit && !isDuplicateMode) return <div className="loading">Loading product...</div>

  return (
    <div className="product-form">
      <div className="form-header">
        <div>
          <h2>
            {isDuplicateMode 
              ? 'Duplicate Product' 
              : (isEdit ? 'Edit Product' : 'Add New Product')}
          </h2>
          {isEdit && !isDuplicateMode && (
            <p className="duplicate-hint">You can duplicate this product to create a similar one</p>
          )}
        </div>
        <div className="header-buttons">
          {isEdit && !isDuplicateMode && (
            <button type="button" onClick={handleDuplicate} className="btn-duplicate">
              Duplicate Product
            </button>
          )}
          {isDuplicateMode && (
            <button type="button" onClick={handleCancelDuplicate} className="btn-cancel-duplicate">
              Cancel Duplicate
            </button>
          )}
          <Link to="/admin/products" className="btn-secondary">Back to Products</Link>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-group">
            <label>Product Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="form-control"
              required
            />
            {isDuplicateMode && (
              <small className="form-text text-info">
                Product name has been modified. You can change it as needed.
              </small>
            )}
          </div>

          <div className="form-group">
            <label>Price (e.g., Rs. 2,100) *</label>
            <input
              type="text"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="form-control"
              placeholder="Rs. 2,100"
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
              placeholder="2100"
              required
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
              min="0"
              max="5"
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
              placeholder="Oud, Amber, Musk, Rose"
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
              min="0"
            />
          </div>

          <div className="form-group">
            <label>Product Image</label>
            <input
              type="file"
              name="image"
              onChange={handleImageChange}
              className="form-control"
              accept="image/*"
            />
            {preview && (
              <div className="image-preview">
                <img src={preview} alt="Preview" />
                {isDuplicateMode && !image && (
                  <small className="form-text text-info">
                    Same image will be used from original product
                  </small>
                )}
              </div>
            )}
          </div>

          {/* Deal Fields */}
          <div className="form-group checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="is_deal"
                checked={formData.is_deal === 1}
                onChange={handleChange}
              />
              Hot Deal
            </label>
          </div>

          {formData.is_deal === 1 && (
            <>
              <div className="form-group">
                <label>Discount Price (Rs.)</label>
                <input
                  type="number"
                  name="discount_price"
                  value={formData.discount_price}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="e.g., 2100"
                />
                <small className="form-text">Price after discount</small>
              </div>

              <div className="form-group">
                <label>Discount Percentage (%)</label>
                <input
                  type="number"
                  name="discount_percent"
                  value={formData.discount_percent}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="e.g., 40"
                />
                <small className="form-text">e.g., 40 for 40% off</small>
              </div>
            </>
          )}

          <div className="form-group checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="is_top_seller"
                checked={formData.is_top_seller === 1}
                onChange={handleChange}
              />
              Top Seller
            </label>
          </div>

          <div className="form-group checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="is_new_arrival"
                checked={formData.is_new_arrival === 1}
                onChange={handleChange}
              />
              New Arrival
            </label>
          </div>
        </div>

        <div className="form-group full-width">
          <label>Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="form-control"
            rows="5"
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Saving...' : 
              (isDuplicateMode ? 'Create Duplicate Product' : 
                (isEdit ? 'Update Product' : 'Create Product'))}
          </button>
          <Link to="/admin/products" className="btn-secondary">Cancel</Link>
        </div>
      </form>
    </div>
  )
}

export default ProductForm