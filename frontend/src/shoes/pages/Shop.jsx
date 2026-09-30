import { useEffect, useRef, useState } from "react";
import ShopBanner from "../components/ShopBanner";
import ShopSidebar from "../components/ShopSidebar";
import ProductCard from "../components/ProductCard";
import { API_URL, STORAGE_URL } from "../../../config";
import "../styles/shop.css";

const INITIAL_FILTERS = { search: "", category: "All", gender: "All", size: null, color: null };

// TEMP: banner abhi placeholder hai (baad mein backend ke banners se aayega)
const BANNER_IMAGE =
  "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=1800&auto=format&fit=crop&q=70";

// Backend image path (/storage/shoes/1/a.jpg) ko poora URL bana deta hai
const imgUrl = (path) => {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return STORAGE_URL + path.replace(/^\/?storage/, "");
};

// Backend ka data ko wahi shakal dete hain jo ProductCard pehle se samajhta hai
const mapShoe = (s) => ({
  id: s.id,
  slug: s.slug,
  name: s.name,
  price: s.price,
  gender: s.gender,
  colors: s.color ? [s.color] : [],
  categories: s.categories ? s.categories.split(" / ") : [],
  isNew: s.is_new,
  image: imgUrl(s.image),
});

const SORT_MAP = { low: "price_asc", high: "price_desc", new: "newest" };

export default function Shop() {
  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const [view, setView] = useState("grid");
  const [sort, setSort] = useState("low");
  const [shoes, setShoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const bodyRef = useRef(null);

  useEffect(() => {
    const controller = new AbortController();

    const params = new URLSearchParams();
    params.set("sort", SORT_MAP[sort]);
    if (filters.category !== "All") params.set("category", filters.category);
    if (filters.gender !== "All") {
      // Male/Female chunne par Unisex bhi dikhao (pehle wala behaviour)
      params.set("gender", filters.gender === "Unisex" ? "Unisex" : `${filters.gender},Unisex`);
    }
    if (filters.size) params.set("size", filters.size);
    if (filters.color) params.set("color", filters.color);

    setLoading(true);
    setError("");

    fetch(`${API_URL}/shoes?${params.toString()}`, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error("Server error");
        return res.json();
      })
      .then((data) => {
        setShoes(data.map(mapShoe));
        setLoading(false);
      })
      .catch((err) => {
        if (err.name === "AbortError") return;
        setError("Shoes load nahi ho sakay. Dobara try karein.");
        setLoading(false);
      });

    return () => controller.abort();
  }, [filters.category, filters.gender, filters.size, filters.color, sort]);

  // Search abhi frontend par hi hota hai (naam se)
  const products = shoes.filter(
    (s) => !filters.search || s.name.toLowerCase().includes(filters.search.toLowerCase())
  );

  const handleAddToCart = (shoe) => {
    console.log("Added to cart:", shoe.name);
  };

  const scrollToProducts = () => {
    bodyRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="shoes-page">
      <ShopBanner image={BANNER_IMAGE} onCta={scrollToProducts} />

      <div className="shoes-body" ref={bodyRef}>
        <ShopSidebar filters={filters} setFilters={setFilters} onClear={() => setFilters(INITIAL_FILTERS)} />

        <main className="shoes-main">
          <div className="shoes-toolbar">
            <div className="shoes-views">
              <button className={view === "grid" ? "active" : ""} onClick={() => setView("grid")} aria-label="Grid view">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></svg>
              </button>
              <button className={view === "list" ? "active" : ""} onClick={() => setView("list")} aria-label="List view">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" /></svg>
              </button>
            </div>

            <select className="shoes-sort" value={sort} onChange={(e) => setSort(e.target.value)}>
              <option value="low">Price: Low to High</option>
              <option value="high">Price: High to Low</option>
            </select>
          </div>

          {loading ? (
            <p className="shoes-empty">Loading...</p>
          ) : error ? (
            <p className="shoes-empty">{error}</p>
          ) : products.length ? (
            <div className={`shoes-grid ${view}`}>
              {products.map((shoe) => (
                <ProductCard key={shoe.id} shoe={shoe} onAddToCart={handleAddToCart} />
              ))}
            </div>
          ) : (
            <p className="shoes-empty">Koi shoes nahi mile. Filters clear kar ke dobara try karein.</p>
          )}
        </main>
      </div>
    </div>
  );
}