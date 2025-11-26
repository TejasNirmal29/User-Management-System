# Admin Panel Features - Complete Implementation Guide

## ✅ Admin Panel Requirements Checklist

### 1. View All Users (Table Listing) ✅

**Endpoint:** `GET /api/v1/users`

**Features:**

- ✅ View all users in paginated table format
- ✅ Admin authentication required
- ✅ Shows: name, email, phone, role, state, city, created date

**Request:**

```bash
GET /api/v1/users?page=1&limit=10
Authorization: Bearer <admin_access_token>
```

**Response:**

```json
{
  "success": true,
  "message": "Users retrieved successfully",
  "data": {
    "users": [
      {
        "id": "...",
        "name": "John Doe",
        "email": "john@example.com",
        "phone": "1234567890",
        "state": "California",
        "city": "Los Angeles",
        "role": "user",
        "createdAt": "2024-01-15T10:30:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 25,
      "pages": 3
    }
  }
}
```

### 2. Search Users (Name/Email) ✅

**Endpoint:** `GET /api/v1/users?search=john`

**Features:**

- ✅ Search by name (case-insensitive)
- ✅ Search by email (case-insensitive)
- ✅ Real-time search results

**Request:**

```bash
GET /api/v1/users?search=john&page=1&limit=10
Authorization: Bearer <admin_access_token>
```

**Use Cases:**

- Search for "john" → Finds "John Doe", "Johnny", "john@example.com"
- Search for "@gmail" → Finds all Gmail users
- Search for "smith" → Finds "John Smith", "smith@example.com"

### 3. Filter Users (State/City) ✅

**Endpoint:** `GET /api/v1/users?state=California&city=Los Angeles`

**Features:**

- ✅ Filter by state
- ✅ Filter by city
- ✅ Combined filters (state AND city)

**Request:**

```bash
GET /api/v1/users?state=California&city=Los%20Angeles&page=1&limit=10
Authorization: Bearer <admin_access_token>
```

**Filter Combinations:**

- By State only: `?state=California`
- By City only: `?city=Los Angeles`
- By Both: `?state=California&city=Los Angeles`
- With Search: `?state=California&search=john`

### 4. View Single User Details ✅

**Endpoint:** `GET /api/v1/users/:id`

**Features:**

- ✅ View complete user profile
- ✅ Admin can view any user
- ✅ Shows all user information

**Request:**

```bash
GET /api/v1/users/69273a6ad44b5651ddd4c698
Authorization: Bearer <admin_access_token>
```

**Response:**

```json
{
  "success": true,
  "message": "User retrieved successfully",
  "data": {
    "user": {
      "id": "69273a6ad44b5651ddd4c698",
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "1234567890",
      "profile_image": "/uploads/1234567890-profile.jpg",
      "address": "123 Main Street",
      "state": "California",
      "city": "Los Angeles",
      "country": "USA",
      "pincode": "90001",
      "role": "user",
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-20T15:45:00Z"
    }
  }
}
```

### 5. Edit User Details ✅

**Endpoint:** `PUT /api/v1/users/:id`

**Features:**

- ✅ Admin can edit any user
- ✅ Update name, email, phone, address, location
- ✅ Upload/change profile image
- ✅ Admin can change user role
- ✅ Validates email/phone uniqueness

**Request (Form-data):**

```bash
PUT /api/v1/users/69273a6ad44b5651ddd4c698
Authorization: Bearer <admin_access_token>
Content-Type: multipart/form-data

name: John Updated
email: john.updated@example.com
phone: 9876543210
address: 456 New Street
state: New York
city: New York City
pincode: 10001
role: admin
profile_image: [file]
```

**Response:**

```json
{
  "success": true,
  "message": "User updated successfully",
  "data": {
    "user": {
      "id": "69273a6ad44b5651ddd4c698",
      "name": "John Updated",
      "email": "john.updated@example.com",
      "phone": "9876543210",
      "profile_image": "/uploads/new-image.jpg",
      "role": "admin"
    }
  }
}
```

**Admin Privileges:**

- ✅ Can change user role (user ↔ admin)
- ✅ Can edit any user's profile
- ✅ Can update email/phone (with duplicate check)

### 6. Delete User ✅

**Endpoint:** `DELETE /api/v1/users/:id`

**Features:**

- ✅ Admin only access
- ✅ Deletes user from database
- ✅ Removes profile image from filesystem
- ✅ Permanent deletion (no soft delete)

**Request:**

```bash
DELETE /api/v1/users/69273a6ad44b5651ddd4c698
Authorization: Bearer <admin_access_token>
```

**Response:**

```json
{
  "success": true,
  "message": "User deleted successfully",
  "data": null
}
```

**What Gets Deleted:**

- ✅ User record from database
- ✅ Profile image from uploads folder
- ✅ Associated refresh tokens

### 7. Logout ✅

**Endpoint:** `POST /api/v1/auth/logout`

**Features:**

- ✅ Invalidates refresh token
- ✅ Removes token from database
- ✅ Works for both admin and regular users

**Request:**

```bash
POST /api/v1/auth/logout
Authorization: Bearer <admin_access_token>
```

**Response:**

```json
{
  "success": true,
  "message": "Logged out successfully",
  "data": null
}
```

## 🔐 Admin Authentication Flow

### Step 1: Login as Admin

```bash
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "admin@gmail.com",
  "password": "Admin@123"
}
```

### Step 2: Use Access Token

All admin endpoints require:
