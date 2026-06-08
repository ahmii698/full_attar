import { useState } from 'react'

function FAQPage() {
  const [openIndex, setOpenIndex] = useState(null)
  
  const faqs = [
    { q: "What is attar?", a: "Attar is a natural perfume oil derived from botanical sources, traditionally distilled without alcohol." },
    { q: "How long does the fragrance last?", a: "Our attars last 24+ hours on skin and even longer on clothes due to their high concentration." },
    { q: "Are your attars natural?", a: "Yes, 100% natural ingredients, no synthetic additives or alcohol." },
    { q: "Do you ship internationally?", a: "Yes, we ship worldwide with tracking information provided." },
    { q: "How should I apply attar?", a: "Apply on pulse points - wrists, behind ears, and neck for best results." },
    { q: "What is your return policy?", a: "30-day return policy for unopened products in original condition." },
  ]
  
  return (
    <div className="faq-page">
      <div className="faq-hero">
        <h1>Frequently Asked Questions</h1>
        <p>Everything you need to know about Royal Attar</p>
      </div>
      
      <div className="faq-container">
        {faqs.map((faq, index) => (
          <div key={index} className="faq-item">
            <div className="faq-question" onClick={() => setOpenIndex(openIndex === index ? null : index)}>
              <h3>{faq.q}</h3>
              <span className="faq-icon">{openIndex === index ? '−' : '+'}</span>
            </div>
            {openIndex === index && (
              <div className="faq-answer">
                <p>{faq.a}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default FAQPage