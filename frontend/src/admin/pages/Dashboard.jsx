import { useState, useEffect } from 'react'
import {
  FaBox,
  FaShoePrints,
  FaShoppingCart,
  FaUsers,
  FaMoneyBillWave
} from 'react-icons/fa'
import { getDashboard } from '../services/adminApi'
import '../styles/Dashboard.css'

const formatMoney = (value) => `Rs. ${Number(value ?? 0).toLocaleString()}`

function OrdersTable({ title, orders }) {
  return (
    <div className="recent-orders">
      <h3>{title}</h3>
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
            {(orders || []).length === 0 ? (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center' }}>
                  No orders yet
                </td>
              </tr>
            ) : (
              orders.map(order => (
                <tr key={order.order_id}>
                  <td>#{order.order_number}</td>
                  <td>{order.full_name || order.user?.name || 'N/A'}</td>
                  <td>{formatMoney(order.total_amount)}</td>
                  <td>
                    <span className={`status-${order.status}`}>{order.status}</span>
                  </td>
                  <td>
                    {new Date(order.created_at || order.order_date).toLocaleDateString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function Dashboard() {
  const [data, setData] = useState({
    totalAttar: 0,
    totalShoes: 0,
    totalUsers: 0,
    attarOrders: 0,
    shoesOrders: 0,
    attarRevenue: 0,
    shoesRevenue: 0,
    recentAttarOrders: [],
    recentShoesOrders: []
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
    { icon: <FaBox />, title: 'Total Attar', value: data.totalAttar },
    { icon: <FaShoePrints />, title: 'Total Shoes', value: data.totalShoes },
    { icon: <FaUsers />, title: 'Total Users', value: data.totalUsers },
    { icon: <FaShoppingCart />, title: 'Total Orders (Attar)', value: data.attarOrders },
    { icon: <FaShoppingCart />, title: 'Total Orders (Shoes)', value: data.shoesOrders },
    {
      icon: <FaMoneyBillWave />,
      title: 'Total Revenue (Attar)',
      value: formatMoney(data.attarRevenue)
    },
    {
      icon: <FaMoneyBillWave />,
      title: 'Total Revenue (Shoes)',
      value: formatMoney(data.shoesRevenue)
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

      <OrdersTable title="Recent Attar Orders" orders={data.recentAttarOrders} />
      <OrdersTable title="Recent Shoes Orders" orders={data.recentShoesOrders} />
    </div>
  )
}

export default Dashboard