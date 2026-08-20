require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const leaveRoutes = require('./routes/leaveRoutes');
const parentRoutes = require('./routes/parentRoutes');

const app = express();

app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true
}));
app.use(express.json());

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB Connected');
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  });

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/leave-requests', leaveRoutes);
app.use('/api/parents', parentRoutes);

app.get('/', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Leave Portal Backend is Running',
    availableEndpoints: {
      auth: '/api/auth',
      users: '/api/users',
      leaveRequests: '/api/leave-requests',
      health: '/api/health'
    }
  });
});

app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Leave Portal backend is running' });
});

app.use((err, req, res, _next) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({ success: false, message: 'Internal server error.' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
