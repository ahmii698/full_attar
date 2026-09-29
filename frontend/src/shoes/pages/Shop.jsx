import { useMemo, useState } from "react";
import ShopBanner from "../components/ShopBanner";
import ShopSidebar from "../components/ShopSidebar";
import ProductCard from "../components/ProductCard";
import { SHOES } from "../services/shoesData";
import "../styles/shop.css";

const INITIAL_FILTERS = { search: "", category: "All", gender: "All", size: null, color: null };

// TEMP: placeholder images (dynamic karte waqt ye sab hata dena)
const BANNER_IMAGE =
  "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=1600&auto=format&fit=crop&q=70";

const img = (id) => `https://images.unsplash.com/${id}?w=600&auto=format&fit=crop&q=70`;

const SHOE_IMAGES = {
  1: img("photo-1542291026-7eec264c27ff"),
  2: img("photo-1608231387042-66d1773070a5"),
  3: img("photo-1552346154-21d32810aba3"),
  4: img("photo-1600185365926-3a2ce3cdb9eb"),
  5: img("photo-1606107557195-0e29a4b5b4aa"),
  6: img("photo-1525966222134-fcfa99b8ae77"),
  7: img("photo-1614252235316-8c857d38b5f4"),
  8: img("photo-1520639888713-7851133b1ed0"),
};

const SHOES_WITH_IMAGES = SHOES.map((s) => ({ ...s, image: SHOE_IMAGES[s.id] || s.image }));

export default function Shop() {
  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const [view, setView] = useState("grid");
  const [sort, setSort] = useState("new");

  const products = useMemo(() => {
    let list = SHOES_WITH_IMAGES.filter((s) => {
      if (filters.search && !s.name.toLowerCase().includes(filters.search.toLowerCase())) return false;
      if (filters.category !== "All" && !s.categories.includes(filters.category)) return false;
      if (filters.gender !== "All" && s.gender !== filters.gender && s.gender !== "Unisex") return false;
      if (filters.size && !s.sizes.includes(filters.size)) return false;
      if (filters.color && !s.colors.includes(filters.color)) return false;
      return true;
    });

    if (sort === "low") list = [...list].sort((a, b) => a.price - b.price);
    else if (sort === "high") list = [...list].sort((a, b) => b.price - a.price);
    else list = [...list].sort((a, b) => Number(b.isNew) - Number(a.isNew));

    return list;
  }, [filters, sort]);

  const handleAddToCart = (shoe) => {
    console.log("Added to cart:", shoe.name);
  };

  return (
    <div className="shoes-page">
      <ShopSidebar filters={filters} setFilters={setFilters} onClear={() => setFilters(INITIAL_FILTERS)} />

      <main className="shoes-main">
        <ShopBanner image={BANNER_IMAGE} />

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
            <option value="new">Sort by: New Arrivals</option>
            <option value="low">Price: Low to High</option>
            <option value="high">Price: High to Low</option>
          </select>
        </div>

        {products.length ? (
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
  );
}