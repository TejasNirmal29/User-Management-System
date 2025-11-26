# User Management System (React + Vite)

Role-based user management frontend built with React, Redux Toolkit, Ant Design, React Router, and Axios with JWT access/refresh token handling.

## Features

- JWT auth (accessToken + refreshToken) with automatic refresh
- Role-based navigation
  - Admin: Profile, Dashboard (full CRUD on users)
  - User: Profile only
- Protected routes and automatic redirects
- Profile page (fetches user by decoded JWT id)
- Admin Dashboard:
  - List users (pagination)
  - Search & filter (name, email, state, city)
  - View user details (modal)
  - Edit user (route: /dashboard/edit-user/:id)
  - Delete user
  - Logout

## Tech Stack

- React 18 + Vite
- Redux Toolkit
- React Router
- Ant Design
- Axios (interceptors for token/refresh)
- jwt-decode

## Prerequisites

- Node.js 18+ and npm 9+

## Installation

1. Install dependencies

   ```sh
   npm install
   ```

2. Environment variables (create .env in project root)

   ```env
   VITE_BASE_URL=http://localhost:5000/api/v1
   VITE_IMAGE_URL=http://localhost:5000
   VITE_LOGO=/logo.png
   ```

   Notes:

   - Vite requires variables to be prefixed with VITE\_
   - Restart dev server after changing .env

3. Run

   ```sh
   npm run dev
   ```

4. Build

   ```sh
   npm run build
   ```

5. Preview production build

   ```sh
   npm run preview
   ```

## Routes

- / → redirects to /profile when authenticated, else /auth/signin
- /auth/signin → login page
- /profile → user profile (requires auth)
- /dashboard → admin dashboard (requires admin)
- /dashboard/edit-user/:id → edit user (requires admin)

## State & Tokens

- Local storage keys:
  - access token: Constants.AUTH.ACCESS_TOKEN (access-token)
  - refresh token: Constants.AUTH.REFRESH_TOKEN (refresh-token)
- On login:
  - Store accessToken and refreshToken, plus user in Redux
- Axios request:
  - Attaches Authorization: Bearer <accessToken>
- Axios response:
  - On 401, tries /auth/refresh-token with refreshToken
  - Retries queued requests with new accessToken
  - On refresh failure, clears tokens and redirects to /auth/signin
- Logout:
  - Clears tokens and Redux auth state

## API Services (used in app)

- Auth
  - POST /auth/login
  - POST /auth/refresh-token
- Users
  - GET /users?state=&city=&page=&limit=&name=&email=
  - GET /users/:userId
  - PUT /users/:userId
  - DELETE /users/:userId

## Folder Structure (high-level)

```
src/
  components/         # Reusable UI
  db/                 # Navigation items
  layouts/            # AppLayout
  redux/              # Slices, store, thunks
  services/           # Axios + API methods
  views/              # Pages (Auth, Profile, Dashboard, etc.)
  main.jsx            # Entry
```

## Notes

- Profile avatar uses VITE_IMAGE_URL + profile_image when available
- Admin sees all tabs; users see only allowed tabs
- Keep VITE_BASE_URL consistent with your backend
