const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const { Server } = require('socket.io');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Make io accessible to routes
app.set('io', io);

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/firs', require('./routes/firs'));

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'FIR Tracking System API' });
});

// Socket.IO connection
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  // Join FIR room for real-time updates
  socket.on('join-fir', (firId) => {
    socket.join(`fir-${firId}`);
    console.log(`Socket ${socket.id} joined room: fir-${firId}`);
  });

  // Leave FIR room
  socket.on('leave-fir', (firId) => {
    socket.leave(`fir-${firId}`);
    console.log(`Socket ${socket.id} left room: fir-${firId}`);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
