# Hassan Store - E-Commerce Website

A modern, fully functional e-commerce website built with **React** and **Context API** for state management.

## 📋 Project Overview

**Hassan Store** is a complete e-commerce solution with user authentication, product management, shopping cart, checkout, and an admin panel. The frontend is built with React while the backend setup is prepared for later implementation.

---

## 🎯 Features Implemented

### ✅ Authentication System
- **Dark Mode**: Toggle in the navbar (🌙/☀️) to switch between light and dark themes.
- **Sign Up Page** (`/signup`)
  - New user registration with email and password
  - Form validation
  - Automatic redirect to Sign In after successful registration
  
- **Sign In Page** (`/signin`)
  - User login with email and password
  - Error handling for invalid credentials
  - **Google Login Option** (mock integration)
  - Automatic redirect to Products page after successful login
  - Admin users will see Admin link when signed in (see Sign Up notes)

### ✅ Home Page (`/`)
- **Brand Details** section with features:
  - Fast Delivery
  - Easy Payment
  - Quality Products
  - Secure Shopping
- **Special Navbar** (only visible for non-logged-in users) with Sign Up/Sign In links
- Personalized welcome message for logged-in users
- Call-to-action buttons

### ✅ Products Page (`/products`)
- **Only accessible after user login**
- Displays all products in a grid layout
- Each product card shows:
  - Product image
  - Title
  - Description
  - Price
  - "Add to Cart" button
- Products are managed from the Admin Panel
- Real-time updates when new products are added

### ✅ Cart Page (`/cart`)
- Display all added items with:
  - Product image and details
  - Quantity controls (increment/decrement/remove)
  - Individual item total price
  - Overall cart total
- **Remove items** from cart
- **Proceed to Checkout** button
- Empty cart message when no items

### ✅ Checkout Page (`/checkout`)
- **Order Summary** showing:
  - All products in order
  - Quantities and prices
  - Total amount
- **Delivery Form** requiring:
  - Name (auto-filled from user data)
  - Email (auto-filled from user data)
  - Phone number
  - Delivery address
- **Payment Method**:
  - Cash on Delivery (COD) only
  - Display total amount to be paid on delivery
- Order confirmation with success message
- Auto-redirect to home after order placement
- Orders saved to localStorage

### ✅ Admin Panel (`/admin`)
- **Add New Products** form with:
  - Product title
  - Description
  - Price
  - Image URL
- **View all products** in a table format
- Successfully added products automatically appear on Products page
- Products persisted in localStorage

### ✅ Navbar Component
- **Dynamic navigation** based on user authentication state
- Show/hide menu items based on login status
- User name display when logged in
- Logout functionality
- Special behavior on home page for non-logged-in users

### ✅ State Management
- **AuthContext**: User authentication, login/logout, Google login
- **CartContext**: Cart operations, product management, totals calculation
- **localStorage**: Data persistence across page refreshes

---

## 🏗️ Project Structure

```
frontend/
├── public/
│   ├── index.html
│   ├── manifest.json
│   └── robots.txt
├── src/
│   ├── components/
│   │   └── Navbar.jsx
│   ├── context/
│   │   ├── AuthContext.jsx
│   │   └── CartContext.jsx
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Products.jsx
│   │   ├── SignUp.jsx
│   │   ├── SignIn.jsx
│   │   ├── Cart.jsx
│   │   ├── Checkout.jsx
│   │   └── Admin.jsx
│   ├── styles/
│   │   ├── Navbar.css
│   │   ├── Auth.css
│   │   ├── Home.css
│   │   ├── Products.css
│   │   ├── Cart.css
│   │   ├── Checkout.css
│   │   └── Admin.css
│   ├── App.js
│   ├── index.js
│   └── index.css
├── package.json
└── README.md

backend/
├── server.js
└── package.json
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Hassan-website
   ```

2. **Install Frontend Dependencies**
   ```bash
   cd frontend
   npm install
   ```

3. **Start the Frontend Development Server**
   ```bash
   npm start
   ```
   The app will open at `http://localhost:3000`

---

## 📱 User Flow

### For New Users:
1. Land on Home page (`/`)
2. See "Get Started" button → Click Sign Up
3. Register with name, email, and password
4. Redirected to Sign In page
5. Sign in with credentials (or use Google Login)
6. Redirected to Products page
7. Browse and add products to cart
8. Go to cart to review items
9. Proceed to checkout
10. Fill delivery details and place order

### For Admins:
1. Navigate to Admin panel (`/admin`)
2. Click "Add New Product"
3. Fill product details (title, description, price, image URL)
4. Submit form
5. Product automatically appears on Products page for all users

---

## 🔐 Authentication Flow

- **User Data Storage**: localStorage (mock backend)
- **Password Validation**: Minimum 6 characters
- **Session Persistence**: User remains logged in after page refresh
- **Logout**: Clears user session from localStorage

---

## 🛒 Cart & Order Management

- **Cart Persistence**: Cart items saved to localStorage
- **Quantity Management**: Increment/decrement quantities easily
- **Price Calculation**: Automatic total price calculation
- **Order Storage**: Orders saved to localStorage with timestamp and status
- **Order Details**: Order ID, user info, items, total, address, payment method

---

## 💳 Payment & Checkout

- **Payment Method**: Cash on Delivery (COD) only
- **Order Confirmation**: Immediate feedback after order placement
- **Delivery Details**: Phone number and address collection
- **Order History**: All orders saved with details and status

---

## 🎨 Styling & UI/UX

- **Responsive Design**: Mobile and desktop optimized
- **Modern Gradient**: Purple gradient (#667eea - #764ba2) theme
- **Card Layout**: Clean card-based design for products and items
- **Consistency**: Unified styling across all pages
- **Accessibility**: Proper form labels and button states

---

## 📦 Key Dependencies

```json
{
  "react": "^19.2.4",
  "react-dom": "^19.2.4",
  "react-router-dom": "^7.13.1"
}
```

---

## 🔄 State Management Architecture

### AuthContext
```javascript
{
  user: { id, name, email, password, isGoogle },
  signup: (name, email, password) => Promise,
  signin: (email, password) => Promise,
  logout: () => void,
  googleLogin: (name, email) => void,
  isLoading: boolean
}
```

### CartContext
```javascript
{
  cartItems: [],
  products: [],
  addToCart: (product) => void,
  removeFromCart: (productId) => void,
  updateQuantity: (productId, quantity) => void,
  clearCart: () => void,
  getTotalPrice: () => number,
  addProduct: (product) => void
}
```

---

## 📌 Test Credentials

To test the application:

1. **Sign Up** with any credentials:
   - Name: Hassan User
   - Email: user@test.com
   - Password: password123

2. **Sign In** with the registered email and password

3. **Try Google Login** (mock that uses default test account)

---

## 🔮 Future Enhancements (Backend)

- Real database integration (MongoDB)
- User authentication with JWT
- Payment gateway integration
- Email notifications
- Order tracking
- Product reviews and ratings
- Wishlist feature
- Product search and filters
- Order history page

---

## 📄 Notes

- **localStorage Limit**: All data is stored client-side. For production, implement a proper backend
- **Images**: Use placeholder images or provide direct image URLs
- **Security**: Current implementation is for demo. Use proper backend authentication in production
- **Validation**: Basic form validation implemented. Add more comprehensive validation as needed

---

## 🎓 Learning Points

This project demonstrates:
- React Hooks (useState, useContext, useEffect)
- Context API for state management
- React Router for navigation
- Form handling and validation
- localStorage for data persistence
- Responsive CSS Grid and Flexbox
- Component composition and reusability

---

## 📞 Support

For issues or questions, please refer to the code comments or create an issue in the repository.

---

**Happy Shopping! 🛍️**
