import { useState } from 'react'
import { FaPlus, FaMinus } from 'react-icons/fa'

function FAQSection() {
  const [openIndex, setOpenIndex] = useState(null)
  
  const faqs = [
    {
      question: "How long does shipping take?",
      answer: "Domestic shipping takes 3-5 business days. International shipping takes 7-14 business days depending on the destination. Tracking information will be provided once your order ships."
    },
    {
      question: "Do you offer refunds?",
      answer: "Yes, we offer 30-day returns on unopened products in original condition. Once we receive and inspect the returned item, we will process your refund within 5-7 business days."
    },
    {
      question: "Is customer support available?",
      answer: "Our customer support team is available 24/7 via email at support@royalattar.com and live chat during business hours (9 AM - 9 PM, Monday to Saturday)."
    },
    {
      question: "Are your attars 100% natural?",
      answer: "Yes! All our attars are 100% natural, free from synthetic additives, alcohol, and chemicals. We use traditional distillation methods passed down through generations."
    },
    {
      question: "How to apply attar for best results?",
      answer: "Apply on pulse points: wrists, behind ears, neck, and inner elbows. A little goes a long way. For longer lasting effect, apply on clothes or after moisturizing skin."
    },
    {
      question: "Do you ship internationally?",
      answer: "Yes, we ship worldwide! Shipping costs vary by location. Free international shipping on orders over Rs. 10,000."
    }
  ]
  
  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index)
  }
  
  return (
    <section className="faq-section">
      <div className="faq-header">
        <h2>Frequently Asked <span className="gold">Questions</span></h2>
        <div className="heading-divider"></div>
        <p>Everything you need to know about Royal Attar</p>
      </div>
      
      <div className="faq-container">
        {faqs.map((faq, index) => (
          <div key={index} className={`faq-item ${openIndex === index ? 'active' : ''}`}>
            <div className="faq-question" onClick={() => toggleFAQ(index)}>
              <h3>{faq.question}</h3>
              <span className="faq-icon">
                {openIndex === index ? <FaMinus /> : <FaPlus />}
              </span>
            </div>
            {openIndex === index && (
              <div className="faq-answer">
                <p>{faq.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>
      
      <div className="faq-footer">
        <p>Can't find your answer? <a href="/contact">Contact us</a></p>
      </div>
    </section>
  )
}

export default FAQSection