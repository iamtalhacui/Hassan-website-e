import React, { createContext, useState, useEffect, useContext } from "react";
import { api } from "../api";
import { AuthContext } from "./AuthContext";

export const CartContext = createContext();

const defaultProducts = [
  {
    id: 1,
    title: "Air Runner Pro Sneakers",
    description: "Lightweight performance running shoes with premium foam sole technology. Perfect for gym, jogging, and daily wear.",
    price: 4500,
    salePercent: 15,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=400&fit=crop",
    category: "Footwear",
    stock: 20,
  },
  {
    id: 2,
    title: "Chrono Elite Watch",
    description: "Premium stainless steel chronograph watch, water resistant to 50m. A statement piece for every occasion.",
    price: 12000,
    salePercent: 0,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=400&fit=crop",
    category: "Accessories",
    stock: 10,
  },
  {
    id: 3,
    title: "Urban Anti-Theft Backpack",
    description: "Anti-theft laptop backpack with USB charging port, hidden pockets and built-in rain cover. Fits 15.6\" laptops.",
    price: 3200,
    salePercent: 10,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&h=400&fit=crop",
    category: "Bags",
    stock: 35,
  },
  {
    id: 4,
    title: "ANC Wireless Headphones",
    description: "40-hour battery Active Noise Cancelling headphones with Hi-Fi premium sound. Foldable and travel-ready.",
    price: 8900,
    salePercent: 20,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=400&fit=crop",
    category: "Electronics",
    stock: 15,
  },
  {
    id: 5,
    title: "Men's Slim Fit Polo",
    description: "100% premium cotton slim-fit polo shirt. Breathable and stylish, available in multiple colors for everyday wear.",
    price: 1800,
    salePercent: 0,
    image: "https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?w=500&h=400&fit=crop",
    category: "Clothing",
    stock: 50,
  },
  {
    id: 6,
    title: "Leather Wallet",
    description: "Genuine leather bifold wallet with 8 card slots, RFID blocking technology and a sleek minimalist design.",
    price: 2200,
    salePercent: 0,
    image: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=500&h=400&fit=crop",
    category: "Accessories",
    stock: 30,
  },
  {
    id: 7,
    title: "Wireless Mechanical Keyboard",
    description: "Compact TKL wireless mechanical keyboard with RGB backlight, 2.4GHz & Bluetooth dual connectivity.",
    price: 7500,
    salePercent: 10,
    image: "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=500&h=400&fit=crop",
    category: "Electronics",
    stock: 12,
  },
  {
    id: 8,
    title: "Sports Water Bottle",
    description: "1-litre stainless steel insulated water bottle, keeps drinks cold 24hrs or hot 12hrs. Leak-proof lid.",
    price: 1200,
    salePercent: 0,
    image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500&h=400&fit=crop",
    category: "Sports",
    stock: 60,
  },
  {
    id: 9,
    title: "Aviator Sunglasses",
    description: "Classic UV400 polarized aviator sunglasses with metal frame. Timeless style with full eye protection.",
    price: 2500,
    salePercent: 25,
    image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500&h=400&fit=crop",
    category: "Accessories",
    stock: 25,
  },
  {
    id: 10,
    title: "Jogger Track Pants",
    description: "Comfortable slim-fit jogger pants with elastic waistband and zip pockets. Perfect for gym or casual outings.",
    price: 2800,
    salePercent: 0,
    image: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=500&h=400&fit=crop",
    category: "Clothing",
    stock: 40,
  },
  {
    id: 11,
    title: "Fast Wireless Charger",
    description: "15W Qi wireless charging pad compatible with all Qi-enabled smartphones. LED indicator, non-slip base.",
    price: 1900,
    salePercent: 15,
    image: "https://images.unsplash.com/photo-1591370874773-6702e8f12fd8?w=500&h=400&fit=crop",
    category: "Electronics",
    stock: 45,
  },
  {
    id: 12,
    title: "Leather Crossbody Bag",
    description: "Compact genuine leather crossbody bag with adjustable strap, zip closure and inner organizer pockets.",
    price: 4200,
    salePercent: 5,
    image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500&h=400&fit=crop",
    category: "Bags",
    stock: 18,
  },
];

export const CartProvider = ({ children }) => {
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem("hs_products");
    if (saved) {
      const parsed = JSON.parse(saved);
      // If localStorage has fewer than default, reset with defaults
      return parsed.length >= defaultProducts.length ? parsed : defaultProducts;
    }
    return defaultProducts;
  });

  const { user } = useContext(AuthContext);

  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem("hs_cart");
    return saved ? JSON.parse(saved) : [];
  });

  // Load products from backend (MongoDB) when available
  useEffect(() => {
    const loadFromServer = async () => {
      try {
        const remote = await api.getProducts();
        if (Array.isArray(remote)) {
          setProducts(remote);
        }
      } catch (err) {
        console.warn("Could not load products from server:", err);
      }
    };

    loadFromServer();
  }, []);

  useEffect(() => {
    localStorage.setItem("hs_products", JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem("hs_cart", JSON.stringify(cartItems));
  }, [cartItems]);

  const addProduct = (product) => {
    const newProduct = { ...product, id: Date.now(), salePercent: product.salePercent || 0 };
    setProducts((prev) => [newProduct, ...prev]);

    if (user?.isAdmin) {
      api.addProduct(product)
        .then((created) => {
          if (created && created._id) {
            setProducts((prev) =>
              prev.map((p) => (p.id === newProduct.id ? created : p))
            );
          }
        })
        .catch((err) => console.warn("Failed to save product to backend:", err));
    }

    return newProduct;
  };

  const updateProduct = (id, updatedData) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id || p._id === id ? { ...p, ...updatedData } : p))
    );

    if (user?.isAdmin) {
      api.updateProduct(id, updatedData).catch((err) =>
        console.warn("Failed to update product on backend:", err)
      );
    }
  };

  const deleteProduct = (productId) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId && p._id !== productId));
    setCartItems((prev) => prev.filter((item) => item.id !== productId));

    if (user?.isAdmin) {
      api.deleteProduct(productId).catch((err) =>
        console.warn("Failed to delete product on backend:", err)
      );
    }
  };

  // Effective price considering sale
  const getEffectivePrice = (product) => {
    if (product.salePercent > 0) {
      return Math.round(product.price - (product.price * product.salePercent) / 100);
    }
    return product.price;
  };

  const addToCart = (product) => {
    const effectivePrice = getEffectivePrice(product);
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id || item._id === product._id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, price: effectivePrice, originalPrice: product.price, quantity: 1 }];
    });
  };

  const removeFromCart = (productId) => {
    setCartItems((prev) => prev.filter((item) => item.id !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) { removeFromCart(productId); return; }
    setCartItems((prev) =>
      prev.map((item) => (item.id === productId ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => setCartItems([]);

  const getTotalPrice = () =>
    cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  const getCartCount = () =>
    cartItems.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        products,
        cartItems,
        addProduct,
        updateProduct,
        deleteProduct,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotalPrice,
        getCartCount,
        getEffectivePrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};