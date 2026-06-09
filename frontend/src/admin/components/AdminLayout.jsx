import { Outlet, useNavigate } from 'react-router-dom'
import AdminSidebar from './AdminSidebar'
import AdminHeader from './AdminHeader'
import { useAdminAuth } from '../contexts/AdminAuthContext'
import { useEffect } from 'react'
import '../styles/AdminLayout.css'

function AdminLayout() {
  const { admin, loading } = useAdminAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!loading && !admin) {
      navigate('/admin/login')
    }
  }, [admin, loading, navigate])

  if (loading) return <div className="admin-loading">Loading...</div>
  if (!admin) return null

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-main">
        <AdminHeader />
        <div className="admin-content">
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default AdminLayout