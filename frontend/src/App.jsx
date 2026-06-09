import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { CartProvider } from './contexts/CartContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'
import ShopPage from './pages/ShopPage'
import BestSellersPage from './pages/BestSellersPage'
import DealsPage from './pages/DealsPage'
import TestersPage from './pages/TestersPage'
import OutletsPage from './pages/OutletsPage'
import BlogsPage from './pages/BlogsPage'
import BlogDetailPage from './pages/BlogDetailPage'
import CartPage from './pages/CartPage'
import WishlistPage from './pages/WishlistPage'
import CheckoutPage from './pages/CheckoutPage'
import PaymentPage from './pages/PaymentPage'
import UploadProofPage from './pages/UploadProofPage'
import OrderConfirmationPage from './pages/OrderConfirmationPage'
import TrackOrderPage from './pages/TrackOrderPage'
import LoginPage from './pages/LoginPage'
import ProfilePage from './pages/ProfilePage'
import OrdersPage from './pages/OrdersPage'
import AboutPage from './pages/AboutPage'
import ContactPage from './pages/ContactPage'
import FAQPage from './pages/FAQPage'

// ========== ADMIN PANEL IMPORTS ==========
import { AdminAuthProvider } from './admin/contexts/AdminAuthContext'
import AdminLayout from './admin/components/AdminLayout'
import AdminLogin from './admin/pages/AdminLogin'
import Dashboard from './admin/pages/Dashboard'
import Products from './admin/pages/Products'
import ProductForm from './admin/pages/ProductForm'
import Blogs from './admin/pages/Blogs'
import BlogForm from './admin/pages/BlogForm'
import Orders from './admin/pages/Orders'
import Users from './admin/pages/Users'
import Testimonials from './admin/pages/Testimonials'
import Contacts from './admin/pages/Contacts'
import Subscribers from './admin/pages/Subscribers'

// ========== NEW ADMIN IMPORTS ==========
import HeroSettings from './admin/pages/HeroSettings'
import Banners from './admin/pages/Banners'
import SiteSettings from './admin/pages/SiteSettings'
import FAQs from './admin/pages/FAQs'
import Outlets from './admin/pages/Outlets'

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <div className="app">
          <Navbar />
          <main className="main">
            <Routes>
              {/* Main Pages */}
              <Route path="/" element={<HomePage />} />
              <Route path="/shop" element={<ShopPage />} />
              <Route path="/best-sellers" element={<BestSellersPage />} />
              <Route path="/deals" element={<DealsPage />} />
              <Route path="/testers" element={<TestersPage />} />
              <Route path="/outlets" element={<OutletsPage />} />
              <Route path="/blogs" element={<BlogsPage />} />
              <Route path="/blog/:id" element={<BlogDetailPage />} />
              
              {/* Cart & Checkout */}
              <Route path="/cart" element={<CartPage />} />
              <Route path="/wishlist" element={<WishlistPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/payment" element={<PaymentPage />} />
              <Route path="/upload-proof" element={<UploadProofPage />} />
              <Route path="/order-confirmation" element={<OrderConfirmationPage />} />
              <Route path="/track-order" element={<TrackOrderPage />} />
              
              {/* Auth & User */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/orders" element={<OrdersPage />} />
              
              {/* Info Pages */}
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/faq" element={<FAQPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </CartProvider>
    </AuthProvider>
  )
}

// ========== SEPARATE ADMIN APP (outside main app) ==========
export function AdminApp() {
  return (
    <AdminAuthProvider>
      <Routes>
        {/* Login page - no layout */}
        <Route path="/login" element={<AdminLogin />} />
        
        {/* Admin pages with layout */}
        <Route path="/" element={<AdminLayout />}>
          {/* INDEX ROUTE - NOW GOES TO PRODUCTS, NOT DASHBOARD */}
          <Route index element={<Navigate to="products" />} />
          
          {/* Products */}
          <Route path="products" element={<Products />} />
          <Route path="products/create" element={<ProductForm />} />
          <Route path="products/edit/:id" element={<ProductForm />} />
          
          {/* Blogs */}
          <Route path="blogs" element={<Blogs />} />
          <Route path="blogs/create" element={<BlogForm />} />
          <Route path="blogs/edit/:id" element={<BlogForm />} />
          
          {/* Orders */}
          <Route path="orders" element={<Orders />} />
          
          {/* Users */}
          <Route path="users" element={<Users />} />
          
          {/* Testimonials */}
          <Route path="testimonials" element={<Testimonials />} />
          
          {/* Contacts */}
          <Route path="contacts" element={<Contacts />} />
          
          {/* Subscribers */}
          <Route path="subscribers" element={<Subscribers />} />
          
          {/* Outlets */}
          <Route path="outlets" element={<Outlets />} />
          
          {/* FAQs */}
          <Route path="faqs" element={<FAQs />} />
          
          {/* Hero Settings */}
          <Route path="hero-settings" element={<HeroSettings />} />
          
          {/* Banners */}
          <Route path="banners" element={<Banners />} />
          
          {/* Site Settings */}
          <Route path="site-settings" element={<SiteSettings />} />
        </Route>
      </Routes>
    </AdminAuthProvider>
  )
}

export default App