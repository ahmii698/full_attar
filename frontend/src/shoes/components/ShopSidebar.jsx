import { CATEGORIES, GENDERS, SIZES, COLORS } from "../services/shoesData";

export default function ShopSidebar({ filters, setFilters, onClear }) {
  const update = (key, value) => setFilters((prev) => ({ ...prev, [key]: value }));

  return (
    <aside className="shoes-sidebar">
      <div className="sb-block">
        <h4 className="sb-title">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></svg>
          SEARCH
        </h4>
        <input
          className="sb-search"
          type="text"
          placeholder="Search shoes..."
          value={filters.search}
          onChange={(e) => update("search", e.target.value)}
        />
      </div>

      <div className="sb-block">
        <h4 className="sb-title">CATEGORIES</h4>
        <ul className="sb-list">
          {CATEGORIES.map((c) => (
            <li key={c}>
              <button className={`sb-item ${filters.category === c ? "active" : ""}`} onClick={() => update("category", c)}>
                <span>{c}</span>
                {filters.category === c && <i className="sb-dot" />}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="sb-block">
        <h4 className="sb-title">GENDER</h4>
        <ul className="sb-list">
          {GENDERS.map((g) => (
            <li key={g}>
              <button className={`sb-item ${filters.gender === g ? "active" : ""}`} onClick={() => update("gender", g)}>
                <span>{g}</span>
                {filters.gender === g && <i className="sb-dot" />}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="sb-block">
        <h4 className="sb-title">SIZE</h4>
        <div className="sb-sizes">
          {SIZES.map((s) => (
            <button
              key={s}
              className={`sb-size ${filters.size === s ? "active" : ""}`}
              onClick={() => update("size", filters.size === s ? null : s)}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="sb-block">
        <h4 className="sb-title">COLOR</h4>
        <div className="sb-colors">
          {COLORS.map((c) => (
            <button
              key={c.name}
              title={c.name}
              className={`sb-color ${filters.color === c.name ? "active" : ""}`}
              style={{ background: c.hex }}
              onClick={() => update("color", filters.color === c.name ? null : c.name)}
            />
          ))}
        </div>
      </div>

      <button className="sb-clear" onClick={onClear}>CLEAR ALL FILTERS</button>
    </aside>
  );
}