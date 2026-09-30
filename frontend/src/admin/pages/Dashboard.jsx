import { useState, useEffect } from 'react'
import { FaBox, FaShoppingCart, FaUsers, FaMoneyBillWave } from 'react-icons/fa'
import { getDashboard } from '../services/adminApi'
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
  const [error, setError] = useState('')

  useEffect(() => {
    fetchDashboard()
  }, [])

  const fetchDashboard = async () => {
    try {
      const res = await getDashboard()
      setData(res.data)
    } catch (err) {
      console.error('Error fetching dashboard:', err)
      setError('Dashboard load nahi ho saka. Backend check karo.')
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="loading">Loading dashboard...</div>
  if (error) return <div className="loading">{error}</div>

  const stats = [
    { icon: <FaBox />, title: 'Total Products', value: data.totalProducts },
    { icon: <FaShoppingCart />, title: 'Total Orders', value: data.totalOrders },
    { icon: <FaUsers />, title: 'Total Users', value: data.totalUsers },
    {
      icon: <FaMoneyBillWave />,
      title: 'Total Revenue',
      value: `Rs. ${Number(data.totalRevenue ?? 0).toLocaleString()}`
    }
  ]

  return (
    <div className="dashboard">
      <div className="stats-grid">
        {stats.map(stat => (
          <div className="stat-card" key={stat.title}>
            <div className="stat-icon">{stat.icon}</div>
            <h3>{stat.value}</h3>
            <p>{stat.title}</p>
          </div>
        ))}
      </div>

      <div className="recent-orders">
        <h3>Recent Orders</h3>
        <div className="data-table">
          <table>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {(data.recentOrders || []).map(order => (
                <tr key={order.order_id}>
                  <td>#{order.order_number}</td>
                  <td>{order.full_name || order.user?.name || 'N/A'}</td>
                  <td>Rs. {Number(order.total_amount ?? 0).toLocaleString()}</td>
                  <td>
                    <span className={`status-${order.status}`}>{order.status}</span>
                  </td>
                  <td>
                    {new Date(order.created_at || order.order_date).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Dashboard