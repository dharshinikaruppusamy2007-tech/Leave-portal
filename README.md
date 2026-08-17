# Leave Portal

A full-stack Leave Management System built with React + Vite, Node.js + Express, and MongoDB.

## Tech Stack

- **Frontend:** React 18, Vite 4, Lucide React icons
- **Backend:** Node.js, Express 5, Mongoose
- **Database:** MongoDB
- **Auth:** JWT (JSON Web Tokens), bcryptjs

## Project Structure

```
leave-portal/
├── public/
├── src/                          # React frontend
│   ├── assets/
│   ├── components/
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Dashboard.jsx
│   │   ├── MyProfile.jsx
│   │   ├── ApplyLeave.jsx
│   │   ├── AcademicHistory.jsx
│   │   ├── Sidebar.jsx
│   │   ├── StaffPortal.jsx
│   │   └── ParentPortal.jsx
│   ├── App.jsx
│   ├── main.jsx
│   ├── api.js
│   └── index.css
├── server/                       # Express backend
│   ├── models/
│   │   ├── User.js
│   │   └── Leave.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── userRoutes.js
│   │   └── leaveRoutes.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── .env
│   ├── package.json
│   └── server.js
├── index.html
├── package.json
└── vite.config.js
```

## Getting Started

### Prerequisites

- Node.js (v16+)
- MongoDB (local or Atlas)

### Installation

**Frontend:**
```bash
npm install
```

**Backend:**
```bash
cd server
npm install
```

### Environment Variables

Create `server/.env`:
```
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/leave_portal
JWT_SECRET=your_secret_key_here
```

### Running

**Backend:**
```bash
cd server
npm start
```

**Frontend (in a separate terminal):**
```bash
npm run dev
```

The frontend runs on `http://localhost:5173` and proxies API requests to `http://localhost:5000`.

## Features

- **Student Module:** Dashboard, My Profile, Apply Leave, Academic History
- **Staff Module:** Pending Approvals, Student Records
- **Parent Module:** Leave Status, Detailed History
- JWT-based authentication
- Password hashing with bcrypt
- Role-based access control

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login |
| GET | `/api/users/profile` | Get logged-in user profile |
| GET | `/api/leave-requests` | Get all leave requests |
| GET | `/api/leave-requests/my` | Get current user's leave requests |
| POST | `/api/leave-requests` | Submit leave application |
| PATCH | `/api/leave-requests/:id/status` | Update leave status |
