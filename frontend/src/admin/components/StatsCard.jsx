import '../styles/Dashboard.css'

function StatsCard({ icon, title, value }) {
  return (
    <div className="stat-card">
      <div className="stat-icon">
        <i className={`fas ${icon}`}></i>
      </div>
      <h3>{value}</h3>
      <p>{title}</p>
    </div>
  )
}

export default StatsCard