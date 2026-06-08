function SectionHeading({ title, subtitle }) {
  return (
    <div className="section-heading">
      <h2>{title}</h2>
      <div className="heading-divider"></div>
      <p>{subtitle}</p>
    </div>
  )
}

export default SectionHeading