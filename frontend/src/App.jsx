import { Routes, Route } from 'react-router-dom'
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

export default App