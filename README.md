# DS Mart - Mini
A full-featured e-commerce application built with React, Vite, Firebase, and Tailwind CSS. Features include user authentication, product browsing, shopping cart, wishlist, order tracking, reviews, and an admin panel for product management.

## 🚀 Features

### Core Features
- **User Authentication** - Email/Password & Google Sign-In via Firebase
- **Product Catalog** - Browse products with search functionality
- **Shopping Cart** - Add/remove items, adjust quantities, persistent storage
- **Wishlist** - Save favorite items for later
- **Checkout** - Address entry, phone number, payment method selection
- **Order Management** - View order history, track deliveries with timeline, cancel orders
- **Order Tracking** - Detailed delivery timeline with status updates (Confirmed → Shipped → Delivered)

### Advanced Features
- **Ratings & Reviews** - Write product reviews with 1-5 star ratings, prevent duplicate reviews per user
- **Product Sharing** - Share via Web Share API or WhatsApp direct link
- **Admin Panel** - Create, edit, and delete products with localStorage persistence
- **Responsive Design** - Mobile-first layout with bottom navigation on mobile, header on desktop
- **Real-Time Updates** - Cart badge count, wishlist indicators, review display
- **Multiple Payment Methods** - Cash on Delivery (COD) and UPI payment options

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19.2.0, Vite 7.2.4 |
| **Styling** | Tailwind CSS 4 with @tailwindcss/postcss@4.1.17 |
| **State Management** | Zustand (5 stores with localStorage persistence) |
| **Authentication** | Firebase Auth (Email, Google OAuth) |
| **Database** | Firebase Firestore (configured, ready to use) |
| **Storage** | Firebase Storage (for product images) |
| **UI Components** | React Icons (Feather icons), Swiper carousel |
| **Utilities** | dayjs (date formatting), axios (optional), react-hook-form (optional) |
| **Routing** | React Router DOM v6 |

## 📁 Project Structure

```
src/
├── pages/
│   ├── Home.jsx              # Homepage with banner slider & featured products
│   ├── ProductList.jsx       # Product listing with grid layout
│   ├── ProductDetails.jsx    # Single product view with reviews & sharing
│   ├── Wishlist.jsx          # Wishlist items display
│   ├── Checkout.jsx          # Checkout form (address, payment method)
│   ├── Orders.jsx            # Order history list
│   ├── OrderTracking.jsx     # Order detail with delivery timeline
│   ├── Login.jsx             # Email/password & Google sign-in
│   ├── Register.jsx          # User registration
│   ├── AdminProducts.jsx     # Admin: Product list with edit/delete
│   ├── AdminAddProduct.jsx   # Admin: Add new product form
│   └── AdminEditProduct.jsx  # Admin: Edit existing product
├── components/
│   ├── Header.jsx            # Top navigation with search & cart
│   ├── BottomNav.jsx         # Mobile bottom navigation bar
│   ├── CartDrawer.jsx        # Side drawer for shopping cart
│   ├── ReviewSection.jsx     # Review form & display component
│   └── ProtectedRoute.jsx    # Authentication guard for routes
├── store/
│   ├── cartStore.js          # Cart state (add, remove, update qty)
│   ├── wishlistStore.js      # Wishlist state (add, remove, check)
│   ├── orderStore.js         # Orders state with timeline (persist)
│   ├── reviewStore.js        # Reviews state with duplicate check (persist)
│   └── productStore.js       # Product management for admin (persist)
├── App.jsx                   # Main app with routing
├── App.css                   # Component styles
├── index.css                 # Base CSS + Tailwind directives
├── firebase.js               # Firebase configuration
└── main.jsx                  # App entry point

public/                        # Static assets

tailwind.config.cjs            # Tailwind CSS config
postcss.config.cjs             # PostCSS config
vite.config.js                 # Vite config
.env                           # Firebase credentials (create from .env.example)
```

## 📦 Installation

### Prerequisites
- Node.js 18+ and npm

### Steps

1. **Clone the repository**
   ```bash
   git clone <repo-url>
   cd my-ecommerce
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Firebase**
   - Create a Firebase project at [firebase.google.com](https://firebase.google.com)
   - Enable **Authentication** (Email/Password & Google provider)
   - Enable **Firestore Database** (start in test mode)
   - Enable **Storage** (for product images)
   - Copy your Firebase credentials from Project Settings

4. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your Firebase credentials:
   ```
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```
   
   App will open at `http://localhost:5173` (or next available port)

## 🚀 Building & Deployment

### Build for production
```bash
npm run build
```

This creates an optimized `dist/` folder ready for deployment.

### Automatic Deployment to GitHub Pages

This project is configured with GitHub Actions to automatically build and deploy to GitHub Pages on every push to `main`.

**Setup Steps:**

1. **Configure GitHub Repository Settings**
   - Go to Settings → Pages
   - Set Source to "GitHub Actions"
   - Build will trigger automatically on push

2. **Add Firebase Secrets to GitHub**
   - Go to Settings → Secrets and variables → Actions
   - Add each Firebase credential as a secret:
     - `VITE_FIREBASE_API_KEY`
     - `VITE_FIREBASE_AUTH_DOMAIN`
     - `VITE_FIREBASE_PROJECT_ID`
     - `VITE_FIREBASE_STORAGE_BUCKET`
     - `VITE_FIREBASE_MESSAGING_SENDER_ID`
     - `VITE_FIREBASE_APP_ID`
     - `VITE_FIREBASE_MEASUREMENT_ID`

3. **Push to Main Branch**
   ```bash
   git push origin main
   ```

4. **Watch Deployment**
   - Go to Actions tab in GitHub
   - Monitor the "Deploy to GitHub Pages" workflow
   - App will be live at: `https://Dipam03.github.io/crody-react/`

### Manual Deploy Options

**Vercel** (Recommended for alternative)
```bash
npm i -g vercel
vercel
```

**Firebase Hosting**
```bash
npm install -g firebase-tools
firebase login
firebase deploy
```

**Netlify**
```bash
npm i -g netlify-cli
netlify deploy --prod --dir=dist
```

## 📖 Usage Guide

### For Users

1. **Sign Up** - Register with email or Google account (click login link if not logged in)
2. **Browse Products** - Use search bar or browse product list
3. **Add to Cart** - Click "Add to Cart" on product details, adjust quantity
4. **Manage Wishlist** - Click heart icon to save items
5. **Checkout** - Enter address & phone, select payment (COD/UPI), place order
6. **Track Orders** - View delivery timeline and order status
7. **Write Reviews** - Rate and comment on purchased products
8. **Share Products** - Click share button to send via Web Share API or WhatsApp

### For Admins

1. Navigate to `/admin/products` (must be logged in)
2. **Add Product** - Click "Add Product" button, fill form, submit
3. **Edit Product** - Click edit icon on product card, update details
4. **Delete Product** - Click delete icon (red trash icon) to remove product

> **Note**: Products are stored in localStorage. For production, integrate Firestore persistence.

## 🎯 Key Components & Hooks

### Zustand Stores
- **useCartStore** - `addItem(product)`, `removeItem(id)`, `updateQty(id, qty)`, `clear()`, `totalCount` getter
- **useWishlistStore** - `addItem(product)`, `removeItem(id)`, `isWishlisted(id)` check
- **useOrderStore** - `addOrder(order)`, `updateStatus(id, status)`, `cancelOrder(id)`, `getOrder(id)`
- **useReviewStore** - `addReview(review)`, `getProductReviews(productId)`, `hasUserReviewed(productId, userId)`, `getAverageRating(productId)`
- **useProductStore** - `addProduct(product)`, `updateProduct(id, updates)`, `deleteProduct(id)`, `getProduct(id)`, `getAllProducts()`

### Firebase Hooks (react-firebase-hooks)
- `useAuthState(auth)` - Returns `[user, loading, error]`
- `signInWithEmailAndPassword(email, password)`
- `createUserWithEmailAndPassword(email, password)`
- `signInWithPopup(auth, googleProvider)`
- `signOut(auth)`

## 🔧 Configuration

### Color Scheme
The app uses a **crimson red** accent color throughout (bg-red-600, text-red-600, hover:bg-red-700).
To change: Update Tailwind color classes in components and `tailwind.config.cjs`.

### Sample Products
Edit `src/pages/ProductList.jsx` to add/modify sample products, or use the admin panel at `/admin/products`.

## 🐛 Troubleshooting

### Dev Server Not Starting
```bash
# Clear npm cache and reinstall
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Firebase Error: "Firebase app not initialized"
- Check `.env` file has all required keys
- Verify keys are prefixed with `VITE_` (Vite requirement)
- Restart dev server after updating `.env`

### "The requested module ... does not provide an export named 'default'"
- This was a Zustand v4 breaking change. Already fixed in this project.
- If re-importing, use: `import { create } from 'zustand'` (not default import)

### Tailwind CSS not loading
- Ensure `@tailwindcss/postcss@4` is installed: `npm ls @tailwindcss/postcss`
- Check `postcss.config.cjs` has the correct plugin: `'@tailwindcss/postcss': {}`
- Restart dev server

### Cart/Orders/Reviews not persisting
- Check browser localStorage is enabled
- Open DevTools → Application → Local Storage
- Verify keys: `cart`, `orders`, `reviews`, `products`
- Clear localStorage to reset: `localStorage.clear()`

### Google Sign-In not working
- Enable Google provider in Firebase Console → Authentication → Sign-in method
- Verify Google OAuth client ID is correct in Firebase settings
- Add `http://localhost:5173` to authorized redirect URIs (for local testing)

## 📝 Notes

### localStorage vs Firestore
Currently, cart/orders/reviews/products use **localStorage** (device-only). For cloud sync:
1. Enable Firestore rules in Firebase Console
2. Replace localStorage calls in stores with Firestore queries
3. Use `onSnapshot` for real-time updates

### Protected Routes
Routes like `/checkout`, `/orders`, `/wishlist` are not yet enforced to require login.
To protect them, wrap routes in `<ProtectedRoute>` component (already created).

### Admin Access
Currently, any logged-in user can access `/admin/products`. For production:
- Add admin flag to user document in Firestore
- Check this flag in `ProtectedRoute` before allowing access

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/your-feature`
3. Commit changes: `git commit -m 'Add feature'`
4. Push to branch: `git push origin feature/your-feature`
5. Open Pull Request

## 📄 License

This project is open source and available under the MIT License.

## 👨‍💻 Author

DS Mart Team

---

**Ready to deploy?** Make sure `.env` is configured and run `npm run build` to generate production-ready files.
