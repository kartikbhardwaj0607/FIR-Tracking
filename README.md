# 🚨 FIR Tracking System

A modern, real-time FIR (First Information Report) tracking system built with React, Node.js, MongoDB, and Socket.IO. Features a sleek black and orange aesthetic with smooth animations.

![FIR Tracking System](https://img.shields.io/badge/Status-Active-success)
![React](https://img.shields.io/badge/React-18.2.0-blue)
![Node.js](https://img.shields.io/badge/Node.js-18+-green)
![MongoDB](https://img.shields.io/badge/MongoDB-6.0+-brightgreen)

## ✨ Features

### 🔐 Dual Login System
- **Client Portal**: File and track FIRs
- **Admin Portal**: Manage all FIRs, assign inspectors, update status

### 🔄 Real-Time Updates
- Live status updates using Socket.IO
- Instant notifications for FIR changes
- No page refresh needed

### 📊 Beautiful Dashboard
- Modern black and orange theme
- Smooth animations with Framer Motion
- Responsive design for all devices

### 📝 FIR Management
- Create new FIRs with detailed information
- Track investigation progress
- View status timeline
- Document management system

### 👮 Admin Features
- Assign inspectors to cases
- Update FIR status and priority
- Mark documents as signed
- Close cases
- View comprehensive statistics

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI Framework
- **React Router** - Navigation
- **Framer Motion** - Animations
- **Socket.IO Client** - Real-time updates
- **Axios** - API calls
- **React Hot Toast** - Notifications

### Backend
- **Node.js & Express** - Server
- **MongoDB & Mongoose** - Database
- **Socket.IO** - WebSocket server
- **JWT** - Authentication
- **bcryptjs** - Password hashing

## 📁 Project Structure

```
fir-tracking-system/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── models/
│   │   ├── User.js
│   │   └── FIR.js
│   ├── middleware/
│   │   └── auth.js
│   ├── routes/
│   │   ├── auth.js
│   │   └── firs.js
│   ├── .env
│   ├── server.js
│   └── package.json
│
└── frontend/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── components/
    │   │   ├── Login.js & Login.css
    │   │   ├── Register.js
    │   │   ├── ClientDashboard.js
    │   │   ├── AdminDashboard.js & AdminDashboard.css
    │   │   ├── FIRDetail.js & FIRDetail.css
    │   │   ├── FIRCard.js & FIRCard.css
    │   │   ├── Navbar.js & Navbar.css
    │   │   ├── CreateFIRModal.js
    │   │   ├── Modal.css
    │   │   └── Dashboard.css
    │   ├── context/
    │   │   └── AuthContext.js
    │   ├── services/
    │   │   ├── api.js
    │   │   └── socket.js
    │   ├── App.js
    │   ├── index.js
    │   └── index.css
    └── package.json
```

## 🚀 Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (v6.0 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd fir-tracking-system
```

2. **Setup Backend**
```bash
cd backend
npm install
```

3. **Configure Environment Variables**
Create a `.env` file in the backend directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/fir_tracking
JWT_SECRET=your_jwt_secret_key_change_in_production_123456789
NODE_ENV=development
```

4. **Start MongoDB**
```bash
# Make sure MongoDB is running
mongod
```

5. **Start Backend Server**
```bash
cd backend
npm start
# or for development with auto-restart
npm run dev
```

6. **Setup Frontend**
```bash
cd ../frontend
npm install
```

7. **Start Frontend Development Server**
```bash
npm start
```

The application will open at `http://localhost:3000`

## 📝 Usage

### Creating Users

#### Admin Account
1. Go to `http://localhost:3000/register`
2. Fill in the registration form
3. Select "Admin" as Account Type
4. Click "Create Account"

#### Client Account
1. Go to `http://localhost:3000/register`
2. Fill in the registration form
3. Select "Client" as Account Type
4. Click "Create Account"

### Client Workflow
1. Login with client credentials
2. Click "File New FIR" button
3. Fill in the FIR details
4. Submit and track your FIR status in real-time
5. Click on any FIR card to view detailed information

### Admin Workflow
1. Login with admin credentials
2. View all FIRs in the system
3. Click "Edit" on any FIR to update:
   - Assign inspector
   - Update status
   - Change priority
   - Mark documents as signed
   - Close the case
4. Changes reflect instantly for clients

## 🎨 Color Scheme

- **Primary Orange**: `#ff6b35`
- **Secondary Orange**: `#ff8c42`
- **Dark Background**: `#0a0a0a`
- **Card Background**: `#1a1a1a`
- **Border Color**: `#2a2a2a`
- **Text Primary**: `#ffffff`
- **Text Secondary**: `#b0b0b0`

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### FIRs
- `GET /api/firs` - Get all FIRs (role-based)
- `GET /api/firs/:id` - Get single FIR
- `POST /api/firs` - Create new FIR (client)
- `PUT /api/firs/:id` - Update FIR (admin)
- `DELETE /api/firs/:id` - Delete FIR (admin)
- `GET /api/firs/stats/dashboard` - Get statistics (admin)

## 🔄 Real-Time Events

### Socket Events
- `join-fir` - Join FIR room for updates
- `leave-fir` - Leave FIR room
- `fir-updated` - FIR status updated
- `fir-created` - New FIR created
- `fir-list-updated` - FIR list updated

## 🎯 Key Features Explained

### Status Timeline
Shows the complete history of FIR updates with:
- Status changes
- Who made the update
- Timestamp
- Description

### Document Tracking
Track required documents:
- Identity Proof
- Address Proof
- Incident Report
- Mark as signed/unsigned

### Priority Levels
- **Low**: Minor cases
- **Medium**: Standard cases
- **High**: Important cases
- **Critical**: Urgent cases

### Status Flow
1. **Filed**: Initial submission
2. **Under Investigation**: Active investigation
3. **Documents Review**: Reviewing documents
4. **Action Taken**: Action completed
5. **Closed**: Case closed

## 🐛 Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running: `mongod`
- Check connection string in `.env`

### Port Already in Use
- Change PORT in backend `.env`
- Or kill process using the port

### Socket Connection Failed
- Check if backend is running
- Verify CORS settings in `server.js`

## 🚀 Deployment Tips

### Backend
- Use environment variables for production
- Set up MongoDB Atlas for cloud database
- Deploy to Heroku, Railway, or AWS

### Frontend
- Build production version: `npm run build`
- Deploy to Vercel, Netlify, or AWS S3
- Update API URL in production

## 🤝 Contributing

This is a hackathon project. Feel free to fork and improve!

## 📄 License

MIT License - Feel free to use for your projects!

## 👨‍💻 Author

Built for hackathon with ❤️ and ☕

## 🎉 Acknowledgments

- Framer Motion for beautiful animations
- Socket.IO for real-time functionality
- React community for amazing tools

---

**Good luck with your hackathon! 🚀**
