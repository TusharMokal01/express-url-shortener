# 🔗 URL Shortener API

A secure and scalable **Express.js** backend providing **JWT-based authentication** and a full-featured **URL shortening service**, powered by:

* 🐘 PostgreSQL (Docker)
* 🧬 Drizzle ORM
* 🔐 JSON Web Tokens (JWT)
* 🛡 Zod validation
* 🔑 Secure password hashing (HMAC SHA256 + salt)

---

# 📌 Features

* ✅ User Registration
* ✅ User Login (JWT Authentication)
* ✅ URL Shortening
* ✅ URL Redirection
* ✅ Fetch Authenticated User URLs
* ✅ Delete User URLs
* ✅ Protected Routes
* ✅ Clean Layered Architecture

---

# 🚀 Tech Stack

* Node.js
* Express.js
* PostgreSQL
* Drizzle ORM
* JWT
* Zod
* Docker

---

# 🧱 Project Structure

```bash
url-shortener/
│
├── db/
│   └── db.js                     # Drizzle + PostgreSQL connection
│
├── models/
│   ├── index.js                  # Exports all schemas
│   ├── user.schema.js            # Users table schema
│   └── url.schema.js             # URLs table schema
│
├── src/
│   ├── controllers/
│   │   ├── user.controller.js
│   │   └── url.controller.js
│   │
│   ├── middlewares/
│   │   ├── authenticateUser.js
│   │   ├── isAuthenticated.js
│   │   └── errorHandler.js
│   │
│   ├── routes/
│   │   ├── user.routes.js
│   │   └── url.routes.js
│   │
│   ├── services/
│   │   ├── user.service.js
│   │   └── url.service.js
│   │
│   ├── utils/
│   │   ├── hashPassword.js
│   │   ├── token.js
│   │   └── nanoid.js
│   │
│   ├── validations/
│   │   ├── user.schema.js        # Zod validation schemas
│   │   └── url.schema.js
│   │
│   ├── app.js                    # Express configuration
│   └── server.js                 # Server bootstrap
│
├── drizzle.config.js             # Drizzle CLI configuration
├── .env                          # Environment variables
├── docker-compose.yml
├── package.json
└── README.md
```

---

# ⚙️ Environment Variables

Create a `.env` file in the root directory:

```env
PORT=8000
DATABASE_URL=postgresql://postgres:password@localhost:5432/url_shortener
JWT_SECRET=your_jwt_secret_key
```

---

# 🐳 Database Setup (Docker)

Start PostgreSQL using Docker:

```bash
docker-compose up -d
```

Ensure your `docker-compose.yml` contains:

```yaml
services:
  postgres:
    image: postgres:17.4
    ports:
      - "5432:5432"
    volumes:
      - db_data:/var/lib/postgresql/data

volumes:
  db_data:
```

---

# 🔐 Authentication

Authentication is handled using **JWT**.

## Global Middleware: `authenticateUser`

* Reads `Authorization` header
* Requires format:

```
Authorization: Bearer <token>
```

* Verifies token using `jwt.verify`
* Attaches decoded payload to `req.user`
* If header is missing → request continues without authentication

### Errors

* `400` → Invalid Authorization header format
* `500` → Internal Server Error

---

## `isAuthenticated`

* Ensures `req.user` exists
* Returns `401` if user is not logged in

---

# 🧪 Test Route

## GET `/test-route`

```json
{
  "Status": "Ok",
  "Message": "App is up and running."
}
```

---

# 👤 User Routes

## POST `/user/signup`

Registers a new user.

### Body

```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

### Responses

* `400` → Validation error
* `409` → User already exists
* `200` → User created successfully

---

## POST `/user/login`

Authenticates user and returns JWT.

### Body

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

### Response

```json
{
  "token": "jwt_token_here"
}
```

---

# 🔗 URL Routes

> `urlRouter` is mounted at root level and must be registered after other routes.

---

## POST `/shorten`

Requires authentication.

### Body

```json
{
  "url": "https://example.com",
  "code": "custom123"   // optional
}
```

If `code` is not provided, an 8-character ID is generated using `nanoid`.

### Response

```json
{
  "urlId": "uuid",
  "shortCode": "abc123xy",
  "targetUrl": "https://example.com"
}
```

---

## GET `/urls`

Returns all URLs created by authenticated user.

---

## DELETE `/delete/:urlId`

Deletes URL only if it belongs to authenticated user.

---

## GET `/:shortCode`

Redirects to original URL.

* `404` → Invalid short code
* `302` → Redirect to target URL

> ⚠️ This route must be placed last in the routing stack.

---

# 🗄️ Database Schema

## `users` Table

* `id` (UUID, Primary Key)
* `firstName`
* `lastName`
* `email` (Unique)
* `role` (`ADMIN`, `MODERATOR`, `USER`)
* `password`
* `salt`
* `createdAt`
* `updatedAt`

---

## `urls` Table

* `id` (UUID, Primary Key)
* `shortCode` (Unique)
* `targetUrl`
* `userId` (Foreign Key → users.id)
* `createdAt`
* `updatedAt`

---

# 🔐 Password Security

Passwords are secured using:

* `crypto.createHmac("sha256", salt)`
* `randomBytes(16)` for unique salt generation

Both salt and hashed password are stored in the database.

---

# 🔄 URL Shortening Flow

1. User signs up
2. User logs in
3. Server returns JWT
4. Client sends:

```
Authorization: Bearer <token>
```

5. Authenticated user creates short URL
6. Short code is stored with user ID
7. Visiting `/<shortCode>` redirects to original URL
8. Users can list and delete only their own URLs

---

# ▶️ Running the Project

### 1️⃣ Install dependencies

```bash
npm install
```

### 2️⃣ Start PostgreSQL

```bash
docker-compose up -d
```

### 3️⃣ Run migrations (if using Drizzle CLI)

```bash
npx drizzle-kit push
```

### 4️⃣ Start server

```bash
npm run dev
```

Server runs on:

```
http://localhost:8000
```

---

# 📌 Summary

This project demonstrates:

* 🔐 Secure JWT authentication
* 🛡 Layered architecture (Controllers → Services → DB)
* 🧬 Drizzle ORM integration
* 🧪 Zod validation
* 🐳 Dockerized PostgreSQL
* 🔗 Secure user-specific URL shortening

---
