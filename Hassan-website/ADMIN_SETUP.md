# Hassan Store - Admin Setup Guide

## 🔐 Default Admin Credentials

Use these credentials to access the admin dashboard:

```
Email: admin@hassanstore.com
Password: Admin@123
```

### How to Login as Admin

1. Go to `http://localhost:3000/admin`
2. Enter the credentials above
3. Click "Sign In"
4. You'll be redirected to `/admin/dashboard`

---

## 🗄️ MongoDB Connection

### Stable Connection Features

✅ **Retry Logic**: Automatically retries MongoDB connection up to 5 times
✅ **Graceful Fallback**: Works in mock mode if MongoDB is unavailable
✅ **Connection Monitoring**: Detects disconnections and auto-reconnects
✅ **Timeout Handling**: 5-second server selection timeout

### Configuration

The backend automatically attempts to connect to MongoDB using the URI in `.env`:

```
MONGO_URI=mongodb+srv://Hassan:Hassan@hassan.ebqwkxd.mongodb.net/hassanstore?retryWrites=true&w=majority
```

### Connection Status

Check the server startup logs:
```
🚀 Hassan Store API Server Started
📝 Available at http://localhost:5000
🔌 Database Status: ✅ Connected  (or ⚠️  Mock Mode)
```

---

## 🎨 New Admin Dashboard Features

### Modern Design

✨ **Beautiful UI** with gradient backgrounds, smooth animations, and glassmorphism effects
- Modern color scheme (Purple/Blue gradient)
- Responsive grid layout
- Smooth transitions and hover effects
- Professional typography

### Dashboard Sections

#### 1. **Overview Tab** 📊
- Total Products count
- Total Orders count  
- Registered Users count
- Total Revenue (from confirmed orders)
- Recent orders table

#### 2. **Products Tab** 📦
- Add new products
- Edit existing products
- Delete products
- View product inventory
- Sale percentage management

#### 3. **Orders Tab** 📋
- View all customer orders
- Filter by status (Pending, Processing, Shipped, Delivered, Cancelled)
- Update order status
- View order details
- Delete orders if needed

#### 4. **Users Tab** 👥
- View all registered users
- User role display (Admin/User)
- User account creation date
- Contact information

#### 5. **Sales & Revenue Tab** 📈
- Top-selling products graph
- Revenue trends
- Sales performance metrics
- Best performing categories

---

## 🔧 Architecture Changes

### Backend (Node.js/Express)

**File**: `backend/server.js`
```javascript
// MongoDB connection with retry logic
- Retry attempts: 5
- Timeout: 10 seconds between retries
- Connection pooling enabled
- Automatic reconnection on disconnect
```

**File**: `backend/routes/auth.js`
```javascript
// Default admin authentication system
- Email: admin@hassanstore.com
- Password: Admin@123
- Works with or without MongoDB connection
- Generates JWT tokens
```

### Frontend (React)

**File**: `frontend/src/pages/AdminDashboard.css`
```css
- Modern gradient background (0f172a → 0a0e27)
- Sidebar with smooth navigation
- Beautiful stat cards with hover effects
- Responsive grid layout
- Mobile-optimized design
```

**File**: `frontend/src/api.js`
```javascript
// Default admin credentials exposed for testing
- Used when backend is in mock mode
- Fallback for development/testing
```

---

## 🚀 Quick Start

### 1. Start Backend
```bash
cd backend
npm run dev
```

Expected output:
```
🚀 Hassan Store API Server Started
📝 Available at http://localhost:5000
🔌 Database Status: ✅ Connected
```

### 2. Start Frontend
```bash
cd frontend
npm start
```

Frontend opens at `http://localhost:3000`

### 3. Access Admin Dashboard
```
Go to: http://localhost:3000/admin
Email: admin@hassanstore.com
Password: Admin@123
```

---

## 📱 Mobile Responsive

The admin dashboard is fully responsive:
- ✅ Desktop (1024px and above)
- ✅ Tablet (768px - 1023px)
- ✅ Mobile (480px - 767px)
- ✅ Extra small (< 480px)

---

## 🔐 Security Notes

⚠️ **Important**: The default admin credentials are set for development/testing purposes.

For production:
1. Use strong, unique credentials
2. Store passwords in `.env` files (never hardcode)
3. Implement role-based access control (RBAC)
4. Use HTTPS only
5. Add rate limiting to auth endpoints
6. Implement session management

---

## 🐛 Troubleshooting

### MongoDB Not Connecting?
- Check your MongoDB Atlas cluster is active
- Verify credentials in `backend/.env`
- Ensure firewall allows the connection
- Server will start in mock mode automatically

### Admin Login Not Working?
- Use exact credentials: `admin@hassanstore.com` / `Admin@123`
- Clear browser localStorage: `localStorage.clear()`
- Check browser console for errors (F12)

### Dashboard Not Loading?
- Backend must be running on port 5000
- Check `http://localhost:5000` responds
- Refresh browser page
- Clear browser cache

---

## 📊 Sample Data Structure

### Product
```javascript
{
  _id: "507f1f77bcf86cd799439011",
  title: "Product Name",
  description: "Product description",
  price: 999,
  image: "https://...",
  category: "Electronics",
  stock: 50,
  salePercent: 10,
  createdAt: "2026-03-06T12:00:00Z"
}
```

### Order
```javascript
{
  _id: "507f1f77bcf86cd799439012",
  user: "507f1f77bcf86cd799439010",
  userName: "Hassan Ali",
  email: "hassan@example.com",
  items: [...],
  totalPrice: 2999,
  phone: "+92300000000",
  address: "123 Main St",
  paymentMethod: "Cash on Delivery",
  status: "Pending",
  createdAt: "2026-03-06T12:00:00Z"
}
```

### User
```javascript
{
  _id: "507f1f77bcf86cd799439010",
  name: "Hassan Ali",
  email: "hassan@example.com",
  password: "$2a$10$...",  // hashed
  isAdmin: false,
  createdAt: "2026-03-06T12:00:00Z"
}
```

---

## 🎯 Next Steps

1. ✅ Connect to real MongoDB Atlas
2. ✅ Create additional admin accounts with strong passwords
3. ✅ Implement email notifications for orders
4. ✅ Add payment gateway integration
5. ✅ Set up SSL/HTTPS
6. ✅ Deploy to production server

---

**Last Updated**: March 6, 2026
**Version**: 1.0.0
