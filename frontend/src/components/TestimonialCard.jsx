function TestimonialCard({ name, review, rating, location, date }) {
  return (
    <div className="testimonial-card">
      <div className="quote-icon">“</div>
      <p className="testimonial-text">"{review}"</p>
      <div className="testimonial-rating">
        {'★'.repeat(rating)}{'☆'.repeat(5 - rating)}
      </div>
      <h4 className="testimonial-name">{name}</h4>
      <p className="testimonial-location">{location}</p>
      {date && <p className="testimonial-date">{date}</p>}
    </div>
  )
}

export default TestimonialCard