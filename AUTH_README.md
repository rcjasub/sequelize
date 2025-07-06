# JWT Authentication System

This application now includes a complete JWT (JSON Web Token) authentication system with the following features:

## Features

- **User Registration**: Create new user accounts with username and password
- **User Login**: Authenticate users and receive JWT tokens
- **User Logout**: Clear authentication tokens
- **Protected Routes**: Middleware to protect API endpoints
- **Secure Password Storage**: Passwords are hashed using bcrypt
- **HTTP-Only Cookies**: JWT tokens are stored securely in HTTP-only cookies

## Database Schema

### Users Table

- `id` (Primary Key, Auto-increment)
- `username` (Unique, 3-20 characters)
- `passwordHash` (Bcrypt hashed password)
- `createdAt` (Timestamp)
- `updatedAt` (Timestamp)

## API Endpoints

### Authentication Routes (`/auth`)

#### POST `/auth/signup`

Create a new user account.

**Request Body:**

```json
{
  "username": "newuser",
  "password": "password123"
}
```

**Response:**

```json
{
  "message": "User created successfully",
  "user": {
    "id": 1,
    "username": "newuser"
  }
}
```

#### POST `/auth/login`

Authenticate a user and receive a JWT token.

**Request Body:**

```json
{
  "username": "newuser",
  "password": "password123"
}
```

**Response:**

```json
{
  "message": "Login successful",
  "user": {
    "id": 1,
    "username": "newuser"
  }
}
```

#### POST `/auth/logout`

Clear the authentication token.

**Response:**

```json
{
  "message": "Logout successful"
}
```

#### GET `/auth/me`

Get current user information (requires authentication).

**Response:**

```json
{
  "user": {
    "id": 1,
    "username": "newuser",
    "iat": 1751773336,
    "exp": 1751859736
  }
}
```

## Protected Routes

The `authenticateJWT` middleware can be applied to any route that requires authentication. When applied, it:

1. Extracts the JWT token from the `token` cookie
2. Verifies the token's validity and expiration
3. Adds the decoded user information to `req.user`
4. Returns a 401 error if no token is provided
5. Returns a 403 error if the token is invalid or expired

### Example Usage

```javascript
const { authenticateJWT } = require("./auth");

// Protected route
router.post("/protected-route", authenticateJWT, (req, res) => {
  // req.user contains the authenticated user information
  res.json({ message: "Access granted", user: req.user });
});
```

## Security Features

1. **Password Hashing**: All passwords are hashed using bcrypt with a salt round of 10
2. **HTTP-Only Cookies**: JWT tokens are stored in HTTP-only cookies to prevent XSS attacks
3. **Secure Cookies**: In production, cookies are set with the `secure` flag
4. **SameSite Protection**: Cookies use `strict` SameSite policy
5. **Token Expiration**: JWT tokens expire after 24 hours
6. **Input Validation**: Username length validation (3-20 characters) and password minimum length (6 characters)

## Environment Variables

Set the following environment variable for production:

```
JWT_SECRET=your-super-secret-jwt-key-here
```

If not set, a default secret will be used (not recommended for production).

## Testing the Authentication System

### 1. Create a new user

```bash
curl -X POST http://localhost:8080/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"password123"}' \
  -c cookies.txt
```

### 2. Login

```bash
curl -X POST http://localhost:8080/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"password123"}' \
  -c cookies.txt
```

### 3. Access protected route

```bash
curl -X GET http://localhost:8080/auth/me -b cookies.txt
```

### 4. Use protected API endpoints

```bash
curl -X POST http://localhost:8080/api/ducks \
  -H "Content-Type: application/json" \
  -d '{"name":"New Duck","color":"yellow"}' \
  -b cookies.txt
```

### 5. Logout

```bash
curl -X POST http://localhost:8080/auth/logout -b cookies.txt
```

## Implementation Details

- **User Model**: Located in `database/user.js`
- **Authentication Routes**: Located in `auth/index.js`
- **Middleware**: `authenticateJWT` function exported from `auth/index.js`
- **Database Integration**: User model integrated into `database/index.js`
- **App Configuration**: Cookie parser middleware and auth routes mounted in `app.js`

The authentication system is now fully integrated and ready for use!
