import { useState, useEffect } from 'react'
import { FaPlus, FaUpload, FaTimes, FaArrowLeft, FaEdit, FaTrash } from 'react-icons/fa'
import {
  getShoes,
  createShoe,
  updateShoe,
  deleteShoe,
  deleteShoeImage,
  getShoeCategories
} from '../services/adminApi'
import { STORAGE_URL } from '../../../config'
import '../styles/AdminShoes.css'

// Sirf yehi sizes allowed hain (DB mein bhi yehi rule hai)
const SIZES = [3, 4, 5, 6, 7, 8, 9, 10]
const MAX_IMAGES = 5
const ITEMS_PER_PAGE = 8

const EMPTY_FORM = {
  name: '',
  description: '',
  price: '',
  gender: '',
  color: '',
  is_new: false,
  is_active: true
}

const emptyStocks = () => Object.fromEntries(SIZES.map((s) => [s, 0]))

// Backend path (/storage/shoes/1/a.jpg) ko poora URL banata hai
const getImageUrl = (path) => {
  if (!path) return ''
  if (path.startsWith('http')) return path
  return `${STORAGE_URL.replace(/\/+$/, '')}${path.replace(/^\/?storage/, '')}`
}

// Laravel ka validation error nikalta hai
const getErrorMessage = (error) => {
  const errors = error?.response?.data?.errors
  if (errors) return Object.values(errors).flat()[0]
  return error?.response?.data?.message || 'Kuch masla aa gaya. Dobara try karein.'
}

function AdminShoes() {
  const [shoes, setShoes] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  const [view, setView] = useState('list') // 'list' ya 'form'
  const [editing, setEditing] = useState(null) // edit hone wali shoe, add par null

  const [form, setForm] = useState(EMPTY_FORM)
  const [categoryIds, setCategoryIds] = useState([])
  const [stocks, setStocks] = useState(emptyStocks())
  const [existingImages, setExistingImages] = useState([])
  const [newImages, setNewImages] = useState([]) // { file, preview }
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

  useEffect(() => {
    loadShoes()
    loadCategories()
  }, [])

  useEffect(() => {
    setPage(1)
  }, [search])

  const loadShoes = async () => {
    try {
      const res = await getShoes()
      setShoes(res.data)
      return res.data
    } catch (err) {
      console.error('Error fetching shoes:', err)
      return []
    } finally {
      setLoading(false)
    }
  }

  const loadCategories = async () => {
    try {
      const res = await getShoeCategories()
      setCategories(res.data)
    } catch (err) {
      console.error('Error fetching categories:', err)
    }
  }

  /* ---------- open / close form ---------- */

  const resetNewImages = () => {
    newImages.forEach((img) => URL.revokeObjectURL(img.preview))
    setNewImages([])
  }

  const openAdd = () => {
    setEditing(null)
    setForm(EMPTY_FORM)
    setCategoryIds([])
    setStocks(emptyStocks())
    setExistingImages([])
    resetNewImages()
    setError('')
    setView('form')
  }

  const openEdit = (shoe) => {
    const stockMap = emptyStocks()
    shoe.sizes.forEach((s) => {
      stockMap[s.size] = s.stock
    })

    setEditing(shoe)
    setForm({
      name: shoe.name || '',
      description: shoe.description || '',
      price: shoe.price ?? '',
      gender: shoe.gender || '',
      color: shoe.color || '',
      is_new: !!shoe.is_new,
      is_active: !!shoe.is_active
    })
    setCategoryIds(shoe.category_ids || [])
    setStocks(stockMap)
    setExistingImages(shoe.images || [])
    resetNewImages()
    setError('')
    setView('form')
  }

  const closeForm = () => {
    resetNewImages()
    setView('list')
    setEditing(null)
    setError('')
  }

  /* ---------- form handlers ---------- */

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  const toggleCategory = (id) => {
    setCategoryIds((prev) => (prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]))
  }

  const handleStock = (size, value) => {
    setStocks((prev) => ({ ...prev, [size]: value === '' ? '' : Math.max(0, Number(value)) }))
  }

  const handleFiles = (e) => {
    const files = Array.from(e.target.files || [])
    const remaining = MAX_IMAGES - existingImages.length - newImages.length
    const picked = files.slice(0, Math.max(0, remaining)).map((file) => ({
      file,
      preview: URL.createObjectURL(file)
    }))
    if (files.length > remaining) {
      setError(`Ek shoe ki sirf ${MAX_IMAGES} images ho sakti hain.`)
    }
    setNewImages((prev) => [...prev, ...picked])
    e.target.value = ''
  }

  const removeNewImage = (index) => {
    URL.revokeObjectURL(newImages[index].preview)
    setNewImages((prev) => prev.filter((_, i) => i !== index))
  }

  const removeExistingImage = async (img) => {
    if (!window.confirm('Is image ko delete karna hai?')) return
    try {
      await deleteShoeImage(editing.id, img.id)
      const fresh = await loadShoes()
      const updated = fresh.find((s) => s.id === editing.id)
      if (updated) {
        setEditing(updated)
        setExistingImages(updated.images)
      }
    } catch (err) {
      setError(getErrorMessage(err))
    }
  }

  /* ---------- save ---------- */

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!form.gender) return setError('Gender select karein.')
    if (categoryIds.length === 0) return setError('Kam az kam ek category select karein.')
    if (!editing && newImages.length === 0) return setError('Kam az kam ek image upload karein.')

    const fd = new FormData()
    fd.append('name', form.name)
    fd.append('description', form.description)
    fd.append('price', form.price)
    fd.append('gender', form.gender)
    fd.append('color', form.color)
    fd.append('is_new', form.is_new ? 1 : 0)
    if (editing) fd.append('is_active', form.is_active ? 1 : 0)

    categoryIds.forEach((id) => fd.append('category_ids[]', id))

    SIZES.forEach((size, i) => {
      fd.append(`sizes[${i}][size]`, size)
      fd.append(`sizes[${i}][stock]`, Number(stocks[size]) || 0)
    })

    newImages.forEach((img) => fd.append('images[]', img.file))

    try {
      setSaving(true)
      if (editing) {
        await updateShoe(editing.id, fd)
      } else {
        await createShoe(fd)
      }
      await loadShoes()
      closeForm()
    } catch (err) {
      console.error('Error saving shoe:', err)
      setError(getErrorMessage(err))
    } finally {
      setSaving(false)
    }
  }

  /* ---------- delete ---------- */

  const handleDelete = async (shoe) => {
    if (!window.confirm(`"${shoe.name}" ko delete karna hai? Iski saari images bhi delete ho jayengi.`)) return
    try {
      await deleteShoe(shoe.id)
      loadShoes()
    } catch (err) {
      alert(getErrorMessage(err))
    }
  }

  /* ---------- list (search + pagination) ---------- */

  const filtered = shoes.filter((s) => !search || s.name.toLowerCase().includes(search.toLowerCase()))
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE)
  const start = (page - 1) * ITEMS_PER_PAGE
  const current = filtered.slice(start, start + ITEMS_PER_PAGE)

  if (loading) return <div className="admin-loading">Loading shoes...</div>

  /* ================= FORM VIEW ================= */
  if (view === 'form') {
    const totalImages = existingImages.length + newImages.length

    return (
      <div className="ash-page">
        <div className="ash-header">
          <h2>{editing ? 'Edit Shoe' : 'Add New Shoe'}</h2>
          <button type="button" className="ash-btn ash-btn--ghost" onClick={closeForm}>
            <FaArrowLeft /> Back to Shoes
          </button>
        </div>

        <form className="ash-form" onSubmit={handleSubmit}>
          {error && <div className="ash-error">{error}</div>}

          <div className="ash-grid">
            <div className="ash-field ash-field--full">
              <label>Shoe Name *</label>
              <input name="name" value={form.name} onChange={handleChange} required placeholder="e.g. Air Max Dn" />
            </div>

            <div className="ash-field">
              <label>Price (Rs.) *</label>
              <input type="number" name="price" min="0" value={form.price} onChange={handleChange} required />
            </div>

            <div className="ash-field">
              <label>Gender *</label>
              <select name="gender" value={form.gender} onChange={handleChange} required>
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Unisex">Unisex</option>
              </select>
            </div>

            <div className="ash-field">
              <label>Color</label>
              <input name="color" value={form.color} onChange={handleChange} placeholder="e.g. Red" />
            </div>

            <div className="ash-field ash-field--checks">
              <label className="ash-check">
                <input type="checkbox" name="is_new" checked={form.is_new} onChange={handleChange} />
                NEW badge dikhao
              </label>
              {editing && (
                <label className="ash-check">
                  <input type="checkbox" name="is_active" checked={form.is_active} onChange={handleChange} />
                  Website par dikhao (Active)
                </label>
              )}
            </div>

            {/* Categories */}
            <div className="ash-field ash-field--full">
              <label>Categories * (ek ya zyada)</label>
              <div className="ash-chips">
                {categories.map((cat) => (
                  <button
                    type="button"
                    key={cat.category_id}
                    className={`ash-chip ${categoryIds.includes(cat.category_id) ? 'active' : ''}`}
                    onClick={() => toggleCategory(cat.category_id)}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Sizes */}
            <div className="ash-field ash-field--full">
              <label>Sizes aur Stock</label>
              <p className="ash-hint">Stock 0 ho to website par wo size cut (disabled) nazar aayegi.</p>
              <div className="ash-sizes">
                {SIZES.map((size) => (
                  <div className="ash-size" key={size}>
                    <span>Size {size}</span>
                    <input
                      type="number"
                      min="0"
                      value={stocks[size]}
                      onChange={(e) => handleStock(size, e.target.value)}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="ash-field ash-field--full">
              <label>Description</label>
              <textarea
                name="description"
                rows="4"
                value={form.description}
                onChange={handleChange}
                placeholder="Shoe ke baare mein likhein..."
              />
            </div>

            {/* Images */}
            <div className="ash-field ash-field--full">
              <label>
                Images * ({totalImages}/{MAX_IMAGES})
              </label>
              <p className="ash-hint">Pehli upload hone wali image main image hogi. Zyada se zyada {MAX_IMAGES} images.</p>

              <div className="ash-images">
                {existingImages.map((img) => (
                  <div className="ash-img" key={img.id}>
                    <img src={getImageUrl(img.url)} alt="" />
                    {img.is_main && <span className="ash-img__main">MAIN</span>}
                    <button type="button" className="ash-img__remove" onClick={() => removeExistingImage(img)}>
                      <FaTimes />
                    </button>
                  </div>
                ))}

                {newImages.map((img, i) => (
                  <div className="ash-img ash-img--new" key={img.preview}>
                    <img src={img.preview} alt="" />
                    <span className="ash-img__main">NEW</span>
                    <button type="button" className="ash-img__remove" onClick={() => removeNewImage(i)}>
                      <FaTimes />
                    </button>
                  </div>
                ))}

                {totalImages < MAX_IMAGES && (
                  <label className="ash-upload">
                    <FaUpload />
                    <span>Add Image</span>
                    <input type="file" accept="image/*" multiple onChange={handleFiles} hidden />
                  </label>
                )}
              </div>
            </div>
          </div>

          <div className="ash-actions">
            <button type="submit" className="ash-btn ash-btn--gold" disabled={saving}>
              {saving ? 'Saving...' : editing ? 'Update Shoe' : 'Create Shoe'}
            </button>
            <button type="button" className="ash-btn ash-btn--ghost" onClick={closeForm}>
              <FaTimes /> Cancel
            </button>
          </div>
        </form>
      </div>
    )
  }

  /* ================= LIST VIEW ================= */
  return (
    <div className="ash-page">
      <div className="ash-header">
        <h2>Shoes</h2>
        <button type="button" className="ash-btn ash-btn--gold" onClick={openAdd}>
          <FaPlus /> Add New Shoe
        </button>
      </div>

      <div className="ash-toolbar">
        <input
          className="ash-search"
          type="text"
          placeholder="Search shoes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <span className="ash-count">
          {filtered.length} shoe{filtered.length !== 1 ? 's' : ''}
        </span>
      </div>

      <div className="ash-table-wrap">
        <table className="ash-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Image</th>
              <th>Name</th>
              <th>Price</th>
              <th>Categories</th>
              <th>Gender</th>
              <th>Color</th>
              <th>Sizes in stock</th>
              <th>New</th>
              <th>Active</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {current.length === 0 ? (
              <tr>
                <td colSpan="11" className="ash-empty">
                  Koi shoe nahi mila.
                </td>
              </tr>
            ) : (
              current.map((shoe) => {
                const inStock = shoe.sizes.filter((s) => s.stock > 0).map((s) => s.size)
                return (
                  <tr key={shoe.id}>
                    <td>{shoe.id}</td>
                    <td>
                      <img
                        className="ash-thumb"
                        src={getImageUrl(shoe.image)}
                        alt={shoe.name}
                        onError={(e) => {
                          e.target.src = 'https://placehold.co/54x54/1a1a1a/d4af37?text=No+Image'
                        }}
                      />
                    </td>
                    <td>{shoe.name}</td>
                    <td>Rs. {Number(shoe.price).toLocaleString()}</td>
                    <td>{shoe.categories || '-'}</td>
                    <td>{shoe.gender}</td>
                    <td>{shoe.color || '-'}</td>
                    <td>{inStock.length ? inStock.join(', ') : 'Out of stock'}</td>
                    <td>
                      <span className={`ash-pill ${shoe.is_new ? 'ash-pill--on' : ''}`}>
                        {shoe.is_new ? 'Yes' : 'No'}
                      </span>
                    </td>
                    <td>
                      <span className={`ash-pill ${shoe.is_active ? 'ash-pill--on' : ''}`}>
                        {shoe.is_active ? 'Active' : 'Hidden'}
                      </span>
                    </td>
                    <td>
                      <div className="ash-row-actions">
                        <button type="button" className="ash-btn ash-btn--edit" onClick={() => openEdit(shoe)}>
                          <FaEdit /> Edit
                        </button>
                        <button type="button" className="ash-btn ash-btn--danger" onClick={() => handleDelete(shoe)}>
                          <FaTrash /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="ash-pagination">
          <button disabled={page === 1} onClick={() => setPage(page - 1)}>
            ← Previous
          </button>
          {[...Array(totalPages)].map((_, i) => (
            <button key={i} className={page === i + 1 ? 'active' : ''} onClick={() => setPage(i + 1)}>
              {i + 1}
            </button>
          ))}
          <button disabled={page === totalPages} onClick={() => setPage(page + 1)}>
            Next →
          </button>
        </div>
      )}
    </div>
  )
}

export default AdminShoes