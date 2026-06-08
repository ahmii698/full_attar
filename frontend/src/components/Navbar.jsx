import { useState, useRef, useEffect } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { 
  FiSearch, FiUser, FiShoppingCart, FiMenu, FiX, FiHeart, FiLogOut,
  FiGrid, FiWind, FiTag, FiStar, FiUsers
} from 'react-icons/fi'
import { useCart } from '../contexts/CartContext'
import { useAuth } from '../contexts/AuthContext'
import raLogo from '../assets/ra.png'

function Navbar() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const { getCartCount, wishlistItems } = useCart()
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const timeoutRef = useRef(null)
  
  const cartCount = getCartCount()
  const wishlistCount = wishlistItems.length
  
  // Categories
  const categories = {
    premium: [
      { name: 'Black & Silver Platinum', filter: 'Black & Silver Platinum' },
      { name: 'Royal Oud', filter: 'Royal Oud' },
      { name: 'Musk Al Mahal', filter: 'Musk Al Mahal' },
      { name: 'Sultan E Ameer', filter: 'Sultan E Ameer' },
      { name: 'Oud Al Aswad', filter: 'Oud Al Aswad' }
    ],
    western: [
      { name: 'Winter Collection 2024', filter: 'Winter Collection 2024' },
      { name: 'Amber Rose', filter: 'Amber Rose' },
      { name: 'Silver & White', filter: 'Silver & White' },
      { name: 'Floral Dream', filter: 'Floral Dream' }
    ],
    eastern: [
      { name: 'Ameer Al Oud', filter: 'Ameer Al Oud' },
      { name: 'Oudh Al Ward', filter: 'Oudh Al Ward' },
      { name: 'Eastern Oud', filter: 'Eastern Oud' }
    ],
    gender: [
      { name: 'Male', filter: 'Male' },
      { name: 'Female', filter: 'Female' },
      { name: 'Unisex', filter: 'Unisex' }
    ]
  }
  
  // Function to handle category click and navigate with filter
  const handleCategoryClick = (filterValue) => {
    closeMegaMenu()
    navigate(`/shop?category=${encodeURIComponent(filterValue)}`)
  }
  
  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setIsMegaMenuOpen(true)
  }
  
  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setIsMegaMenuOpen(false), 100)
  }
  
  const handleMenuMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
  }
  
  const handleMenuMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setIsMegaMenuOpen(false), 100)
  }
  
  const closeMegaMenu = () => {
    setIsMegaMenuOpen(false)
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
  }
  
  const handleLogout = () => {
    logout()
    setIsUserMenuOpen(false)
    navigate('/')
  }
  
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])
  
  return (
    <>
      <nav className="navbar">
        <div className="logo">
          <Link to="/" className="logo-link">
            <img src={raLogo} alt="Royal Attar" className="logo-img" />
          </Link>
        </div>
        
        <div className="nav-links">
          <NavLink to="/" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>HOME</NavLink>
          
          <div 
            className="mega-menu-container"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <Link to="/shop" className="nav-link mega-trigger">SHOP ▾</Link>
            
            {isMegaMenuOpen && (
              <div 
                className="mega-menu full-width"
                onMouseEnter={handleMenuMouseEnter}
                onMouseLeave={handleMenuMouseLeave}
              >
                <button className="mega-close-btn" onClick={closeMegaMenu}>✕</button>
                <div className="mega-menu-inner">
                  <div className="mega-grid">
                    <div className="mega-col">
                      <h4><FiStar /> PREMIUM</h4>
                      <ul>
                        {categories.premium.map(item => (
                          <li key={item.name}>
                            <a onClick={() => handleCategoryClick(item.filter)}>{item.name}</a>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="mega-col">
                      <h4><FiWind /> WESTERN</h4>
                      <ul>
                        {categories.western.map(item => (
                          <li key={item.name}>
                            <a onClick={() => handleCategoryClick(item.filter)}>{item.name}</a>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="mega-col">
                      <h4><FiGrid /> EASTERN</h4>
                      <ul>
                        {categories.eastern.map(item => (
                          <li key={item.name}>
                            <a onClick={() => handleCategoryClick(item.filter)}>{item.name}</a>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="mega-col">
                      <h4><FiUsers /> GENDER</h4>
                      <ul>
                        {categories.gender.map(item => (
                          <li key={item.name}>
                            <a onClick={() => handleCategoryClick(item.filter)}>{item.name}</a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <NavLink to="/best-sellers" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>BEST SELLERS</NavLink>
          <NavLink to="/deals" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>DEALS</NavLink>
          <NavLink to="/testers" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>TESTERS</NavLink>
          <NavLink to="/outlets" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>OUR OUTLETS</NavLink>
          <NavLink to="/blogs" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>BLOGS</NavLink>
          <NavLink to="/track-order" className="nav-link">TRACK ORDER</NavLink>
        </div>
        
        <div className="nav-icons">
          <button className="icon-btn"><FiSearch /></button>
          
          <div className="user-menu-container">
            {user ? (
              <>
                <button className="icon-btn user-btn" onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}>
                  <FiUser />
                </button>
                {isUserMenuOpen && (
                  <div className="user-dropdown">
                    <div className="user-info">
                      <span className="user-name">{user.name}</span>
                      <span className="user-email">{user.email}</span>
                    </div>
                    <Link to="/profile" onClick={() => setIsUserMenuOpen(false)}>My Profile</Link>
                    <Link to="/orders" onClick={() => setIsUserMenuOpen(false)}>My Orders</Link>
                    <button onClick={handleLogout} className="logout-btn">
                      <FiLogOut /> Logout
                    </button>
                  </div>
                )}
              </>
            ) : (
              <Link to="/login" className="icon-btn">
                <FiUser />
              </Link>
            )}
          </div>
          
          <div onClick={() => !user && navigate('/login')} style={{ cursor: 'pointer' }}>
            <Link to={user ? "/wishlist" : "#"} className="icon-btn wishlist-link" onClick={(e) => !user && e.preventDefault()}>
              <FiHeart />
              {wishlistCount > 0 && <span className="cart-count">{wishlistCount}</span>}
            </Link>
          </div>
          
          <div onClick={() => !user && navigate('/login')} style={{ cursor: 'pointer' }}>
            <Link to={user ? "/cart" : "#"} className="icon-btn cart-icon" onClick={(e) => !user && e.preventDefault()}>
              <FiShoppingCart />
              {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
            </Link>
          </div>
        </div>
        
        <button className="mobile-menu-btn" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <FiX /> : <FiMenu />}
        </button>
      </nav>
      
      {isMobileMenuOpen && (
        <div className="mobile-menu">
          <Link to="/" onClick={() => setIsMobileMenuOpen(false)}>HOME</Link>
          <Link to="/shop" onClick={() => setIsMobileMenuOpen(false)}>SHOP</Link>
          <Link to="/best-sellers" onClick={() => setIsMobileMenuOpen(false)}>BEST SELLERS</Link>
          <Link to="/deals" onClick={() => setIsMobileMenuOpen(false)}>DEALS</Link>
          <Link to="/testers" onClick={() => setIsMobileMenuOpen(false)}>TESTERS</Link>
          <Link to="/outlets" onClick={() => setIsMobileMenuOpen(false)}>OUR OUTLETS</Link>
          <Link to="/blogs" onClick={() => setIsMobileMenuOpen(false)}>BLOGS</Link>
          <Link to="/track-order" onClick={() => setIsMobileMenuOpen(false)}>TRACK ORDER</Link>
          
          {user ? (
            <>
              <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)}>MY PROFILE</Link>
              <Link to="/orders" onClick={() => setIsMobileMenuOpen(false)}>MY ORDERS</Link>
              <Link to="/wishlist" onClick={() => setIsMobileMenuOpen(false)}>WISHLIST</Link>
              <Link to="/cart" onClick={() => setIsMobileMenuOpen(false)}>CART</Link>
              <button onClick={handleLogout} className="mobile-logout-btn">LOGOUT</button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>LOGIN</Link>
              <Link to="/signup" onClick={() => setIsMobileMenuOpen(false)}>SIGN UP</Link>
            </>
          )}
          
          <Link to="/about" onClick={() => setIsMobileMenuOpen(false)}>ABOUT</Link>
          <Link to="/contact" onClick={() => setIsMobileMenuOpen(false)}>CONTACT</Link>
        </div>
      )}
    </>
  )
}

export default Navbar