import { useState, useEffect } from 'react'
import ProductCard from '../components/ProductCard'
import { API_URL } from '../../config'  // ✅ IMPORT FROM CONFIG

function BestSellersPage() {
  const [bestSellers, setBestSellers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchBestSellers()
  }, [])

  const fetchBestSellers = async () => {
    try {
      setLoading(true)
      
      // ✅ USING CONFIG API_URL
      const response = await fetch(`${API_URL}/top-sellers`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch best sellers')
      }
      
      let data = await response.json()
      console.log('Best Sellers Data:', data)
      
      setBestSellers(data)
    } catch (err) {
      setError(err.message)
      console.error('Error fetching best sellers:', err)
    } finally {
      setLoading(false)
    }
  }

  // Loading state
  if (loading) {
    return (
      <div className="shop-page">
        <div className="shop-header">
          <h1>Best Sellers</h1>
          <p>Our most popular fragrances loved by thousands</p>
        </div>
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading best sellers...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="shop-page">
        <div className="shop-header">
          <h1>Best Sellers</h1>
          <p>Our most popular fragrances loved by thousands</p>
        </div>
        <div className="error-container">
          <p>⚠️ Error: {error}</p>
          <button onClick={fetchBestSellers}>Try Again</button>
        </div>
      </div>
    )
  }

  return (
    <div className="shop-page">
      <div className="shop-header">
        <h1>Best Sellers</h1>
        <p>Our most popular fragrances loved by thousands</p>
      </div>
      
      <div className="products-section">
        {bestSellers.length === 0 ? (
          <div className="no-products">
            <p>No best sellers found.</p>
          </div>
        ) : (
          <div className="products-grid">
            {bestSellers.map(product => (
              <ProductCard 
                key={product.product_id || product.id}
                id={product.product_id || product.id}
                name={product.name}
                price={product.price}
                priceNum={product.price_num}
                discount_price={product.discount_price}
                discount_percent={product.discount_percent}
                is_deal={product.is_deal === 1}
                rating={product.rating || 0}
                category={product.category}
                gender={product.gender}
                notes={product.notes}
                image_url={product.image_url}
                description={product.description}
                ml_prices={product.ml_prices}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default BestSellersPage