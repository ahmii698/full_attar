import { useState, useEffect } from 'react'
import { getDashboard } from '../services/adminApi'
import StatsCard from '../components/StatsCard'
import '../styles/Dashboard.css'

function Dashboard() {
  const [data, setData] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalRevenue: 0,
    recentOrders: []
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboard()
  }, [])

  const fetchDashboard = async () => {
    try {
      const res = await getDashboard()
      setData(res.data)
    } catch (error) {
      console.error('Error fetching dashboard:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="loading">Loading dashboard...</div>

  return (
    <div className="dashboard">
      <div className="stats-grid">
        <StatsCard icon="fa-box" title="Total Products" value={data.totalProducts} />
        <StatsCard icon="fa-shopping-cart" title="Total Orders" value={data.totalOrders} />
        <StatsCard icon="fa-users" title="Total Users" value={data.totalUsers} />
        <StatsCard icon="fa-dollar-sign" title="Total Revenue" value={`Rs. ${data.totalRevenue.toLocaleString()}`} />
      </div>

      <div className="recent-orders">
        <h3>Recent Orders</h3>
        <table className="data-table">
          <thead>
            <tr><th>Order ID</th><th>Customer</th><th>Amount</th><th>Status</th><th>Date</th></tr>
          </thead>
          <tbody>
            {data.recentOrders.map(order => (
              <tr key={order.order_id}>
                <td>#{order.order_number}</td>
                <td>{order.user?.name || 'N/A'}</td>
                <td>Rs. {order.total_amount?.toLocaleString()}</td>
                <td><span className={`status-${order.status}`}>{order.status}</span></td>
                <td>{new Date(order.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Dashboard