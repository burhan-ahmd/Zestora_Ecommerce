# Zestora Ecommerce

A full-stack ecommerce application built with the MERN stack (MongoDB, Express.js, React, Node.js). Practice project featuring admin and customer roles, product management, shopping cart, and order processing.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Node.js, Express.js, Mongoose, JWT, bcryptjs |
| Frontend | React 19, Vite, React Router 7, Axios |
| Database | MongoDB (Atlas) |
| Styling | Custom CSS Design System |

## Features

- **Authentication** — Register, login, JWT-based sessions (7-day expiry)
- **Role-Based Access** — Admin and customer roles with enforced permissions
- **Product Catalog** — Full CRUD with categories, pricing, stock, ratings, images
- **Category Management** — Active/inactive toggle; inactive categories hide their products
- **Advanced Filtering** — Search, category, price range, rating, sort, pagination (server-side)
- **Shopping Cart** — localStorage-persisted, stock-aware quantity controls
- **Checkout** — Shipping address, payment method (COD/Card), stock validation
- **Order Management** — Status workflow (pending → confirmed → shipped → delivered), auto payment update
- **Admin Dashboard** — Stats cards, recent orders, quick actions
- **Responsive Design** — Mobile-friendly sidebar, hamburger menu, adaptive layouts

## Project Structure

```
ecommerce/
├── backend/
│   ├── config/db.js
│   ├── middleware/authMiddleware.js
│   ├── middleware/roleMiddleware.js
│   ├── models/User.js, Products.js, Category.js, Order.js
│   ├── controllers/auth, product, category, order
│   ├── routes/auth, product, category, order
│   ├── server.js
│   ├── seed.js
│   └── .env
├── frontend/
│   └── src/
│       ├── components/Navbar, Footer, admin/Sidebar
│       ├── context/AuthContext, CartContext
│       ├── layouts/Public, Auth, Dashboard, RoleRoute
│       ├── pages/Home, Products, Cart, Checkout
│       ├── pages/auth/Login, Register
│       ├── pages/admin/Dashboard, category/*, products/*, orders/*
│       ├── utils/api.js, publicApi.js
│       └── App.css (design system)
└── README.md
```

## Getting Started

### Prerequisites
- Node.js v18+
- MongoDB Atlas account (or local MongoDB)

### Backend Setup
```bash
cd backend
npm install

# Create .env file
echo "MONGO_URI=your_mongodb_uri" >> .env
echo "PORT=4000" >> .env
echo "JWT_SECRET=your_secret_key" >> .env

# Seed admin user
npm run seed

# Start server
npm run dev
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`, backend on `http://localhost:4000`.

## Admin Credentials

| Field | Value |
|-------|-------|
| Email | put_yours_in_seed.js_file |
| Password | put_yours_in_seed.js_file |

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | No | Register user |
| POST | `/api/auth/login` | No | Login, returns JWT |
| GET | `/api/categories/public` | No | Active categories |
| POST | `/api/categories` | Admin | Create category |
| PUT | `/api/categories/:id` | Admin | Update category |
| DELETE | `/api/categories/:id` | Admin | Delete category |
| GET | `/api/products` | No | Products (search, filter, paginate) |
| POST | `/api/products` | Admin | Create product |
| PUT | `/api/products/:id` | Admin | Update product |
| DELETE | `/api/products/:id` | Admin | Delete product |
| POST | `/api/orders` | User | Place order |
| GET | `/api/orders/my-orders` | User | My orders |
| GET | `/api/orders` | Admin | All orders |
| PUT | `/api/orders/:id/status` | Admin | Update order status |

## License

MIT
