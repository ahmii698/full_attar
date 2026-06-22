import { useState, useEffect } from 'react'
import { FaPlus, FaMinus } from 'react-icons/fa'
import { API_URL } from '../../config'  // ✅ IMPORT FROM CONFIG

function FAQSection() {
  const [openIndex, setOpenIndex] = useState(null)
  const [faqs, setFaqs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchFAQs()
  }, [])

  const fetchFAQs = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${API_URL}/faqs`)  // ✅ USING API_URL
      
      if (!response.ok) {
        throw new Error('Failed to fetch FAQs')
      }
      
      const data = await response.json()
      
      const activeFaqs = data.filter(faq => faq.is_active === true || faq.is_active === 1)
      activeFaqs.sort((a, b) => (a.display_order || 0) - (b.display_order || 0))
      
      setFaqs(activeFaqs)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  if (loading) {
    return (
      <section className="faq-section">
        <div className="faq-header">
          <h2>Frequently Asked <span className="gold">Questions</span></h2>
          <div className="heading-divider"></div>
          <p>Loading FAQs...</p>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="faq-section">
        <div className="faq-header">
          <h2>Frequently Asked <span className="gold">Questions</span></h2>
          <div className="heading-divider"></div>
          <p>Error loading FAQs: {error}</p>
        </div>
      </section>
    )
  }

  return (
    <section className="faq-section">
      <div className="faq-header">
        <h2>Frequently Asked <span className="gold">Questions</span></h2>
        <div className="heading-divider"></div>
        <p>Everything you need to know about Royal Attar</p>
      </div>
      
      <div className="faq-container">
        {faqs.length === 0 ? (
          <div className="no-faqs">
            <p>No FAQs available at the moment.</p>
          </div>
        ) : (
          faqs.map((faq, index) => (
            <div key={faq.faq_id} className={`faq-item ${openIndex === index ? 'active' : ''}`}>
              <div className="faq-question" onClick={() => toggleFAQ(index)}>
                <h3>{faq.question}</h3>
                <span className="faq-icon">
                  {openIndex === index ? <FaMinus /> : <FaPlus />}
                </span>
              </div>
              {openIndex === index && (
                <div className="faq-answer">
                  <p>{faq.answer}</p>
                  {faq.category && (
                    <span className="faq-category-tag">{faq.category}</span>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
      
      <div className="faq-footer">
        <p>Can't find your answer? <a href="/contact">Contact us</a></p>
      </div>
    </section>
  )
}

export default FAQSection