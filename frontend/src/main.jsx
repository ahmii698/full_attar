import React, { lazy, Suspense } from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'

// ✅ Lazy Load Frontend App
const App = lazy(() => import('./App'))

// ✅ Lazy Load Admin App
const AdminApp = lazy(() => import('./App').then(module => ({ default: module.AdminApp })))

// ✅ Loading Component
const LoadingFallback = () => (
  <div className="app-loading">
    <div className="loading-spinner"></div>
    <p>Loading...</p>
  </div>
)

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          {/* Frontend Routes - / se start honge */}
          <Route path="/*" element={<App />} />
          
          {/* Admin Routes - /admin se start honge */}
          <Route path="/admin/*" element={<AdminApp />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  </React.StrictMode>,
)