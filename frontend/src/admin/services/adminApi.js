import axios from 'axios'
import { API_URL } from '../../../config'  // ✅ IMPORT FROM CONFIG

// ========== ADMIN API ==========
const ADMIN_API_URL = `${API_URL}/admin`  // ✅ USING API_URL FROM CONFIG

const API = axios.create({
  baseURL: ADMIN_API_URL,
  withCredentials: true,
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

// ========== PUBLIC API ==========
export const publicAPI = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
})

// ========== ADMIN AUTH ==========
export const adminLogin = (email, password) => API.post('/login', { email, password })
export const getDashboard = () => API.get('/dashboard')

// ========== ADMIN CATEGORIES ==========
export const getCategories = () => API.get('/categories')
export const getCategory = (id) => API.get(`/categories/${id}`)
export const createCategory = (data) => API.post('/categories', data)

// ✅ FIX: updateCategory - Support both FormData and JSON
export const updateCategory = (id, data) => {
  if (data instanceof FormData) {
    return API.post(`/categories/${id}?_method=PUT`, data, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  } else {
    return API.put(`/categories/${id}`, data)
  }
}

export const deleteCategory = (id) => API.delete(`/categories/${id}`)
export const getCategoryProducts = (id) => API.get(`/categories/${id}/products`)

// ========== ADMIN PRODUCTS ==========
export const getProducts = () => API.get('/products')
export const getProduct = (id) => API.get(`/products/${id}`)
export const getProductsByCategory = (categoryId) => API.get(`/categories/${categoryId}/products`)

export const createProduct = (data) => {
  return API.post('/products', data, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

export const updateProduct = (id, data) => {
  if (data instanceof FormData) {
    return API.post(`/products/${id}?_method=PUT`, data, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  } else {
    return API.post(`/products/${id}?_method=PUT`, data, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }
}

export const deleteProduct = (id) => API.delete(`/products/${id}`)

// ========== ADMIN BLOGS ==========
export const getBlogs = () => API.get('/blogs')
export const getBlog = (id) => API.get(`/blogs/${id}`)

export const createBlog = (data) => {
  return API.post('/blogs', data, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

export const updateBlog = (id, data) => {
  return API.post(`/blogs/${id}?_method=PUT`, data, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

export const deleteBlog = (id) => API.delete(`/blogs/${id}`)

// ========== ADMIN ORDERS ==========
export const getOrders = () => API.get('/orders')
export const getOrder = (id) => API.get(`/orders/${id}`)
export const updateOrderStatus = (id, status) => API.put(`/orders/${id}/status`, { status })

// ========== ADMIN USERS ==========
export const getUsers = () => API.get('/users')
export const deleteUser = (id) => API.delete(`/users/${id}`)

// ========== ADMIN TESTIMONIALS ==========
export const getTestimonials = () => API.get('/testimonials')
export const getTestimonial = (id) => API.get(`/testimonials/${id}`)
export const updateTestimonial = (id, data) => API.put(`/testimonials/${id}`, data)
export const approveTestimonial = (id) => API.put(`/testimonials/${id}/approve`)
export const deleteTestimonial = (id) => API.delete(`/testimonials/${id}`)

// ========== ADMIN CONTACTS ==========
export const getContacts = () => API.get('/contacts')
export const getContact = (id) => API.get(`/contacts/${id}`)
export const markContactAsRead = (id) => API.put(`/contacts/${id}/read`)
export const deleteContact = (id) => API.delete(`/contacts/${id}`)
export const replyToContact = (id, message) => API.post(`/contacts/${id}/reply`, { message })

// ========== ADMIN SUBSCRIBERS ==========
export const getSubscribers = () => API.get('/subscribers')
export const getSubscriber = (id) => API.get(`/subscribers/${id}`)
export const toggleSubscriberStatus = (id, status) => API.put(`/subscribers/${id}/status`, { is_active: status })
export const deleteSubscriber = (id) => API.delete(`/subscribers/${id}`)

// ========== ADMIN OUTLETS ==========
export const getOutlets = () => API.get('/outlets')
export const getOutlet = (id) => API.get(`/outlets/${id}`)
export const createOutlet = (data) => API.post('/outlets', data)
export const updateOutlet = (id, data) => API.put(`/outlets/${id}`, data)
export const deleteOutlet = (id) => API.delete(`/outlets/${id}`)
export const reorderOutlets = (orders) => API.post('/outlets/reorder', { orders })

// ========== ADMIN FAQS ==========
export const getFaqs = () => API.get('/faqs')
export const getFaq = (id) => API.get(`/faqs/${id}`)
export const createFaq = (data) => API.post('/faqs', data)
export const updateFaq = (id, data) => API.put(`/faqs/${id}`, data)
export const deleteFaq = (id) => API.delete(`/faqs/${id}`)
export const reorderFaqs = (orders) => API.post('/faqs/reorder', { orders })

// ========== ADMIN HERO SLIDERS ==========
export const getHeroSliders = () => API.get('/hero-sliders')
export const getHeroSlider = (id) => API.get(`/hero-sliders/${id}`)

export const createHeroSlider = (data) => {
  return API.post('/hero-sliders', data, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

export const updateHeroSlider = (id, data) => {
  return API.post(`/hero-sliders/${id}?_method=PUT`, data, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

export const deleteHeroSlider = (id) => API.delete(`/hero-sliders/${id}`)

// ========== ADMIN HERO STATS ==========
export const getHeroStats = () => API.get('/hero-stats')
export const createHeroStat = (data) => API.post('/hero-stats', data)
export const updateHeroStat = (id, data) => API.put(`/hero-stats/${id}`, data)
export const deleteHeroStat = (id) => API.delete(`/hero-stats/${id}`)

// ========== ADMIN BANNERS ==========
export const getBanners = () => API.get('/banners')
export const getBanner = (id) => API.get(`/banners/${id}`)

export const createBanner = (data) => {
  return API.post('/banners', data, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

export const updateBanner = (id, data) => {
  return API.post(`/banners/${id}?_method=PUT`, data, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

export const deleteBanner = (id) => API.delete(`/banners/${id}`)

// ========== ADMIN SITE SETTINGS ==========
export const getSiteSettings = () => API.get('/site-settings')
export const updateSiteSetting = (key, value) => API.put(`/site-settings/${key}`, { value })

// ========== ADMIN SOCIAL LINKS ==========
export const getSocialLinks = () => API.get('/social-links')
export const updateSocialLink = (id, data) => API.put(`/social-links/${id}`, data)

// ========== PUBLIC API ENDPOINTS ==========
export const publicAPIEndpoints = {
  getTopSellers: () => publicAPI.get('/top-sellers'),
  getDeals: () => publicAPI.get('/deals'),
  getBanners: () => publicAPI.get('/banners'),
  getFAQs: () => publicAPI.get('/faqs'),
  getHeroStats: () => publicAPI.get('/hero-stats'),
  getTestimonials: () => publicAPI.get('/testimonials'),
  getHeroSliders: () => publicAPI.get('/hero-sliders'),
  getSocialLinks: () => publicAPI.get('/social-links'),
  getCategories: () => publicAPI.get('/categories'),
  getNavbarCategories: () => publicAPI.get('/navbar-categories'),
}

// ========== DIRECT PUBLIC API FUNCTIONS ==========
export const getPublicCategories = () => publicAPI.get('/categories')
export const getPublicNavbarCategories = () => publicAPI.get('/navbar-categories')
export const getPublicProducts = () => publicAPI.get('/products')
export const getPublicProduct = (id) => publicAPI.get(`/products/${id}`)
export const getPublicTopSellers = () => publicAPI.get('/top-sellers')
export const getPublicDeals = () => publicAPI.get('/deals')