# URL Shortener

## Overview

This application is built using Express and implements:

- User registration
- User login (JWT-based authentication)
- URL shortening
- URL redirection
- Fetch user-specific URLs
- Delete user-specific URLs
- PostgreSQL database (via docker)
- Drizzle ORM
- Zod request validation

The server runs on:

```

PORT = process.env.PORT ?? 8000

```

---

# Authentication

Authentication is handled using JSON Web Tokens (JWT).

## `authenticateUser` (Global Middleware)

- Reads `Authorization` header.
- Requires format:  
```

Authorization: Bearer <token>

````
- Verifies token using `jwt.verify`.
- Attaches decoded payload to `req.user`.

If no `Authorization` header is provided, the request proceeds without authentication.

Errors:
- `400` → Authorization header must start with `Bearer `
- `500` → Internal Server Error

---

## `isAuthenticated`

- Ensures `req.user` exists.
- Returns:
- `401` → User not logged in

---

# Test Route

## GET `/test-route`

**Response**
```json
{
"Status": "Ok",
"Message": "App is up and running."
}
````

---

# User Routes (`/user`)

## POST `/user/signup`

Controller: `resgisterUser`

* Validates request using Zod schema.
* Checks if user already exists.
* Hashes password using HMAC SHA256 with salt.
* Stores user in database.

**Responses**

* `400` → Validation error
* `409` → User already exists
* `200` → User created successfully

---

## POST `/user/login`

Controller: `userLogin`

* Validates request using Zod schema.
* Verifies email and password.
* Generates JWT token.

**JWT Payload**

* `userId`

**Responses**

* `400` → Validation error
* `404` → User not found
* `401` → Incorrect password
* `201` → Returns access token

---

# URL Routes (Root Level)

> `urlRouter` is mounted at root level and must be loaded after other routes.

---

## POST `/shorten`

Middleware:

* `isAuthenticated`

Controller:

* `shortenTheUserUrl`

**Body**

* `url` (required, valid URL)
* `code` (optional)

If `code` is not provided, an 8-character ID is generated using `nanoid`.

**Response**

* `400` → Validation error
* `201` → Returns:

  * `urlId`
  * `shortCode`
  * `targetUrl`

---

## GET `/urls`

Middleware:

* `isAuthenticated`

Controller:

* `getAllTheUrls`

Returns all URLs belonging to the authenticated user.

**Response**

* `200` → List of URLs

---

## DELETE `/delete/:urlId`

Middleware:

* `isAuthenticated`

Controller:

* `deleteUrlById`

Deletes URL only if:

* `urlId` matches
* `userId` matches authenticated user

**Response**

* `200` → URL deleted successfully

---

## GET `/:shortCode`

Controller:

* `redirectToTargetUrl`

* Looks up URL by `shortCode`.

* Redirects to `targetUrl`.

**Responses**

* `404` → Invalid URL
* Redirect → `302` to original URL

> This dynamic route must be placed last in the route stack.

---

# Database Models

## `usersTable` (users)

Columns:

* `id` (UUID, primary key)
* `firstName`
* `lastName`
* `email` (unique)
* `role` (`ADMIN`, `MODERATOR`, `USER`) — default `USER`
* `password`
* `salt`
* `createdAt`
* `updatedAt`

---

## `urlsTable` (urls)

Columns:

* `id` (UUID, primary key)
* `shortCode` (unique)
* `targetUrl`
* `userId` (references users table)
* `createdAt`
* `updatedAt`

---

# Services

## `checkIfAnExistingUser(email)`

* Returns user by email.

## `createNewUserInDB(data)`

* Inserts new user.
* Returns `userId`.

---

# Utilities

## `hashUserPassword(password)`

* Generates salt using `randomBytes(16)`
* Hashes password using HMAC SHA256
* Returns `{ hashedPassword, salt }`

---

## `verifyUserProviedPassword(password, salt)`

* Hashes provided password using stored salt
* Returns hashed value

---

## `createToken(payload)`

* Generates JWT using `jwt.sign`
* Returns token

---

# Validation Schemas (Zod)

## Signup Schema

* `firstName` (string)
* `lastName` (optional string)
* `email` (valid email)
* `password` (minimum 8 characters)

---

## Login Schema

* `email` (valid email)
* `password` (string)

---

## Shorten URL Schema

* `url` (valid URL)
* `code` (optional string)

---

# URL Shortening Flow

1. User signs up.
2. User logs in.
3. Server returns JWT token.
4. Client sends:

   ```
   Authorization: Bearer <token>
   ```
5. Authenticated user creates short URL.
6. Short code is stored with user ID.
7. Visiting `/<shortCode>` redirects to original URL.
8. Users can list and delete only their own URLs.
