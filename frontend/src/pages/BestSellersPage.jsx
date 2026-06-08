import ProductCard from '../components/ProductCard'

const bestSellers = [
  { id: 1, name: "Black & Silver Platinum", price: "Rs. 2,100", rating: 1330 },
  { id: 2, name: "Ameer Al Oud", price: "Rs. 1,800", rating: 890 },
  { id: 3, name: "Oud Al Aswad", price: "Rs. 3,200", rating: 650 },
  { id: 4, name: "Sultan E Ameer", price: "Rs. 4,500", rating: 420 },
  { id: 5, name: "Royal Oud", price: "Rs. 6,500", rating: 245 },
  { id: 6, name: "Musk Al Mahal", price: "Rs. 5,200", rating: 156 },
]

function BestSellersPage() {
  return (
    <div className="shop-page">
      <div className="shop-header">
        <h1>Best Sellers</h1>
        <p>Our most popular fragrances loved by thousands</p>
      </div>
      <div className="products-section">
        <div className="products-grid">
          {bestSellers.map(product => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default BestSellersPage