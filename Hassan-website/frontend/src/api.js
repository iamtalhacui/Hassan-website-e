const BASE = "http://localhost:5000/api";

const getToken = () => localStorage.getItem("hs_token");

const headers = (auth = false) => {
  const h = { "Content-Type": "application/json" };
  if (auth) h["Authorization"] = `Bearer ${getToken()}`;
  return h;
};

export const api = {
  // ── Auth ────────────────────────────────────────────────────────────────────
  signup: (data) =>
    fetch(`${BASE}/auth/signup`, {
      method: "POST",
      headers: headers(),
      body: JSON.stringify(data),
    }).then((r) => r.json()),

  signin: (data) =>
    fetch(`${BASE}/auth/signin`, {
      method: "POST",
      headers: headers(),
      body: JSON.stringify(data),
    }).then((r) => r.json()),

  // ── Users ───────────────────────────────────────────────────────────────────
  getUsers: () =>
    fetch(`${BASE}/auth/users`, {
      headers: headers(true),
    }).then((r) => r.json()),

  deleteUser: (id) =>
    fetch(`${BASE}/auth/users/${id}`, {
      method: "DELETE",
      headers: headers(true),
    }).then((r) => r.json()),

  // ── Products ────────────────────────────────────────────────────────────────
  getProducts: () =>
    fetch(`${BASE}/products`).then((r) => r.json()),

  addProduct: (data) =>
    fetch(`${BASE}/products`, {
      method: "POST",
      headers: headers(true),
      body: JSON.stringify(data),
    }).then((r) => r.json()),

  updateProduct: (id, data) =>
    fetch(`${BASE}/products/${id}`, {
      method: "PUT",
      headers: headers(true),
      body: JSON.stringify(data),
    }).then((r) => r.json()),

  deleteProduct: (id) =>
    fetch(`${BASE}/products/${id}`, {
      method: "DELETE",
      headers: headers(true),
    }).then((r) => r.json()),

  // ── Orders ──────────────────────────────────────────────────────────────────
  placeOrder: (data) =>
    fetch(`${BASE}/orders`, {
      method: "POST",
      headers: headers(true),
      body: JSON.stringify(data),
    }).then((r) => r.json()),

  getOrders: () =>
    fetch(`${BASE}/orders`, {
      headers: headers(true),
    }).then((r) => r.json()),

  updateOrderStatus: (id, status) =>
    fetch(`${BASE}/orders/${id}`, {
      method: "PUT",
      headers: headers(true),
      body: JSON.stringify({ status }),
    }).then((r) => r.json()),

  deleteOrder: (id) =>
    fetch(`${BASE}/orders/${id}`, {
      method: "DELETE",
      headers: headers(true),
    }).then((r) => r.json()),
};