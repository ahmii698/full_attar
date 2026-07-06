import { useState, useEffect } from 'react'
import ProductCard from '../components/ProductCard'
import { API_URL } from '../../config'  // ✅ IMPORT FROM CONFIG
import './DealsPage.css'

function DealsPage() {
  const [deals, setDeals] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchDeals()
  }, [])

  const fetchDeals = async () => {
    try {
      setLoading(true)
      
      const response = await fetch(`${API_URL}/deals`)  // ✅ USING API_URL
      
      if (!response.ok) {
        throw new Error('Failed to fetch deals')
      }
      
      let data = await response.json()
      
      
      setDeals(data)
    } catch (err) {
      setError(err.message)
    
    } finally {
      setLoading(false)
    }
  }

  // Loading state
  if (loading) {
    return (
      <div className="shop-page">
        <div className="shop-header">
          <h1>Hot Deals </h1>
          <p>Limited time offers. Up to 40% off on selected attars!</p>
        </div>
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading deals...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="shop-page">
        <div className="shop-header">
          <h1>Hot Deals </h1>
          <p>Limited time offers. Up to 40% off on selected attars!</p>
        </div>
        <div className="error-container">
          <p>⚠️ Error: {error}</p>
          <button onClick={fetchDeals}>Try Again</button>
        </div>
      </div>
    )
  }

  return (
    <div className="shop-page">
      <div className="shop-header">
        <h1>Hot Deals </h1>
        <p>Limited time offers. Up to 40% off on selected attars!</p>
      </div>
      
      <div className="products-section">
        {deals.length === 0 ? (
          <div className="no-products">
            <p>No active deals at the moment. Check back soon!</p>
          </div>
        ) : (
          <div className="products-grid">
            {deals.map(product => (
              <ProductCard 
                key={product.product_id || product.id}
                id={product.product_id || product.id}
                name={product.name}
                price={product.price}
                priceNum={product.price_num}
                discount_price={product.discount_price}
                discount_percent={product.discount_percent}
                is_deal={true}
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

export default DealsPage