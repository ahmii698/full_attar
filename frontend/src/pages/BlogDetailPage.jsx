import { useParams, Link } from 'react-router-dom'
import { FaArrowLeft, FaFacebook, FaTwitter, FaWhatsapp, FaLinkedin, FaRegBookmark, FaShareAlt } from 'react-icons/fa'
import at1 from '../assets/at1.jpg'
import at2 from '../assets/at2.jpg'
import at3 from '../assets/at3.jpg'
import at4 from '../assets/at4.jpg'
import at5 from '../assets/at5.jpg'
import at6 from '../assets/at6.jpg'

const blogs = [
  {
    id: 1,
    title: "The Art of Oud: A Journey Through Time",
    content: `
      <p>Oud, also known as agarwood, is one of the most precious and expensive natural fragrance ingredients in the world. It is formed in the heartwood of Aquilaria trees when they become infected with a specific type of mold.</p>
      
      <p>The history of oud dates back thousands of years to ancient civilizations across Asia and the Middle East. It has been used in traditional medicine, religious ceremonies, and perfumery for centuries.</p>
      
      <h2>How Oud is Sourced</h2>
      <p>The process of obtaining oud is both an art and a science. When an Aquilaria tree becomes infected, it produces a dark, aromatic resin in response to the infection. This resin-soaked wood is what we call oud or agarwood.</p>
      
      <p>The rarity of oud comes from the fact that only about 2% of wild Aquilaria trees produce the resin naturally. This scarcity, combined with the labor-intensive extraction process, makes oud one of the most expensive woods in the world.</p>
      
      <h2>Traditional Distillation</h2>
      <p>The traditional method of distilling oud involves soaking the resinous wood chips in water and then heating them in copper vessels. The steam carries the aromatic compounds through a cooling system, where they condense into a precious oil.</p>
      
      <p>This process can take several weeks to months, and the resulting oil is then aged for additional months to allow the fragrance to mature and develop its full complexity.</p>
      
      <h2>Types of Oud</h2>
      <p>There are several types of oud, each with its own unique scent profile. Some are woody and smoky, while others have sweet or fruity notes. The quality and price of oud depend on factors such as the age of the tree, the concentration of resin, and the distillation method used.</p>
    `,
    image: at1,
    category: "Oud",
    date: "March 15, 2024",
    readTime: "5 min read",
    author: "Ahmed Raza",
    tags: ["Oud", "History", "Luxury"]
  },
  {
    id: 2,
    title: "How to Choose the Perfect Attar for Every Season",
    content: `
      <p>Choosing the right attar for different seasons can enhance your fragrance experience and ensure you smell appropriate and appealing all year round.</p>
      
      <h2>Summer Scents</h2>
      <p>During hot summer months, opt for light, fresh, and citrusy attars. These fragrances are refreshing and won't become overwhelming in the heat. Look for notes like bergamot, lemon, mint, and light floral scents.</p>
      
      <h2>Winter Warmth</h2>
      <p>Cold weather calls for warm, rich, and woody fragrances. Oud, amber, sandalwood, and musk-based attars bloom beautifully in cooler temperatures, creating a cozy and sophisticated aura.</p>
      
      <h2>Spring Freshness</h2>
      <p>Spring is the season of renewal, so choose floral and green attars. Rose, jasmine, and fresh-cut grass notes capture the essence of spring perfectly.</p>
      
      <h2>Autumn Elegance</h2>
      <p>Fall is perfect for spicy and earthy fragrances. Cinnamon, clove, patchouli, and vetiver create warm and inviting scents that complement the season's mood.</p>
    `,
    image: at2,
    category: "Attar Guide",
    date: "March 10, 2024",
    readTime: "4 min read",
    author: "Sarah Khan",
    tags: ["Attar", "Seasonal", "Guide"]
  },
  {
    id: 3,
    title: "The Difference Between Oud and Attar",
    content: `
      <p>While often used interchangeably, oud and attar are distinct fragrance products with unique characteristics.</p>
      
      <h2>What is Oud?</h2>
      <p>Oud (also called agarwood) is a resinous heartwood that forms in Aquilaria trees. It is used as a raw material to produce oud oil, which has a complex, woody, and slightly sweet aroma.</p>
      
      <h2>What is Attar?</h2>
      <p>Attar is a traditional perfume oil made by distilling natural ingredients such as flowers, herbs, spices, and woods. Attars are alcohol-free and highly concentrated, making them long-lasting.</p>
      
      <h2>Key Differences</h2>
      <p>The main difference is that oud is a specific ingredient (agarwood resin), while attar is a finished product that can contain oud along with other ingredients. Oud attar is a type of attar that features oud as a prominent note.</p>
    `,
    image: at3,
    category: "Oud",
    date: "March 5, 2024",
    readTime: "3 min read",
    author: "Omar Farooq",
    tags: ["Oud", "Attar", "Comparison"]
  },
  {
    id: 4,
    title: "Top 10 Best Selling Attars of 2024",
    content: `
      <p>Based on customer reviews and sales data, here are our top 10 best-selling attars of 2024.</p>
      
      <h2>1. Black & Silver Platinum</h2>
      <p>Our most popular attar features a perfect blend of smoky oud and warm amber. Customers love its longevity and sophisticated scent profile.</p>
      
      <h2>2. Ameer Al Oud</h2>
      <p>A rich and woody fragrance that captures the essence of traditional Arabian perfumery.</p>
      
      <h2>3. Oud Al Aswad</h2>
      <p>Deep, dark, and mysterious. This attar is for those who appreciate the pure, unadulterated scent of premium oud.</p>
    `,
    image: at4,
    category: "Trending",
    date: "February 28, 2024",
    readTime: "6 min read",
    author: "Fatima Al Mansouri",
    tags: ["Best Sellers", "Popular", "2024"]
  },
  {
    id: 5,
    title: "How to Apply Attar for Long Lasting Effect",
    content: `
      <p>Applying attar correctly can make a significant difference in how long the fragrance lasts and how it develops on your skin.</p>
      
      <h2>Apply to Pulse Points</h2>
      <p>The best places to apply attar are pulse points where the body generates heat: wrists, behind the ears, the base of the throat, inside elbows, and behind the knees.</p>
      
      <h2>Don't Rub</h2>
      <p>After applying attar to your wrists, don't rub them together. This breaks down the molecular structure of the oil and can shorten the fragrance's lifespan.</p>
      
      <h2>Moisturize First</h2>
      <p>Apply an unscented moisturizer before your attar. The oil will adhere better to hydrated skin and last much longer.</p>
    `,
    image: at5,
    category: "Tips & Tricks",
    date: "February 20, 2024",
    readTime: "4 min read",
    author: "Bilal Ahmed",
    tags: ["Tips", "Application", "Longevity"]
  },
  {
    id: 6,
    title: "Behind the Scenes: How Our Attars Are Made",
    content: `
      <p>The journey of creating a Royal Attar fragrance begins with selecting the finest raw materials from around the world.</p>
      
      <h2>Raw Materials</h2>
      <p>Our master perfumers source ingredients from their native regions: oud from Southeast Asia, roses from Bulgaria, sandalwood from India, and saffron from Kashmir.</p>
      
      <h2>Traditional Distillation</h2>
      <p>We use traditional copper pot distillation methods that have been passed down through generations.</p>
      
      <h2>Aging Process</h2>
      <p>Once distilled, our attars are aged in glass or copper vessels for months or even years. This aging allows the different notes to harmonize and develop depth.</p>
    `,
    image: at6,
    category: "Craftsmanship",
    date: "February 15, 2024",
    readTime: "7 min read",
    author: "Ahmed Raza",
    tags: ["Process", "Traditional", "Craftsmanship"]
  },
]

// Get related posts (same category, exclude current)
const getRelatedPosts = (currentId, currentCategory) => {
  return blogs.filter(blog => blog.id !== currentId && blog.category === currentCategory).slice(0, 2)
}

function BlogDetailPage() {
  const { id } = useParams()
  const blog = blogs.find(b => b.id === parseInt(id))
  const relatedPosts = blog ? getRelatedPosts(blog.id, blog.category) : []
  
  const handleShare = (platform) => {
    const url = window.location.href
    const text = blog.title
    if (platform === 'facebook') {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank')
    } else if (platform === 'twitter') {
      window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank')
    } else if (platform === 'whatsapp') {
      window.open(`https://wa.me/?text=${text} ${url}`, '_blank')
    } else if (platform === 'linkedin') {
      window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank')
    }
  }
  
  if (!blog) {
    return (
      <div className="shop-page">
        <div className="shop-header">
          <h1>Blog Not Found</h1>
          <p>The article you're looking for doesn't exist.</p>
          <Link to="/blogs" className="explore-btn" style={{ marginTop: '20px' }}>← Back to Blogs</Link>
        </div>
      </div>
    )
  }
  
  return (
    <div className="blog-detail-page">
      <div className="blog-detail-header">
        <Link to="/blogs" className="back-to-blogs">
          <FaArrowLeft /> Back to Blogs
        </Link>
        
        <div className="blog-detail-image">
          <img src={blog.image} alt={blog.title} />
          {/* CATEGORY TAG REMOVED - No badge on image */}
        </div>
        
        <div className="blog-detail-info">
          <h1>{blog.title}</h1>
          <div className="blog-detail-meta">
            <span>📅 {blog.date}</span>
            <span>⏱️ {blog.readTime}</span>
          </div>
          
          {/* AUTHOR IMAGE REMOVED - Sirf naam */}
          <div className="blog-author-name">
            <span className="author-name">By {blog.author}</span>
          </div>
          
          <div className="blog-detail-tags">
            {blog.tags.map((tag, i) => (
              <span key={i} className="detail-tag">#{tag}</span>
            ))}
          </div>
          
          <div className="blog-share-section">
            <span className="share-label">Share this article:</span>
            <div className="share-buttons">
              <button onClick={() => handleShare('facebook')} className="share-btn facebook"><FaFacebook /></button>
              <button onClick={() => handleShare('twitter')} className="share-btn twitter"><FaTwitter /></button>
              <button onClick={() => handleShare('whatsapp')} className="share-btn whatsapp"><FaWhatsapp /></button>
              <button onClick={() => handleShare('linkedin')} className="share-btn linkedin"><FaLinkedin /></button>
              <button className="share-btn bookmark"><FaRegBookmark /></button>
              <button className="share-btn share"><FaShareAlt /></button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="blog-detail-content">
        <div dangerouslySetInnerHTML={{ __html: blog.content }} />
      </div>
      
      {relatedPosts.length > 0 && (
        <div className="related-posts">
          <h3>You Might Also Like</h3>
          <div className="related-posts-grid">
            {relatedPosts.map(related => (
              <Link to={`/blog/${related.id}`} key={related.id} className="related-post-card">
                <img src={related.image} alt={related.title} />
                <div className="related-post-info">
                  <h4>{related.title}</h4>
                  <p>{related.date}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
      
      <div className="blog-detail-footer">
        <Link to="/blogs" className="more-blogs-btn">
          View All Blogs →
        </Link>
      </div>
    </div>
  )
}

export default BlogDetailPage