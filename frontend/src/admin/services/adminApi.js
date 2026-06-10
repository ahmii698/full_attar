import axios from 'axios'

const API = axios.create({
  baseURL: 'http://localhost:8000/api/admin',
  withCredentials: true,  // Add this for CORS
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
})

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Auth
export const adminLogin = (email, password) => API.post('/login', { email, password })

// Dashboard
export const getDashboard = () => API.get('/dashboard')

// ========== PRODUCTS ==========
export const getProducts = () => API.get('/products')
export const getProduct = (id) => API.get(`/products/${id}`)
export const createProduct = (data) => API.post('/products', data)
export const updateProduct = (id, data) => API.put(`/products/${id}`, data)
export const deleteProduct = (id) => API.delete(`/products/${id}`)

// ========== BLOGS ==========
export const getBlogs = () => API.get('/blogs')
export const getBlog = (id) => API.get(`/blogs/${id}`)
export const createBlog = (data) => API.post('/blogs', data)
export const updateBlog = (id, data) => API.put(`/blogs/${id}`, data)
export const deleteBlog = (id) => API.delete(`/blogs/${id}`)

// ========== ORDERS ==========
export const getOrders = () => API.get('/orders')
export const getOrder = (id) => API.get(`/orders/${id}`)
export const updateOrderStatus = (id, status) => API.put(`/orders/${id}/status`, { status })

// ========== USERS ==========
export const getUsers = () => API.get('/users')
export const deleteUser = (id) => API.delete(`/users/${id}`)

// ========== TESTIMONIALS ==========
export const getTestimonials = () => API.get('/testimonials')
export const getTestimonial = (id) => API.get(`/testimonials/${id}`)
export const updateTestimonial = (id, data) => API.put(`/testimonials/${id}`, data)
export const approveTestimonial = (id) => API.put(`/testimonials/${id}/approve`)
export const deleteTestimonial = (id) => API.delete(`/testimonials/${id}`)

// ========== CONTACTS ==========
export const getContacts = () => API.get('/contacts')
export const getContact = (id) => API.get(`/contacts/${id}`)
export const markContactAsRead = (id) => API.put(`/contacts/${id}/read`)
export const deleteContact = (id) => API.delete(`/contacts/${id}`)

// ========== SUBSCRIBERS ==========
export const getSubscribers = () => API.get('/subscribers')
export const getSubscriber = (id) => API.get(`/subscribers/${id}`)
export const toggleSubscriberStatus = (id, status) => API.put(`/subscribers/${id}/status`, { is_active: status })
export const deleteSubscriber = (id) => API.delete(`/subscribers/${id}`)

// ========== OUTLETS ==========
export const getOutlets = () => API.get('/outlets')
export const getOutlet = (id) => API.get(`/outlets/${id}`)
export const createOutlet = (data) => API.post('/outlets', data)
export const updateOutlet = (id, data) => API.put(`/outlets/${id}`, data)
export const deleteOutlet = (id) => API.delete(`/outlets/${id}`)
export const reorderOutlets = (orders) => API.post('/outlets/reorder', { orders })

// ========== FAQS ==========
export const getFaqs = () => API.get('/faqs')
export const getFaq = (id) => API.get(`/faqs/${id}`)
export const createFaq = (data) => API.post('/faqs', data)
export const updateFaq = (id, data) => API.put(`/faqs/${id}`, data)
export const deleteFaq = (id) => API.delete(`/faqs/${id}`)
export const reorderFaqs = (orders) => API.post('/faqs/reorder', { orders })

// ========== HERO SLIDERS ==========
export const getHeroSliders = () => API.get('/hero-sliders')
export const getHeroSlider = (id) => API.get(`/hero-sliders/${id}`)
export const createHeroSlider = (data) => API.post('/hero-sliders', data)
export const updateHeroSlider = (id, data) => API.put(`/hero-sliders/${id}`, data)
export const deleteHeroSlider = (id) => API.delete(`/hero-sliders/${id}`)

// ========== HERO STATS ==========
export const getHeroStats = () => API.get('/hero-stats')
export const createHeroStat = (data) => API.post('/hero-stats', data)
export const updateHeroStat = (id, data) => API.put(`/hero-stats/${id}`, data)
export const deleteHeroStat = (id) => API.delete(`/hero-stats/${id}`)

// ========== BANNERS ==========
export const getBanners = () => API.get('/banners')
export const getBanner = (id) => API.get(`/banners/${id}`)
export const createBanner = (data) => API.post('/banners', data)
export const updateBanner = (id, data) => API.put(`/banners/${id}`, data)
export const deleteBanner = (id) => API.delete(`/banners/${id}`)

// ========== SITE SETTINGS ==========
export const getSiteSettings = () => API.get('/site-settings')
export const updateSiteSetting = (key, value) => API.put(`/site-settings/${key}`, { value })

// ========== SOCIAL LINKS ==========
export const getSocialLinks = () => API.get('/social-links')
export const updateSocialLink = (id, data) => API.put(`/social-links/${id}`, data)