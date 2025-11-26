# User Management System - Backend API

A comprehensive RESTful API for user management with JWT authentication, role-based access control, and image upload functionality built with **Node.js**, **Express**, **TypeScript**, and **MongoDB**.

---

## 🚀 Features

- ✅ **User Registration & Login** with email/password
- ✅ **JWT Token-Based Authentication** (Access Token: 1 hour, Refresh Token: 7 days)
- ✅ **Refresh Token Rotation** for enhanced security
- ✅ **Role-Based Access Control** (Admin & User roles)
- ✅ **Complete CRUD Operations** for users
- ✅ **Profile Image Upload** (JPG/PNG, max 2MB)
- ✅ **Advanced Search, Filter & Pagination**
- ✅ **Input Validation** with express-validator
- ✅ **Password Hashing** with bcrypt
- ✅ **MongoDB Database** with Mongoose ODM
- ✅ **CORS & Security Middleware**
- ✅ **Graceful Shutdown Handling**
- ✅ **Full TypeScript Support**

---

## 📋 Prerequisites

Before you begin, ensure you have installed:

| Software           | Version | Download Link                                                 |
| ------------------ | ------- | ------------------------------------------------------------- |
| **Node.js**        | v18+    | [nodejs.org](https://nodejs.org/)                             |
| **MongoDB**        | v6+     | [mongodb.com](https://www.mongodb.com/try/download/community) |
| **npm**            | v9+     | Included with Node.js                                         |
| **Git** (Optional) | Latest  | [git-scm.com](https://git-scm.com/)                           |

### ✅ Verify Installation:

```bash
node --version    # Should show v18.x.x or higher
npm --version     # Should show 9.x.x or higher
mongod --version  # Should show v6.x.x or higher
```

## 🛠️ Installation & Setup

### **Step 1: Get the Project**

**Option A: Clone with Git**

```bash
git clone <your-repository-url>
cd "Harvee Assessment_Backend"
```

**Option B: Download ZIP**

1. Download the project ZIP file
2. Extract to your desired location
3. Open terminal/command prompt in the extracted folder

### **Step 2: Install Dependencies**

```bash
npm install
```

```bash
 npm run dev

**What gets installed:**
- ✅ **express** (^5.1.0) - Web framework
- ✅ **mongoose** (^9.0.0) - MongoDB ODM
- ✅ **jsonwebtoken** (^9.0.2) - JWT implementation
- ✅ **bcrypt** (^6.0.0) - Password hashing
- ✅ **express-validator** (^7.3.1) - Input validation
- ✅ **multer** (^2.0.2) - File upload handling
- ✅ **cors** (^2.8.5) - CORS middleware
- ✅ **dotenv** (^17.2.3) - Environment variables
- ✅ **helmet** (^8.1.0) - Security headers
- ✅ **typescript** (^5.9.3) - TypeScript compiler
- ✅ **tsx** (^4.7.0) - TypeScript executor
- ✅ **nodemon** (^3.1.11) - Auto-reload for development
- ✅ Plus all TypeScript type definitions

**Expected Output:**
```

added 500+ packages in 30s
found 0 vulnerabilities

````

### **Step 3: Configure Environment**

**Create `.env.develop` file:**

```bash
# Windows (Command Prompt)
copy .env.example .env.develop

# Windows (PowerShell)
Copy-Item .env.example .env.develop

# macOS/Linux
cp .env.example .env.develop
````

**Edit `.env.develop`:**

```env
# Server Configuration
APP_PORT=5000
NODE_ENV=development

# Database Configuration
MONGO_URI=mongodb://localhost:27017/user_management

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
ACCESS_TOKEN_EXPIRY=1h
REFRESH_TOKEN_EXPIRY=7d

# API Security
API_ACCESS_KEY=your_api_access_key_here
```

### **Step 4: Start MongoDB**

**Windows:**

```bash
net start MongoDB
# OR
mongod
```

**macOS:**

```bash
brew services start mongodb-community
```

**Linux:**

```bash
sudo systemctl start mongod
```

**Verify:**

```bash
mongosh
# OR
mongo --eval "db.version()"
```

### **Step 5: Create Admin User**

```bash
npm run create-admin
```

**Expected Output:**

```
✅ Admin user created successfully
📧 Email: admin@gmail.com
🔑 Password: Admin@123
```

### **Step 6: Start Development Server**

```bash
npm run dev
```

**Expected Output:**

```
Loading environment: development
Using env file: .env.develop
MongoDB connected successfully
Database connected successfully!
Resolved routes - /api/v1/auth
Resolved routes - /api/v1/users
Server is running on http://localhost:5000
```

---

## 🎯 Quick Test

### **1. Health Check**

```bash
curl http://localhost:5000
```

### **2. Login as Admin**

```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@gmail.com","password":"Admin@123"}'
```

### **3. Register New User**

```bash
curl -X POST http://localhost:5000/api/v1/auth/register \
  -F "name=John Doe" \
  -F "email=john@example.com" \
  -F "phone=1234567890" \
  -F "password=Pass123" \
  -F "state=California" \
  -F "city=Los Angeles" \
  -F "country=USA" \
  -F "pincode=90001"
```

---

## 📁 Project Structure

```
Harvee Assessment_Backend/
├── src/
│   ├── app.mts                 # Express app entry
│   ├── configs/                # Configuration files
│   ├── constants/              # Application constants
│   ├── lib/                    # Core libraries
│   ├── middlewares/            # Express middlewares
│   ├── models/                 # Mongoose models
│   ├── routes/                 # API routes
│   ├── scripts/                # Utility scripts
│   ├── types/                  # TypeScript types
│   ├── utils/                  # Utility functions
│   └── validators/             # Request validators
├── uploads/                    # Uploaded images
├── docs/                       # Documentation
├── postman/                    # Postman collection
├── entry.mts                   # Application entry
├── nodemon.json                # Nodemon config
├── package.json                # Dependencies
├── tsconfig.json               # TypeScript config
├── .env.develop                # Dev environment
├── .gitignore                  # Git ignore
└── README.md                   # This file
```

---

## 🔌 API Endpoints

### **Authentication**

| Method | Endpoint                     | Description   | Auth |
| ------ | ---------------------------- | ------------- | ---- |
| `POST` | `/api/v1/auth/register`      | Register user | No   |
| `POST` | `/api/v1/auth/login`         | Login user    | No   |
| `POST` | `/api/v1/auth/refresh-token` | Refresh token | No   |
| `POST` | `/api/v1/auth/logout`        | Logout user   | Yes  |

### **Users**

| Method   | Endpoint                | Description   | Auth | Admin |
| -------- | ----------------------- | ------------- | ---- | ----- |
| `GET`    | `/api/v1/users/profile` | Get profile   | Yes  | No    |
| `GET`    | `/api/v1/users`         | Get all users | Yes  | Yes   |
| `GET`    | `/api/v1/users/:id`     | Get user      | Yes  | No\*  |
| `PUT`    | `/api/v1/users/:id`     | Update user   | Yes  | No\*  |
| `DELETE` | `/api/v1/users/:id`     | Delete user   | Yes  | Yes   |

\*Users can only access/update their own profile

---

## 📝 API Examples

### **Register User**

```http
POST /api/v1/auth/register
Content-Type: multipart/form-data

name: John Doe
email: john@example.com
phone: 1234567890
password: Pass123
address: 123 Main Street
state: California
city: Los Angeles
country: USA
pincode: 90001
profile_image: [file]
```

**Response:**

```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {...},
    "accessToken": "...",
    "refreshToken": "...",
    "tokenExpiry": {
      "accessToken": "1h",
      "refreshToken": "7d"
    }
  }
}
```

### **Get All Users (Admin)**

```http
GET /api/v1/users?page=1&limit=10&name=john&state=California
Authorization: Bearer <access_token>
```

**Query Parameters:**

- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10, max: 100)
- `sort` - Sort field (prefix `-` for desc)
- `search` - Search in name/email
- `name` - Filter by name
- `state` - Filter by state
- `city` - Filter by city

---

## 🛠️ Available Scripts

```bash
# Development
npm run dev              # Start with auto-reload

# Production
npm run build            # Compile TypeScript
npm start                # Run compiled code

# Database
npm run create-admin     # Create admin user
npm run update-role      # Update user role
```

---

## 🐛 Troubleshooting

### **MongoDB Connection Error**

```bash
# Check MongoDB
mongosh

# Start MongoDB
net start MongoDB  # Windows
brew services start mongodb-community  # macOS
sudo systemctl start mongod  # Linux
```

### **Port Already in Use**

```bash
# Find process
netstat -ano | findstr :5000  # Windows
lsof -i :5000  # macOS/Linux

# Change port in .env.develop
APP_PORT=5001
```

### **Module Not Found**

```bash
rm -rf node_modules package-lock.json
npm install
```

---

## 🔒 Security Features

- **Password Hashing:** bcrypt with 10 salt rounds
- **JWT Authentication:** Access (1h) + Refresh (7d) tokens
- **Token Rotation:** New refresh token on every refresh
- **CORS Protection:** Configured CORS middleware
- **Input Validation:** express-validator on all routes
- **RBAC:** Role-based access control (Admin/User)
- **File Upload Security:** Type & size validation (2MB max, jpg/png)

---

## 📦 Dependencies

### **Production:**

- express ^5.1.0
- mongoose ^9.0.0
- jsonwebtoken ^9.0.2
- bcrypt ^6.0.0
- express-validator ^7.3.1
- multer ^2.0.2
- cors ^2.8.5
- dotenv ^17.2.3
- helmet ^8.1.0

### **Development:**

- typescript ^5.9.3
- tsx ^4.7.0
- nodemon ^3.1.11
- @types/\* (various)

---

## ✅ Success Checklist

- [ ] Node.js v18+ installed
- [ ] MongoDB v6+ installed
- [ ] Dependencies installed (`npm install`)
- [ ] `.env.develop` created
- [ ] MongoDB running
- [ ] Admin user created
- [ ] Server starts successfully
- [ ] Health check works
- [ ] Admin login works

---

## 🎉 You're All Set!

Your User Management API is now **fully installed and running**!

**Server URL:** `http://localhost:5000`

**Next Steps:**

1. Import Postman collection from `/postman` folder
2. Login as admin (admin@gmail.com / Admin@123)
3. Register test users
4. Test all API endpoints

---

**Happy Coding! 🚀**
