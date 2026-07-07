# 🛒 E-Commerce Platform

A modern full-stack E-Commerce application built with Next.js, MongoDB, NextAuth, Razorpay, and Cloudinary. The platform provides a seamless shopping experience with secure authentication, online payments, product management, and responsive design.

---

## ✨ Features

### 🔐 Authentication & Authorization
- Secure user authentication with NextAuth
- Login and registration system
- Protected routes
- Session management
- Role-based access control (Admin/User)

### 🛍️ Product Management
- Browse products
- Product details page
- Product categories
- Product search and filtering
- Product image management with Cloudinary

### 🛒 Shopping Experience
- Add to cart
- Update cart quantity
- Remove items from cart
- Persistent shopping cart
- Responsive UI for all devices

### 💳 Payment Integration
- Secure payments using Razorpay
- Order creation and tracking
- Payment verification
- Order confirmation

### 📦 Order Management
- Place orders
- View order history
- Track order status
- Manage customer orders

### ☁️ Cloud Storage
- Cloudinary integration
- Optimized image delivery
- Secure image uploads

### 📱 Responsive Design
- Mobile-first design
- Tablet support
- Desktop optimized
- Modern UI/UX

---

## 🚀 Tech Stack

### Frontend
- Next.js
- React.js
- TypeScript / JavaScript
- Tailwind CSS

### Backend
- Next.js API Routes
- Server Actions

### Database
- MongoDB
- Mongoose

### Authentication
- NextAuth.js

### Payments
- Razorpay

### Media Storage
- Cloudinary

### Deployment
- Vercel

---

## ⚙️ Environment Variables

Create a `.env.local` file in the root directory.

```env
# MongoDB
MONGODB_URI=

# NextAuth
NEXTAUTH_URL=
NEXTAUTH_SECRET=

# Cloudinary
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# Razorpay
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
```

---

## 🔧 Installation

### Clone the Repository

```bash
git clone https://github.com/SangameshwarGaikwad21/E-commerce.git
```

### Navigate to Project Directory

```bash
cd E-commerce
```

### Install Dependencies

```bash
npm install
```

### Configure Environment Variables

Create `.env.local` and add the required credentials.

### Start Development Server

```bash
npm run dev
```

Open:

```bash
http://localhost:3000
```

---

## 📸 Key Functionalities

### User
- Register/Login
- Browse products
- Add items to cart
- Checkout products
- Make secure payments
- View orders

### Admin
- Manage products
- Upload product images
- Manage inventory
- Track customer orders

---

## 🔄 Application Flow

```text
User Login
    │
    ▼
Browse Products
    │
    ▼
Add to Cart
    │
    ▼
Checkout
    │
    ▼
Razorpay Payment
    │
    ▼
Payment Verification
    │
    ▼
Order Created
```

---

## 🌟 Performance Optimizations

- Server-side rendering with Next.js
- Image optimization
- Cloudinary CDN delivery
- Efficient MongoDB queries
- Component reusability
- Lazy loading where applicable

---

## 🔐 Security Features

- Secure authentication using NextAuth
- Protected API routes
- Environment variable protection
- Payment verification
- Session-based authentication
- Input validation

---

## 📈 Learning Outcomes

This project demonstrates practical experience with:

- Full-Stack Development
- Authentication & Authorization
- Payment Gateway Integration
- Database Design
- Cloud Storage Integration
- API Development
- State Management
- Production Deployment

--

## 👨‍💻 Developer

### Sangam Gaikwad

Passionate Full-Stack Developer focused on building scalable web applications using modern technologies.

GitHub: https://github.com/SangameshwarGaikwad21

---

## ⭐ Support

If you found this project helpful, please consider giving it a ⭐ on GitHub.

It helps the project reach more developers and motivates future improvements.

---

## 📄 License

This project is licensed under the MIT License.
