import React, { useContext, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import "./Products.css";

const Products = () => {
  const { products, addToCart, getEffectivePrice } = useContext(CartContext);
  const { user } = useContext(AuthContext);

  const [toast,      setToast]      = useState(null);
  const [adding,     setAdding]     = useState(null);
  const [search,     setSearch]     = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [sortBy,     setSortBy]     = useState("default");

  // Get unique categories from products
  const categories = useMemo(() => {
    const cats = [...new Set(products.map((p) => p.category).filter(Boolean))];
    return ["All", ...cats];
  }, [products]);

  // Filter + sort
  const filtered = useMemo(() => {
    let list = [...products];
    if (activeCategory !== "All")
      list = list.filter((p) => p.category === activeCategory);
    if (search.trim())
      list = list.filter((p) =>
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.description?.toLowerCase().includes(search.toLowerCase())
      );
    if (sortBy === "price-asc")
      list.sort((a, b) => getEffectivePrice(a) - getEffectivePrice(b));
    else if (sortBy === "price-desc")
      list.sort((a, b) => getEffectivePrice(b) - getEffectivePrice(a));
    else if (sortBy === "sale")
      list = list.filter((p) => p.salePercent > 0).concat(list.filter((p) => !p.salePercent));
    return list;
  }, [products, activeCategory, search, sortBy, getEffectivePrice]);

  const handleAdd = (product) => {
    setAdding(product.id || product._id);
    addToCart(product);
    setToast(`${product.title} added to cart!`);
    setTimeout(() => { setAdding(null); setToast(null); }, 2000);
  };

  const salePrice = (p) =>
    p.salePercent > 0
      ? Math.round(p.price - (p.price * p.salePercent) / 100)
      : null;

  return (
    <div className="pr-page">
      {/* Header */}
      <div className="pr-header">
        <div className="pr-header-left">
          <p className="pr-eyebrow">Hassan Store</p>
          <h1 className="pr-title">Our Collection</h1>
          <p className="pr-sub">{filtered.length} product{filtered.length !== 1 ? "s" : ""} available</p>
        </div>
        <div className="pr-header-right">
          {user?.isAdmin && (
            <Link to="/admin/dashboard" className="pr-btn-admin">⚙ Admin Panel</Link>
          )}
          <Link to="/cart" className="pr-btn-cart">🛒 View Cart</Link>
        </div>
      </div>

      {/* Search + Sort */}
      <div className="pr-toolbar">
        <div className="pr-search-wrap">
          <span className="pr-search-icon">🔍</span>
          <input
            className="pr-search"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button className="pr-search-clear" onClick={() => setSearch("")}>✕</button>
          )}
        </div>
        <select
          className="pr-sort"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="default">Default</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="sale">On Sale First</option>
        </select>
      </div>

      {/* Category Filters */}
      <div className="pr-categories">
        {categories.map((cat) => (
          <button
            key={cat}
            className={`pr-cat-btn ${activeCategory === cat ? "active" : ""}`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Products Grid */}
      {filtered.length === 0 ? (
        <div className="pr-empty">
          <span>🔎</span>
          <h3>No products found</h3>
          <p>Try a different search or category</p>
          <button className="pr-btn-cart" onClick={() => { setSearch(""); setActiveCategory("All"); }}>
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="pr-grid">
          {filtered.map((product) => {
            const pid    = product.id || product._id;
            const sale   = salePrice(product);
            const isAdding = adding === pid;

            return (
              <div className="pr-card" key={pid}>
                {/* Image */}
                <div className="pr-img-wrap">
                  <img
                    src={product.image || "https://via.placeholder.com/400x300?text=No+Image"}
                    alt={product.title}
                    className="pr-img"
                    loading="lazy"
                  />
                  {product.category && (
                    <span className="pr-cat-tag">{product.category}</span>
                  )}
                  {product.salePercent > 0 && (
                    <span className="pr-sale-badge">{product.salePercent}% OFF</span>
                  )}
                  {product.stock !== null && product.stock !== undefined && product.stock < 5 && product.stock > 0 && (
                    <span className="pr-low-stock">Only {product.stock} left!</span>
                  )}
                </div>

                {/* Info */}
                <div className="pr-info">
                  <h3 className="pr-name">{product.title}</h3>
                  <p className="pr-desc">{product.description}</p>

                  <div className="pr-footer">
                    <div className="pr-price-wrap">
                      {sale ? (
                        <>
                          <span className="pr-price-sale">Rs. {sale.toLocaleString()}</span>
                          <span className="pr-price-original">Rs. {product.price.toLocaleString()}</span>
                        </>
                      ) : (
                        <span className="pr-price">Rs. {product.price.toLocaleString()}</span>
                      )}
                    </div>
                    <button
                      className={`pr-add-btn ${isAdding ? "added" : ""}`}
                      onClick={() => handleAdd(product)}
                      disabled={isAdding || product.stock === 0}
                    >
                      {product.stock === 0 ? "Out of Stock" : isAdding ? "✓ Added!" : "+ Add to Cart"}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="pr-toast">
          🛒 {toast}
        </div>
      )}
    </div>
  );
};

export default Products;