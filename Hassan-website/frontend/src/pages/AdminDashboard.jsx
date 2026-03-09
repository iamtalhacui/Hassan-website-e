import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { CartContext } from "../context/CartContext";
import "./AdminDashboard.css";

// ─── Sidebar Nav Items ───────────────────────────────────────────────────────
const NAV = [
  { id: "overview",  icon: "◎", label: "Overview"       },
  { id: "products",  icon: "◫", label: "Products"       },
  { id: "orders",    icon: "◑", label: "Orders"         },
  { id: "users",     icon: "◉", label: "Users"          },
  { id: "sales",     icon: "◈", label: "Sales & Revenue"},
];

// ─── Helpers ─────────────────────────────────────────────────────────────────
const getOrders  = () => JSON.parse(localStorage.getItem("hs_orders")  || "[]");
const getUsers   = () => JSON.parse(localStorage.getItem("hs_users")   || "[]");
const saveOrders = (o) => localStorage.setItem("hs_orders", JSON.stringify(o));
const saveUsers  = (u) => localStorage.setItem("hs_users",  JSON.stringify(u));

const STATUS_COLORS = {
  Pending:   { bg: "rgba(232,201,126,0.12)", color: "#e8c97e"  },
  Processing:{ bg: "rgba(100,149,255,0.12)", color: "#6495ff"  },
  Shipped:   { bg: "rgba(120,200,255,0.12)", color: "#78c8ff"  },
  Delivered: { bg: "rgba(74,222,128,0.12)",  color: "#4ade80"  },
  Cancelled: { bg: "rgba(255,107,107,0.12)", color: "#ff6b6b"  },
};

// ═════════════════════════════════════════════════════════════════════════════
const AdminDashboard = () => {
  const { user, logout }                           = useContext(AuthContext);
  const { products, addProduct, deleteProduct }    = useContext(CartContext);
  const navigate                                   = useNavigate();

  const [tab,        setTab]        = useState("overview");
  const [orders,     setOrders]     = useState(getOrders());
  const [users,      setUsers]      = useState(getUsers());
  const [toast,      setToast]      = useState(null);
  const [sideOpen,   setSideOpen]   = useState(false);

  // redirect non-admins
  useEffect(() => {
    if (!user)          { navigate("/admin");     return; }
    if (!user.isAdmin)  { navigate("/");          return; }
  }, [user, navigate]);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleLogout = () => { logout(); navigate("/admin"); };

  // revenue
  const totalRevenue = orders
    .filter(o => o.status !== "Cancelled")
    .reduce((s, o) => s + (o.totalPrice || 0), 0);

  // ── Overview Tab ──────────────────────────────────────────────────────────
  const OverviewTab = () => (
    <div className="ad-tab-content">
      <div className="ad-section-head">
        <p className="ad-eyebrow">At a glance</p>
        <h2 className="ad-section-title">Dashboard Overview</h2>
      </div>

      <div className="ad-stats-grid">
        {[
          { icon:"◫", label:"Total Products",  value: products.length,                    sub:"In catalog"          },
          { icon:"◑", label:"Total Orders",    value: orders.length,                       sub:"All time"            },
          { icon:"◉", label:"Registered Users",value: users.length,                        sub:"Accounts created"    },
          { icon:"◈", label:"Total Revenue",   value:`Rs. ${totalRevenue.toLocaleString()}`,sub:"Confirmed orders"   },
        ].map((s,i) => (
          <div className="ad-stat-card" key={i} style={{ animationDelay:`${i*0.08}s` }}>
            <div className="ad-stat-icon">{s.icon}</div>
            <div className="ad-stat-value">{s.value}</div>
            <div className="ad-stat-label">{s.label}</div>
            <div className="ad-stat-sub">{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="ad-card" style={{ marginTop:"2rem" }}>
        <div className="ad-card-head">
          <h3 className="ad-card-title">Recent Orders</h3>
          <button className="ad-link-btn" onClick={() => setTab("orders")}>View all →</button>
        </div>
        {orders.length === 0
          ? <div className="ad-empty">No orders yet</div>
          : (
            <div className="ad-table-wrap">
              <table className="ad-table">
                <thead><tr>
                  <th>Order ID</th><th>Customer</th><th>Amount</th><th>Status</th><th>Date</th>
                </tr></thead>
                <tbody>
                  {orders.slice(-5).reverse().map((o,i) => (
                    <tr key={i}>
                      <td className="ad-mono">{o.id}</td>
                      <td>{o.user || o.userName}</td>
                      <td className="ad-gold">Rs. {(o.totalPrice||0).toLocaleString()}</td>
                      <td><StatusBadge status={o.status} /></td>
                      <td className="ad-muted">{o.date || new Date(o.timestamp||Date.now()).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        }
      </div>

      {/* Low stock */}
      <div className="ad-card" style={{ marginTop:"1.25rem" }}>
        <div className="ad-card-head">
          <h3 className="ad-card-title">Low Stock Alert</h3>
          <button className="ad-link-btn" onClick={() => setTab("products")}>Manage →</button>
        </div>
        <div className="ad-table-wrap">
          <table className="ad-table">
            <thead><tr><th>Product</th><th>Category</th><th>Price</th><th>Stock</th></tr></thead>
            <tbody>
              {products.filter(p => (p.stock || 0) < 5).slice(0,5).map((p,i) => (
                <tr key={i}>
                  <td>{p.title}</td>
                  <td><span className="ad-tag">{p.category||"General"}</span></td>
                  <td className="ad-gold">Rs. {(p.price||0).toLocaleString()}</td>
                  <td><span className="ad-stock-low">{p.stock ?? "N/A"}</span></td>
                </tr>
              ))}
              {products.filter(p => (p.stock||0) < 5).length === 0 &&
                <tr><td colSpan={4} className="ad-empty-row">All products well-stocked ✓</td></tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  // ── Products Tab ──────────────────────────────────────────────────────────
  const ProductsTab = () => {
    const blank = { title:"", description:"", price:"", image:"", category:"", stock:"", salePercent:"" };
    const [showForm,    setShowForm]    = useState(false);
    const [editMode,    setEditMode]    = useState(false);
    const [editId,      setEditId]      = useState(null);
    const [form,        setForm]        = useState(blank);
    const [formError,   setFormError]   = useState("");
    const [delConfirm,  setDelConfirm]  = useState(null);
    const [search,      setSearch]      = useState("");

    const handle = e => setForm({ ...form, [e.target.name]: e.target.value });

    const openAdd  = () => { setForm(blank); setEditMode(false); setEditId(null); setShowForm(true); setFormError(""); };
    const openEdit = (p)  => {
      setForm({
        title: p.title, description: p.description,
        price: p.price, image: p.image||"",
        category: p.category||"", stock: p.stock??"",
        salePercent: p.salePercent||""
      });
      setEditMode(true); setEditId(p._id||p.id); setShowForm(true); setFormError("");
    };

    const submit = (e) => {
      e.preventDefault(); setFormError("");
      if (!form.title || !form.description || !form.price) return setFormError("Title, description and price required");
      if (isNaN(form.price) || Number(form.price) <= 0)    return setFormError("Price must be a valid positive number");

      const productData = {
        title: form.title, description: form.description,
        price: Number(form.price),
        image: form.image || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop",
        category: form.category || "General",
        stock: form.stock !== "" ? Number(form.stock) : null,
        salePercent: form.salePercent !== "" ? Number(form.salePercent) : 0,
      };

      if (editMode) {
        // Update in localStorage via CartContext workaround
        const stored = JSON.parse(localStorage.getItem("hs_products") || "[]");
        const updated = stored.map(p => (p.id === editId || p._id === editId) ? { ...p, ...productData } : p);
        localStorage.setItem("hs_products", JSON.stringify(updated));
        window.location.reload(); // refresh to show updated
      } else {
        addProduct(productData);
        showToast("Product added successfully!");
      }
      setShowForm(false); setForm(blank);
    };

    const handleDelete = (id) => {
      deleteProduct(id);
      setDelConfirm(null);
      showToast("Product deleted.", "error");
    };

    const filtered = products.filter(p =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      (p.category||"").toLowerCase().includes(search.toLowerCase())
    );

    const salePrice = (price, pct) => price - (price * pct / 100);

    return (
      <div className="ad-tab-content">
        <div className="ad-section-head">
          <div>
            <p className="ad-eyebrow">Catalog</p>
            <h2 className="ad-section-title">Products <span className="ad-count">{products.length}</span></h2>
          </div>
          <button className="ad-btn-primary" onClick={openAdd}>+ Add Product</button>
        </div>

        {/* Add/Edit Form */}
        {showForm && (
          <div className="ad-form-card">
            <h3 className="ad-form-title">{editMode ? "✏️ Edit Product" : "➕ New Product"}</h3>
            {formError && <div className="ad-form-error">{formError}</div>}
            <form onSubmit={submit} className="ad-form-grid">
              <div className="ad-field span-2">
                <label className="ad-label">Product Title *</label>
                <input name="title" value={form.title} onChange={handle} placeholder="e.g. Nike Air Max" className="ad-input" />
              </div>
              <div className="ad-field">
                <label className="ad-label">Category</label>
                <input name="category" value={form.category} onChange={handle} placeholder="e.g. Footwear" className="ad-input" />
              </div>
              <div className="ad-field">
                <label className="ad-label">Price (Rs.) *</label>
                <input name="price" type="number" value={form.price} onChange={handle} placeholder="2500" className="ad-input" min="1" />
              </div>
              <div className="ad-field">
                <label className="ad-label">Stock Quantity</label>
                <input name="stock" type="number" value={form.stock} onChange={handle} placeholder="50" className="ad-input" min="0" />
              </div>
              <div className="ad-field">
                <label className="ad-label">🏷️ Sale Discount %</label>
                <input name="salePercent" type="number" value={form.salePercent} onChange={handle} placeholder="0 = no sale, 20 = 20% off" className="ad-input" min="0" max="90" />
              </div>
              <div className="ad-field span-2">
                <label className="ad-label">Description *</label>
                <textarea name="description" value={form.description} onChange={handle} placeholder="Product description..." className="ad-input ad-textarea" rows={3}></textarea>
              </div>
              <div className="ad-field span-2">
                <label className="ad-label">Image URL</label>
                <input name="image" value={form.image} onChange={handle} placeholder="https://..." className="ad-input" />
              </div>
              {form.image && (
                <div className="ad-img-preview span-2">
                  <img src={form.image} alt="Preview" onError={e => e.target.style.display="none"} />
                </div>
              )}
              {form.salePercent > 0 && form.price > 0 && (
                <div className="ad-sale-preview span-2">
                  🏷️ Sale Price: <strong>Rs. {salePrice(Number(form.price), Number(form.salePercent)).toLocaleString()}</strong>
                  <span className="ad-orig-price"> (was Rs. {Number(form.price).toLocaleString()})</span>
                  &nbsp;— {form.salePercent}% off
                </div>
              )}
              <div className="ad-form-actions span-2">
                <button type="button" className="ad-btn-ghost" onClick={() => { setShowForm(false); setForm(blank); }}>Cancel</button>
                <button type="submit" className="ad-btn-primary">{editMode ? "Save Changes" : "Add Product →"}</button>
              </div>
            </form>
          </div>
        )}

        {/* Search */}
        <div className="ad-search-bar">
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search products by name or category..."
            className="ad-search-input"
          />
        </div>

        {/* Table */}
        <div className="ad-card">
          {filtered.length === 0
            ? <div className="ad-empty">No products found</div>
            : (
              <div className="ad-table-wrap">
                <table className="ad-table">
                  <thead><tr>
                    <th>Product</th><th>Category</th><th>Price</th>
                    <th>Sale</th><th>Stock</th><th>Actions</th>
                  </tr></thead>
                  <tbody>
                    {filtered.map((p, i) => {
                      const pid = p._id || p.id;
                      const hasSale = p.salePercent > 0;
                      return (
                        <tr key={i}>
                          <td>
                            <div className="ad-prod-cell">
                              <img src={p.image} alt={p.title} className="ad-prod-thumb" onError={e => e.target.src="https://via.placeholder.com/40"} />
                              <div>
                                <p className="ad-prod-name">{p.title}</p>
                                <p className="ad-prod-desc">{(p.description||"").slice(0,45)}…</p>
                              </div>
                            </div>
                          </td>
                          <td><span className="ad-tag">{p.category||"General"}</span></td>
                          <td>
                            {hasSale
                              ? <><span className="ad-sale-price">Rs. {salePrice(p.price, p.salePercent).toLocaleString()}</span><br/><span className="ad-strike">Rs. {p.price.toLocaleString()}</span></>
                              : <span className="ad-gold">Rs. {(p.price||0).toLocaleString()}</span>
                            }
                          </td>
                          <td>
                            {hasSale
                              ? <span className="ad-sale-badge">{p.salePercent}% OFF</span>
                              : <span className="ad-muted">—</span>
                            }
                          </td>
                          <td>
                            {p.stock != null
                              ? <span className={p.stock < 5 ? "ad-stock-low" : "ad-stock-ok"}>{p.stock}</span>
                              : <span className="ad-muted">N/A</span>
                            }
                          </td>
                          <td>
                            <div className="ad-row-actions">
                              <button className="ad-edit-btn" onClick={() => openEdit(p)}>Edit</button>
                              {delConfirm === pid
                                ? <>
                                    <button className="ad-del-confirm" onClick={() => handleDelete(pid)}>Delete</button>
                                    <button className="ad-del-cancel"  onClick={() => setDelConfirm(null)}>No</button>
                                  </>
                                : <button className="ad-del-btn" onClick={() => setDelConfirm(pid)}>Delete</button>
                              }
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )
          }
        </div>
      </div>
    );
  };

  // ── Orders Tab ────────────────────────────────────────────────────────────
  const OrdersTab = () => {
    const [localOrders, setLocalOrders] = useState(getOrders());
    const [search, setSearch]           = useState("");
    const [filter, setFilter]           = useState("All");

    const updateStatus = (orderId, status) => {
      const updated = localOrders.map(o => o.id === orderId ? { ...o, status } : o);
      setLocalOrders(updated);
      saveOrders(updated);
      setOrders(updated);
      showToast(`Order updated to ${status}`);
    };

    const filtered = localOrders
      .filter(o => filter === "All" || o.status === filter)
      .filter(o =>
        (o.id||"").toLowerCase().includes(search.toLowerCase()) ||
        (o.user||o.userName||"").toLowerCase().includes(search.toLowerCase())
      )
      .slice().reverse();

    return (
      <div className="ad-tab-content">
        <div className="ad-section-head">
          <div>
            <p className="ad-eyebrow">Orders</p>
            <h2 className="ad-section-title">All Orders <span className="ad-count">{localOrders.length}</span></h2>
          </div>
        </div>

        <div className="ad-filters-row">
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by order ID or customer..." className="ad-search-input" style={{ flex:1 }} />
          <div className="ad-filter-tabs">
            {["All","Pending","Processing","Shipped","Delivered","Cancelled"].map(s => (
              <button key={s} className={`ad-filter-tab ${filter===s?"active":""}`} onClick={() => setFilter(s)}>{s}</button>
            ))}
          </div>
        </div>

        <div className="ad-card">
          {filtered.length === 0
            ? <div className="ad-empty">No orders found</div>
            : (
              <div className="ad-table-wrap">
                <table className="ad-table">
                  <thead><tr>
                    <th>Order ID</th><th>Customer</th><th>Items</th>
                    <th>Total</th><th>Payment</th><th>Status</th><th>Date</th><th>Update</th>
                  </tr></thead>
                  <tbody>
                    {filtered.map((o,i) => (
                      <tr key={i}>
                        <td className="ad-mono">{o.id}</td>
                        <td>
                          <p className="ad-prod-name">{o.user||o.userName}</p>
                          <p className="ad-muted" style={{ fontSize:"0.75rem" }}>{o.email}</p>
                        </td>
                        <td className="ad-muted">{(o.items||[]).length} item(s)</td>
                        <td className="ad-gold">Rs. {(o.totalPrice||0).toLocaleString()}</td>
                        <td><span className="ad-tag">{o.paymentMethod||"COD"}</span></td>
                        <td><StatusBadge status={o.status} /></td>
                        <td className="ad-muted">{o.date||new Date(o.timestamp||Date.now()).toLocaleDateString()}</td>
                        <td>
                          <select
                            className="ad-status-select"
                            value={o.status}
                            onChange={e => updateStatus(o.id, e.target.value)}
                          >
                            {["Pending","Processing","Shipped","Delivered","Cancelled"].map(s => (
                              <option key={s} value={s}>{s}</option>
                            ))}
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          }
        </div>
      </div>
    );
  };

  // ── Users Tab ─────────────────────────────────────────────────────────────
  const UsersTab = () => {
    const [localUsers,  setLocalUsers]  = useState(getUsers());
    const [delConfirm,  setDelConfirm]  = useState(null);
    const [search,      setSearch]      = useState("");

    const handleDelete = (userId) => {
      const updated = localUsers.filter(u => u.id !== userId);
      setLocalUsers(updated);
      saveUsers(updated);
      setUsers(updated);
      setDelConfirm(null);
      showToast("User deleted.", "error");
    };

    const filtered = localUsers.filter(u =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
    );

    return (
      <div className="ad-tab-content">
        <div className="ad-section-head">
          <div>
            <p className="ad-eyebrow">Users</p>
            <h2 className="ad-section-title">All Users <span className="ad-count">{localUsers.length}</span></h2>
          </div>
        </div>

        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search users by name or email..." className="ad-search-input" style={{ marginBottom:"1.25rem", width:"100%", maxWidth:"400px" }} />

        <div className="ad-card">
          {filtered.length === 0
            ? <div className="ad-empty">No users found</div>
            : (
              <div className="ad-table-wrap">
                <table className="ad-table">
                  <thead><tr>
                    <th>Name</th><th>Email</th><th>Role</th><th>Joined</th><th>Action</th>
                  </tr></thead>
                  <tbody>
                    {filtered.map((u, i) => (
                      <tr key={i}>
                        <td>
                          <div className="ad-user-cell">
                            <div className="ad-user-avatar">{u.name.charAt(0).toUpperCase()}</div>
                            <span className="ad-prod-name">{u.name}</span>
                          </div>
                        </td>
                        <td className="ad-muted">{u.email}</td>
                        <td>
                          {u.isAdmin
                            ? <span className="ad-role-admin">Admin</span>
                            : <span className="ad-role-user">Customer</span>
                          }
                        </td>
                        <td className="ad-muted">{u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "N/A"}</td>
                        <td>
                          {u.isAdmin
                            ? <span className="ad-muted" style={{ fontSize:"0.75rem" }}>Protected</span>
                            : delConfirm === u.id
                              ? <>
                                  <button className="ad-del-confirm" onClick={() => handleDelete(u.id)}>Delete</button>
                                  <button className="ad-del-cancel" onClick={() => setDelConfirm(null)} style={{ marginLeft:"6px" }}>No</button>
                                </>
                              : <button className="ad-del-btn" onClick={() => setDelConfirm(u.id)}>Delete</button>
                          }
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          }
        </div>
      </div>
    );
  };

  // ── Sales Tab ─────────────────────────────────────────────────────────────
  const SalesTab = () => {
    const confirmed  = orders.filter(o => o.status !== "Cancelled");
    const cancelled  = orders.filter(o => o.status === "Cancelled");
    const delivered  = orders.filter(o => o.status === "Delivered");
    const pending    = orders.filter(o => o.status === "Pending");
    const revenue    = confirmed.reduce((s,o) => s + (o.totalPrice||0), 0);
    const avgOrder   = confirmed.length ? Math.round(revenue / confirmed.length) : 0;

    // Product sales frequency
    const productSales = {};
    orders.forEach(o => {
      (o.items||[]).forEach(item => {
        const name = item.title;
        productSales[name] = (productSales[name] || 0) + (item.quantity||1);
      });
    });
    const topProducts = Object.entries(productSales)
      .sort((a,b) => b[1]-a[1])
      .slice(0, 5);

    return (
      <div className="ad-tab-content">
        <div className="ad-section-head">
          <div>
            <p className="ad-eyebrow">Analytics</p>
            <h2 className="ad-section-title">Sales & Revenue</h2>
          </div>
        </div>

        <div className="ad-stats-grid">
          {[
            { icon:"💰", label:"Total Revenue",   value:`Rs. ${revenue.toLocaleString()}`,      sub:"Confirmed orders only"     },
            { icon:"📦", label:"Orders Placed",   value: orders.length,                          sub:"All time"                  },
            { icon:"⏳", label:"Pending",         value: pending.length,                         sub:"Awaiting fulfillment"      },
            { icon:"🚫", label:"Cancelled",       value: cancelled.length,                       sub:"Cancelled orders"          },
            { icon:"✅", label:"Delivered",        value: delivered.length,                       sub:`${orders.length ? Math.round(delivered.length/orders.length*100) : 0}% of orders` },
            { icon:"📊", label:"Avg Order Value",  value:`Rs. ${avgOrder.toLocaleString()}`,      sub:"Per confirmed order"       },
          ].map((s,i) => (
            <div className="ad-stat-card" key={i} style={{ animationDelay:`${i*0.08}s` }}>
              <div className="ad-stat-icon">{s.icon}</div>
              <div className="ad-stat-value">{s.value}</div>
              <div className="ad-stat-label">{s.label}</div>
              <div className="ad-stat-sub">{s.sub}</div>
            </div>
          ))}
        </div>

        {/* Order Status Breakdown */}
        <div className="ad-sales-grid">
          <div className="ad-card">
            <h3 className="ad-card-title" style={{ marginBottom:"1.25rem" }}>Order Status Breakdown</h3>
            {["Pending","Processing","Shipped","Delivered","Cancelled"].map(status => {
              const count = orders.filter(o => o.status === status).length;
              const pct   = orders.length ? Math.round(count / orders.length * 100) : 0;
              return (
                <div className="ad-bar-row" key={status}>
                  <div className="ad-bar-label">
                    <StatusBadge status={status} />
                    <span className="ad-muted" style={{ fontSize:"0.8rem" }}>{count} orders</span>
                  </div>
                  <div className="ad-bar-track">
                    <div className="ad-bar-fill" style={{ width:`${pct}%`, background: STATUS_COLORS[status]?.color || "#e8c97e" }}></div>
                  </div>
                  <span className="ad-bar-pct">{pct}%</span>
                </div>
              );
            })}
          </div>

          {/* Top Products */}
          <div className="ad-card">
            <h3 className="ad-card-title" style={{ marginBottom:"1.25rem" }}>Top Selling Products</h3>
            {topProducts.length === 0
              ? <div className="ad-empty">No sales data yet</div>
              : topProducts.map(([name, qty], i) => (
                <div className="ad-top-row" key={i}>
                  <span className="ad-top-rank">#{i+1}</span>
                  <span className="ad-top-name">{name}</span>
                  <span className="ad-top-qty">{qty} sold</span>
                </div>
              ))
            }
          </div>
        </div>

        {/* Full orders revenue table */}
        <div className="ad-card" style={{ marginTop:"1.25rem" }}>
          <h3 className="ad-card-title" style={{ marginBottom:"1rem" }}>Revenue by Order</h3>
          <div className="ad-table-wrap">
            <table className="ad-table">
              <thead><tr>
                <th>Order ID</th><th>Customer</th><th>Items</th><th>Revenue</th><th>Status</th><th>Date</th>
              </tr></thead>
              <tbody>
                {[...orders].reverse().map((o,i) => (
                  <tr key={i}>
                    <td className="ad-mono">{o.id}</td>
                    <td>{o.user||o.userName}</td>
                    <td className="ad-muted">{(o.items||[]).length}</td>
                    <td className={o.status==="Cancelled" ? "ad-cancelled-amt" : "ad-gold"}>
                      {o.status==="Cancelled" ? "—" : `Rs. ${(o.totalPrice||0).toLocaleString()}`}
                    </td>
                    <td><StatusBadge status={o.status} /></td>
                    <td className="ad-muted">{o.date||new Date(o.timestamp||Date.now()).toLocaleDateString()}</td>
                  </tr>
                ))}
                {orders.length === 0 && <tr><td colSpan={6} className="ad-empty-row">No orders yet</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  // ── Shared: StatusBadge ───────────────────────────────────────────────────
  const StatusBadge = ({ status }) => {
    const s = STATUS_COLORS[status] || { bg:"rgba(255,255,255,0.08)", color:"rgba(255,255,255,0.5)" };
    return (
      <span className="ad-status-badge" style={{ background: s.bg, color: s.color, border:`1px solid ${s.color}33` }}>
        {status}
      </span>
    );
  };

  const TABS = { overview: <OverviewTab />, products: <ProductsTab />, orders: <OrdersTab />, users: <UsersTab />, sales: <SalesTab /> };

  // ── RENDER ────────────────────────────────────────────────────────────────
  return (
    <div className="ad-shell">
      {/* Sidebar */}
      <aside className={`ad-sidebar ${sideOpen ? "open" : ""}`}>
        <div className="ad-sidebar-top">
          <div className="ad-sidebar-brand">
            <span className="ad-sb-icon">◈</span>
            <span className="ad-sb-name">Hassan<span>Store</span></span>
          </div>
          <div className="ad-sidebar-user">
            <div className="ad-su-avatar">{user?.name?.charAt(0).toUpperCase()}</div>
            <div className="ad-su-info">
              <p className="ad-su-name">{user?.name}</p>
              <p className="ad-su-role">Administrator</p>
            </div>
          </div>
          <nav className="ad-nav">
            {NAV.map(n => (
              <button
                key={n.id}
                className={`ad-nav-item ${tab === n.id ? "active" : ""}`}
                onClick={() => { setTab(n.id); setSideOpen(false); }}
              >
                <span className="ad-nav-icon">{n.icon}</span>
                <span className="ad-nav-label">{n.label}</span>
                {n.id === "orders" && orders.filter(o=>o.status==="Pending").length > 0 && (
                  <span className="ad-nav-badge">{orders.filter(o=>o.status==="Pending").length}</span>
                )}
              </button>
            ))}
          </nav>
        </div>
        <div className="ad-sidebar-bottom">
          <button className="ad-nav-item" onClick={() => navigate("/products")}>
            <span className="ad-nav-icon">◷</span>
            <span className="ad-nav-label">View Store</span>
          </button>
          <button className="ad-nav-item logout" onClick={handleLogout}>
            <span className="ad-nav-icon">⊗</span>
            <span className="ad-nav-label">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="ad-main">
        <header className="ad-topbar">
          <button className="ad-hamburger" onClick={() => setSideOpen(!sideOpen)}>
            <span></span><span></span><span></span>
          </button>
          <div className="ad-topbar-title">
            {NAV.find(n => n.id === tab)?.label || "Dashboard"}
          </div>
          <div className="ad-topbar-right">
            <span className="ad-topbar-user">{user?.name}</span>
            <button className="ad-topbar-logout" onClick={handleLogout}>Logout</button>
          </div>
        </header>

        <div className="ad-body">
          {TABS[tab]}
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className={`ad-toast ${toast.type}`}>
          {toast.type === "success" ? "✓" : "✕"} {toast.msg}
        </div>
      )}

      {/* Mobile overlay */}
      {sideOpen && <div className="ad-overlay" onClick={() => setSideOpen(false)}></div>}
    </div>
  );
};

export default AdminDashboard;