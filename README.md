# Realtime Product Dashboard – Backend (Node.js + Express + Firebase)

## Overview
This backend powers the **Realtime Product Management Dashboard**, providing:
- Authentication with JWT + HTTP-only cookies
- Product CRUD API
- Firebase Firestore database access
- Secure cookie-based login
- CORS configuration for frontend deployment
- TypeScript codebase with clean structure

---

## Tech Stack
- **Node.js + Express**
- **TypeScript**
- **Firebase Admin SDK**
- **JWT Authentication**
- **HTTP-only cookies**
- **Render.com deployment**

---

## Project Structure
```
backend/
├── src/
│   ├── index.ts
│   ├── routes/
│   │   ├── auth.ts
│   │   ├── products.ts
│   ├── middleware/
│   │   ├── auth.ts
│   ├── config/
│       └── firebase.ts
├── package.json
├── tsconfig.json
└── .gitignore
```

---

## Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/YOUR_USERNAME/realtime-dashboard-backend
cd realtime-dashboard-backend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Create `.env`
```
PORT=4000
JWT_SECRET=your-secret
COOKIE_NAME=token

FIREBASE_PROJECT_ID=your-id
FIREBASE_CLIENT_EMAIL=your-service-account-email
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----
....
-----END PRIVATE KEY-----
"
```

### ⚠️ Important Notes
- Wrap the Firebase private key in **quotes** and ensure `
` newlines stay intact.
- Never commit `.env`.

---

## Development
Run locally using:
```bash
npm run dev
```

Build for production:
```bash
npm run build
```

Start production server:
```bash
npm start
```

---

# API Documentation

All API routes are prefixed with their base path.

---

## AUTH ROUTES – `/auth`

### **POST /auth/login**
Authenticate user and set secure HTTP-only cookie.

#### Request body:
```json
{
  "email": "demo@example.com",
  "password": "password123"
}
```

#### Response:
```json
{
  "email": "demo@example.com"
}
```

---

### **POST /auth/logout**
Clears the authentication cookie.

#### Response:
```json
{ "success": true }
```

---

### **GET /auth/me**
Returns the logged-in user.

#### Response:
```json
{
  "email": "demo@example.com"
}
```

---

## PRODUCT ROUTES – `/products`

Requires authentication.

### **GET /products**
Fetch all products sorted by `createdAt`.

#### Response:
```json
[
  {
    "id": "abc",
    "name": "Item",
    "price": 10,
    "category": "General",
    "status": "active",
    "createdAt": "...",
    "updatedAt": "..."
  }
]
```

---

### **POST /products**
Create product.

#### Request:
```json
{
  "name": "Product A",
  "price": 50,
  "stock": 100,
  "category": "Shoes",
  "status": "active"
}
```

---

### **PUT /products/:id**
Update product fields.

---

### **PATCH /products/:id/status**
Update only status.

#### Request:
```json
{ "status": "inactive" }
```

---

### **DELETE /products/:id**
Deletes product.

---

# Deployment (Render)

### Build Command
```
npm install && npm run build
```

### Start Command
```
npm start
```

### Environment Variables (Render Dashboard)
Add all variables from `.env`.

### CORS Setup
In `index.ts`, ensure:
```ts
cors({
  origin: [
    "http://localhost:3000",
    "https://YOUR_FRONTEND.vercel.app"
  ],
  credentials: true
})
```

---

# Notes for Instructors / Examiners
- Clean architecture with Firestore abstraction.
- Secure cookie-based session authentication.
- No environment secrets committed (verified via `.gitignore`).
- Deployed and running at Render backend URL.

---

# License
MIT – for educational evaluation.
