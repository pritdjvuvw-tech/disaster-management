const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const socketIo = require('socket.io');

const survivorRoutes = require('./routes/survivors');
const authoritiesRoutes = require('./routes/authorities');
const emergencyRoutes = require('./routes/emergency');
const alertRoutes = require('./routes/alerts');
const analyticsRoutes = require('./routes/analytics');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Store io instance in app for access in routes
app.set('io', io);

// Routes
app.use('/api/survivors', survivorRoutes);
app.use('/api/authorities', authoritiesRoutes);
app.use('/api/emergency', emergencyRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/analytics', analyticsRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OPERATIONAL',
    timestamp: new Date(),
    message: 'RAKSHAK System Online'
  });
});

// WebSocket connections
io.on('connection', (socket) => {
  console.log(`New client connected: ${socket.id}`);

  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id}`);
  });

  socket.on('survivor-status', (data) => {
    io.emit('survivor-update', data);
  });

  socket.on('emergency-alert', (data) => {
    io.emit('alert-notification', data);
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: 'The requested resource does not exist'
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`\n🛡️  RAKSHAK Backend Server`);
  console.log(`📡 Running on port ${PORT}`);
  console.log(`⏰ Started at ${new Date().toLocaleString()}\n`);
});

module.exports = { app, io };
