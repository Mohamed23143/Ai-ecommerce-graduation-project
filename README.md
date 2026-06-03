# NASSEG — AI-Powered Luxury E-Commerce

A luxury fashion e-commerce platform with integrated AI chatbot, built with React, TypeScript, and Tailwind CSS.

## Tech Stack

- **Frontend:** React 18, TypeScript, Vite, Tailwind CSS
- **Auth:** Clerk (authentication & user management)
- **AI:** OpenRouter API (`deepseek/deepseek-v4-flash`) via proxy
- **Routing:** React Router v6
- **Icons:** React Icons (Feather, Ionicons)
- **State:** React Context (cart, search)
- **Images:** Local `/products/` and `/catagore/` directories

## Features

### Store
- Product catalog with 20 items across 5 categories (Women, Men, Accessories, Eyewear, Footwear)
- Category pages with local hero images
- Collections, New Arrivals, and Sale pages
- Product detail pages with size/color selection
- Full-screen search overlay
- Shopping cart with drawer

### AI Chat Assistant
- Floating chat widget on homepage
- Real-time streaming responses via OpenRouter
- Markdown rendering, copy-on-hover, retry on error
- Stop-generation, online status indicator
- About modal and keyboard shortcuts

### User System
- Clerk-powered authentication (sign in / register)
- Account dashboard with order history, wishlist, and profile
- Guest checkout available

### Checkout
- 3-step checkout (shipping → delivery → payment)
- Card, cash, and wallet payment options
- Card scanning via OCR (Tesseract.js)
- Promo code support

### Admin Panel
- Full CRUD for products, categories, admin users
- Order management with status updates
- Customer management
- Analytics dashboard with computed metrics
- Protected by admin authentication

## Getting Started

```bash
# Install dependencies
npm install

# Set up environment variables
# Create .env file:
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_key
VITE_OPENROUTER_API_KEY=your_openrouter_key

# Start development server
npm run dev

# Build for production
npm run build

# Lint
npm run lint
```

## Project Structure

```
src/
├── components/       # Reusable UI components
│   └── home/         # Homepage components (chat, categories, etc.)
├── context/          # React contexts (CartContext)
├── data/             # Static data (products)
├── pages/            # Route pages
│   ├── AdminPage.tsx    # Admin panel (dashboard, products, orders, etc.)
│   ├── UserDashboard.tsx # User account dashboard
│   ├── AuthPage.tsx     # Clerk sign in/up page
│   ├── CheckoutPage.tsx # Checkout flow
│   └── ...              # Other pages
└── services/         # API services (OpenRouter AI)
```

## Design

- **Colors:** Cream `#f9f8f5`, Gold `#c4a265`, Dark `#1a1a1a`
- **Fonts:** Playfair Display (serif headings), Inter (sans-serif body)
- **Aesthetic:** Minimal luxury with clean borders, generous whitespace, and gold accents

## Admin Access

Navigate to `/admin` and sign in with credentials stored in localStorage. Default: `admin@nasseg.com` / `admin123`.
