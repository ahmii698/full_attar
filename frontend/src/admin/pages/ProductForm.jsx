import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { FaUpload, FaTimes, FaTag, FaBox, FaStar, FaCheck, FaImage, FaPlus, FaMinus, FaArrowLeft } from 'react-icons/fa'
import { getProduct, createProduct, updateProduct } from '../services/adminApi'
// React Quill imports
import ReactQuill from 'react-quill-new'
import 'react-quill-new/dist/quill.snow.css'
import { API_URL, STORAGE_URL } from '../../../config'  // ✅ IMPORT FROM CONFIG
import '../styles/ProductForm.css'

// ✅ Clean text function - removes unwanted characters and formatting
const cleanDescription = (text) => {
  if (!text) return '';
  
  let cleaned = text
    .replace(/[\u2018\u2019]/g, "'")  // Smart quotes to straight
    .replace(/[\u201C\u201D]/g, '"')  // Smart double quotes to straight
    .replace(/[\u2013\u2014]/g, '-')  // Em/En dashes to hyphen
    .replace(/\u2026/g, '...')        // Ellipsis to three dots
    .replace(/\u00A0/g, ' ')          // Non-breaking space to space
    .replace(/\r\n/g, '\n')           // Windows line breaks
    .replace(/\r/g, '\n')             // Mac line breaks
    .trim();
  
  return cleaned;
};

// ✅ Quill modules configuration - SIMPLIFIED FOR CLEAN TEXT
const quillModules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ['bold', 'italic', 'underline'],
    [{ list: 'ordered'}, { list: 'bullet' }],
    ['clean']
  ],
}

const quillFormats = [
  'header',
  'bold', 'italic', 'underline',
  'list', 'bullet'
]

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
    is_new_arrival: false,
    description: '',
    top_highlights: [],
    ml_prices: {
      '3': '',
      '6': '',
      '12': ''
    }
  })
  const [isEdit, setIsEdit] = useState(false)

  // ✅ USING CONFIG - NO HARDCODED URLS
  const APP_URL = STORAGE_URL?.replace('/storage', '') || 'http://localhost:8000'
  const FRONTEND_URL = window.location.origin || 'http://localhost:5173'

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
      
      let mlPrices = { '3': '', '6': '', '12': '' }
      if (product.ml_prices) {
        const parsed = typeof product.ml_prices === 'string' 
          ? JSON.parse(product.ml_prices) 
          : product.ml_prices
        mlPrices = { 
          '3': parsed['3'] || '',
          '6': parsed['6'] || '',
          '12': parsed['12'] || ''
        }
      }
      
      let topHighlights = []
      if (product.top_highlights) {
        if (typeof product.top_highlights === 'string') {
          try {
            topHighlights = JSON.parse(product.top_highlights)
          } catch (e) {
            topHighlights = []
          }
        } else if (Array.isArray(product.top_highlights)) {
          topHighlights = product.top_highlights
        }
      }
      
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
        is_new_arrival: product.is_new_arrival === 1,
        description: product.description || '',
        top_highlights: topHighlights,
        ml_prices: mlPrices
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

  // ✅ Handle description change from Quill - WITH CLEANING
  const handleDescriptionChange = (value) => {
    const cleaned = cleanDescription(value);
    setFormData(prev => ({
      ...prev,
      description: cleaned
    }))
  }

  const handleMlPriceChange = (ml, value) => {
    setFormData(prev => ({
      ...prev,
      ml_prices: {
        ...prev.ml_prices,
        [ml]: value
      }
    }))
  }

  const handleHighlightChange = (index, field, value) => {
    const newHighlights = [...formData.top_highlights]
    newHighlights[index] = { ...newHighlights[index], [field]: value }
    setFormData(prev => ({ ...prev, top_highlights: newHighlights }))
  }

  const addHighlight = () => {
    setFormData(prev => ({
      ...prev,
      top_highlights: [...prev.top_highlights, { label: '', value: '' }]
    }))
  }

  const removeHighlight = (index) => {
    setFormData(prev => ({
      ...prev,
      top_highlights: prev.top_highlights.filter((_, i) => i !== index)
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
        if (key === 'ml_prices') {
          const mlPricesJson = JSON.stringify(formData.ml_prices)
          submitData.append('ml_prices', mlPricesJson)
        } else if (key === 'top_highlights') {
          const highlightsJson = JSON.stringify(formData.top_highlights)
          submitData.append('top_highlights', highlightsJson)
        } else if (key === 'description') {
          const cleanedDesc = cleanDescription(formData.description || '');
          submitData.append('description', cleanedDesc)
        } else if (formData[key] !== undefined && formData[key] !== '') {
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
        <Link to="/admin/products" className="btn-secondary">
          <FaArrowLeft /> Back to Products
        </Link>
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

          {/* ==================== ML PRICES SECTION - SIRF 3, 6, 12 ==================== */}
          <div className="form-group full-width ml-prices-section">
            <label className="ml-prices-label">
              <FaTag /> ML Prices (3ml, 6ml, 12ml)
            </label>
            <p className="helper-text">
              Set prices for each ML size. Leave empty if not available.
              <br />
              <small>Default price will be used if no price is set.</small>
            </p>
            <div className="ml-prices-grid">
              <div className="ml-price-item">
                <label>3ml (Default)</label>
                <input
                  type="number"
                  value={formData.ml_prices['3'] || ''}
                  onChange={(e) => handleMlPriceChange('3', e.target.value)}
                  className="form-control"
                  placeholder="Base price"
                />
              </div>
              <div className="ml-price-item">
                <label>6ml</label>
                <input
                  type="number"
                  value={formData.ml_prices['6'] || ''}
                  onChange={(e) => handleMlPriceChange('6', e.target.value)}
                  className="form-control"
                  placeholder="Price for 6ml"
                />
              </div>
              <div className="ml-price-item">
                <label>12ml</label>
                <input
                  type="number"
                  value={formData.ml_prices['12'] || ''}
                  onChange={(e) => handleMlPriceChange('12', e.target.value)}
                  className="form-control"
                  placeholder="Price for 12ml"
                />
              </div>
            </div>
          </div>

          {/* ==================== TOP HIGHLIGHTS SECTION ==================== */}
          <div className="form-group full-width top-highlights-section">
            <label className="highlights-label">
              <FaStar /> Top Highlights
            </label>
            <p className="helper-text">
              Add key features of this product. These will appear on the product detail page.
              <br />
              <small>Leave empty to use default highlights for all products.</small>
            </p>
            
            <div className="highlights-input-grid">
              {formData.top_highlights && formData.top_highlights.length > 0 ? (
                formData.top_highlights.map((highlight, index) => (
                  <div key={index} className="highlight-input-item">
                    <input
                      type="text"
                      value={highlight.label || ''}
                      onChange={(e) => handleHighlightChange(index, 'label', e.target.value)}
                      placeholder="Label (e.g., Fragrance Family)"
                      className="form-control highlight-label-input"
                    />
                    <input
                      type="text"
                      value={highlight.value || ''}
                      onChange={(e) => handleHighlightChange(index, 'value', e.target.value)}
                      placeholder="Value (e.g., Oud, Amber, Musk)"
                      className="form-control highlight-value-input"
                    />
                    <button
                      type="button"
                      className="remove-highlight-btn"
                      onClick={() => removeHighlight(index)}
                    >
                      <FaTimes />
                    </button>
                  </div>
                ))
              ) : (
                <div className="no-highlights-message">
                  <p>No custom highlights added. Default highlights will be used.</p>
                </div>
              )}
            </div>
            
            <button
              type="button"
              className="add-highlight-btn"
              onClick={addHighlight}
            >
              <FaPlus /> Add Highlight
            </button>
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
                <FaUpload /> Choose Image from Computer
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
                    <FaTimes /> Remove
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
              <FaTag /> Hot Deal
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
              <FaStar /> Top Seller
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
              <FaBox /> New Arrival
            </label>
          </div>

          {/* ✅ RICH TEXT EDITOR FOR DESCRIPTION - NO WHITE BACKGROUND */}
          <div className="form-group full-width description-editor-section">
            <label>Description <span className="editor-hint">(Format your text with the toolbar below)</span></label>
            <div className="quill-wrapper">
              <ReactQuill
                theme="snow"
                value={formData.description || ''}
                onChange={handleDescriptionChange}
                modules={quillModules}
                formats={quillFormats}
                placeholder="Write a detailed description of the product..."
                className="quill-editor"
              />
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Saving...' : (isEdit ? 'Update Product' : 'Create Product')}
          </button>
          <Link to="/admin/products" className="btn-secondary">
            <FaTimes /> Cancel
          </Link>
        </div>
      </form>
    </div>
  )
}

export default ProductForm