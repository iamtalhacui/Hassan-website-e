# Quick Start Guide - Hassan Store

## 🚀 Quick Setup (5 minutes)

### Step 1: Start the App
```bash
cd frontend
npm start
```
The app opens automatically at `http://localhost:3000`

---

## 🧪 Quick Testing Scenarios

### Scenario 1: Sign Up & Browse Products ⭐
**Time: 2 minutes**

1. **Land on Home Page**
   - URL: `http://localhost:3000`
   - You'll see brand details and "Get Started" button
   - Special navbar shows "Sign Up" and "Sign In"

2. **Sign Up**
   - Click "Sign Up" on navbar or home button
   - Fill form:
     - Name: `Hassan User`
     - Email: `user@test.com`
     - Password: `password123`
     - *Optional*: Admin code `ADMIN123` to register as an administrator
   - Dark mode toggle appears in navbar once signed in; click 🌙/☀️ to switch theme
   - Click "Register"
   - Auto-redirects to Sign In page

3. **Sign In**
   - Email: `user@test.com`
   - Password: `password123`
   - Click "Sign In"
   - Auto-redirects to Products page ✅

4. **Browse Products**
   - See "Shoes" and "Watch" products
   - Each shows image, title, description, and price
   - Try "Add to Cart" button

---

### Scenario 2: Shopping & Checkout ⭐⭐
**Time: 3 minutes**

1. **Add Multiple Items to Cart**
   - From Products page
   - Click "Add to Cart" on Shoes
   - Alert says "Shoes added to cart!"
   - Add Watch too
   - Click navbar "Cart" link

2. **View Cart**
   - See both items with:
     - Product image
     - Quantity controls (-/+)
     - Individual totals
     - Cart summary on right
   - Try increasing Shoes quantity to 2
   - Total updates automatically
   - Try "Remove" button on Watch

3. **Proceed to Checkout**
   - Click "Proceed to Checkout" button
   - Fills Name & Email automatically
   - Fill:
     - Phone: `0300-1234567`
     - Address: `123 Main St, Lahore`
   - See "Cash on Delivery" selected
   - See total amount (Rs. 4000 for 2 Shoes)
   - Click "Place Order"

4. **Order Confirmation**
   - See success message: "✓ Order Placed Successfully!"
   - Auto-redirects to home in 3 seconds
   - Cart is now empty
   - User is still logged in ✅

---

### Scenario 3: Google Login ⭐
**Time: 1 minute**

1. **Sign Out First**
   - Click navbar "Logout" button

2. **Back to Home**
   - See sign-up navbar again

3. **Google Sign In**
   - Click "Sign In" button
   - Click "Sign In with Google" button
   - Instantly logged in as "Google User"
   - Redirected to Products page ✅

---

### Scenario 4: Admin Add Products ⭐⭐
**Time: 2 minutes**

1. **Go to Admin Panel**
   - Click "Admin" in navbar
   - See "Add New Product" button
   - See table with current 2 products

2. **Add New Product**
   - Click "Add New Product" button
   - Form appears with fields:
     - Title: `T-Shirt`
     - Description: `Comfortable cotton t-shirt`
     - Price: `1000`
     - Image URL: `https://via.placeholder.com/150?text=TShirt`
   - Click "Add Product"
   - Success message appears: "Product added successfully!"
   - Table updates to show 3 products

3. **Verify on Products Page**
   - Click "Products" in navbar
   - See the new T-Shirt product in grid
   - Price shows Rs. 1000
   - "Add to Cart" button works ✅

---

### Scenario 5: Cart Persistence ⭐
**Time: 1 minute**

1. **Add Items to Cart**
   - From Products page
   - Add Shoes (quantity 1)
   - Add Watch (quantity 2)
   - Go to Cart page
   - See 2 items with correct quantities

2. **Refresh Page**
   - Press F5 or Ctrl+R
   - Cart still shows items ✅
   - Quantities preserved

3. **Close Tab & Reopen**
   - Close the tab
   - Reopen app at localhost:3000
   - Click "Sign In" again (need to log in)
   - Sign in with `user@test.com` / `password123`
   - Go to Cart
   - Items still there ✅

---

## ⚡ Quick Features Checklist

- ✅ Sign Up with validation
- ✅ Sign In with credentials check
- ✅ Google Login (mock)
- ✅ Home page with special navbar
- ✅ Products page after login
- ✅ Add to Cart in one click
- ✅ Cart with quantity controls
- ✅ Cart summary & totals
- ✅ Checkout form prefill
- ✅ Cash on Delivery only
- ✅ Order confirmation
- ✅ Admin add products
- ✅ New products appear instantly
- ✅ Data persists on refresh

---

## 🎨 Testing UI Features

### Navbar Changes
- **Before Login**: Shows Home, Sign In, Sign Up
- **After Login**: Shows Home, Products, Cart, Admin, (User Name), Logout
- **On Home Page (not logged in)**: Hidden, shows special navbar instead

### Form Validations
1. **Sign Up**:
   - Missing field → "All fields are required"
   - Password < 6 chars → "Password must be at least 6 characters"

2. **Sign In**:
   - Wrong credentials → "Invalid email or password"
   - Empty fields → "Email and password are required"

3. **Checkout**:
   - Missing phone/address → "Please fill in all details"
   - Can't place order without both fields

### Responsive Design
- **Desktop**: Full layout with sidebar
- **Tablet**: 2-column grid for products
- **Mobile**: 1-column layout, buttons stack

---

## 💾 Data Storage

All data is in **browser localStorage**:

### Check User Data
```javascript
// In browser console (F12 → Console)
JSON.parse(localStorage.getItem('user'))
```

### Check Cart
```javascript
JSON.parse(localStorage.getItem('cart'))
```

### Check Products
```javascript
JSON.parse(localStorage.getItem('products'))
```

### Check Orders
```javascript
JSON.parse(localStorage.getItem('orders'))
```

### Clear Everything
```javascript
localStorage.clear()
// Reload page to start fresh
```

---

## 🎯 Performance Tips

- App loads in < 2 seconds
- Smooth animations on interactions
- Cart updates instantly
- No network delays (all local)
- Image loading fast (placeholders)

---

## 🔍 Debugging in Browser

1. **Open Developer Tools**: F12
2. **Go to Console Tab**
3. **Check localStorage**:
   ```javascript
   console.log(JSON.parse(localStorage.getItem('cart')))
   ```

4. **Test Context values** (in components):
   - Add `console.log({ user, cartItems })`
   - Watch console as you interact

5. **Check Network**: No network requests (all local) ✅

---

## ⚠️ Common Issues & Fixes

### Issue: "Products page shows nothing"
**Solution**: Make sure you're logged in. Products only show after login.

### Issue: "Cart not saving items"
**Solution**: Check browser: F12 → Application → localStorage → cart key

### Issue: "Can't sign in"
**Solution**: Use the email/password you registered with. Or create new account.

### Issue: "Admin panel not showing"
**Solution**: Admin link only shows when logged in. Log in first.

### Issue: "Mobile layout broken"
**Solution**: Products grid should wrap automatically. If not, check CSS file.

---

## 📱 Mobile Testing

### Test on Mobile Browser
1. On Windows: Use phone or Android emulator
2. Go to: `http://[your-computer-ip]:3000`
3. Find IP: `ipconfig` in terminal → IPv4 Address
4. Test all features on mobile screen

### Expected Mobile Behavior
- Navbar items stack or compress
- Products grid: 1 column
- Form fields full width
- Cart items stack vertically
- All buttons remain touchable

---

## 🎓 Code Examples

### Add to Cart Function
```javascript
const { addToCart } = useContext(CartContext);

// In a button onClick
handleAddToCart = () => {
  addToCart(productObject);
}
```

### Get Total Price
```javascript
const { getTotalPrice } = useContext(CartContext);
const total = getTotalPrice(); // Returns number
```

### Check If User Logged In
```javascript
const { user } = useContext(AuthContext);
if (user) {
  // User is logged in, show products
}
```

---

## ✨ Pro Tips

1. **Test with multiple accounts**: Sign up several users, switch between them
2. **Test edge cases**: Empty cart, 0 quantity, negative numbers
3. **Clear localStorage between tests**: `localStorage.clear()`
4. **Check responsive**: Open DevTools (F12) → Toggle device toolbar
5. **Monitor console**: Look for errors while using app

---

## 🚀 Ready to Go!

That's it! Your e-commerce store is fully functional with:
- ✅ User authentication
- ✅ Shopping cart
- ✅ Order checkout
- ✅ Admin panel
- ✅ Responsive design
- ✅ Data persistence

**Enjoy! 🎉**
